import { useState } from 'react'
import type {
  RatesTableProps,
  Rate,
  MinuteRanges,
} from '../types'
import { CellEditor } from './CellEditor'

const rangeLabels: Record<keyof MinuteRanges, string> = {
  lessThan30: '< 30 min',
  '30_1_to_59_9': '30.1-59.9 min',
  '60_to_89_9': '60-89.9 min',
  '90_to_119_9': '90-119.9 min',
  moreThan120: '> 120 min',
}

const currencyLabels: Record<string, string> = {
  ARS: 'ARS',
  USD: 'USD',
  BRL: 'BRL',
}

const calculationTypeLabels: Record<string, string> = {
  'x minuto': 'x minuto',
  flat: 'flat',
  'por hora': 'por hora',
}

type EditingCell = {
  rateId: string
  rangeKey: keyof MinuteRanges
  bonusType: 'withoutBonus' | 'withBonus'
} | null

export function RatesTable({
  rates,
  onCreate,
  onView,
  onEdit,
  onDelete,
  onCellEdit,
}: RatesTableProps) {
  const [editingCell, setEditingCell] = useState<EditingCell>(null)

  const handleCellDoubleClick = (
    rateId: string,
    rangeKey: keyof MinuteRanges,
    bonusType: 'withoutBonus' | 'withBonus'
  ) => {
    setEditingCell({ rateId, rangeKey, bonusType })
  }

  const handleCellSave = (value: number) => {
    if (editingCell) {
      onCellEdit?.(editingCell.rateId, editingCell.rangeKey, editingCell.bonusType, value)
      setEditingCell(null)
    }
  }

  const handleCellCancel = () => {
    setEditingCell(null)
  }

  const isEditing = (
    rateId: string,
    rangeKey: keyof MinuteRanges,
    bonusType: 'withoutBonus' | 'withBonus'
  ) => {
    return (
      editingCell?.rateId === rateId &&
      editingCell?.rangeKey === rangeKey &&
      editingCell?.bonusType === bonusType
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              Tarifario
            </h1>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              Tabla maestra de tarifas por fase/rol con franjas de minutos
            </p>
          </div>
          {onCreate && (
            <button
              onClick={onCreate}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nueva Tarifa
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
            <thead className="bg-stone-50 dark:bg-stone-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider sticky left-0 bg-stone-50 dark:bg-stone-900 z-10">
                  Fase/Rol
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider border-l border-stone-200 dark:border-stone-700"
                >
                  &lt; 30 min
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider border-l border-stone-200 dark:border-stone-700"
                >
                  30.1-59.9 min
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider border-l border-stone-200 dark:border-stone-700"
                >
                  60-89.9 min
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider border-l border-stone-200 dark:border-stone-700"
                >
                  90-119.9 min
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider border-l border-stone-200 dark:border-stone-700"
                >
                  &gt; 120 min
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider border-l border-stone-200 dark:border-stone-700">
                  Moneda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider border-l border-stone-200 dark:border-stone-700">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider border-l border-stone-200 dark:border-stone-700">
                  Acciones
                </th>
              </tr>
              <tr>
                <th className="px-6 py-2 text-left text-xs font-medium text-stone-500 dark:text-stone-400 sticky left-0 bg-stone-50 dark:bg-stone-900 z-10">
                  {/* Empty for phase column */}
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400 border-l border-stone-200 dark:border-stone-700">
                  Sin bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400">
                  Con bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400 border-l border-stone-200 dark:border-stone-700">
                  Sin bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400">
                  Con bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400 border-l border-stone-200 dark:border-stone-700">
                  Sin bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400">
                  Con bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400 border-l border-stone-200 dark:border-stone-700">
                  Sin bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400">
                  Con bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400 border-l border-stone-200 dark:border-stone-700">
                  Sin bono
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-stone-500 dark:text-stone-400">
                  Con bono
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-stone-500 dark:text-stone-400 border-l border-stone-200 dark:border-stone-700">
                  {/* Empty for currency column */}
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-stone-500 dark:text-stone-400 border-l border-stone-200 dark:border-stone-700">
                  {/* Empty for calculation type column */}
                </th>
                <th className="px-6 py-2 text-right text-xs font-medium text-stone-500 dark:text-stone-400 border-l border-stone-200 dark:border-stone-700">
                  {/* Empty for actions column */}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-stone-800 divide-y divide-stone-200 dark:divide-stone-700">
              {rates.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-6 py-12 text-center">
                    <div className="text-stone-500 dark:text-stone-400">
                      <svg
                        className="mx-auto h-12 w-12 text-stone-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium">No hay tarifas configuradas</p>
                      <p className="text-sm mt-1">Crea tu primera tarifa para comenzar</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rates.map((rate) => (
                  <tr
                    key={rate.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-stone-800 z-10 border-r border-stone-200 dark:border-stone-700">
                      <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {rate.phase}
                      </div>
                    </td>
                    {/* Less than 30 */}
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 border-l border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, 'lessThan30', 'withoutBonus')
                      }
                    >
                      {isEditing(rate.id, 'lessThan30', 'withoutBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges.lessThan30.withoutBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges.lessThan30.withoutBonus
                      )}
                    </td>
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, 'lessThan30', 'withBonus')
                      }
                    >
                      {isEditing(rate.id, 'lessThan30', 'withBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges.lessThan30.withBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges.lessThan30.withBonus
                      )}
                    </td>
                    {/* 30.1-59.9 */}
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 border-l border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, '30_1_to_59_9', 'withoutBonus')
                      }
                    >
                      {isEditing(rate.id, '30_1_to_59_9', 'withoutBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges['30_1_to_59_9'].withoutBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges['30_1_to_59_9'].withoutBonus
                      )}
                    </td>
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, '30_1_to_59_9', 'withBonus')
                      }
                    >
                      {isEditing(rate.id, '30_1_to_59_9', 'withBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges['30_1_to_59_9'].withBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges['30_1_to_59_9'].withBonus
                      )}
                    </td>
                    {/* 60-89.9 */}
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 border-l border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, '60_to_89_9', 'withoutBonus')
                      }
                    >
                      {isEditing(rate.id, '60_to_89_9', 'withoutBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges['60_to_89_9'].withoutBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges['60_to_89_9'].withoutBonus
                      )}
                    </td>
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, '60_to_89_9', 'withBonus')
                      }
                    >
                      {isEditing(rate.id, '60_to_89_9', 'withBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges['60_to_89_9'].withBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges['60_to_89_9'].withBonus
                      )}
                    </td>
                    {/* 90-119.9 */}
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 border-l border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, '90_to_119_9', 'withoutBonus')
                      }
                    >
                      {isEditing(rate.id, '90_to_119_9', 'withoutBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges['90_to_119_9'].withoutBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges['90_to_119_9'].withoutBonus
                      )}
                    </td>
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, '90_to_119_9', 'withBonus')
                      }
                    >
                      {isEditing(rate.id, '90_to_119_9', 'withBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges['90_to_119_9'].withBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges['90_to_119_9'].withBonus
                      )}
                    </td>
                    {/* More than 120 */}
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 border-l border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, 'moreThan120', 'withoutBonus')
                      }
                    >
                      {isEditing(rate.id, 'moreThan120', 'withoutBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges.moreThan120.withoutBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges.moreThan120.withoutBonus
                      )}
                    </td>
                    <td
                      className="px-3 py-4 whitespace-nowrap text-center text-sm text-stone-900 dark:text-stone-100 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onDoubleClick={() =>
                        handleCellDoubleClick(rate.id, 'moreThan120', 'withBonus')
                      }
                    >
                      {isEditing(rate.id, 'moreThan120', 'withBonus') ? (
                        <CellEditor
                          value={rate.minuteRanges.moreThan120.withBonus}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                        />
                      ) : (
                        rate.minuteRanges.moreThan120.withBonus
                      )}
                    </td>
                    {/* Currency */}
                    <td className="px-6 py-4 whitespace-nowrap border-l border-stone-200 dark:border-stone-700">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {currencyLabels[rate.currency]}
                      </div>
                    </td>
                    {/* Calculation Type */}
                    <td className="px-6 py-4 whitespace-nowrap border-l border-stone-200 dark:border-stone-700">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {calculationTypeLabels[rate.calculationType]}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-l border-stone-200 dark:border-stone-700">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(rate.id)}
                            className="text-blue-900 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label="Ver tarifa"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(rate.id)}
                            className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                            aria-label="Editar tarifa"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (confirm('¿Estás seguro de eliminar esta tarifa?')) {
                                onDelete(rate.id)
                              }
                            }}
                            className="text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Eliminar tarifa"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Helper text */}
      <div className="mt-4 text-sm text-stone-600 dark:text-stone-400">
        <p>💡 Haz doble click en cualquier celda de tarifa para editarla</p>
      </div>
    </div>
  )
}


