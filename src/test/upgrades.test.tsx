import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { journeys, journeyPlaces } from '../data/journeys'
import { photos } from '../data/photos'
import { places } from '../data/places'
import { LanguageProvider } from '../context/LanguageContext'
import { PlaceVisual } from '../components/PlaceVisual'

describe('curated journeys and licensed photography', () => {
  it('resolves every stop and cover to a real, unique destination', () => {
    expect(journeys).toHaveLength(3)
    for (const journey of journeys) {
      const stops = journeyPlaces(journey)
      expect(new Set(stops.map((place) => place.id)).size).toBe(stops.length)
      expect(stops.some((place) => place.id === journey.cover)).toBe(true)
      expect(journey.name.si).toMatch(/[\u0D80-\u0DFF]/)
    }
  })
  it('keeps Sri Lanka and natural-wonder journeys consistent with their subjects', () => {
    const sriLanka = journeyPlaces(journeys.find((journey) => journey.id === 'sri-lanka')!)
    expect(sriLanka).toHaveLength(5)
    expect(sriLanka.every((place) => place.sriLanka)).toBe(true)
    const nature = journeyPlaces(journeys.find((journey) => journey.id === 'nature')!)
    expect(nature).toHaveLength(4)
    expect(nature.every((place) => place.category === 'nature')).toBe(true)
  })
  it('ships complete photo credits, translated alt text and valid local JPEGs', () => {
    for (const [id, photo] of Object.entries(photos)) {
      expect(places.some((place) => place.id === id && place.image === photo.src)).toBe(true)
      expect(photo.source).toMatch(/^https:\/\/unsplash.com\/photos\//)
      expect(photo.license).toBe('https://unsplash.com/license')
      expect(photo.credit.length).toBeGreaterThan(0)
      expect(photo.alt.si).toMatch(/[\u0D80-\u0DFF]/)
      const buffer = readFileSync(resolve('public', photo.src.slice(1)))
      expect([...buffer.subarray(0, 2)]).toEqual([0xff, 0xd8])
    }
  })
})

describe('destination imagery', () => {
  const everest = places.find((place) => place.id === 'everest')!
  it('uses a destination-specific caption and source credit', () => {
    render(
      <LanguageProvider>
        <PlaceVisual place={everest} withCredit />
      </LanguageProvider>,
    )
    expect(screen.getByRole('img')).toHaveAttribute('alt', photos.everest.alt.en)
    expect(screen.getByRole('link')).toHaveTextContent('Mauricio Manzato')
  })
  it('recovers from a failed photo with original artwork and removes the photo credit', () => {
    const { container } = render(
      <LanguageProvider>
        <PlaceVisual place={everest} withCredit />
      </LanguageProvider>,
    )
    fireEvent.error(screen.getByRole('img'))
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(container.querySelector('.place-art')).toBeInTheDocument()
  })
})
