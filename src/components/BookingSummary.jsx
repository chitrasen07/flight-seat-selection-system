import { Armchair, Receipt, Users, UtensilsCrossed } from 'lucide-react'
import { buildBookingSummary, formatINR, formatSeatPrice } from '../utils/pricing'

export default function BookingSummary({ passengers, seats }) {
  const summary = buildBookingSummary(passengers, seats)
  const {
    lines,
    passengerCount,
    assignedSeatCount,
    seatSubtotal,
    mealSubtotal,
    grandTotal,
  } = summary

  const hasCharges = assignedSeatCount > 0 || mealSubtotal > 0
  const isEmpty = !hasCharges

  return (
    <section className="card-surface overflow-hidden rounded-2xl" aria-labelledby="booking-summary-heading">
      <div className="flex items-center gap-2 border-b border-navy-900/6 px-3 py-3 sm:px-4 sm:py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
          <Receipt className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="booking-summary-heading" className="text-sm font-bold text-navy-900">
            Booking summary
          </h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-navy-800/55">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" aria-hidden="true" />
              {passengerCount} passenger{passengerCount === 1 ? '' : 's'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {assignedSeatCount}/{passengerCount} seats assigned
            </span>
          </p>
        </div>
      </div>

      <div className="px-3 py-3 sm:px-4">
        {isEmpty ? (
          <p className="rounded-xl bg-navy-950/3 px-3 py-5 text-center text-sm text-navy-800/50">
            Assign seats or choose a meal to see your price breakdown.
          </p>
        ) : (
          <ul className="max-h-64 space-y-2.5 overflow-y-auto overscroll-contain sm:max-h-80">
            {lines.map((line) => (
              <li
                key={line.id}
                className="rounded-xl border border-navy-900/6 bg-navy-950/[0.02] px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-bold text-navy-900">{line.name}</p>
                  <p className="shrink-0 text-sm font-extrabold tabular-nums text-navy-900">
                    {formatINR(line.subtotal)}
                  </p>
                </div>

                <div className="mt-2 space-y-1.5 text-xs text-navy-800/60">
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex min-w-0 items-start gap-1.5">
                      <Armchair className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">
                        {line.seatId ? (
                          <>
                            <span className="font-semibold text-navy-800">Seat {line.seatId}</span>
                            {line.seatCategory && (
                              <span className="mt-0.5 block text-[11px] text-navy-800/50">
                                {line.seatCategory}
                              </span>
                            )}
                          </>
                        ) : (
                          <span>No seat selected</span>
                        )}
                      </span>
                    </p>
                    <span
                      className={`shrink-0 font-bold tabular-nums ${
                        line.seatId && line.seatPrice === 0
                          ? 'text-emerald-700'
                          : 'text-navy-900'
                      }`}
                    >
                      {line.seatId ? formatSeatPrice(line.seatPrice) : formatINR(0)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1.5">
                      <UtensilsCrossed className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{line.mealName}</span>
                    </p>
                    <span
                      className={`shrink-0 font-bold tabular-nums ${
                        line.mealPrice === 0 ? 'text-emerald-700' : 'text-navy-900'
                      }`}
                    >
                      {line.mealPrice === 0 ? 'Free' : formatINR(line.mealPrice)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2 border-t border-navy-900/6 bg-gradient-to-br from-navy-900 to-navy-800 px-3 py-3.5 text-white sm:px-4 sm:py-4">
        <div className="flex items-center justify-between text-xs text-white/65">
          <span>Seat subtotal</span>
          <span
            key={`seat-${seatSubtotal}`}
            className="total-flash font-semibold tabular-nums text-white/90"
          >
            {formatINR(seatSubtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/65">
          <span>Meal subtotal</span>
          <span
            key={`meal-${mealSubtotal}`}
            className="total-flash font-semibold tabular-nums text-white/90"
          >
            {formatINR(mealSubtotal)}
          </span>
        </div>
        <div className="flex items-end justify-between border-t border-white/10 pt-2.5">
          <span className="text-sm font-semibold text-white/80">Grand total</span>
          <span
            key={`grand-${grandTotal}`}
            className="total-flash text-2xl font-extrabold tracking-tight tabular-nums"
            aria-live="polite"
          >
            {formatINR(grandTotal)}
          </span>
        </div>
      </div>
    </section>
  )
}
