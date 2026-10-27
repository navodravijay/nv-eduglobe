import { ArrowUpRight, LocateFixed, MapPin, Sparkles } from 'lucide-react'
import { categories, continents, formatCoordinate, type Place } from '../data/places'
import { useLanguage } from '../context/LanguageContext'
import { Modal } from './Modal'
import { PlaceVisual } from './PlaceVisual'

export function PlaceDetail({
  place,
  onClose,
  onFly,
}: {
  place: Place
  onClose: () => void
  onFly: () => void
}) {
  const { language, t } = useLanguage()
  return (
    <Modal title={place.name[language]} onClose={onClose} className="place-modal">
      {place.image ? (
        <div className="detail-photo">
          <PlaceVisual place={place} loading="eager" withCredit />
        </div>
      ) : (
        <div className={`detail-art art-${place.category}`}>
          <span className="coordinate-art">
            {formatCoordinate(place.lat, 'lat')}
            <br />
            {formatCoordinate(place.lng, 'lng')}
          </span>
          <GlobeIllustration />
        </div>
      )}
      <div className="detail-body">
        <span className="eyebrow">
          <MapPin size={13} />
          {place.region[language]} <span className="dot-separator">·</span>{' '}
          {continents.find((item) => item.id === place.continent)?.name[language]}
        </span>
        <h3>{place.name[language]}</h3>
        <span className="tag">
          {categories.find((category) => category.id === place.category)?.name[language]}
        </span>
        <p className="detail-description">{place.description[language]}</p>
        <div className="fact-box">
          <Sparkles size={20} />
          <div>
            <span className="eyebrow">{t.didYouKnow}</span>
            <p>{place.fact[language]}</p>
          </div>
        </div>
        <dl className="coordinate-grid">
          <div>
            <dt>{t.latitude}</dt>
            <dd>{formatCoordinate(place.lat, 'lat')}</dd>
          </div>
          <div>
            <dt>{t.longitude}</dt>
            <dd>{formatCoordinate(place.lng, 'lng')}</dd>
          </div>
        </dl>
        <button className="button primary full-width" onClick={onFly}>
          <LocateFixed size={17} />
          {t.fly}
          <ArrowUpRight size={17} />
        </button>
        <a
          className="detail-source"
          href={place.source.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.source}: {place.source.name}
          <ArrowUpRight size={13} />
          <span className="sr-only">
            {language === 'en' ? '(opens in a new tab)' : '(නව ටැබයක විවෘත වේ)'}
          </span>
        </a>
        <p className="fine-print">{t.representative}</p>
      </div>
    </Modal>
  )
}

function GlobeIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="globe-illustration"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="80" />
      <ellipse cx="100" cy="100" rx="38" ry="80" />
      <ellipse cx="100" cy="100" rx="67" ry="80" />
      <ellipse cx="100" cy="100" rx="80" ry="26" />
      <ellipse cx="100" cy="100" rx="80" ry="60" />
      <path d="M20 100h160M100 20v160" />
      <circle cx="130" cy="70" r="4" fill="currentColor" />
    </svg>
  )
}
