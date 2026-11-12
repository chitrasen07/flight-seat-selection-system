import { describe, expect, it } from 'vitest'
import { AIRCRAFT_DATA } from '../data/aircraft'
import { DEFAULT_MEAL_ID } from '../data/meals'
import { buildBookingSummary, formatINR, formatSeatPrice } from './pricing'
import { createPassenger } from './assignment'

describe('pricing formatters', () => {
  it('formats INR and free seat labels', () => {
    expect(formatINR(250)).toBe('₹250')
    expect(formatINR(0)).toBe('₹0')
    expect(formatSeatPrice(0)).toBe('Free')
    expect(formatSeatPrice(350)).toBe('₹350')
  })
})

describe('buildBookingSummary', () => {
  const seats = AIRCRAFT_DATA['layout-3-2'].seats

  it('returns zero totals with default no-meal passengers', () => {
    const summary = buildBookingSummary([createPassenger(1)], seats)
    expect(summary).toMatchObject({
      passengerCount: 1,
      assignedSeatCount: 0,
      seatSubtotal: 0,
      mealSubtotal: 0,
      grandTotal: 0,
    })
    expect(summary.lines[0].mealId).toBe(DEFAULT_MEAL_ID)
  })

  it('prices free, premium, and extra-legroom seats correctly', () => {
    const passengers = [
      { ...createPassenger(1), seatId: '1A' },
      { ...createPassenger(2), seatId: '1E' },
      { ...createPassenger(3), seatId: '1C' },
    ]
    const summary = buildBookingSummary(passengers, seats)
    expect(summary.lines.map((l) => l.seatPrice)).toEqual([0, 250, 350])
    expect(summary.seatSubtotal).toBe(600)
    expect(summary.grandTotal).toBe(600)
  })

  it('includes meal-only charges without seats', () => {
    const passengers = [
      { ...createPassenger(1), mealId: 'chicken-biryani' },
      { ...createPassenger(2), mealId: 'paneer-wrap' },
    ]
    const summary = buildBookingSummary(passengers, seats)
    expect(summary.assignedSeatCount).toBe(0)
    expect(summary.mealSubtotal).toBe(430)
    expect(summary.grandTotal).toBe(430)
  })

  it('updates when seats and meals change together', () => {
    const passengers = [
      { ...createPassenger(1), seatId: '1E', mealId: 'sandwich' },
      { ...createPassenger(2), seatId: '2A', mealId: 'veg-thali' },
    ]
    const summary = buildBookingSummary(passengers, seats)
    expect(summary.seatSubtotal).toBe(600)
    expect(summary.mealSubtotal).toBe(150)
    expect(summary.grandTotal).toBe(750)
  })
})
