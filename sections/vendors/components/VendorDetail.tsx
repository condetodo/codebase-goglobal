import type { VendorDetailProps, Phase, AssignmentStatus } from '../types'

const phaseLabels: Record<Phase, string> = {
  preflight: 'Preflight',
  adaptación: 'Adaptación',
  edición: 'Edición',
  'voice recording': 'Voice Recording',
  'sound editing': 'Sound Editing',
  QA: 'QA',
}

const statusLabels: Record<AssignmentStatus, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En Progreso',
  completada: 'Completada',
  retrasada: 'Retrasada',
}

const statusColors: Record<AssignmentStatus, string> = {
  pendiente: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  en_progreso: 'bg-blue-900 text-white dark:bg-blue-800 dark:text-blue-200',
  completada: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  retrasada: 'bg-red-700 text-white dark:bg-red-800 dark:text-red-200',
}

export function VendorDetail({
  vendor,
  workHistory = [],
  onEdit,
  onDelete,
  onToggleActive,
  onWorkHistoryClick,
}: VendorDetailProps) {
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
          <div className="flex items-center gap-4">
            {vendor.photo && (
              <img
                src={vendor.photo}
                alt={vendor.voiceTalent}
                className="h-20 w-20 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                {vendor.voiceTalent}
              </h1>
              <p className="mt-1 text-stone-600 dark:text-stone-400">{vendor.vtNewCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onToggleActive && (
              <button
                onClick={() => onToggleActive(!vendor.active)}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  vendor.active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
                }`}
              >
                {vendor.active ? 'Activo' : 'Inactivo'}
              </button>
            )}
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
                onClick={onDelete}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Información Básica
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Email</dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">{vendor.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Idioma</dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                  {vendor.language}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Tipo</dt>
                <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                  {vendor.vendorType}
                </dd>
              </div>
              {vendor.gender && (
                <div>
                  <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Género</dt>
                  <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                    {vendor.gender}
                  </dd>
                </div>
              )}
              {vendor.character && (
                <div>
                  <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                    Personaje
                  </dt>
                  <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                    {vendor.character}
                  </dd>
                </div>
              )}
              {vendor.vocalRange && (
                <div>
                  <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                    Rango Vocal
                  </dt>
                  <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                    {vendor.vocalRange}
                  </dd>
                </div>
              )}
              {vendor.category && (
                <div>
                  <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                    Categoría
                  </dt>
                  <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                    {vendor.category}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Technical Details */}
          {(vendor.mic || vendor.software || vendor.homeStudio) && (
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Detalles Técnicos
              </h2>
              <dl className="space-y-4">
                {vendor.mic && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      Micrófono
                    </dt>
                    <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                      {vendor.mic}
                    </dd>
                  </div>
                )}
                {vendor.software && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      Software
                    </dt>
                    <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                      {vendor.software}
                    </dd>
                  </div>
                )}
                {vendor.homeStudio && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      Home Studio
                    </dt>
                    <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                      {vendor.homeStudio}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Payment Configuration */}
          {(vendor.currency || vendor.rate !== null) && (
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Configuración de Pagos
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vendor.currency && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      Moneda
                    </dt>
                    <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                      {vendor.currency}
                    </dd>
                  </div>
                )}
                {vendor.rate !== null && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Rate</dt>
                    <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                      {vendor.rate}
                    </dd>
                  </div>
                )}
                {vendor.bonus !== null && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      Bonus
                    </dt>
                    <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                      {vendor.bonus ? 'Sí' : 'No'}
                    </dd>
                  </div>
                )}
                {vendor.qualityBonus !== null && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      Quality Bonus
                    </dt>
                    <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                      {vendor.qualityBonus}
                    </dd>
                  </div>
                )}
                {vendor.continuityBonus !== null && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      Continuity Bonus
                    </dt>
                    <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
                      {vendor.continuityBonus}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Voice Sample */}
          {vendor.voiceSample && (
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Muestra de Voz
              </h2>
              <a
                href={vendor.voiceSample}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-900 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0011 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Escuchar muestra
              </a>
            </div>
          )}

          {/* Notes */}
          {vendor.notes && (
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Notas
              </h2>
              <p className="text-sm text-stone-900 dark:text-stone-100 whitespace-pre-wrap">
                {vendor.notes}
              </p>
            </div>
          )}
        </div>

        {/* Work History Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Historial de Trabajos
            </h2>
            {workHistory.length === 0 ? (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                No hay trabajos registrados para este vendor.
              </p>
            ) : (
              <div className="space-y-4">
                {workHistory.map((item) => (
                  <div
                    key={item.assignmentId}
                    className="border-b border-stone-200 dark:border-stone-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                          {item.episodeTitle}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {item.orderNumber} • {item.showName}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${statusColors[item.status]}`}
                      >
                        {statusLabels[item.status]}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                      <div>
                        <span className="font-medium">Fase:</span> {phaseLabels[item.phase]}
                      </div>
                      <div>
                        <span className="font-medium">Deadline:</span> {formatDate(item.deadline)}
                      </div>
                    </div>
                    {onWorkHistoryClick && (
                      <button
                        onClick={() => onWorkHistoryClick(item.assignmentId)}
                        className="mt-2 text-xs text-blue-900 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Ver detalles →
                      </button>
                    )}
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


