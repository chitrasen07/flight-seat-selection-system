import { Armchair, Plane } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3.5 lg:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white shadow-sm sm:h-11 sm:w-11 sm:rounded-2xl">
            <Plane className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-tight text-navy-900 sm:text-xl">
              Skyward Air
            </p>
            <p className="truncate text-[11px] font-medium text-navy-800/60 sm:text-xs">
              Seat selection · Outbound journey
            </p>
          </div>
        </div>

        <p
          className="inline-flex items-center gap-2 rounded-xl border border-navy-900/8 bg-navy-950/4 px-3 py-1.5 text-xs font-semibold text-navy-900"
          aria-current="step"
        >
          <Armchair className="h-3.5 w-3.5 text-royal-600" aria-hidden="true" />
          <span>Choose seats</span>
          <span className="hidden font-medium text-navy-800/45 sm:inline">· Current step</span>
        </p>
      </div>
    </header>
  )
}
