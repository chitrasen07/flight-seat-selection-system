import { SEAT_CATEGORIES } from '../data/aircraft'
import { formatINR, formatSeatPrice } from '../utils/pricing'

const OCCUPIED = {
  cushion: '#94a3b8',
  backrest: '#64748b',
  armrest: '#475569',
  text: '#334155',
}

const SELECTED = {
  cushion: '#102a4c',
  backrest: '#0b1b33',
  armrest: '#2563eb',
  text: '#ffffff',
}

const TAKEN = {
  cushion: '#c7d2fe',
  backrest: '#818cf8',
  armrest: '#4338ca',
  text: '#312e81',
}

export default function Seat({ seat, isSelected, isTaken, onSelect }) {
  if (!seat) {
    return <div className="h-10 w-9 sm:h-9 sm:w-8" aria-hidden="true" />
  }

  const category = SEAT_CATEGORIES[seat.category] ?? SEAT_CATEGORIES.standard
  const isOccupied = seat.occupied
  const isDisabled = isOccupied || isTaken
  const palette = isOccupied
    ? OCCUPIED
    : isSelected
      ? SELECTED
      : isTaken
        ? TAKEN
        : category
  const priceLabel = formatSeatPrice(seat.price)
  const priceText = isOccupied ? '✕' : isTaken ? '•' : formatINR(seat.price)

  const statusText = isOccupied
    ? 'occupied, unavailable'
    : isTaken
      ? 'taken by another passenger'
      : isSelected
        ? 'selected'
        : 'available'

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      onClick={() => {
        if (isDisabled) return
        onSelect?.(seat)
      }}
      title={
        isOccupied
          ? `${seat.id} · Unavailable`
          : isTaken
            ? `${seat.id} · Assigned to another passenger`
            : `${seat.id} · ${category.label} · ${priceLabel}`
      }
      aria-label={`Seat ${seat.id}, ${category.label}, ${priceLabel}, ${statusText}`}
      className={`seat-interactive focus-ring relative h-10 w-9 shrink-0 transition duration-150 sm:h-9 sm:w-8 ${
        isDisabled
          ? 'cursor-not-allowed opacity-90'
          : 'cursor-pointer hover:-translate-y-0.5 hover:drop-shadow-md active:translate-y-0'
      } ${isSelected ? 'z-10 scale-[1.05] rounded-md drop-shadow-md ring-2 ring-royal-500/50' : ''}`}
    >
      <svg viewBox="0 0 40 48" className="h-full w-full" aria-hidden="true">
        <rect x="2" y="14" width="4" height="26" rx="2" fill={palette.armrest} />
        <rect x="34" y="14" width="4" height="26" rx="2" fill={palette.armrest} />
        <rect x="7" y="2" width="26" height="12" rx="4" fill={palette.backrest} />
        <rect
          x="7"
          y="14"
          width="26"
          height="28"
          rx="5"
          fill={palette.cushion}
          stroke={isSelected ? '#2563eb' : 'rgba(15,23,42,0.12)'}
          strokeWidth="1.2"
        />
        {isOccupied && (
          <path
            d="M14 22 L26 34 M26 22 L14 34"
            stroke={palette.text}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
        )}
      </svg>

      <span
        className="pointer-events-none absolute inset-x-0 top-[36%] flex flex-col items-center leading-none"
        style={{ color: palette.text }}
      >
        <span className="text-[9px] font-extrabold tracking-tight drop-shadow-[0_0.5px_0_rgba(255,255,255,0.35)]">
          {seat.id}
        </span>
        <span className="mt-0.5 text-[8px] font-bold tabular-nums opacity-95">
          {priceText}
        </span>
      </span>
    </button>
  )
}
