import { SEAT_CATEGORIES } from '../data/aircraft'
import { MEALS, DEFAULT_MEAL_ID } from '../data/meals'

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** Format an integer INR amount consistently across the app. */
export function formatINR(amount) {
  return inrFormatter.format(Math.round(Number(amount) || 0))
}

export function formatSeatPrice(amount) {
  const value = Math.round(Number(amount) || 0)
  return value === 0 ? 'Free' : formatINR(value)
}

export function getMealById(mealId) {
  return MEALS.find((meal) => meal.id === mealId) ?? MEALS.find((m) => m.id === DEFAULT_MEAL_ID)
}

export function getSeatCategory(seat) {
  if (!seat) return null
  return SEAT_CATEGORIES[seat.category] ?? SEAT_CATEGORIES.standard
}

/**
 * Derive booking lines and totals from current assignments.
 * Totals are never stored in React state — always recalculated.
 */
export function buildBookingSummary(passengers, seats) {
  const lines = passengers.map((passenger) => {
    const seat = passenger.seatId ? (seats[passenger.seatId] ?? null) : null
    const category = getSeatCategory(seat)
    const meal = getMealById(passenger.mealId)
    const seatPrice = seat ? Math.round(seat.price) : 0
    const mealPrice = Math.round(meal?.price ?? 0)

    return {
      id: passenger.id,
      name: passenger.name,
      seatId: seat?.id ?? null,
      seatCategory: category?.label ?? null,
      seatPrice,
      mealId: meal?.id ?? DEFAULT_MEAL_ID,
      mealName: meal?.name ?? 'No meal',
      mealPrice,
      subtotal: seatPrice + mealPrice,
    }
  })

  const seatSubtotal = lines.reduce((sum, line) => sum + line.seatPrice, 0)
  const mealSubtotal = lines.reduce((sum, line) => sum + line.mealPrice, 0)

  return {
    lines,
    passengerCount: passengers.length,
    assignedSeatCount: lines.filter((line) => line.seatId).length,
    seatSubtotal,
    mealSubtotal,
    grandTotal: seatSubtotal + mealSubtotal,
  }
}
