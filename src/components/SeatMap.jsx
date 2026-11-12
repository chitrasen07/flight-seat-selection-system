import Seat from './Seat'

function SeatGroup({
  labels,
  seats,
  row,
  activeSeatId,
  takenSeatIds,
  onSeatSelect,
}) {
  return (
    <div className="flex items-center gap-1">
      {labels.map((col) => {
        const seatId = `${row}${col}`
        const seat = seats[seatId]
        return (
          <Seat
            key={seatId}
            seat={seat}
            isSelected={activeSeatId === seatId}
            isTaken={takenSeatIds.has(seatId)}
            onSelect={onSeatSelect}
          />
        )
      })}
    </div>
  )
}

function AisleGap({ rowNumber }) {
  return (
    <div className="flex w-6 shrink-0 items-center justify-center sm:w-7">
      {rowNumber != null && (
        <span className="text-[10px] font-bold tabular-nums text-sky-200/80 sm:text-[11px]">
          {rowNumber}
        </span>
      )}
    </div>
  )
}

export default function SeatMap({
  aircraft,
  activeSeatId,
  takenSeatIds,
  onSeatSelect,
}) {
  const { groups, rowCount, seats } = aircraft
  const rows = Array.from({ length: rowCount }, (_, i) => i + 1)
  const labeledAisleIndex = Math.max(1, Math.floor(groups.length / 2))

  return (
    <div
      className="mx-auto w-max"
      role="group"
      aria-label={`${aircraft.name} seat map`}
    >
      <div className="mb-1.5 flex items-center justify-center gap-1" aria-hidden="true">
        {groups.map((group, groupIndex) => (
          <div key={`header-wrap-${groupIndex}`} className="contents">
            {groupIndex > 0 && <AisleGap />}
            <div className="flex items-center gap-1">
              {group.map((col) => (
                <div
                  key={`header-${col}`}
                  className="flex h-5 w-9 items-center justify-center text-[10px] font-bold text-slate-300/85 sm:w-8"
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-1">
            {groups.map((group, groupIndex) => (
              <div key={`${row}-g-${groupIndex}`} className="contents">
                {groupIndex > 0 && (
                  <AisleGap rowNumber={groupIndex === labeledAisleIndex ? row : null} />
                )}
                <SeatGroup
                  labels={group}
                  seats={seats}
                  row={row}
                  activeSeatId={activeSeatId}
                  takenSeatIds={takenSeatIds}
                  onSeatSelect={onSeatSelect}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
