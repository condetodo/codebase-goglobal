import type { RateDetailProps, MinuteRanges } from '../types'

const rangeLabels: Record<keyof MinuteRanges, string> = {
  lessThan30: 'Menos de 30 minutos',
  '30_1_to_59_9': 'de 30.1 a 59.9 minutos',
  '60_to_89_9': 'de 60 a 89.9 minutos',
  '90_to_119_9': 'de 90 a 119.9 minutos',
  moreThan120: 'más de 120 minutos',
}

const currencyLabels: Record<string, string> = {
  ARS: 'ARS',
  USD: 'USD',
  BRL: 'BRL',
}

const calculationTypeLabels: Record<string, string> = {
  'x minuto': 'Por minuto',
  flat: 'Tarifa fija',
  'por hora': 'Por hora',
}

export function RateDetail({ rate, onEdit, onDelete }: RateDetailProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              {rate.phase}
            </h1>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              Detalle de tarifa
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de eliminar esta tarifa?')) {
                    onDelete()
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-red-700 text-white font-medium rounded-lg hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* General Information */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Información General
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Fase/Rol</dt>
            <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">{rate.phase}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Moneda</dt>
            <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
              {currencyLabels[rate.currency]}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Tipo de Cálculo
            </dt>
            <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
              {calculationTypeLabels[rate.calculationType]}
            </dd>
          </div>
        </dl>
      </div>

      {/* Minute Ranges */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Franjas de Minutos
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
            <thead className="bg-stone-50 dark:bg-stone-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Franja
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Sin Bono
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Con Bono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-stone-800 divide-y divide-stone-200 dark:divide-stone-700">
              {(
                [
                  'lessThan30',
                  '30_1_to_59_9',
                  '60_to_89_9',
                  '90_to_119_9',
                  'moreThan120',
                ] as Array<keyof MinuteRanges>
              ).map((rangeKey) => (
                <tr key={rangeKey}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-stone-900 dark:text-stone-100">
                      {rangeLabels[rangeKey]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {rate.minuteRanges[rangeKey].withoutBonus}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {rate.minuteRanges[rangeKey].withBonus}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


