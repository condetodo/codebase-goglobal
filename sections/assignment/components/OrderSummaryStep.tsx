import type { OrderCreationData, Phase } from '../types'

interface OrderSummaryStepProps {
  orderData: OrderCreationData
  onBack: () => void
  onConfirm: () => void
  onCancel?: () => void
}

const productTypeLabels: Record<string, string> = {
  miniserie: 'Miniserie',
  serie: 'Serie',
  pelicula: 'Película',
  documental: 'Documental',
}

const phaseLabels: Record<Phase, string> = {
  adaptación: 'PREPRODUCCIÓN - Adaptación de guion',
  'voice recording': 'PRODUCCIÓN - Voice Talents',
  'sound editing': 'POSTPRODUCCIÓN - Editor de sonido',
  subtítulos: 'POSTPRODUCCIÓN - Creación de subtítulos',
  QA: 'POSTPRODUCCIÓN - QA final',
}

const phaseVendorLabels: Record<Phase, string> = {
  adaptación: 'Adaptador',
  'voice recording': 'Actores de voz',
  'sound editing': 'Editor de sonido',
  subtítulos: 'Subtitulador',
  QA: 'Auditor de calidad',
}

export function OrderSummaryStep({ orderData, onBack, onConfirm, onCancel }: OrderSummaryStepProps) {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Resumen de la Order
        </h2>
        <p className="text-stone-600 dark:text-stone-400">
          Revisa la información antes de crear la Order
        </p>
      </div>

      {/* Información Básica */}
      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-6 border border-stone-200 dark:border-stone-700">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Información Básica
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Tipo de Producto</dt>
            <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
              {productTypeLabels[orderData.productType]}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Cantidad de Episodios
            </dt>
            <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">
              {orderData.episodeCount} {orderData.episodeCount === 1 ? 'episodio' : 'episodios'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Idioma</dt>
            <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">{orderData.language}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500 dark:text-stone-400">Show/Serie</dt>
            <dd className="mt-1 text-sm text-stone-900 dark:text-stone-100">{orderData.showName}</dd>
          </div>
        </dl>
      </div>

      {/* Asignaciones de Vendors */}
      <div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Asignaciones de Vendors por Etapa
        </h3>
        <div className="space-y-3">
          {orderData.vendorAssignments.map((assignment) => (
            <div
              key={assignment.phase}
              className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                    {phaseLabels[assignment.phase]}
                  </h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {phaseVendorLabels[assignment.phase]}
                  </p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <span className="text-sm text-stone-500 dark:text-stone-400">Deadline:</span>
                      <span className="ml-2 text-sm font-medium text-stone-900 dark:text-stone-100">
                        {formatDate(assignment.deadline)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">
                        Vendors asignados ({assignment.vendors.length}):
                      </span>
                      <div className="space-y-2">
                        {assignment.vendors.map((vendor, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-200 dark:border-stone-700"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                                  {vendor.vendorName}
                                </span>
                                {assignment.vendors.length > 1 && (
                                  <span className="ml-2 text-xs text-stone-500 dark:text-stone-400">
                                    (Vendor {idx + 1})
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-stone-600 dark:text-stone-400">
                                {vendor.estimatedMinutes} min
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                        Total minutos estimados:{' '}
                        {assignment.vendors.reduce((sum, v) => sum + v.estimatedMinutes, 0).toFixed(1)} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Al confirmar, se creará la Order y se generarán {orderData.episodeCount}{' '}
              {orderData.episodeCount === 1 ? 'episodio' : 'episodios'} automáticamente.
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Todas las asignaciones de vendors, deadlines y minutos se aplicarán automáticamente a
              cada episodio.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-700">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
          >
            Anterior
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
        >
          Confirmar y Crear Order
        </button>
      </div>
    </div>
  )
}

