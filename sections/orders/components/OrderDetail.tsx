import type {
  OrderDetailProps,
  OrderStatus,
  EpisodeStatus,
  PhaseType,
} from '../types'

const statusLabels: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

const episodeStatusLabels: Record<EpisodeStatus, string> = {
  pendiente: 'Pendiente',
  en_produccion: 'En Producción',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

const episodeStatusColors: Record<EpisodeStatus, string> = {
  pendiente: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  en_produccion: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  completado: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  cancelado: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

// Las 5 etapas del proceso de doblaje
const phaseLabels: Record<PhaseType, string> = {
  adaptación: 'PREPRODUCCIÓN - Adaptación de guion',
  'voice recording': 'PRODUCCIÓN - Voice Talents',
  'sound editing': 'POSTPRODUCCIÓN - Editor de sonido',
  subtítulos: 'POSTPRODUCCIÓN - Creación de subtítulos',
  QA: 'POSTPRODUCCIÓN - QA final',
}

const phaseVendorLabels: Record<PhaseType, string> = {
  adaptación: 'Adaptador',
  'voice recording': 'Actores de voz',
  'sound editing': 'Editor de sonido',
  subtítulos: 'Subtitulador',
  QA: 'Auditor de calidad',
}

const productTypeLabels: Record<string, string> = {
  miniserie: 'Miniserie',
  serie: 'Serie',
  pelicula: 'Película',
  documental: 'Documental',
}

export function OrderDetail({
  order,
  episodes,
  onEdit,
  onDelete,
  onAddEpisode,
  onStatusChange,
  onEpisodeClick,
  onEditVendorAssignments,
}: OrderDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    onStatusChange?.(order.id, newStatus)
  }

  const orderEpisodes = episodes.filter((ep) => ep.orderId === order.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
            aria-label="Volver"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              {order.orderNumber}
            </h1>
            <p className="mt-1 text-stone-600 dark:text-stone-400">{order.showName}</p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(order.id)}
                className="inline-flex items-center px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar Orden
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(order.id)}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 bg-white dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Vendors y Deadlines Asignados a Nivel de Order */}
      {order.vendorAssignments && order.vendorAssignments.length > 0 && (
        <div className="mb-6 bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Vendors y Deadlines Asignados a Nivel de Order
              </h2>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                Estas asignaciones se aplican automáticamente a todos los episodios
              </p>
            </div>
            {onEditVendorAssignments && (
              <button
                onClick={() => onEditVendorAssignments(order.id)}
                className="inline-flex items-center px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar Asignaciones y Deadlines
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.vendorAssignments.map((assignment, idx) => (
              <div
                key={idx}
                className="p-4 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-900/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {phaseLabels[assignment.phase]}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {phaseVendorLabels[assignment.phase]}
                    </p>
                  </div>
                  <div className="ml-2 flex items-center text-blue-600 dark:text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                      Vendors ({assignment.vendors?.length || 0}):
                    </p>
                    <div className="space-y-1">
                      {assignment.vendors?.map((vendor, vendorIdx) => (
                        <div key={vendorIdx} className="text-sm">
                          <span className="text-stone-900 dark:text-stone-100 font-medium">
                            {vendor.vendorName}
                          </span>
                          {vendor.estimatedMinutes > 0 && (
                            <span className="ml-2 text-xs text-stone-500 dark:text-stone-400">
                              ({vendor.estimatedMinutes} min)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                      Deadline:
                    </p>
                    <p className="text-sm text-stone-900 dark:text-stone-100">
                      {formatDate(assignment.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Información de la Orden
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Tipo de Producto
                </dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                  {productTypeLabels[order.productType]}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Show/Serie
                </dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                  {order.showName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Idioma</dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                  {order.language}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Cantidad de Episodios
                </dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                  {order.episodeCount}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Estado</dt>
                <dd className="mt-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                    className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!onStatusChange}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Creado por
                </dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                  {order.createdBy}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Fecha de Creación
                </dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                  {formatDate(order.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Episodes List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Episodios ({orderEpisodes.length})
              </h2>
              {onAddEpisode && (
                <button
                  onClick={() => onAddEpisode(order.id)}
                  className="inline-flex items-center px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
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
                  Agregar Episodio
                </button>
              )}
            </div>

            {orderEpisodes.length === 0 ? (
              <div className="px-6 py-12 text-center">
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
                  <p className="text-lg font-medium">No hay episodios</p>
                  <p className="text-sm mt-1">Agrega el primer episodio para comenzar</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone-200 dark:divide-stone-700">
                {orderEpisodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors cursor-pointer"
                    onClick={() => onEpisodeClick?.(episode.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-medium text-stone-900 dark:text-stone-100">
                            Episodio {episode.episodeNumber}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${episodeStatusColors[episode.status]}`}
                          >
                            {episodeStatusLabels[episode.status]}
                          </span>
                        </div>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                          {episode.title}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {episode.duration} min
                          </span>
                          {episode.assignedVendors.length > 0 && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {episode.assignedVendors.length} vendor
                              {episode.assignedVendors.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        {episode.assignedVendors.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {episode.assignedVendors.map((vendor, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
                              >
                                {vendor.vendorName} ({phaseVendorLabels[vendor.phase] || phaseLabels[vendor.phase]})
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Indicador visual de que hereda asignaciones de la Order */}
                        {order.vendorAssignments && order.vendorAssignments.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Hereda asignaciones de la Order</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEpisodeClick?.(episode.id)
                        }}
                        className="ml-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                        aria-label="Ver episodio"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


