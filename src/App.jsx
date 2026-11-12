import { useState } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'
import Header from './components/Header'
import FlightDetails from './components/FlightDetails'
import PassengerList from './components/PassengerList'
import AircraftIllustration from './components/AircraftIllustration'
import MealSelector from './components/MealSelector'
import BookingSummary from './components/BookingSummary'
import {
  AIRCRAFT_DATA,
  AIRCRAFT_LAYOUTS,
  DEFAULT_LAYOUT_ID,
  FLIGHT_INFO,
} from './data/aircraft'
import { MEALS } from './data/meals'
import {
  MAX_PASSENGERS,
  MIN_PASSENGERS,
  addPassenger,
  applySeatSelection,
  clearAllSeats,
  clearPassengerSeat,
  createPassenger,
  evaluateSeatSelection,
  removeLastPassenger,
  setPassengerMeal,
} from './utils/assignment'

export default function App() {
  const [layoutId, setLayoutId] = useState(DEFAULT_LAYOUT_ID)
  const [passengers, setPassengers] = useState([createPassenger(1)])
  const [selectedPassengerId, setSelectedPassengerId] = useState('p-1')
  const [nextPassengerIndex, setNextPassengerIndex] = useState(2)
  const [feedback, setFeedback] = useState(null)

  const aircraft = AIRCRAFT_DATA[layoutId]
  const layouts = Object.values(AIRCRAFT_LAYOUTS)
  const activePassenger = passengers.find((p) => p.id === selectedPassengerId) ?? null
  const activeSeatId = activePassenger?.seatId ?? null
  const takenSeatIds = new Set(
    passengers
      .filter((p) => p.seatId && p.id !== selectedPassengerId)
      .map((p) => p.seatId),
  )

  function notify(message, tone = 'info') {
    setFeedback({ id: Date.now(), message, tone })
  }

  function handleLayoutChange(nextLayoutId) {
    if (nextLayoutId === layoutId) return
    setLayoutId(nextLayoutId)
    setPassengers((prev) => clearAllSeats(prev))
    notify('Layout switched — seat selections were cleared. Meal choices were kept.', 'info')
  }

  function handleAddPassenger() {
    const result = addPassenger(passengers, nextPassengerIndex)
    if (!result.ok) {
      notify(`Maximum of ${MAX_PASSENGERS} passengers allowed.`, 'info')
      return
    }
    setPassengers(result.passengers)
    setSelectedPassengerId(result.selectedPassengerId)
    setNextPassengerIndex(result.nextIndex)
    notify(`${result.passenger.name} added. Select a seat on the map.`, 'success')
  }

  function handleRemovePassenger() {
    const result = removeLastPassenger(passengers, selectedPassengerId)
    if (!result.ok) {
      notify(`At least ${MIN_PASSENGERS} passenger is required.`, 'info')
      return
    }
    setPassengers(result.passengers)
    setSelectedPassengerId(result.selectedPassengerId)
    notify(
      `${result.removed.name} removed${result.removed.seatId ? ` (seat ${result.removed.seatId} released)` : ''}.`,
      'info',
    )
  }

  function handleSelectPassenger(passengerId) {
    setSelectedPassengerId(passengerId)
  }

  function handleClearSeat(passengerId) {
    const passenger = passengers.find((p) => p.id === passengerId)
    if (!passenger?.seatId) return

    const clearedSeat = passenger.seatId
    setPassengers((prev) => clearPassengerSeat(prev, passengerId))
    notify(`Removed seat ${clearedSeat} from ${passenger.name}.`, 'success')
  }

  function handleChangeSeat(passengerId) {
    setSelectedPassengerId(passengerId)
    const passenger = passengers.find((p) => p.id === passengerId)
    notify(
      passenger?.seatId
        ? `${passenger.name}: tap a new seat to replace ${passenger.seatId}.`
        : `${passenger?.name ?? 'Passenger'}: tap an available seat on the map.`,
      'info',
    )
  }

  function handleSeatSelect(seat) {
    const decision = evaluateSeatSelection(passengers, selectedPassengerId, seat)
    if (!decision.ok) {
      notify(decision.message, decision.code === 'OCCUPIED' || decision.code === 'TAKEN' ? 'error' : 'info')
      return
    }

    const active = passengers.find((p) => p.id === decision.passengerId)
    setPassengers((prev) => applySeatSelection(prev, decision))

    if (decision.action === 'clear') {
      notify(`Removed seat ${decision.seatId} from ${active.name}.`, 'success')
      return
    }

    notify(
      decision.previousSeatId
        ? `${active.name} moved from ${decision.previousSeatId} to ${decision.seatId}.`
        : `${active.name} assigned to seat ${decision.seatId}.`,
      'success',
    )
  }

  function handleMealChange(passengerId, mealId) {
    setPassengers((prev) => setPassengerMeal(prev, passengerId, mealId))
  }

  return (
    <div className="min-h-svh font-sans text-navy-950">
      <a href="#main-content" className="skip-link">
        Skip to seat selection
      </a>

      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-[90rem] px-3 py-3 outline-none sm:px-5 sm:py-5 lg:px-6 lg:py-6 xl:px-8 xl:py-7"
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {feedback?.message ?? ''}
        </div>

        {feedback && (
          <div
            key={feedback.id}
            role="status"
            className={`feedback-banner mb-3 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm shadow-sm sm:mb-4 ${
              feedback.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : feedback.tone === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-900'
                  : 'border-sky-200 bg-sky-50 text-navy-900'
            }`}
          >
            {feedback.tone === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <p className="min-w-0 flex-1 font-medium">{feedback.message}</p>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setFeedback(null)}
              className="focus-ring rounded-md p-1 opacity-60 transition hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-[minmax(260px,300px)_minmax(0,1fr)_minmax(280px,320px)] xl:items-start xl:gap-5">
          <aside className="order-1 flex min-w-0 flex-col gap-3 sm:gap-4">
            <FlightDetails
              flight={FLIGHT_INFO}
              layoutId={layoutId}
              layouts={layouts}
              onLayoutChange={handleLayoutChange}
            />
            <PassengerList
              passengers={passengers}
              seats={aircraft.seats}
              selectedPassengerId={selectedPassengerId}
              onSelectPassenger={handleSelectPassenger}
              onAddPassenger={handleAddPassenger}
              onRemovePassenger={handleRemovePassenger}
              onClearSeat={handleClearSeat}
              onChangeSeat={handleChangeSeat}
              maxPassengers={MAX_PASSENGERS}
            />
          </aside>

          <div className="order-2 min-w-0 md:order-3 md:col-span-2 xl:order-2 xl:col-span-1">
            <AircraftIllustration
              aircraft={aircraft}
              activeSeatId={activeSeatId}
              takenSeatIds={takenSeatIds}
              onSeatSelect={handleSeatSelect}
              activePassengerName={activePassenger?.name}
            />
          </div>

          <aside className="order-3 flex min-w-0 flex-col gap-3 sm:gap-4 md:order-2 xl:order-3">
            <BookingSummary passengers={passengers} seats={aircraft.seats} />
            <MealSelector
              meals={MEALS}
              passengers={passengers}
              selectedPassengerId={selectedPassengerId}
              onMealChange={handleMealChange}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
