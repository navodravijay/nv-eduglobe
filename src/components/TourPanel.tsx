import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { journeys, journeyPlaces, type Journey } from '../data/journeys'
import type { Place } from '../data/places'
import { PlaceVisual } from './PlaceVisual'

export function TourPanel({
  journey,
  index,
  paused,
  interval,
  expanded,
  onPause,
  onStop,
  onStep,
  onJourney,
  onInterval,
  onPresent,
  onSelect,
}: {
  journey: Journey
  index: number
  paused: boolean
  interval: number
  expanded: boolean
  onPause: () => void
  onStop: () => void
  onStep: (index: number) => void
  onJourney: (journey: Journey) => void
  onInterval: (seconds: number) => void
  onPresent: () => void
  onSelect: (place: Place) => void
}) {
  const { language, t } = useLanguage()
  const stops = journeyPlaces(journey)
  const place = stops[index]
  return (
    <div className="tour-panel upgraded-tour">
      <div className="tour-panel-heading">
        <span className="eyebrow">
          <span className={`status-dot ${paused ? 'paused' : ''}`} />
          {t.guidedJourney}
          <span className="tour-count">
            {String(index + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
          </span>
        </span>
        <div className="tour-heading-actions">
          {!expanded && (
            <button
              className="icon-button"
              aria-label={t.presentationView}
              title={t.presentationView}
              onClick={onPresent}
            >
              <Maximize2 size={14} />
            </button>
          )}
          <button className="icon-button" aria-label={t.endTour} onClick={onStop}>
            <X size={16} />
          </button>
        </div>
      </div>
      <label className="tour-route-select">
        <span className="sr-only">{t.chooseJourney}</span>
        <select
          aria-label={t.chooseJourney}
          value={journey.id}
          onChange={(event) => {
            const selected = journeys.find((item) => item.id === event.target.value)
            if (selected) onJourney(selected)
          }}
        >
          {journeys.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name[language]}
            </option>
          ))}
        </select>
      </label>
      {place.image && <PlaceVisual className="tour-photo" place={place} loading="eager" />}
      <button className="tour-destination" onClick={() => onSelect(place)}>
        <span>
          <h3>{place.name[language]}</h3>
          <span>{place.region[language]}</span>
        </span>
        <ArrowUpRight size={22} />
      </button>
      <p className="tour-fact">{place.fact[language]}</p>
      <div className="tour-settings">
        <label>
          {t.travelPace}
          <select
            aria-label={t.travelPace}
            value={interval}
            onChange={(event) => onInterval(Number(event.target.value))}
          >
            {[8, 12, 20].map((seconds) => (
              <option value={seconds} key={seconds}>
                {seconds} {t.seconds}
              </option>
            ))}
          </select>
        </label>
        <span>{paused ? t.tourPaused : `${interval} ${t.seconds} / ${t.stopLabel}`}</span>
      </div>
      <div className="tour-bottom">
        <span>
          {t.stopLabel} {index + 1} {t.of} {stops.length}
        </span>
        <div>
          <button
            className="icon-button"
            aria-label={t.previousStop}
            onClick={() => onStep((index + stops.length - 1) % stops.length)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="icon-button"
            aria-label={paused ? t.resume : t.pause}
            onClick={onPause}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button
            className="icon-button"
            aria-label={t.nextStop}
            onClick={() => onStep((index + 1) % stops.length)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="tour-segments">
        {stops.map((stop, i) => (
          <button
            key={stop.id}
            aria-label={stop.name[language]}
            aria-current={i === index ? 'step' : undefined}
            onClick={() => onStep(i)}
            className={i === index ? 'current' : ''}
          />
        ))}
      </div>
    </div>
  )
}
