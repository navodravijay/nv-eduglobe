import { useEffect, useId, useRef, useState } from 'react'
import { Check, Layers, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export interface MapLayers {
  grid: boolean
  equator: boolean
  markers: boolean
}

export function GlobeLayers({
  value,
  onChange,
  disabled,
}: {
  value: MapLayers
  onChange: (value: MapLayers) => void
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  useEffect(() => {
    if (!open) return
    const pointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', pointer)
    root.current?.addEventListener('keydown', escape)
    const node = root.current
    return () => {
      document.removeEventListener('pointerdown', pointer)
      node?.removeEventListener('keydown', escape)
    }
  }, [open])
  return (
    <div ref={root} className="layer-picker">
      <button
        ref={trigger}
        className={`icon-button ${open ? 'toggled' : ''}`}
        aria-label={t.mapLayers}
        title={t.mapLayers}
        aria-expanded={open}
        aria-controls={id}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <Layers size={16} />
      </button>
      {open && (
        <div id={id} className="layer-popover" role="group" aria-label={t.mapLayers}>
          <div className="layer-heading">
            <span className="eyebrow">{t.mapLayers}</span>
            <button
              className="icon-button"
              aria-label={t.close}
              onClick={() => {
                setOpen(false)
                trigger.current?.focus()
              }}
            >
              <X size={14} />
            </button>
          </div>
          <p>{t.layersDescription}</p>
          {(
            [
              { key: 'grid', label: t.coordinateGrid, detail: t.coordinateGridDescription },
              { key: 'equator', label: t.equator, detail: t.equatorDescription },
              {
                key: 'markers',
                label: t.destinationMarkers,
                detail: t.destinationMarkersDescription,
              },
            ] as const
          ).map((layer) => (
            <label key={layer.key} className="layer-option">
              <input
                type="checkbox"
                checked={value[layer.key]}
                onChange={(event) => onChange({ ...value, [layer.key]: event.target.checked })}
              />
              <span className="layer-check" aria-hidden="true">
                {value[layer.key] && <Check size={12} />}
              </span>
              <span>
                {layer.label}
                <small>{layer.detail}</small>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
