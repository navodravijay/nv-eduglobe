import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import type { Place } from '../data/places'
import { PlaceArt } from './PlaceArt'

export function PlaceVisual({
  place,
  className,
  loading = 'lazy',
  withCredit = false,
}: {
  place: Place
  className?: string
  loading?: 'lazy' | 'eager'
  withCredit?: boolean
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const { language } = useLanguage()
  if (!place.image || failedSource === place.image)
    return className ? (
      <div className={className}>
        <PlaceArt place={place} />
      </div>
    ) : (
      <PlaceArt place={place} />
    )
  return (
    <>
      <img
        src={place.image}
        alt={place.imageAlt?.[language] ?? place.name[language]}
        className={className}
        loading={loading}
        decoding="async"
        onError={() => setFailedSource(place.image!)}
      />
      {withCredit && place.imageSource && (
        <a
          className="photo-credit"
          href={place.imageSource}
          target="_blank"
          rel="noopener noreferrer"
        >
          {place.imageCredit} · Unsplash
        </a>
      )}
    </>
  )
}
