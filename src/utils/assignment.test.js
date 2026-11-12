import { describe, expect, it } from 'vitest'
import {
  MAX_PASSENGERS,
  addPassenger,
  applySeatSelection,
  clearAllSeats,
  clearPassengerSeat,
  createPassenger,
  evaluateSeatSelection,
  removeLastPassenger,
  setPassengerMeal,
} from './assignment'

function seat(id, overrides = {}) {
  return { id, occupied: false, price: 0, category: 'standard', ...overrides }
}

describe('evaluateSeatSelection / applySeatSelection', () => {
  it('assigns an available seat to the active passenger', () => {
    const passengers = [createPassenger(1)]
    const decision = evaluateSeatSelection(passengers, 'p-1', seat('1A'))
    expect(decision).toMatchObject({ ok: true, action: 'assign', seatId: '1A' })
    expect(applySeatSelection(passengers, decision)[0].seatId).toBe('1A')
  })

  it('clears the seat when the same seat is clicked again', () => {
    const passengers = [{ ...createPassenger(1), seatId: '1A' }]
    const decision = evaluateSeatSelection(passengers, 'p-1', seat('1A'))
    expect(decision.action).toBe('clear')
    expect(applySeatSelection(passengers, decision)[0].seatId).toBeNull()
  })

  it('replaces an existing seat for the active passenger', () => {
    const passengers = [{ ...createPassenger(1), seatId: '1A' }]
    const decision = evaluateSeatSelection(passengers, 'p-1', seat('1E', { price: 250 }))
    expect(decision).toMatchObject({
      ok: true,
      action: 'assign',
      seatId: '1E',
      previousSeatId: '1A',
    })
    expect(applySeatSelection(passengers, decision)[0].seatId).toBe('1E')
  })

  it('blocks occupied seats', () => {
    const passengers = [createPassenger(1)]
    const decision = evaluateSeatSelection(passengers, 'p-1', seat('2B', { occupied: true }))
    expect(decision).toMatchObject({ ok: false, code: 'OCCUPIED' })
    expect(applySeatSelection(passengers, decision)[0].seatId).toBeNull()
  })

  it('prevents duplicate assignment across passengers', () => {
    const passengers = [
      { ...createPassenger(1), seatId: '1A' },
      createPassenger(2),
    ]
    const decision = evaluateSeatSelection(passengers, 'p-2', seat('1A'))
    expect(decision).toMatchObject({ ok: false, code: 'TAKEN' })
  })

  it('requires an active passenger', () => {
    const decision = evaluateSeatSelection([createPassenger(1)], null, seat('1A'))
    expect(decision).toMatchObject({ ok: false, code: 'NO_PASSENGER' })
  })
})

describe('passenger helpers', () => {
  it('adds passengers up to the maximum', () => {
    let passengers = [createPassenger(1)]
    let nextIndex = 2
    for (let i = 0; i < MAX_PASSENGERS - 1; i++) {
      const result = addPassenger(passengers, nextIndex)
      expect(result.ok).toBe(true)
      passengers = result.passengers
      nextIndex = result.nextIndex
    }
    expect(passengers).toHaveLength(MAX_PASSENGERS)
    expect(addPassenger(passengers, nextIndex).ok).toBe(false)
  })

  it('removes the last passenger and their seat data', () => {
    const passengers = [
      { ...createPassenger(1), seatId: '1A' },
      { ...createPassenger(2), seatId: '1E', mealId: 'chicken-biryani' },
    ]
    const result = removeLastPassenger(passengers, 'p-2')
    expect(result.ok).toBe(true)
    expect(result.passengers).toHaveLength(1)
    expect(result.passengers[0].seatId).toBe('1A')
    expect(result.selectedPassengerId).toBe('p-1')
    expect(result.removed.seatId).toBe('1E')
  })

  it('clears a single seat and all seats independently of meals', () => {
    const passengers = [
      { ...createPassenger(1), seatId: '1A', mealId: 'veg-thali' },
      { ...createPassenger(2), seatId: '1E', mealId: 'sandwich' },
    ]
    expect(clearPassengerSeat(passengers, 'p-1')[0]).toMatchObject({
      seatId: null,
      mealId: 'veg-thali',
    })
    const cleared = clearAllSeats(passengers)
    expect(cleared.every((p) => p.seatId === null)).toBe(true)
    expect(cleared.map((p) => p.mealId)).toEqual(['veg-thali', 'sandwich'])
  })

  it('updates meals per passenger', () => {
    const passengers = [createPassenger(1), createPassenger(2)]
    const next = setPassengerMeal(passengers, 'p-2', 'paneer-wrap')
    expect(next[0].mealId).toBe('none')
    expect(next[1].mealId).toBe('paneer-wrap')
  })
})
