import { DEFAULT_MEAL_ID } from '../data/meals'

export const MIN_PASSENGERS = 1
export const MAX_PASSENGERS = 6

export function createPassenger(index) {
  return {
    id: `p-${index}`,
    name: `Passenger ${index}`,
    seatId: null,
    mealId: DEFAULT_MEAL_ID,
  }
}

/**
 * Decide whether a seat click is valid for the active passenger.
 * Pure rules used by App and unit tests.
 */
export function evaluateSeatSelection(passengers, selectedPassengerId, seat) {
  if (!selectedPassengerId) {
    return { ok: false, code: 'NO_PASSENGER', message: 'Select a passenger before choosing a seat.' }
  }

  if (!seat) {
    return { ok: false, code: 'INVALID_SEAT', message: 'Seat not found.' }
  }

  if (seat.occupied) {
    return { ok: false, code: 'OCCUPIED', message: `Seat ${seat.id} is unavailable.` }
  }

  const owner = passengers.find((p) => p.seatId === seat.id)
  if (owner && owner.id !== selectedPassengerId) {
    return {
      ok: false,
      code: 'TAKEN',
      message: `Seat ${seat.id} belongs to ${owner.name}.`,
    }
  }

  const active = passengers.find((p) => p.id === selectedPassengerId)
  if (!active) {
    return { ok: false, code: 'NO_PASSENGER', message: 'Select a passenger before choosing a seat.' }
  }

  if (active.seatId === seat.id) {
    return { ok: true, action: 'clear', passengerId: selectedPassengerId, seatId: seat.id }
  }

  return {
    ok: true,
    action: 'assign',
    passengerId: selectedPassengerId,
    seatId: seat.id,
    previousSeatId: active.seatId,
  }
}

export function applySeatSelection(passengers, decision) {
  if (!decision?.ok) return passengers

  if (decision.action === 'clear') {
    return passengers.map((p) =>
      p.id === decision.passengerId ? { ...p, seatId: null } : p,
    )
  }

  return passengers.map((p) =>
    p.id === decision.passengerId ? { ...p, seatId: decision.seatId } : p,
  )
}

export function clearPassengerSeat(passengers, passengerId) {
  return passengers.map((p) => (p.id === passengerId ? { ...p, seatId: null } : p))
}

export function clearAllSeats(passengers) {
  return passengers.map((p) => ({ ...p, seatId: null }))
}

export function setPassengerMeal(passengers, passengerId, mealId) {
  return passengers.map((p) => (p.id === passengerId ? { ...p, mealId } : p))
}

export function addPassenger(passengers, nextIndex) {
  if (passengers.length >= MAX_PASSENGERS) {
    return { ok: false, passengers, nextIndex, selectedPassengerId: null }
  }
  const passenger = createPassenger(nextIndex)
  return {
    ok: true,
    passengers: [...passengers, passenger],
    nextIndex: nextIndex + 1,
    selectedPassengerId: passenger.id,
    passenger,
  }
}

export function removeLastPassenger(passengers, selectedPassengerId) {
  if (passengers.length <= MIN_PASSENGERS) {
    return { ok: false, passengers, selectedPassengerId }
  }

  const next = passengers.slice(0, -1)
  const removed = passengers[passengers.length - 1]
  const nextSelected = next.some((p) => p.id === selectedPassengerId)
    ? selectedPassengerId
    : next[next.length - 1].id

  return {
    ok: true,
    passengers: next,
    selectedPassengerId: nextSelected,
    removed,
  }
}
