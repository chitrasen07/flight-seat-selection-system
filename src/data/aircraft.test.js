import { describe, expect, it } from 'vitest'
import { AIRCRAFT_DATA, AIRCRAFT_LAYOUTS, SEAT_CATEGORIES, getSeatColumns } from './aircraft'

describe('aircraft layouts', () => {
  it('uses assessment 3–2 groups A B C | D E', () => {
    const layout = AIRCRAFT_LAYOUTS['layout-3-2']
    expect(layout.groups).toEqual([
      ['A', 'B', 'C'],
      ['D', 'E'],
    ])
    expect(getSeatColumns(layout)).toEqual(['A', 'B', 'C', 'D', 'E'])
    expect(Object.keys(AIRCRAFT_DATA['layout-3-2'].seats)).toHaveLength(layout.rowCount * 5)
  })

  it('uses assessment 2–3–2 groups A B | D E F | G H (no C)', () => {
    const layout = AIRCRAFT_LAYOUTS['layout-2-3-2']
    expect(layout.groups).toEqual([
      ['A', 'B'],
      ['D', 'E', 'F'],
      ['G', 'H'],
    ])
    expect(getSeatColumns(layout)).toEqual(['A', 'B', 'D', 'E', 'F', 'G', 'H'])
    expect(Object.keys(AIRCRAFT_DATA['layout-2-3-2'].seats)).toHaveLength(layout.rowCount * 7)
    expect(AIRCRAFT_DATA['layout-2-3-2'].seats['1C']).toBeUndefined()
  })

  it('matches sample assessment pricing for row 1–2 seats', () => {
    const seats = AIRCRAFT_DATA['layout-3-2'].seats
    expect(seats['1A'].price).toBe(0)
    expect(seats['1B'].price).toBe(0)
    expect(seats['1C']).toMatchObject({ category: 'extraLegroom', price: 350 })
    expect(seats['1D'].price).toBe(0)
    expect(seats['1E']).toMatchObject({ category: 'premium', price: 250 })
    expect(seats['2A']).toMatchObject({ category: 'extraLegroom', price: 350 })
    expect(seats['2B'].price).toBe(0)
  })

  it('marks sample occupied seats as non-available', () => {
    const seats = AIRCRAFT_DATA['layout-3-2'].seats
    expect(seats['2B'].occupied).toBe(true)
    expect(seats['3D'].occupied).toBe(true)
    expect(seats['5A'].occupied).toBe(true)
    expect(seats['8C'].occupied).toBe(true)
    expect(seats['8E'].occupied).toBe(true)
  })

  it('keeps category prices aligned with SEAT_CATEGORIES', () => {
    expect(SEAT_CATEGORIES.premium.price).toBe(250)
    expect(SEAT_CATEGORIES.extraLegroom.price).toBe(350)
    expect(SEAT_CATEGORIES.free.price).toBe(0)
    expect(SEAT_CATEGORIES.standard.price).toBe(0)
  })
})
