import { ArrowRight, CalendarDays, Clock3, Plane } from 'lucide-react'

export default function FlightDetails({ flight, layoutId, onLayoutChange, layouts }) {
  return (
    <section className="card-surface overflow-hidden rounded-2xl" aria-labelledby="flight-details-heading">
      <div className="flex items-center justify-between gap-2 border-b border-navy-900/6 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-royal-600/10 text-royal-600">
            <Plane className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="flight-details-heading" className="text-sm font-bold text-navy-900">
              Outbound flight
            </h2>
            <p className="text-[11px] font-medium text-navy-800/55">{flight.flightNumber}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-navy-950/4 px-2 py-1 text-[11px] font-semibold text-navy-800/70">
          {flight.aircraft}
        </span>
      </div>

      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-royal-700 px-3 py-4 text-white sm:px-4 sm:py-5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0 text-left">
            <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">{flight.origin.code}</p>
            <p className="mt-0.5 truncate text-[11px] text-white/65 sm:text-xs">
              {flight.origin.city}
            </p>
            <p className="mt-1.5 text-base font-semibold tabular-nums sm:mt-2 sm:text-lg">
              {flight.departure}
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center px-1 sm:px-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
              {flight.duration}
            </p>
            <div className="flex w-full max-w-28 items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              <span className="h-px flex-1 bg-gradient-to-r from-white/70 to-white/25" />
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/80" aria-hidden="true" />
              <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-white/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            </div>
            <p className="mt-1.5 text-[10px] font-medium text-white/50">Non-stop</p>
          </div>

          <div className="min-w-0 text-right">
            <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {flight.destination.code}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-white/65 sm:text-xs">
              {flight.destination.city}
            </p>
            <p className="mt-1.5 text-base font-semibold tabular-nums sm:mt-2 sm:text-lg">
              {flight.arrival}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-xs text-white/70 sm:mt-4">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {flight.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {flight.departure} – {flight.arrival}
          </span>
        </div>
      </div>

      <div className="space-y-2 px-3 py-3 sm:px-4 sm:py-3.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-800/50">
          Aircraft layout
        </p>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Seating configuration">
          {layouts.map((layout) => {
            const isActive = layout.id === layoutId
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => onLayoutChange(layout.id)}
                aria-pressed={isActive}
                className={`focus-ring ui-transition rounded-xl border px-3 py-2.5 text-left transition duration-150 ${
                  isActive
                    ? 'border-royal-600 bg-royal-600/8 text-navy-900 shadow-sm'
                    : 'border-navy-900/10 bg-white text-navy-800/70 hover:border-navy-900/20 hover:bg-navy-950/2'
                }`}
              >
                <span className="block text-sm font-bold">{layout.name.split(' ')[0]}</span>
                <span className="mt-0.5 block text-[11px] font-medium opacity-70">
                  {isActive ? 'Active map' : 'Switch map'}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-[11px] leading-snug text-navy-800/50">
          Switching layouts clears seat selections. Meal choices are kept.
        </p>
      </div>
    </section>
  )
}
