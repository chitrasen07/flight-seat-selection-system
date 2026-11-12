import { Info, UserRound } from 'lucide-react'
import SeatMap from './SeatMap'
import { SEAT_CATEGORIES } from '../data/aircraft'
import { formatSeatPrice } from '../utils/pricing'

const LEGEND_ITEMS = [
  SEAT_CATEGORIES.premium,
  SEAT_CATEGORIES.free,
  SEAT_CATEGORIES.extraLegroom,
  SEAT_CATEGORIES.standard,
]

/** Decorative wings + engines; scales with stage, never intercepts clicks */
function WingsSvg() {
  return (
    <svg
      viewBox="0 0 1000 320"
      className="pointer-events-none h-auto w-full select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wingFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="45%" stopColor="#e8eef5" />
          <stop offset="100%" stopColor="#c5d0de" />
        </linearGradient>
        <linearGradient id="engineFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c5d0de" />
        </linearGradient>
        <filter id="wingDrop" x="-8%" y="-20%" width="116%" height="150%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0b1b33" floodOpacity="0.16" />
        </filter>
      </defs>

      <g filter="url(#wingDrop)">
        <path
          d="M320 40 C230 50 120 78 40 118 C12 132 8 155 24 178 C48 218 140 248 240 262 C285 270 310 276 320 290 Z"
          fill="url(#wingFill)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <path
          d="M680 40 C770 50 880 78 960 118 C988 132 992 155 976 178 C952 218 860 248 760 262 C715 270 690 276 680 290 Z"
          fill="url(#wingFill)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <path
          d="M90 150 L62 182 M150 168 L128 196 M210 182 L192 208"
          fill="none"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M910 150 L938 182 M850 168 L872 196 M790 182 L808 208"
          fill="none"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
      </g>

      <g filter="url(#wingDrop)">
        <ellipse cx="250" cy="195" rx="44" ry="60" fill="url(#engineFill)" stroke="#94a3b8" strokeWidth="1.5" />
        <ellipse cx="250" cy="195" rx="28" ry="40" fill="#f8fafc" stroke="#cbd5e1" />
        <circle cx="250" cy="195" r="18" fill="#fff" stroke="#22c55e" strokeWidth="4" />
        <path d="M250 183v24M238 195h24" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />

        <ellipse cx="750" cy="195" rx="44" ry="60" fill="url(#engineFill)" stroke="#94a3b8" strokeWidth="1.5" />
        <ellipse cx="750" cy="195" rx="28" ry="40" fill="#f8fafc" stroke="#cbd5e1" />
        <circle cx="750" cy="195" r="18" fill="#fff" stroke="#22c55e" strokeWidth="4" />
        <path d="M750 183v24M738 195h24" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function FuselageShell({ children, wide }) {
  return (
    <div className="relative z-10 mx-auto flex w-fit max-w-none flex-col items-center">
      {/* Nose */}
      <div
        className={`relative ${wide ? 'h-14 w-[18rem]' : 'h-14 w-[14.5rem]'} rounded-t-[100%] border border-b-0 border-slate-300/80 bg-gradient-to-b from-white to-slate-100 shadow-sm`}
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-5 h-5 w-[52%] -translate-x-1/2 rounded-[40%] bg-navy-950/85" />
        <div className="absolute left-1/2 top-6 h-px w-[40%] -translate-x-1/2 bg-sky-300/50" />
      </div>

      {/* Cabin body — width driven by seat map content */}
      <div
        className={`relative border border-slate-300/70 bg-gradient-to-b from-white via-slate-50 to-white shadow-[0_10px_30px_rgb(11_27_51_/_0.14)] ${
          wide ? 'rounded-[2rem] px-3 py-4 sm:px-4' : 'rounded-[1.75rem] px-2.5 py-3.5 sm:px-3.5'
        }`}
      >
        <div
          className="pointer-events-none absolute inset-y-8 left-0 w-2.5 rounded-r-full bg-gradient-to-b from-emerald-300/45 via-emerald-500/40 to-emerald-300/45"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-8 right-0 w-2.5 rounded-l-full bg-gradient-to-b from-emerald-300/45 via-emerald-500/40 to-emerald-300/45"
          aria-hidden="true"
        />

        <div className="relative rounded-2xl bg-gradient-to-b from-[#234066] to-[#152a45] px-2 py-3 sm:px-2.5 sm:py-3.5">
          {children}
        </div>
      </div>

      {/* Tail */}
      <div className="relative flex flex-col items-center" aria-hidden="true">
        <div
          className={`${wide ? 'h-8 w-[16rem]' : 'h-8 w-[13rem]'} rounded-b-3xl border border-t-0 border-slate-300/70 bg-gradient-to-t from-slate-200 to-white shadow-sm`}
        />
        <div className="absolute top-1 flex w-[150%] max-w-[22rem] items-center justify-between px-1">
          <div className="h-5 flex-1 rounded-bl-[100%] bg-gradient-to-r from-slate-200/90 to-transparent" />
          <div className="mx-2 h-7 w-4 rounded-sm bg-slate-200" />
          <div className="h-5 flex-1 rounded-br-[100%] bg-gradient-to-l from-slate-200/90 to-transparent" />
        </div>
      </div>
    </div>
  )
}

export default function AircraftIllustration({
  aircraft,
  activeSeatId,
  takenSeatIds,
  onSeatSelect,
  activePassengerName,
}) {
  const wide = aircraft.groups.length > 2

  return (
    <section
      className="relative flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-b from-sky-200/85 via-sky-100/75 to-slate-100/90 shadow-[var(--shadow-panel)] sm:min-h-[32rem] sm:rounded-3xl xl:min-h-[36rem]"
      aria-labelledby="aircraft-cabin-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 18% 8%, rgba(255,255,255,0.9), transparent 42%), radial-gradient(ellipse at 82% 28%, rgba(125,211,252,0.35), transparent 48%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-20 flex flex-col gap-3 px-3 pt-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3 sm:px-5 sm:pt-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-800/45 sm:text-xs">
            Aircraft cabin
          </p>
          <h2
            id="aircraft-cabin-heading"
            className="mt-1 text-lg font-extrabold tracking-tight text-navy-900 sm:text-xl"
          >
            {aircraft.name}
          </h2>
          <p className="mt-1 max-w-md text-xs text-navy-800/55">
            Tap an available seat to assign it to the active passenger.
          </p>
          {activePassengerName && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-navy-900/90 px-2.5 py-1 text-[11px] font-semibold text-white">
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              Selecting for {activePassengerName}
            </p>
          )}
        </div>

        <aside
          className="card-surface w-full rounded-2xl p-3 sm:w-auto sm:min-w-[11.5rem] sm:shrink-0"
          aria-label="Seat category legend"
        >
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-navy-800/50">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Seat legend
          </p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-1">
            {LEGEND_ITEMS.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-xs text-navy-900">
                <span
                  className="inline-block h-5 w-5 shrink-0 rounded-md border border-black/10 shadow-sm"
                  style={{ backgroundColor: item.cushion }}
                  aria-hidden="true"
                />
                <span className="leading-snug">
                  <span className="font-semibold">
                    {item.id === 'free' ? 'Standard' : item.label}
                  </span>
                  <span className="text-navy-800/50"> · {formatSeatPrice(item.price)}</span>
                </span>
              </li>
            ))}
            <li className="flex items-center gap-2 text-xs text-navy-900">
              <span
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-400 text-[10px] font-bold text-slate-700"
                aria-hidden="true"
              >
                ✕
              </span>
              <span className="font-semibold">Unavailable</span>
            </li>
            <li className="flex items-center gap-2 text-xs text-navy-900">
              <span
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-200 text-[10px] font-bold text-indigo-900"
                aria-hidden="true"
              >
                •
              </span>
              <span className="font-semibold">Taken by party</span>
            </li>
          </ul>
        </aside>
      </div>

      <div className="aircraft-scroll relative z-10 flex-1 px-2 pb-5 pt-2 sm:px-4 sm:pb-8">
        <div
          className={`relative mx-auto w-max ${wide ? 'min-w-[22rem]' : 'min-w-[18rem]'}`}
        >
          {/* Wings sit behind the cabin; cabin width follows seat content */}
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] z-0 w-[min(150%,44rem)] -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <WingsSvg />
          </div>

          <FuselageShell wide={wide}>
            <SeatMap
              aircraft={aircraft}
              activeSeatId={activeSeatId}
              takenSeatIds={takenSeatIds}
              onSeatSelect={onSeatSelect}
            />
          </FuselageShell>
        </div>
      </div>
    </section>
  )
}
