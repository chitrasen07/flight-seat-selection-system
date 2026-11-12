import { Armchair, Minus, Plus, RefreshCw, Trash2, UserRound } from 'lucide-react'
import { formatSeatPrice, getSeatCategory } from '../utils/pricing'

export default function PassengerList({
  passengers,
  seats,
  selectedPassengerId,
  onSelectPassenger,
  onAddPassenger,
  onRemovePassenger,
  onClearSeat,
  onChangeSeat,
  maxPassengers = 6,
}) {
  return (
    <section className="card-surface rounded-2xl p-3 sm:p-4" aria-labelledby="passengers-heading">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        <div className="min-w-0">
          <h2 id="passengers-heading" className="text-sm font-bold text-navy-900">
            Passengers
          </h2>
          <p className="mt-0.5 text-xs text-navy-800/55">
            Select a traveler, then choose a seat
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-navy-950/4 p-1">
          <button
            type="button"
            onClick={onRemovePassenger}
            disabled={passengers.length <= 1}
            aria-label="Remove passenger"
            className="focus-ring ui-transition inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-800/70 transition hover:bg-white hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:w-8"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            className="min-w-8 text-center text-sm font-bold tabular-nums text-navy-900"
            aria-live="polite"
          >
            {passengers.length}
          </span>
          <button
            type="button"
            onClick={onAddPassenger}
            disabled={passengers.length >= maxPassengers}
            aria-label="Add passenger"
            className="focus-ring ui-transition inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-800/70 transition hover:bg-white hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:w-8"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {passengers.length > 1 && (
        <div
          className="mb-3 flex gap-2 overflow-x-auto pb-1 sm:hidden"
          role="tablist"
          aria-label="Switch passenger"
        >
          {passengers.map((passenger, index) => {
            const isActive = passenger.id === selectedPassengerId
            return (
              <button
                key={`chip-${passenger.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectPassenger(passenger.id)}
                className={`focus-ring ui-transition shrink-0 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                  isActive
                    ? 'border-royal-600 bg-royal-600 text-white'
                    : 'border-navy-900/10 bg-white text-navy-800 hover:border-navy-900/20'
                }`}
              >
                P{index + 1}
                {passenger.seatId ? ` · ${passenger.seatId}` : ''}
              </button>
            )
          })}
        </div>
      )}

      <ul className="max-h-[min(28rem,55vh)] space-y-2.5 overflow-y-auto overscroll-contain pr-0.5">
        {passengers.map((passenger, index) => {
          const isActive = passenger.id === selectedPassengerId
          const seat = passenger.seatId ? seats[passenger.seatId] : null
          const category = getSeatCategory(seat)

          return (
            <li key={passenger.id}>
              <div
                className={`ui-transition rounded-xl border transition ${
                  isActive
                    ? 'border-royal-600 bg-gradient-to-r from-royal-600/10 to-transparent shadow-sm'
                    : 'border-navy-900/8 bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectPassenger(passenger.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className="focus-ring flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      isActive ? 'bg-navy-900 text-white' : 'bg-navy-950/5 text-navy-800/60'
                    }`}
                  >
                    {isActive ? (
                      <UserRound className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-bold text-navy-900">
                        {passenger.name}
                      </span>
                      {isActive && (
                        <span className="rounded-md bg-royal-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Active
                        </span>
                      )}
                    </span>

                    {seat && category ? (
                      <span className="mt-1.5 block space-y-1 text-xs">
                        <span className="flex items-center gap-1.5 font-semibold text-royal-600">
                          <Armchair className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          Seat {seat.id}
                        </span>
                        <span className="flex items-center gap-2 text-navy-800/60">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: category.cushion }}
                            aria-hidden="true"
                          />
                          {category.label}
                          <span className="font-bold text-navy-900">
                            {formatSeatPrice(seat.price)}
                          </span>
                        </span>
                      </span>
                    ) : (
                      <span className="mt-1.5 flex items-center gap-1.5 text-xs text-navy-800/55">
                        <Armchair className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        No seat assigned
                      </span>
                    )}
                  </span>
                </button>

                <div className="flex gap-2 border-t border-navy-900/6 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onChangeSeat(passenger.id)}
                    className="focus-ring ui-transition inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-navy-900/10 bg-white px-2 py-1.5 text-[11px] font-semibold text-navy-800 transition hover:border-royal-600/40 hover:bg-royal-600/5 hover:text-royal-700"
                  >
                    <RefreshCw className="h-3 w-3" aria-hidden="true" />
                    {seat ? 'Change seat' : 'Choose seat'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onClearSeat(passenger.id)}
                    disabled={!seat}
                    className="focus-ring ui-transition inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-navy-900/10 bg-white px-2 py-1.5 text-[11px] font-semibold text-navy-800 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                    Remove seat
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
