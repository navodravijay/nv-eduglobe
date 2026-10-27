import type { Place } from '../data/places'

// Original vector illustrations. These are interpretations, not photographic records.
export function PlaceArt({ place }: { place: Place }) {
  const kind = ['everest', 'ella', 'machu-picchu'].includes(place.id)
    ? 'mountain'
    : place.id === 'giza' || place.id === 'egypt'
      ? 'desert'
      : place.id === 'amazon' || place.id === 'brazil'
        ? 'forest'
        : place.id === 'great-barrier-reef'
          ? 'ocean'
          : place.id === 'south-pole'
            ? 'ice'
            : 'globe'
  return (
    <div className={`place-art landscape-${kind}`} aria-hidden="true">
      <svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" fill="none">
        <circle cx="440" cy="100" r="41" className="art-sun" />
        {kind === 'mountain' && (
          <>
            <path
              d="M0 290 115 164 177 218 310 40 465 227 540 150 600 230V340H0Z"
              fill="currentColor"
              opacity=".22"
            />
            <path d="m90 340 220-300 220 300" fill="currentColor" opacity=".2" />
            <path d="m255 115 55-75 57 77-35-13-22 30-24-35Z" fill="currentColor" opacity=".6" />
            <path
              d="m0 340 163-151 99 151m60 0 138-159 140 159"
              stroke="currentColor"
              opacity=".6"
            />
            <path
              d="m310 134 24 39-14 35 25 40-13 48 25 44M177 218l45 62m88-240-8 62"
              stroke="currentColor"
              opacity=".3"
            />
          </>
        )}
        {kind === 'desert' && (
          <>
            <path d="M0 290q140-95 300-10t300-10v70H0Z" fill="currentColor" opacity=".13" />
            <path d="m130 290 150-205 158 205Z" fill="currentColor" opacity=".4" />
            <path d="m280 85 25 205h133Z" fill="currentColor" opacity=".2" />
            <path d="m360 290 88-130 99 130Z" fill="currentColor" opacity=".23" />
            <path d="M0 317q160-51 300-4t300-10" stroke="currentColor" opacity=".6" />
          </>
        )}
        {kind === 'forest' && (
          <>
            {[90, 160, 235, 315, 400, 480, 550].map((x, i) => (
              <g key={x} opacity={0.18 + (i % 3) * 0.1}>
                <path d={`M${x} 330V${95 + (i % 3) * 30}`} stroke="currentColor" strokeWidth="3" />
                <path
                  d={`M${x - 70} ${220 + (i % 3) * 30}q-20-65 30-65-15-65 40-65t40 65q50 0 30 65Z`}
                  fill="currentColor"
                />
              </g>
            ))}
            <path
              d="M280 340q-70-60 0-100t15-60"
              stroke="currentColor"
              opacity=".6"
              strokeWidth="18"
            />
          </>
        )}
        {kind === 'ocean' && (
          <>
            {[130, 165, 200, 235, 270].map((y, i) => (
              <path
                key={y}
                d={`M-20 ${y}q80-45 160 0t160 0 160 0 160 0`}
                stroke="currentColor"
                opacity={0.1 + i * 0.1}
                strokeWidth="2"
              />
            ))}
            <path
              d="M100 340v-63m0 30-30-29m30 16 30-37m320 83v-80m0 43-30-29m30 9 35-45"
              stroke="currentColor"
              opacity=".55"
              strokeWidth="5"
            />
          </>
        )}
        {kind === 'ice' && (
          <>
            <path
              d="m0 270 125-65 88 30 125-100 90 85 90-15 82 50v85H0Z"
              fill="currentColor"
              opacity=".3"
            />
            <path
              d="m213 235 125-100-10 112 100-27M0 290l188 10 140-53 95 54 177-20"
              stroke="currentColor"
              opacity=".5"
            />
          </>
        )}
        {kind === 'globe' && (
          <g stroke="currentColor" opacity=".4">
            <circle cx="300" cy="210" r="138" />
            <ellipse cx="300" cy="210" rx="65" ry="138" />
            <ellipse cx="300" cy="210" rx="118" ry="138" />
            <ellipse cx="300" cy="210" rx="138" ry="44" />
            <ellipse cx="300" cy="210" rx="138" ry="103" />
            <path d="M162 210h276M300 72v276" />
            <circle cx="354" cy="151" r="5" fill="currentColor" />
          </g>
        )}
        <path d="M24 24v20m-10-10h20m542 266v20m-10-10h20" stroke="currentColor" opacity=".4" />
      </svg>
      <span className="art-caption">NV. FIELD NOTES</span>
    </div>
  )
}
