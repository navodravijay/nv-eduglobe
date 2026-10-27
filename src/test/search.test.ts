import { describe, expect, it } from 'vitest'
import { continents, formatCoordinate, places, searchPlaces, tourIds } from '../data/places'

describe('destination search', () => {
  it('matches English names without case or surrounding-space sensitivity', () => {
    expect(searchPlaces('  SiGiRiYa  ').map((place) => place.id)).toEqual(['sigiriya'])
  })
  it('matches Sinhala names and country names in either language', () => {
    expect(searchPlaces('සීගිරිය')[0].id).toBe('sigiriya')
    expect(searchPlaces('ශ්‍රී ලංකාව')).toHaveLength(6)
    expect(searchPlaces('Sri Lanka')).toHaveLength(6)
  })
  it('combines search, continent and category filters', () => {
    expect(searchPlaces('Egypt', 'africa', 'heritage').map((place) => place.id)).toEqual(['giza'])
    expect(searchPlaces('Egypt', 'europe', 'heritage')).toEqual([])
    expect(searchPlaces('', 'asia', 'city').map((place) => place.id)).toEqual(['colombo'])
  })
  it('returns no results for unknown or HTML-like input without executing it', () => {
    expect(searchPlaces('<img src=x onerror=alert(1)>')).toEqual([])
    expect(searchPlaces('not-a-real-location')).toEqual([])
  })
  it('returns all places for an empty query', () => expect(searchPlaces('')).toHaveLength(20))
})

describe('geographic data integrity', () => {
  it('contains unique IDs, complete translations and valid coordinates and sources', () => {
    expect(new Set(places.map((place) => place.id)).size).toBe(places.length)
    for (const place of places) {
      expect(place.lat).toBeGreaterThanOrEqual(-90)
      expect(place.lat).toBeLessThanOrEqual(90)
      expect(place.lng).toBeGreaterThanOrEqual(-180)
      expect(place.lng).toBeLessThanOrEqual(180)
      expect(place.source.url).toMatch(/^https:\/\//)
      for (const field of [place.name, place.description, place.fact]) {
        expect(field.en.length).toBeGreaterThan(0)
        expect(field.si).toMatch(/[\u0D80-\u0DFF]/)
      }
    }
  })
  it('covers all seven continents and all six tour stops', () => {
    expect(new Set(places.map((place) => place.continent)).size).toBe(continents.length)
    expect(tourIds.every((id) => places.some((place) => place.id === id))).toBe(true)
    expect(places.filter((place) => place.sriLanka)).toHaveLength(5)
  })
  it('formats hemispheres correctly', () => {
    expect(formatCoordinate(-13.1631, 'lat')).toBe('13.16° S')
    expect(formatCoordinate(-72.545, 'lng')).toBe('72.55° W')
    expect(formatCoordinate(7.957, 'lat')).toBe('7.96° N')
  })
})
