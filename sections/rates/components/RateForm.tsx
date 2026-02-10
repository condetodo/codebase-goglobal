import { useState, FormEvent } from 'react'
import type {
  RateFormProps,
  Rate,
  Phase,
  Currency,
  CalculationType,
  MinuteRanges,
} from '../types'

const phases: Phase[] = [
  'Preflight',
  'Adaptador',
  'Editor',
  'Editor de sonido',
  'Adaptador PTBR',
  'Editores PTBR',
]

const currencies: Currency[] = ['ARS', 'USD', 'BRL']

const calculationTypes: CalculationType[] = ['x minuto', 'flat', 'por hora']

const rangeLabels: Record<keyof MinuteRanges, string> = {
  lessThan30: 'Menos de 30 minutos',
  '30_1_to_59_9': 'de 30.1 a 59.9 minutos',
  '60_to_89_9': 'de 60 a 89.9 minutos',
  '90_to_119_9': 'de 90 a 119.9 minutos',
  moreThan120: 'más de 120 minutos',
}

export function RateForm({ rate, onSubmit, onCancel }: RateFormProps) {
  const isEditing = !!rate

  const [formData, setFormData] = useState<Omit<Rate, 'id'>>({
    phase: rate?.phase || 'Preflight',
    currency: rate?.currency || 'ARS',
    calculationType: rate?.calculationType || 'x minuto',
    minuteRanges: rate?.minuteRanges || {
      lessThan30: { withoutBonus: 0, withBonus: 0 },
      '30_1_to_59_9': { withoutBonus: 0, withBonus: 0 },
      '60_to_89_9': { withoutBonus: 0, withBonus: 0 },
      '90_to_119_9': { withoutBonus: 0, withBonus: 0 },
      moreThan120: { withoutBonus: 0, withBonus: 0 },
    },
  })

  const handleChange = (
    rangeKey: keyof MinuteRanges,
    bonusType: 'withoutBonus' | 'withBonus',
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      minuteRanges: {
        ...prev.minuteRanges,
        [rangeKey]: {
          ...prev.minuteRanges[rangeKey],
          [bonusType]: value,
        },
      },
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          {isEditing ? 'Editar Tarifa' : 'Nueva Tarifa'}
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          {isEditing
            ? 'Modifica la información de la tarifa'
            : 'Completa la información para crear una nueva tarifa'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Información General
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Fase/Rol
              </label>
              <select
                value={formData.phase}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phase: e.target.value as Phase }))
                }
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              >
                {phases.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Moneda
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.target.value as Currency }))
                }
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Tipo de Cálculo
              </label>
              <select
                value={formData.calculationType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    calculationType: e.target.value as CalculationType,
                  }))
                }
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              >
                {calculationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Minute Ranges */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Franjas de Minutos
          </h2>
          <div className="space-y-4">
            {(
              [
                'lessThan30',
                '30_1_to_59_9',
                '60_to_89_9',
                '90_to_119_9',
                'moreThan120',
              ] as Array<keyof MinuteRanges>
            ).map((rangeKey) => (
              <div
                key={rangeKey}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-lg"
              >
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {rangeLabels[rangeKey]}
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Sin Bono
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minuteRanges[rangeKey].withoutBonus}
                    onChange={(e) =>
                      handleChange(rangeKey, 'withoutBonus', parseFloat(e.target.value) || 0)
                    }
                    className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Con Bono
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minuteRanges[rangeKey].withBonus}
                    onChange={(e) =>
                      handleChange(rangeKey, 'withBonus', parseFloat(e.target.value) || 0)
                    }
                    className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-stone-700 dark:text-stone-300 font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Tarifa'}
          </button>
        </div>
      </form>
    </div>
  )
}


