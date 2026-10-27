import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Globe2, LoaderCircle, RotateCcw } from 'lucide-react'
import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { places, type Place } from '../data/places'
import { useLanguage } from '../context/LanguageContext'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { MapLayers } from './GlobeLayers'

export interface FocusPoint {
  lat: number
  lng: number
  distance?: number
}
export interface GlobeHandle {
  focus: (point: FocusPoint) => void
  zoom: (direction: number) => void
  reset: () => void
  pause: () => void
}
interface GlobeEngine extends GlobeHandle {
  setLayers: (value: MapLayers) => void
  select: (place: Place | null) => void
}
interface Props {
  autoRotate: boolean
  onSelect: (place: Place) => void
  onInteract: () => void
  onStatus: (status: 'loading' | 'ready' | 'error') => void
  layers: MapLayers
  selectedPlace: Place | null
  expanded: boolean
}

const Globe = forwardRef<GlobeHandle, Props>(function Globe(
  { autoRotate, onSelect, onInteract, onStatus, layers, selectedPlace, expanded },
  ref,
) {
  const { t } = useLanguage()
  const reducedMotion = useReducedMotion()
  const container = useRef<HTMLDivElement>(null)
  const engine = useRef<GlobeEngine | null>(null)
  const props = useRef({ autoRotate, onSelect, onInteract, layers, selectedPlace, expanded })
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    onStatus(status)
  }, [onStatus, status])
  useEffect(() => {
    props.current = { autoRotate, onSelect, onInteract, layers, selectedPlace, expanded }
    engine.current?.setLayers(layers)
    engine.current?.select(selectedPlace)
  }, [autoRotate, onSelect, onInteract, layers, selectedPlace, expanded])
  useImperativeHandle(
    ref,
    () => ({
      focus: (point) => engine.current?.focus(point),
      zoom: (direction) => engine.current?.zoom(direction),
      reset: () => engine.current?.reset(),
      pause: () => engine.current?.pause(),
    }),
    [],
  )

  useEffect(() => {
    const host = container.current
    if (!host) return
    let disposed = false
    let renderer: THREE.WebGLRenderer | undefined
    let globe: ThreeGlobe | undefined
    let controls: OrbitControls | undefined
    let frame = 0
    let visible = true
    let lastTime = 0
    let dirty = true
    let dragging = false
    let failed = false
    let settleUntil = 0
    let viewportHeight = 1
    let animation: {
      from: THREE.Vector3
      to: THREE.Vector3
      quaternion: THREE.Quaternion
      start: number
    } | null = null
    let pendingFocus: FocusPoint | null = null
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2500)
    const markerMeshes: THREE.Mesh[] = []
    const listeners: (() => void)[] = []
    const manager = new THREE.LoadingManager()
    manager.onError = () => {
      if (!disposed) {
        failed = true
        setStatus('error')
      }
    }
    const timeout = window.setTimeout(() => {
      if (!disposed) setStatus((current) => (current === 'loading' ? 'error' : current))
    }, 20000)

    function disposeScene() {
      const textures = new Set<THREE.Texture>()
      const materials = new Set<THREE.Material>()
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        if (mesh.material) {
          for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            materials.add(material)
            for (const value of Object.values(material))
              if (value instanceof THREE.Texture) textures.add(value)
          }
        }
      })
      textures.forEach((texture) => texture.dispose())
      materials.forEach((material) => material.dispose())
    }

    const cleanup = () => {
      disposed = true
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
      listeners.forEach((remove) => remove())
      engine.current = null
      controls?.dispose()
      globe?.pauseAnimation()
      disposeScene()
      globe?._destructor()
      renderer?.dispose()
      renderer?.forceContextLoss()
      renderer?.domElement.remove()
    }

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: window.innerWidth > 700,
        alpha: true,
        powerPreference: 'low-power',
      })
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.25 : 1.75),
      )
      renderer.setClearColor(0x080d1b, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.setAttribute('aria-hidden', 'true')
      host.appendChild(renderer.domElement)
      globe = new ThreeGlobe({ animateIn: false, waitForGlobeReady: false })
        .atmosphereColor('#71bcff')
        .atmosphereAltitude(0.14)
        .globeCurvatureResolution(3)
      globe.pauseAnimation()
      const markerGroup = new THREE.Group()
      scene.add(markerGroup)
      const equator = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: 181 }, (_, index) =>
            new THREE.Vector3().copy(globe!.getCoords(0, index * 2 - 180, 0.004)),
          ),
        ),
        new THREE.LineBasicMaterial({ color: '#4de0ff', transparent: true, opacity: 0.75 }),
      )
      scene.add(equator)
      const selectedMarker = new THREE.Group()
      const selectedDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 12, 8),
        new THREE.MeshBasicMaterial({ color: '#fcfdff', depthTest: true }),
      )
      const selectedRing = new THREE.Mesh(
        new THREE.RingGeometry(1.8, 2.1, 40),
        new THREE.MeshBasicMaterial({
          color: '#4de0ff',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        }),
      )
      selectedMarker.add(selectedDot, selectedRing)
      scene.add(selectedMarker)
      const material = globe.globeMaterial() as THREE.MeshPhongMaterial
      material.color.set('#d9e6f2')
      material.specular.set('#1c3649')
      material.shininess = 6
      scene.add(globe)
      // A restrained animated outer halo complements three-globe's atmosphere.
      const haloMaterial = new THREE.ShaderMaterial({
        uniforms: { intensity: { value: 0.24 } },
        vertexShader:
          'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal); v=-p.xyz; gl_Position=projectionMatrix*p;}',
        fragmentShader:
          'uniform float intensity; varying vec3 n; varying vec3 v; void main(){float facing=abs(dot(normalize(n),normalize(v))); float edge=pow(1.0-facing,3.0)*smoothstep(0.0,0.2,facing); gl_FragColor=vec4(0.18,0.51,1.0,edge*intensity);}',
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
      scene.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(103, window.innerWidth < 700 ? 32 : 48, 32),
          haloMaterial,
        ),
      )
      const ambient = new THREE.AmbientLight('#bfdbff', 2.5)
      const sun = new THREE.DirectionalLight('#fff8e9', 3.1)
      sun.position.set(-200, 200, 400)
      scene.add(ambient, sun)
      const rim = new THREE.DirectionalLight('#4d8dff', 1.1)
      rim.position.set(200, -100, -120)
      scene.add(rim)

      const initial = new THREE.Vector3().copy(globe.getCoords(18, 55, 0)).normalize()
      camera.position.copy(initial).multiplyScalar(reducedMotion ? 345 : 470)
      camera.lookAt(0, 0, 0)
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enablePan = false
      controls.enableDamping = !reducedMotion
      controls.dampingFactor = 0.065
      controls.minDistance = 125
      controls.maxDistance = 650
      controls.rotateSpeed = 0.45
      controls.zoomSpeed = 0.6
      controls.autoRotateSpeed = 0.28

      const focus = (point: FocusPoint) => {
        if (!globe || disposed) return
        if (
          !Number.isFinite(point.lat) ||
          !Number.isFinite(point.lng) ||
          Math.abs(point.lat) > 90 ||
          Math.abs(point.lng) > 180
        )
          return
        const direction = new THREE.Vector3()
          .copy(globe.getCoords(Math.max(-85, point.lat), point.lng, 0))
          .normalize()
        const target = direction.multiplyScalar(
          THREE.MathUtils.clamp(point.distance ?? 260, 125, 650),
        )
        if (reducedMotion) {
          camera.position.copy(target)
          camera.lookAt(0, 0, 0)
          controls?.update()
          dirty = true
          return
        }
        animation = {
          from: camera.position.clone(),
          to: target,
          quaternion: new THREE.Quaternion().setFromUnitVectors(
            camera.position.clone().normalize(),
            target.clone().normalize(),
          ),
          start: performance.now(),
        }
        dirty = true
      }
      engine.current = {
        focus: (point) => {
          pendingFocus = point
          focus(point)
        },
        zoom: (direction) => {
          animation = null
          camera.position.multiplyScalar(direction > 0 ? 0.85 : 1.18).clampLength(125, 650)
          dirty = true
        },
        reset: () => {
          pendingFocus = null
          focus({ lat: 18, lng: 55, distance: 345 })
        },
        pause: () => {
          animation = null
          dirty = true
        },
        setLayers: (value) => {
          globe?.showGraticules(value.grid)
          equator.visible = value.equator
          markerGroup.visible = value.markers
          dirty = true
        },
        select: (place) => {
          selectedMarker.visible = !!place
          markerGroup.children.forEach((marker) => {
            marker.visible = marker.userData.place?.id !== place?.id
          })
          if (place && globe) {
            const position = new THREE.Vector3().copy(globe.getCoords(place.lat, place.lng, 0.012))
            selectedMarker.position.copy(position)
            selectedMarker.lookAt(position.clone().multiplyScalar(2))
          }
          dirty = true
        },
      }
      engine.current.setLayers(props.current.layers)
      engine.current.select(props.current.selectedPlace)
      const textureLoader = new THREE.TextureLoader(manager)
      textureLoader.load('/assets/earth.jpg', (texture) => {
        if (disposed) {
          texture.dispose()
          return
        }
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = Math.min(4, renderer?.capabilities.getMaxAnisotropy() ?? 1)
        material.map = texture
        material.needsUpdate = true
        setStatus('ready')
        clearTimeout(timeout)
        if (pendingFocus) focus(pendingFocus)
        else if (!reducedMotion) focus({ lat: 18, lng: 55, distance: 345 })
        dirty = true
      })

      // Markers are independent meshes so picking never uses injected HTML labels.
      places
        .filter((place) => !place.sriLanka || place.id === 'sigiriya')
        .filter((place) => place.id !== 'sri-lanka')
        .forEach((place) => {
          const position = new THREE.Vector3().copy(globe!.getCoords(place.lat, place.lng, 0.008))
          const marker = new THREE.Mesh(
            new THREE.SphereGeometry(place.id === 'sigiriya' ? 1.15 : 0.72, 10, 8),
            new THREE.MeshBasicMaterial({ color: place.id === 'sigiriya' ? '#ecfaff' : '#70dcff' }),
          )
          marker.position.copy(position)
          marker.userData.place = place
          marker.userData.visualRadius = place.id === 'sigiriya' ? 1.15 : 0.72
          marker.userData.screenRadius = place.id === 'sigiriya' ? 3 : 2
          markerMeshes.push(marker)
          markerGroup.add(marker)
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(1.5, 1.7, 24),
            new THREE.MeshBasicMaterial({
              color: '#7eddff',
              transparent: true,
              opacity: 0.45,
              side: THREE.DoubleSide,
            }),
          )
          ring.position.copy(position.clone().multiplyScalar(1.003))
          ring.lookAt(position.clone().multiplyScalar(2))
          ring.userData.place = place
          ring.userData.visualRadius = 1.7
          ring.userData.screenRadius = 5
          markerGroup.add(ring)
        })
      engine.current.select(props.current.selectedPlace)

      let seed = 23
      const random = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }
      const positions = new Float32Array((window.innerWidth < 700 ? 200 : 600) * 3)
      for (let i = 0; i < positions.length; i += 3) {
        const theta = random() * Math.PI * 2
        const phi = Math.acos(2 * random() - 1)
        const radius = 900 + random() * 200
        positions[i] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i + 1] = radius * Math.cos(phi)
        positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta)
      }
      const starGeometry = new THREE.BufferGeometry()
      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      scene.add(
        new THREE.Points(
          starGeometry,
          new THREE.PointsMaterial({
            color: '#b8d2f4',
            size: 1.1,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
            depthWrite: false,
          }),
        ),
      )

      const resize = () => {
        if (!renderer) return
        const { width, height } = host.getBoundingClientRect()
        viewportHeight = Math.max(height, 1)
        camera.aspect = width / Math.max(height, 1)
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        globe?.rendererSize(new THREE.Vector2(width, height))
        dirty = true
      }
      const observer = new ResizeObserver(resize)
      observer.observe(host)
      listeners.push(() => observer.disconnect())
      resize()
      const intersection = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting
          dirty = true
        },
        { rootMargin: '100px' },
      )
      intersection.observe(host)
      listeners.push(() => intersection.disconnect())
      const visibility = () => {
        dirty = true
        lastTime = 0
      }
      document.addEventListener('visibilitychange', visibility)
      listeners.push(() => document.removeEventListener('visibilitychange', visibility))
      const change = () => {
        dirty = true
      }
      const start = () => {
        dragging = true
        animation = null
        props.current.onInteract()
        dirty = true
      }
      const end = () => {
        dragging = false
        settleUntil = performance.now() + 1200
        dirty = true
      }
      controls.addEventListener('change', change)
      controls.addEventListener('start', start)
      controls.addEventListener('end', end)
      listeners.push(() => {
        controls?.removeEventListener('change', change)
        controls?.removeEventListener('start', start)
        controls?.removeEventListener('end', end)
      })
      const raycaster = new THREE.Raycaster()
      let pointerStart = { x: 0, y: 0 }
      const pointerDown = (event: PointerEvent) => {
        pointerStart = { x: event.clientX, y: event.clientY }
      }
      const pointerUp = (event: PointerEvent) => {
        if (
          Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5 ||
          event.button !== 0
        )
          return
        const bounds = host.getBoundingClientRect()
        raycaster.setFromCamera(
          new THREE.Vector2(
            ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            (-(event.clientY - bounds.top) / bounds.height) * 2 + 1,
          ),
          camera,
        )
        const hit = props.current.layers.markers
          ? raycaster.intersectObjects(markerMeshes)[0]
          : undefined
        if (hit && hit.object.position.dot(camera.position) > 10000)
          props.current.onSelect(hit.object.userData.place as Place)
      }
      const canvas = renderer.domElement
      const contextLost = (event: Event) => {
        event.preventDefault()
        if (!disposed) {
          failed = true
          setStatus('error')
        }
      }
      canvas.addEventListener('webglcontextlost', contextLost)
      canvas.addEventListener('pointerdown', pointerDown)
      canvas.addEventListener('pointerup', pointerUp)
      listeners.push(() => {
        canvas.removeEventListener('pointerdown', pointerDown)
        canvas.removeEventListener('pointerup', pointerUp)
        canvas.removeEventListener('webglcontextlost', contextLost)
      })
      const keydown = (event: KeyboardEvent) => {
        if (
          !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(
            event.key,
          )
        )
          return
        event.preventDefault()
        props.current.onInteract()
        animation = null
        const spherical = new THREE.Spherical().setFromVector3(camera.position)
        if (event.key === 'ArrowLeft') spherical.theta -= 0.12
        if (event.key === 'ArrowRight') spherical.theta += 0.12
        if (event.key === 'ArrowUp') spherical.phi -= 0.12
        if (event.key === 'ArrowDown') spherical.phi += 0.12
        spherical.makeSafe()
        camera.position.setFromSpherical(spherical)
        if (event.key === '+' || event.key === '=') engine.current?.zoom(1)
        if (event.key === '-') engine.current?.zoom(-1)
        if (event.key === 'Home') engine.current?.reset()
        dirty = true
      }
      host.addEventListener('keydown', keydown)
      listeners.push(() => host.removeEventListener('keydown', keydown))
      const quaternion = new THREE.Quaternion()
      function animate(now: number) {
        if (disposed) return
        frame = requestAnimationFrame(animate)
        if (
          failed ||
          (!visible && !props.current.expanded) ||
          document.hidden ||
          now - lastTime < (window.innerWidth < 700 ? 1000 / 30 : 1000 / 45)
        )
          return
        const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 45
        lastTime = now
        if (!renderer || !controls || !globe) return
        controls.autoRotate = props.current.autoRotate && !reducedMotion && !animation && !dragging
        const needsFrame =
          dirty || animation || controls.autoRotate || dragging || now < settleUntil
        if (!needsFrame) return
        if (animation) {
          const progress = Math.min((now - animation.start) / 1900, 1)
          const ease = progress * progress * (3 - 2 * progress)
          quaternion.identity().slerp(animation.quaternion, ease)
          camera.position
            .copy(animation.from)
            .normalize()
            .applyQuaternion(quaternion)
            .multiplyScalar(
              THREE.MathUtils.lerp(animation.from.length(), animation.to.length(), ease),
            )
          if (progress === 1) animation = null
        }
        controls.update(delta)
        const pixelScale = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) / viewportHeight
        markerGroup.children.forEach((marker) => {
          marker.scale.setScalar(
            THREE.MathUtils.clamp(
              (camera.position.distanceTo(marker.position) *
                pixelScale *
                marker.userData.screenRadius) /
                marker.userData.visualRadius,
              0.03,
              2,
            ),
          )
        })
        selectedMarker.scale.setScalar(
          THREE.MathUtils.clamp(
            (camera.position.distanceTo(selectedMarker.position) * pixelScale * 8) / 2.1,
            0.03,
            2,
          ),
        )
        haloMaterial.uniforms.intensity.value = reducedMotion
          ? 0.24
          : 0.23 + Math.sin(now * 0.0007) * 0.025
        globe.setPointOfView(camera)
        renderer.render(scene, camera)
        dirty = false
      }
      frame = requestAnimationFrame(animate)
    } catch {
      setStatus('error')
    }
    return cleanup
  }, [attempt, reducedMotion])

  return (
    <div className={`earth-stage earth-${status}`}>
      <div
        ref={container}
        className="earth-canvas"
        role="application"
        aria-roledescription="interactive globe"
        aria-label={t.globeLabel}
        tabIndex={status === 'ready' ? 0 : -1}
      />
      {status === 'loading' && (
        <div className="globe-status" role="status">
          <LoaderCircle className="spinner" size={28} />
          <h3>{t.loading}</h3>
          <p>{t.loadingDescription}</p>
        </div>
      )}
      {status === 'error' && (
        <div className="globe-status globe-fallback" role="status">
          <Globe2 size={44} strokeWidth={1} />
          <h3>{t.fallbackTitle}</h3>
          <p>{t.fallbackDescription}</p>
          <a className="button primary" href="#explore">
            {t.atlas}
          </a>
          <button
            className="text-button"
            onClick={() => {
              setStatus('loading')
              setAttempt((value) => value + 1)
            }}
          >
            <RotateCcw size={14} />
            {t.retry}
          </button>
        </div>
      )}
    </div>
  )
})

export default Globe
