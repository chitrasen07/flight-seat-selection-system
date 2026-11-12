/** Seat category pricing (INR) + top-down seat palette */
export const SEAT_CATEGORIES = {
  free: {
    id: 'free',
    label: 'Standard · Free',
    price: 0,
    cushion: '#f8fafc',
    backrest: '#e2e8f0',
    armrest: '#64748b',
    text: '#0f172a',
  },
  standard: {
    id: 'standard',
    label: 'Standard',
    price: 0,
    cushion: '#22c55e',
    backrest: '#16a34a',
    armrest: '#14532d',
    text: '#ffffff',
  },
  premium: {
    id: 'premium',
    label: 'Premium',
    price: 250,
    cushion: '#38bdf8',
    backrest: '#0ea5e9',
    armrest: '#0369a1',
    text: '#ffffff',
  },
  extraLegroom: {
    id: 'extraLegroom',
    label: 'Extra Legroom',
    price: 350,
    cushion: '#f43f5e',
    backrest: '#e11d48',
    armrest: '#9f1239',
    text: '#ffffff',
  },
}

/**
 * Aircraft seating layouts (assessment source of truth)
 * - layout-3-2: A B C | D E
 * - layout-2-3-2: A B | D E F | G H  (C skipped)
 */
export const AIRCRAFT_LAYOUTS = {
  'layout-3-2': {
    id: 'layout-3-2',
    name: '3–2 Configuration',
    groups: [
      ['A', 'B', 'C'],
      ['D', 'E'],
    ],
    rowCount: 12,
  },
  'layout-2-3-2': {
    id: 'layout-2-3-2',
    name: '2–3–2 Configuration',
    groups: [
      ['A', 'B'],
      ['D', 'E', 'F'],
      ['G', 'H'],
    ],
    rowCount: 10,
  },
}

export function getSeatColumns(layout) {
  return layout.groups.flat()
}

/**
 * Builds seat map data for a given layout.
 * Some seats are occupied; prices vary by category.
 */
function buildSeats(layoutId) {
  const layout = AIRCRAFT_LAYOUTS[layoutId]
  const seatColumns = getSeatColumns(layout)
  const seats = {}

  for (let row = 1; row <= layout.rowCount; row++) {
    for (const col of seatColumns) {
      const id = `${row}${col}`
      let category = 'standard'
      let occupied = false

      // Front rows: mix of free / premium / extra legroom
      if (row === 1) {
        if (col === 'C') category = 'extraLegroom'
        else if (col === 'E' || col === 'F') category = 'premium'
        else category = 'free'
      } else if (row === 2 && (col === 'A' || col === 'G')) {
        category = 'extraLegroom'
      } else if (row <= 3) {
        category = col === 'A' || col === 'E' ? 'premium' : 'free'
      } else if (row === 6 || row === 7) {
        category = 'extraLegroom'
      } else {
        category = 'standard'
      }

      // Sample occupied seats
      if (
        (row === 2 && col === 'B') ||
        (row === 3 && col === 'D') ||
        (row === 5 && col === 'A') ||
        (row === 8 && (col === 'C' || col === 'E'))
      ) {
        occupied = true
      }

      seats[id] = {
        id,
        row,
        column: col,
        category,
        price: SEAT_CATEGORIES[category].price,
        occupied,
      }
    }
  }

  return seats
}

export const AIRCRAFT_DATA = {
  'layout-3-2': {
    ...AIRCRAFT_LAYOUTS['layout-3-2'],
    seats: buildSeats('layout-3-2'),
  },
  'layout-2-3-2': {
    ...AIRCRAFT_LAYOUTS['layout-2-3-2'],
    seats: buildSeats('layout-2-3-2'),
  },
}

export const DEFAULT_LAYOUT_ID = 'layout-3-2'

export const FLIGHT_INFO = {
  origin: { code: 'DEL', city: 'New Delhi' },
  destination: { code: 'BOM', city: 'Mumbai' },
  flightNumber: 'SW 802',
  date: '12 Nov 2026',
  departure: '06:15',
  arrival: '08:25',
  duration: '2h 10m',
  aircraft: 'Airbus A320',
  airline: 'Skyward Air',
}
