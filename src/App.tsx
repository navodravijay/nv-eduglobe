import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Earth,
  ExternalLink,
  GraduationCap,
  Languages,
  MapPin,
  Maximize2,
  Menu,
  Minimize2,
  Minus,
  MousePointer2,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useLanguage } from './context/LanguageContext'
import {
  categories,
  continents,
  formatCoordinate,
  places,
  searchPlaces,
  type Place,
} from './data/places'
import type { GlobeHandle } from './components/Globe'
import { useReducedMotion } from './hooks/useReducedMotion'
import { PlaceDetail } from './components/PlaceDetail'
import { PlaceVisual } from './components/PlaceVisual'
import { Quiz } from './components/Quiz'
import { Modal } from './components/Modal'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GlobeLayers, type MapLayers } from './components/GlobeLayers'
import { JourneyCollection } from './components/JourneyCollection'
import { TourPanel } from './components/TourPanel'
import { journeys, journeyPlaces, type Journey } from './data/journeys'
import { photos } from './data/photos'

const Globe = lazy(() => import('./components/Globe'))
const featured = ['sigiriya', 'everest', 'giza', 'amazon', 'machu-picchu', 'great-barrier-reef']

function App() {
  const { language, toggleLanguage, t } = useLanguage()
  const reducedMotion = useReducedMotion()
  const globeRef = useRef<GlobeHandle>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [autoRotate, setAutoRotate] = useState(!reducedMotion)
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState<Place | null>(null)
  const [focused, setFocused] = useState<Place | null>(null)
  const [query, setQuery] = useState('')
  const [continent, setContinent] = useState('all')
  const [category, setCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const [learningMode, setLearningMode] = useState<'continents' | 'quiz'>('continents')
  const [learningContinent, setLearningContinent] = useState(continents[0])
  const [info, setInfo] = useState<'privacy' | 'assets' | null>(null)
  const [tourActive, setTourActive] = useState(false)
  const [tourPaused, setTourPaused] = useState(false)
  const [tourIndex, setTourIndex] = useState(0)
  const [journey, setJourney] = useState(journeys[0])
  const [tourInterval, setTourInterval] = useState(12)
  const [layers, setLayers] = useState<MapLayers>({ grid: false, equator: false, markers: true })
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [globeVisible, setGlobeVisible] = useState(true)
  const [globeStatus, setGlobeStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const globeShell = useRef<HTMLDivElement>(null)
  const tourStops = journeyPlaces(journey)
  const tourPlace = tourStops[tourIndex]
  const matches = searchPlaces(query, continent, category)
  const ordered =
    query || continent !== 'all' || category !== 'all'
      ? matches
      : [...matches].sort((a, b) => {
          const aIndex = featured.indexOf(a.id),
            bIndex = featured.indexOf(b.id)
          return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex)
        })
  const shown =
    showAll || query || continent !== 'all' || category !== 'all' ? ordered : ordered.slice(0, 6)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }),
      { rootMargin: '-15% 0px -60% 0px' },
    )
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const visibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    const observer = new IntersectionObserver(
      (entries) => setGlobeVisible(entries[0].isIntersecting),
      { threshold: 0.15 },
    )
    if (globeShell.current) observer.observe(globeShell.current)
    return () => {
      document.removeEventListener('visibilitychange', visibility)
      observer.disconnect()
    }
  }, [])
  useEffect(() => {
    if (
      !tourActive ||
      tourPaused ||
      !pageVisible ||
      (!globeVisible && !expanded) ||
      selected ||
      info
    )
      return
    const timer = window.setInterval(
      () => setTourIndex((value) => (value + 1) % journey.stops.length),
      tourInterval * 1000,
    )
    return () => clearInterval(timer)
  }, [
    tourActive,
    tourPaused,
    pageVisible,
    globeVisible,
    selected,
    info,
    tourIndex,
    journey,
    tourInterval,
    expanded,
  ])
  useEffect(() => {
    if (globeStatus !== 'ready') return
    const destination = tourActive ? tourPlace : focused
    if (destination)
      globeRef.current?.focus({
        lat: destination.lat,
        lng: destination.lng,
        distance: destination.sriLanka ? 155 : tourActive ? 260 : 230,
      })
  }, [tourActive, tourPlace, focused, globeStatus])
  useEffect(() => {
    if (!expanded) return
    const previous = document.body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    globeShell.current
      ?.querySelector<HTMLElement>('[role="application"]')
      ?.focus({ preventScroll: true })
    const escape = (event: KeyboardEvent) => {
      if (document.querySelector('dialog[open]')) return
      if (event.key === 'Escape') setExpanded(false)
      if (event.key === 'Tab') {
        const targets = Array.from(
          globeShell.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], [tabindex="0"]',
          ) ?? [],
        ).filter((node) => node.offsetParent !== null)
        const first = targets[0],
          last = targets[targets.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', escape)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', escape)
      previousFocus?.focus({ preventScroll: true })
    }
  }, [expanded])

  const openPlace = useCallback((place: Place) => {
    setSelected(place)
    setTourPaused(true)
  }, [])
  const handleInteract = useCallback(() => {
    setAutoRotate(false)
    setTourPaused(true)
  }, [])
  function scrollTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
    setMenuOpen(false)
  }
  function flyTo(place: Place) {
    setSelected(null)
    setTourActive(false)
    setAutoRotate(false)
    setFocused(place)
    scrollTo('home')
    globeRef.current?.focus({ lat: place.lat, lng: place.lng, distance: 230 })
  }
  function startTour(nextJourney: Journey = journeys[0], present = false) {
    setJourney(nextJourney)
    setTourIndex(0)
    setTourActive(true)
    setTourPaused(false)
    setAutoRotate(false)
    setFocused(null)
    if (present) setExpanded(true)
    if (!present && !expanded) scrollTo('home')
  }
  function toggleTourPause() {
    if (!tourPaused) globeRef.current?.pause()
    else
      globeRef.current?.focus({
        lat: tourPlace.lat,
        lng: tourPlace.lng,
        distance: tourPlace.sriLanka ? 155 : 260,
      })
    setTourPaused((value) => !value)
  }
  function reset() {
    setTourActive(false)
    setFocused(null)
    setAutoRotate(false)
    globeRef.current?.reset()
  }
  function selectContinent() {
    setContinent(learningContinent.id)
    setCategory('all')
    setQuery('')
    scrollTo('explore')
    globeRef.current?.focus({
      lat: learningContinent.lat,
      lng: learningContinent.lng,
      distance: 345,
    })
  }
  const current = tourActive ? tourPlace : focused

  return (
    <>
      <a href="#explore" className="skip-link">
        {t.start}
      </a>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="NV. EduGlobe home">
          <span className="brand-monogram">
            NV<span>.</span>
          </span>
          <span className="brand-divider" />
          <span className="brand-name">
            EduGlobe<span>BY NV SHARP SOLUTIONS</span>
          </span>
        </a>
        <nav
          className={menuOpen ? 'main-nav open' : 'main-nav'}
          aria-label={language === 'en' ? 'Main navigation' : 'ප්‍රධාන මෙනුව'}
        >
          {(['explore', 'learn', 'sri-lanka', 'about'] as const).map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={
                activeSection === id || (id === 'explore' && activeSection === 'home')
                  ? 'active'
                  : ''
              }
              onClick={() => setMenuOpen(false)}
            >
              {id === 'sri-lanka' ? t.sriLanka : t[id]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="language-toggle"
            onClick={toggleLanguage}
            aria-label={t.language}
            title={t.language}
          >
            <Languages size={15} />
            <span className={language === 'en' ? 'current-language' : ''}>EN</span>
            <span className="language-slash">/</span>
            <span lang="si" className={language === 'si' ? 'current-language' : ''}>
              සිං
            </span>
          </button>
          <a className="header-cta" href="#business">
            {t.business}
            <ArrowUpRight size={15} />
          </a>
          <button
            className="icon-button menu-button"
            aria-label={menuOpen ? t.close : t.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-ambient" aria-hidden="true" />
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" />
              {t.eyebrow}
            </span>
            <h1 id="hero-title">
              {t.heroA}
              <br />
              <em>{t.heroB}</em>
            </h1>
            <p>{t.heroDescription}</p>
            <div className="hero-actions">
              <a className="button primary" href="#explore">
                {t.start}
                <ArrowUpRight size={18} />
              </a>
              <button className="tour-start" onClick={() => startTour()}>
                <span className="play-circle">
                  <Play size={12} fill="currentColor" />
                </span>
                {t.watch}
              </button>
            </div>
            <div className="hero-note">
              <span className="tiny-orbit" aria-hidden="true" />
              <span>{t.interactive}</span>
            </div>
          </div>
          <div
            ref={globeShell}
            className={`globe-shell ${expanded ? 'expanded' : ''}`}
            role={expanded ? 'dialog' : undefined}
            aria-modal={expanded ? true : undefined}
            aria-label={expanded ? t.interactive : undefined}
          >
            <div className="globe-topline">
              <span className="eyebrow">
                <Earth size={12} />
                {t.interactive}
              </span>
              <span className="live-indicator">
                <span />
                3D
              </span>
            </div>
            <ErrorBoundary
              fallback={
                <div className="globe-status">
                  <Earth size={35} />
                  <h3>{t.fallbackTitle}</h3>
                  <p>{t.fallbackDescription}</p>
                  <a href="#explore" className="button primary" onClick={() => setExpanded(false)}>
                    {t.atlas}
                  </a>
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="globe-status">
                    <div className="loader-orbit" />
                    <p>{t.loading}</p>
                  </div>
                }
              >
                <Globe
                  ref={globeRef}
                  autoRotate={autoRotate && !selected && !info && !tourActive}
                  onSelect={openPlace}
                  onInteract={handleInteract}
                  onStatus={setGlobeStatus}
                  layers={layers}
                  selectedPlace={current}
                  expanded={expanded}
                />
              </Suspense>
            </ErrorBoundary>
            {globeStatus === 'ready' && !tourActive && !current && (
              <button className="globe-location" onClick={() => openPlace(places[0])}>
                <span className="pin-beacon">
                  <MapPin size={14} />
                </span>
                <span>
                  {t.sriLanka}
                  <small>7.87° N · 80.77° E</small>
                </span>
                <ArrowUpRight size={15} />
              </button>
            )}
            {current && !tourActive && (
              <button className="focused-location" onClick={() => openPlace(current)}>
                <MapPin size={15} />
                <span>
                  {current.name[language]}
                  <small>
                    {formatCoordinate(current.lat, 'lat')} · {formatCoordinate(current.lng, 'lng')}
                  </small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            )}
            <div className="globe-control-row">
              <div className="globe-instructions">
                <MousePointer2 size={13} />
                <span className="desktop-hint">
                  {t.drag}
                  <span className="dot-separator">·</span>
                  {t.scroll}
                </span>
                <span className="touch-hint">{t.touch}</span>
              </div>
              <div className="globe-controls" role="group" aria-label={t.interactive}>
                <GlobeLayers
                  value={layers}
                  onChange={setLayers}
                  disabled={globeStatus !== 'ready'}
                />
                <button
                  className="icon-button"
                  aria-label={t.zoomIn}
                  title={t.zoomIn}
                  disabled={globeStatus !== 'ready'}
                  onClick={() => {
                    handleInteract()
                    globeRef.current?.zoom(1)
                  }}
                >
                  <Plus size={17} />
                </button>
                <button
                  className="icon-button"
                  aria-label={t.zoomOut}
                  title={t.zoomOut}
                  disabled={globeStatus !== 'ready'}
                  onClick={() => {
                    handleInteract()
                    globeRef.current?.zoom(-1)
                  }}
                >
                  <Minus size={17} />
                </button>
                <span className="control-divider" />
                <button
                  className="icon-button"
                  aria-label={t.reset}
                  title={t.reset}
                  disabled={globeStatus !== 'ready'}
                  onClick={reset}
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  className={`icon-button ${autoRotate && !tourActive && !reducedMotion ? 'toggled' : ''}`}
                  aria-label={t.autoRotate}
                  aria-pressed={autoRotate && !tourActive && !reducedMotion}
                  title={t.autoRotate}
                  disabled={reducedMotion || tourActive || globeStatus !== 'ready'}
                  onClick={() => setAutoRotate((value) => !value)}
                >
                  <RotateIcon />
                </button>
                <button
                  className="icon-button"
                  aria-label={expanded ? t.exitFullscreen : t.fullscreen}
                  title={expanded ? t.exitFullscreen : t.fullscreen}
                  aria-expanded={expanded}
                  onClick={() => setExpanded((value) => !value)}
                >
                  {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
              </div>
            </div>
            {expanded && tourActive && (
              <div className="presentation-caption">
                <span className="eyebrow">{journey.name[language]}</span>
                <h2>{tourPlace.name[language]}</h2>
                <p>{tourPlace.description[language]}</p>
                <span className="presentation-disclaimer">NV. EDUGLOBE · {t.presentationDemo}</span>
              </div>
            )}
            {tourActive && (
              <TourPanel
                journey={journey}
                index={tourIndex}
                paused={tourPaused || (!globeVisible && !expanded) || !pageVisible}
                interval={tourInterval}
                expanded={expanded}
                onPause={toggleTourPause}
                onStop={() => setTourActive(false)}
                onStep={setTourIndex}
                onJourney={(route) => startTour(route)}
                onInterval={setTourInterval}
                onPresent={() => setExpanded(true)}
                onSelect={openPlace}
              />
            )}
          </div>
          <div className="hero-bottom">
            <a href="#explore" className="scroll-cue">
              <ArrowDown size={15} />
              <span>{t.planet}</span>
            </a>
            <span className="earth-credit">EARTH IMAGERY · NASA</span>
            <span className="hero-index">
              01 <span>/</span> 05
            </span>
          </div>
        </section>
        <div className="discovery-bar">
          <div>
            <span>07</span>
            <p>{t.continents}</p>
          </div>
          <span className="bar-star" aria-hidden="true">
            ✳
          </span>
          <div>
            <span>20</span>
            <p>{t.destinations}</p>
          </div>
          <span className="bar-star" aria-hidden="true">
            ✳
          </span>
          <div>
            <span>02</span>
            <p>{t.languages}</p>
          </div>
          <div className="bar-statement">
            <span className="status-dot" />
            {t.planet}
          </div>
        </div>

        <section id="explore" className="section explore-section" aria-labelledby="explore-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <Compass size={13} />
                {t.discover}
              </span>
              <h2 id="explore-title">{t.exploreTitle}</h2>
            </div>
            <p>{t.exploreDescription}</p>
          </div>
          <div className="explore-toolbar">
            <label className="search-field">
              <Search size={18} />
              <span className="sr-only">{t.searchLabel}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value.slice(0, 100))}
                placeholder={t.search}
                maxLength={100}
                type="search"
              />
            </label>
            <div className="filter-fields">
              <label className="select-field">
                <span className="sr-only">{t.continents}</span>
                <select value={continent} onChange={(event) => setContinent(event.target.value)}>
                  <option value="all">{t.allContinents}</option>
                  {continents.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name[language]}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </label>
              <label className="select-field">
                <span className="sr-only">{t.allCategories}</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="all">{t.allCategories}</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name[language]}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </label>
            </div>
          </div>
          <div className="results-line">
            <span aria-live="polite">
              <span className="status-dot" />
              {matches.length} {t.results}
            </span>
            <span>
              THE DESTINATION ATLAS <ArrowDownRight size={13} />
            </span>
          </div>
          <div className="place-grid">
            {shown.map((place, i) => (
              <button
                key={place.id}
                className="place-card"
                onClick={() => openPlace(place)}
                aria-label={`${t.view}: ${place.name[language]}`}
              >
                <div className="place-card-image">
                  <PlaceVisual place={place} />
                  <span className="image-category">
                    {categories.find((item) => item.id === place.category)?.name[language]}
                  </span>
                  <span className="card-number">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="place-card-body">
                  <span className="card-region">
                    <MapPin size={11} />
                    {place.region[language]}
                  </span>
                  <div>
                    <h3>{place.name[language]}</h3>
                    <span className="card-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <p>{place.description[language]}</p>
                </div>
              </button>
            ))}
          </div>
          {matches.length === 0 && (
            <div className="empty-state">
              <Compass size={35} strokeWidth={1} />
              <h3>{t.noResults}</h3>
              <p>{t.noResultsDescription}</p>
              <button
                className="button secondary"
                onClick={() => {
                  setQuery('')
                  setContinent('all')
                  setCategory('all')
                }}
              >
                {t.clearFilters}
                <RotateCcw size={16} />
              </button>
            </div>
          )}
          {!query && continent === 'all' && category === 'all' && (
            <div className="show-more">
              <button className="button secondary" onClick={() => setShowAll((value) => !value)}>
                {showAll ? t.showLess : t.showMore}
                <span>{showAll ? '06' : '20'}</span>
                {showAll ? <Minus size={16} /> : <Plus size={16} />}
              </button>
            </div>
          )}
        </section>

        <JourneyCollection onStart={(route) => startTour(route, true)} />

        <section className="sri-lanka-section" id="sri-lanka" aria-labelledby="sl-title">
          <div className="sl-image">
            <img
              src="/assets/sigiriya.jpg"
              alt={
                language === 'en'
                  ? 'Sigiriya, a rock citadel surrounded by forests in Sri Lanka'
                  : 'ශ්‍රී ලංකාවේ වනාන්තර මැද පිහිටි සීගිරි ගල් බලකොටුව'
              }
              loading="lazy"
            />
            <div className="sl-photo-label">
              <span>
                <MapPin size={13} />
                SIGIRIYA, SRI LANKA
              </span>
              <span>7.96° N · 80.76° E</span>
            </div>
            <span className="sl-large-type" aria-hidden="true">
              ශ්‍රී ලංකා
            </span>
          </div>
          <div className="sl-content">
            <span className="eyebrow">
              <span className="status-dot" />
              {t.collection}
            </span>
            <h2 id="sl-title">
              {t.slTitleA}
              <br />
              <em>{t.slTitleB}</em>
            </h2>
            <p>{t.slDescription}</p>
            <span className="sl-places-caption">{t.slPlaces}</span>
            <div className="sl-place-list">
              {places
                .filter((place) => place.sriLanka)
                .map((place, i) => (
                  <button key={place.id} onClick={() => openPlace(place)}>
                    <span className="sl-index">0{i + 1}</span>
                    <span className="sl-place-thumbnail" aria-hidden="true">
                      <PlaceVisual place={place} />
                    </span>
                    <span className="sl-place-name">{place.name[language]}</span>
                    <span className="sl-place-category">
                      {categories.find((item) => item.id === place.category)?.name[language]}
                    </span>
                    <ArrowUpRight size={16} />
                  </button>
                ))}
            </div>
            <button
              className="text-button sl-tour"
              onClick={() => {
                setContinent('asia')
                setCategory('all')
                setQuery(language === 'en' ? 'Sri Lanka' : 'ශ්‍රී ලංකාව')
                scrollTo('explore')
              }}
            >
              {t.slCta}
              <ArrowRight size={16} />
            </button>
            <a
              className="sl-attribution"
              href="https://unsplash.com/photos/NTIodyfKMIM"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photo: sander traa · Unsplash · cropped <ExternalLink size={10} />
            </a>
          </div>
        </section>

        <section id="learn" className="section learn-section" aria-labelledby="learn-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <Sparkles size={13} />
                {t.learningEyebrow}
              </span>
              <h2 id="learn-title">{t.learningTitle}</h2>
            </div>
            <p>{t.learningDescription}</p>
          </div>
          <div className="learning-tabs" role="tablist" aria-label={t.learn}>
            <button
              id="continents-tab"
              role="tab"
              aria-selected={learningMode === 'continents'}
              aria-controls="continents-panel"
              tabIndex={learningMode === 'continents' ? 0 : -1}
              onClick={() => setLearningMode('continents')}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  setLearningMode('quiz')
                  document.getElementById('quiz-tab')?.focus()
                }
              }}
            >
              <Earth size={16} />
              {t.continentMode}
            </button>
            <button
              id="quiz-tab"
              role="tab"
              aria-selected={learningMode === 'quiz'}
              aria-controls="quiz-panel"
              tabIndex={learningMode === 'quiz' ? 0 : -1}
              onClick={() => setLearningMode('quiz')}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  setLearningMode('continents')
                  document.getElementById('continents-tab')?.focus()
                }
              }}
            >
              <GraduationCap size={17} />
              {t.quizMode}
              <span>10</span>
            </button>
          </div>
          <div
            id="continents-panel"
            role="tabpanel"
            aria-labelledby="continents-tab"
            hidden={learningMode !== 'continents'}
            className="continent-panel"
          >
            <div className="continent-list">
              <p>{t.continentHint}</p>
              {continents.map((item, i) => (
                <button
                  key={item.id}
                  aria-pressed={learningContinent.id === item.id}
                  onClick={() => setLearningContinent(item)}
                >
                  <span>0{i + 1}</span>
                  {item.name[language]}
                  <ArrowUpRight size={15} />
                </button>
              ))}
            </div>
            <div className="continent-detail">
              <div className="continent-watermark" aria-hidden="true">
                <Earth size={280} strokeWidth={0.35} />
              </div>
              <span className="eyebrow">
                {t.continents} / 0{continents.indexOf(learningContinent) + 1}
              </span>
              <h3>{learningContinent.name[language]}</h3>
              <p>{learningContinent.description[language]}</p>
              <button className="button secondary" onClick={selectContinent}>
                {t.visitContinent}
                <ArrowUpRight size={16} />
              </button>
              <p className="continent-model fine-print">{t.model}</p>
            </div>
          </div>
          <div
            id="quiz-panel"
            role="tabpanel"
            aria-labelledby="quiz-tab"
            hidden={learningMode !== 'quiz'}
            className="quiz-panel"
          >
            <Quiz />
          </div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="about-heading">
            <span className="eyebrow">{t.madeFor}</span>
            <h2 id="about-title">{t.aboutTitle}</h2>
            <p>{t.aboutDescription}</p>
          </div>
          <div className="audience-grid">
            {[
              {
                title: t.classroom,
                description: t.classroomText,
                icon: <GraduationCap size={25} strokeWidth={1.2} />,
              },
              { title: t.museum, description: t.museumText, icon: <MuseumIcon /> },
              {
                title: t.exhibition,
                description: t.exhibitionText,
                icon: <Maximize2 size={23} strokeWidth={1.2} />,
              },
            ].map((item, i) => (
              <article key={i}>
                <div className="audience-top">
                  {item.icon}
                  <span>0{i + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="business-section" id="business" aria-labelledby="business-title">
          <div className="business-orbit" aria-hidden="true">
            <span>NV.</span>
          </div>
          <div>
            <span className="eyebrow">
              <span className="status-dot" />
              {t.inquiryEyebrow}
            </span>
            <h2 id="business-title">{t.inquiryTitle}</h2>
            <p>{t.inquiryText}</p>
            <a
              className="button light"
              href="https://nv-sharp-solutions.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.inquiryCta}. ${t.external}`}
            >
              {t.inquiryCta}
              <ArrowUpRight size={18} />
            </a>
          </div>
          <span className="business-corner" aria-hidden="true">
            LET’S MAKE AN IMPACT ↗
          </span>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <a className="brand" href="#home">
            <span className="brand-monogram">
              NV<span>.</span>
            </span>
            <span className="brand-divider" />
            <span className="brand-name">
              EduGlobe<span>BY NV SHARP SOLUTIONS</span>
            </span>
          </a>
          <p>{t.demo}</p>
          <a href="#home" className="footer-up" aria-label={t.reset}>
            <ArrowUpRight size={20} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {t.copyright}
          </p>
          <p>
            {t.credit} <span>Navod Ravindu Jayaweera</span>
          </p>
          <div>
            <button onClick={() => setInfo('assets')}>{t.assets}</button>
            <button onClick={() => setInfo('privacy')}>{t.privacy}</button>
          </div>
        </div>
      </footer>
      {selected && (
        <PlaceDetail
          place={selected}
          onClose={() => setSelected(null)}
          onFly={() => flyTo(selected)}
        />
      )}
      {info && (
        <Modal
          title={info === 'privacy' ? t.privacyTitle : t.assetTitle}
          onClose={() => setInfo(null)}
        >
          <div className="info-modal">
            <span className="eyebrow">NV. EDUGLOBE</span>
            {info === 'privacy' ? (
              <>
                <Check size={28} />
                <h3>{t.privacyTitle}</h3>
                <p>{t.privacyText}</p>
                <h4>{t.privacy}</h4>
                <p>{t.accessText}</p>
              </>
            ) : (
              <>
                <BookOpen size={28} />
                <h3>{t.assetTitle}</h3>
                <p>{t.assetText}</p>
                <h4>{t.photoCredits}</h4>
                {Object.entries(photos).map(([id, photo]) => (
                  <a key={id} href={photo.source} target="_blank" rel="noopener noreferrer">
                    {places.find((place) => place.id === id)?.name[language]} · {photo.credit}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
                <a
                  href="https://science.nasa.gov/earth/faq/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.nasaSource}
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://unsplash.com/photos/NTIodyfKMIM"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.photoSource}
                  <ArrowUpRight size={14} />
                </a>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

function RotateIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <path d="M16 8c0-4-8-4-8 4s8 8 8 0M19 8l3 2-3 2" />
    </svg>
  )
}
function MuseumIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="m3 7 9-5 9 5H3Zm2 3v8m5-8v8m4-8v8m5-8v8M2 21h20M3 18h18" />
    </svg>
  )
}
export default App
