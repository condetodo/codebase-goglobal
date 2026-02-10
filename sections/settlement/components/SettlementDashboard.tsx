import { useState } from 'react'
import type {
  SettlementDashboardProps,
  POStatus,
  Currency,
  CalculatedPayment,
  PurchaseOrder,
} from '../types'

const poStatusLabels: Record<POStatus, string> = {
  draft: 'Borrador',
  pending_approval: 'Pendiente Aprobación',
  approved: 'Aprobada',
  sent_to_erp: 'Enviada al ERP',
  paid: 'Pagada',
  cancelled: 'Cancelada',
}

const poStatusColors: Record<POStatus, string> = {
  draft: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  pending_approval: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  sent_to_erp: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

const phaseLabels: Record<string, string> = {
  adaptación: 'Adaptación',
  'voice recording': 'Voice Recording',
  'sound editing': 'Sound Editing',
  subtítulos: 'Subtítulos',
  QA: 'QA',
}

const currencyLabels: Record<Currency, string> = {
  ARS: 'ARS',
  USD: 'USD',
  BRL: 'BRL',
}

const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === 'ARS') {
    return `$${amount.toLocaleString('es-AR')}`
  }
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  if (currency === 'BRL') {
    return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return amount.toString()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function SettlementDashboard({
  summary,
  calculatedPayments,
  purchaseOrders,
  onMonthChange,
  onCalculatePayments,
  onGeneratePOs,
  onViewCalculation,
  onViewPO,
  onFilter,
}: SettlementDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState(summary.month)
  const [vendorFilter, setVendorFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<POStatus[]>([])
  const [currencyFilter, setCurrencyFilter] = useState<Currency[]>([])

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    onMonthChange?.(month)
  }

  const handleCalculatePayments = () => {
    onCalculatePayments?.(selectedMonth)
  }

  const handleGeneratePOs = () => {
    onGeneratePOs?.()
  }

  const pendingCalculations = calculatedPayments.filter((calc) => !calc.poGenerated)

  const filteredCalculations = calculatedPayments.filter((calc) => {
    if (vendorFilter && !calc.vendorName.toLowerCase().includes(vendorFilter.toLowerCase())) {
      return false
    }
    return true
  })

  const filteredPOs = purchaseOrders.filter((po) => {
    if (statusFilter.length > 0 && !statusFilter.includes(po.status)) {
      return false
    }
    if (currencyFilter.length > 0 && !currencyFilter.includes(po.currency)) {
      return false
    }
    if (vendorFilter && !po.vendorName.toLowerCase().includes(vendorFilter.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Liquidación y Pagos
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Cálculo automático de pagos y generación de Purchase Orders
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Selector de mes */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Mes de Liquidación
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-700"
            />
          </div>

          {/* Filtro por vendor */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Vendor
            </label>
            <input
              type="text"
              placeholder="Buscar vendor..."
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-700"
            />
          </div>

          {/* Filtro por estado de PO */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Estado PO
            </label>
            <select
              value={statusFilter.join(',')}
              onChange={(e) => {
                const value = e.target.value
                setStatusFilter(value ? (value.split(',') as POStatus[]) : [])
                onFilter?.({ status: value ? (value.split(',') as POStatus[]) : undefined })
              }}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-700"
            >
              <option value="">Todos</option>
              <option value="draft">Borrador</option>
              <option value="pending_approval">Pendiente Aprobación</option>
              <option value="approved">Aprobada</option>
              <option value="sent_to_erp">Enviada al ERP</option>
              <option value="paid">Pagada</option>
            </select>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleCalculatePayments}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              Calcular Pagos
            </button>
            {pendingCalculations.length > 0 && (
              <button
                onClick={handleGeneratePOs}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white rounded-md font-medium transition-colors"
              >
                Generar POs ({pendingCalculations.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resumen del Mes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
          <p className="text-sm text-stone-600 dark:text-stone-400">Vendors</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {summary.totalVendors}
          </p>
        </div>
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
          <p className="text-sm text-stone-600 dark:text-stone-400">Asignaciones</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {summary.totalAssignments}
          </p>
        </div>
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
          <p className="text-sm text-stone-600 dark:text-stone-400">Minutos</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {summary.totalMinutes.toLocaleString('es-AR')}
          </p>
        </div>
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
          <p className="text-sm text-stone-600 dark:text-stone-400">POs Generadas</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {summary.posGenerated}
          </p>
        </div>
      </div>

      {/* Totales por Moneda */}
      {summary.totalsByCurrency.length > 0 && (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Totales por Moneda
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summary.totalsByCurrency.map((total) => (
              <div
                key={total.currency}
                className="border border-stone-200 dark:border-stone-700 rounded-lg p-4"
              >
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {currencyLabels[total.currency]}
                </p>
                <p className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {formatCurrency(total.total, total.currency)}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                  Subtotal: {formatCurrency(total.subtotal, total.currency)} | Bonos:{' '}
                  {formatCurrency(total.bonuses, total.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Cálculos por Vendor */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Cálculos por Vendor
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            {filteredCalculations.length} cálculo(s) encontrado(s)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 dark:bg-stone-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Fase
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Moneda
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  # Asignaciones
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Minutos
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Subtotal
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Bonos
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              {filteredCalculations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-stone-500 dark:text-stone-400">
                    No hay cálculos disponibles para el mes seleccionado
                  </td>
                </tr>
              ) : (
                filteredCalculations.map((calc) => {
                  const totalBonuses =
                    calc.qualityBonusTotal + calc.monthlyBonusTotal + calc.fullShowBonusTotal
                  return (
                    <tr
                      key={calc.id}
                      className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-stone-900 dark:text-stone-100">
                        {calc.vendorName}
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">
                        {phaseLabels[calc.phase] || calc.phase}
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">
                        {currencyLabels[calc.currency]}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-stone-700 dark:text-stone-300">
                        {calc.totalAssignments}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-stone-700 dark:text-stone-300">
                        {calc.totalMinutes}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-stone-700 dark:text-stone-300">
                        {formatCurrency(calc.subtotal, calc.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-stone-700 dark:text-stone-300">
                        {formatCurrency(totalBonuses, calc.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-stone-900 dark:text-stone-100">
                        {formatCurrency(calc.grandTotal, calc.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            calc.poGenerated
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                        >
                          {calc.poGenerated ? 'PO Generada' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onViewCalculation?.(calc.id)}
                            className="text-blue-900 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            Ver
                          </button>
                          {!calc.poGenerated && (
                            <button
                              onClick={() => onGeneratePOs?.([calc.vendorId])}
                              className="text-red-700 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium"
                            >
                              Generar PO
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista de POs */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Purchase Orders
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            {filteredPOs.length} PO(s) encontrada(s)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 dark:bg-stone-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Número PO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Mes
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Moneda
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Fecha Generación
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-stone-500 dark:text-stone-400">
                    No hay Purchase Orders para el mes seleccionado
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => (
                  <tr
                    key={po.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-stone-900 dark:text-stone-100">
                      {po.poNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">
                      {po.vendorName}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">
                      {po.paymentMonth}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">
                      {currencyLabels[po.currency]}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-stone-900 dark:text-stone-100">
                      {formatCurrency(po.total, po.currency)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${poStatusColors[po.status]}`}
                      >
                        {poStatusLabels[po.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">
                      {formatDate(po.generatedAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onViewPO?.(po.id)}
                          className="text-blue-900 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
