import { ArrowUpRight, Route } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { journeys, journeyPlaces, type Journey } from '../data/journeys'
import { PlaceVisual } from './PlaceVisual'

export function JourneyCollection({ onStart }: { onStart: (journey: Journey) => void }) {
  const { language, t } = useLanguage()
  return (
    <section className="section journey-section" aria-labelledby="journey-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <Route size={13} />
            {t.journeysEyebrow}
          </span>
          <h2 id="journey-title">{t.journeysTitle}</h2>
        </div>
        <p>{t.journeysDescription}</p>
      </div>
      <div className="journey-grid">
        {journeys.map((journey, index) => {
          const stops = journeyPlaces(journey)
          const cover = stops.find((place) => place.id === journey.cover) ?? stops[0]
          return (
            <article className={`journey-card journey-${journey.id}`} key={journey.id}>
              <div className="journey-image">
                <PlaceVisual place={cover} />
                <span className="journey-index">JOURNEY 0{index + 1}</span>
                <span className="journey-stops">
                  {stops.length} {t.stops}
                </span>
              </div>
              <div className="journey-body">
                <h3>{journey.name[language]}</h3>
                <p>{journey.description[language]}</p>
                <div className="journey-route" aria-label={t.destinations}>
                  {stops.slice(0, 3).map((place, i) => (
                    <span key={place.id}>
                      {i > 0 && <span aria-hidden="true">—</span>}
                      {place.name[language]}
                    </span>
                  ))}
                  <span>+{stops.length - 3}</span>
                </div>
                <button
                  className="button secondary"
                  onClick={() => onStart(journey)}
                  aria-label={`${t.startJourney}: ${journey.name[language]}`}
                >
                  {t.startJourney}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
