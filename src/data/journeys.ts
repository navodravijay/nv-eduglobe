import { places, text, tourIds, type Localized } from './places'

export interface Journey {
  id: 'world' | 'sri-lanka' | 'nature'
  name: Localized
  description: Localized
  stops: string[]
  cover: string
}

export const journeys: Journey[] = [
  {
    id: 'world',
    name: text('Around the extraordinary', 'අපූරු ලෝකය වටා'),
    description: text(
      'Ancient ingenuity. Living landscapes. Follow six stories across our planet.',
      'පුරාණ නිර්මාණ සහ සජීවී භූ දර්ශන. අපේ පෘථිවිය හරහා කතා හයක් සොයා යන්න.',
    ),
    stops: tourIds,
    cover: 'giza',
  },
  {
    id: 'sri-lanka',
    name: text('An island of stories', 'කතාවලින් පිරි දූපතක්'),
    description: text(
      'From Sigiriya to Colombo, explore five perspectives on Sri Lanka’s heritage and landscapes.',
      'සීගිරියේ සිට කොළඹ දක්වා, ශ්‍රී ලංකාවේ උරුමය සහ භූ දර්ශන පිළිබඳ දැක්මන් පහක් ගවේෂණය කරන්න.',
    ),
    stops: ['sigiriya', 'kandy', 'galle', 'ella', 'colombo'],
    cover: 'sigiriya',
  },
  {
    id: 'nature',
    name: text('Shaped by nature', 'සොබාදහමේ නිර්මාණ'),
    description: text(
      'Mountains, rivers, rainforest and reef. Meet the forces that shape our world.',
      'කඳු, ගංගා, වැසි වනාන්තර සහ කොරල් පර. අපේ ලෝකය හැඩගස්වන බලවේග හඳුනා ගන්න.',
    ),
    stops: ['everest', 'grand-canyon', 'amazon', 'great-barrier-reef'],
    cover: 'everest',
  },
]

export function journeyPlaces(journey: Journey) {
  return journey.stops.map((id) => {
    const place = places.find((item) => item.id === id)
    if (!place) throw new Error(`Unknown journey destination: ${id}`)
    return place
  })
}
