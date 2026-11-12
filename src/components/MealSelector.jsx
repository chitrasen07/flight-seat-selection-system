import { Check, UtensilsCrossed } from 'lucide-react'
import { formatINR, formatSeatPrice, getMealById } from '../utils/pricing'

export default function MealSelector({
  meals,
  passengers,
  selectedPassengerId,
  onMealChange,
}) {
  const selectedPassenger = passengers.find((p) => p.id === selectedPassengerId)

  if (!selectedPassenger) {
    return null
  }

  const currentMeal = getMealById(selectedPassenger.mealId)
  const groupName = `meal-${selectedPassenger.id}`

  return (
    <section className="card-surface rounded-2xl p-3 sm:p-4" aria-labelledby="meals-heading">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal-600/10 text-royal-600">
          <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="meals-heading" className="text-sm font-bold text-navy-900">
            In-flight meals
          </h2>
          <p className="mt-0.5 text-xs text-navy-800/55">
            Choosing for{' '}
            <span className="font-semibold text-navy-900">{selectedPassenger.name}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-navy-900/8 bg-navy-950/[0.03] px-3 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-800/45">
          Current choice
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-bold text-navy-900">{currentMeal?.name}</p>
          <p
            className={`shrink-0 text-xs font-extrabold tabular-nums ${
              (currentMeal?.price ?? 0) === 0 ? 'text-emerald-700' : 'text-navy-900'
            }`}
          >
            {formatSeatPrice(currentMeal?.price ?? 0)}
          </p>
        </div>
      </div>

      <fieldset className="mt-3 space-y-2">
        <legend className="sr-only">
          Select a meal for {selectedPassenger.name}
        </legend>

        {meals.map((meal) => {
          const isChecked = selectedPassenger.mealId === meal.id
          const isFree = meal.price === 0
          const inputId = `${groupName}-${meal.id}`

          return (
            <label
              key={meal.id}
              htmlFor={inputId}
              className={`group relative flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition duration-150 focus-within:ring-2 focus-within:ring-royal-600/25 ${
                isChecked
                  ? 'border-royal-600 bg-gradient-to-r from-royal-600/10 to-transparent shadow-sm'
                  : 'border-navy-900/8 bg-white hover:border-navy-900/16 hover:bg-navy-950/[0.02]'
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={groupName}
                value={meal.id}
                checked={isChecked}
                onChange={() => onMealChange(selectedPassenger.id, meal.id)}
                className="sr-only"
              />

              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  isChecked
                    ? 'border-royal-600 bg-royal-600 text-white'
                    : 'border-navy-900/20 bg-white text-transparent group-hover:border-navy-900/35'
                }`}
                aria-hidden="true"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-navy-900">{meal.name}</span>
                      {isChecked && (
                        <span className="rounded-md bg-royal-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Selected
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-navy-800/55">
                      {meal.description}
                    </span>
                  </span>

                  <span
                    className={`shrink-0 rounded-lg px-2 py-1 text-xs font-extrabold tabular-nums ${
                      isFree
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-navy-950/5 text-navy-900'
                    }`}
                  >
                    {isFree ? 'Free' : formatINR(meal.price)}
                  </span>
                </span>
              </span>
            </label>
          )
        })}
      </fieldset>
    </section>
  )
}
