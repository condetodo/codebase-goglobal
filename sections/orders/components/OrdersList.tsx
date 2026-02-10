import { useState } from 'react'
import type {
  OrdersListProps,
  OrderStatus,
  ProductType,
  OrderFilters,
} from '../types'

const statusLabels: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

const productTypeLabels: Record<ProductType, string> = {
  miniserie: 'Miniserie',
  serie: 'Serie',
  pelicula: 'Película',
  documental: 'Documental',
}

const statusColors: Record<OrderStatus, string> = {
  pendiente: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  en_proceso: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  completada: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  cancelada: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export function OrdersList({
  orders,
  onCreate,
  onView,
  onEdit,
  onDelete,
  onFilter,
  onSearch,
}: OrdersListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus[]>([])
  const [productTypeFilter, setProductTypeFilter] = useState<ProductType[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleStatusFilterToggle = (status: OrderStatus) => {
    const newFilter = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status]
    setStatusFilter(newFilter)
    applyFilters({ status: newFilter, productType: productTypeFilter })
  }

  const handleProductTypeFilterToggle = (type: ProductType) => {
    const newFilter = productTypeFilter.includes(type)
      ? productTypeFilter.filter((t) => t !== type)
      : [...productTypeFilter, type]
    setProductTypeFilter(newFilter)
    applyFilters({ status: statusFilter, productType: newFilter })
  }

  const applyFilters = (filters: OrderFilters) => {
    onFilter?.(filters)
  }

  const filteredOrders = orders.filter((order) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(query) ||
        order.showName.toLowerCase().includes(query) ||
        order.createdBy.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter.length > 0 && !statusFilter.includes(order.status)) {
      return false
    }

    // Product type filter
    if (productTypeFilter.length > 0 && !productTypeFilter.includes(order.productType)) {
      return false
    }

    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              Órdenes de Doblaje
            </h1>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              Gestiona órdenes y episodios de doblaje
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
              Nueva Orden
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por número de orden, show o creador..."
            className="block w-full pl-10 pr-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Estado:
            </span>
            {(['pendiente', 'en_proceso', 'completada', 'cancelada'] as OrderStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilterToggle(status)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    statusFilter.includes(status)
                      ? 'bg-blue-900 text-white dark:bg-blue-800'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
                  }`}
                >
                  {statusLabels[status]}
                </button>
              )
            )}
          </div>

          {/* Product Type Filters */}
          <div className="flex items-center gap-2 flex-wrap ml-4">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Tipo:
            </span>
            {(['miniserie', 'serie', 'pelicula', 'documental'] as ProductType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleProductTypeFilterToggle(type)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  productTypeFilter.includes(type)
                    ? 'bg-red-700 text-white dark:bg-red-800'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
                }`}
              >
                {productTypeLabels[type]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
            <thead className="bg-stone-50 dark:bg-stone-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Número de Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Show/Serie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Episodios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Idioma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Creado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-stone-800 divide-y divide-stone-200 dark:divide-stone-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium">No se encontraron órdenes</p>
                      <p className="text-sm mt-1">
                        {searchQuery || statusFilter.length > 0 || productTypeFilter.length > 0
                          ? 'Intenta ajustar los filtros de búsqueda'
                          : 'Crea tu primera orden para comenzar'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors cursor-pointer"
                    onClick={() => onView?.(order.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {productTypeLabels[order.productType]}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {order.showName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {order.episodeCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {order.language}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-500 dark:text-stone-400">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onView(order.id)
                            }}
                            className="text-blue-900 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label="Ver orden"
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
                            onClick={(e) => {
                              e.stopPropagation()
                              onEdit(order.id)
                            }}
                            className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                            aria-label="Editar orden"
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
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(order.id)
                            }}
                            className="text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Eliminar orden"
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

      {/* Results count */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-stone-600 dark:text-stone-400">
          Mostrando {filteredOrders.length} de {orders.length} órdenes
        </div>
      )}
    </div>
  )
}


