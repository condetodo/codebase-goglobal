import { useState } from 'react'
import type {
  EpisodeEditProps,
  EpisodeStatus,
  PhaseType,
  AssignedVendor,
} from '../types'

const statusLabels: Record<EpisodeStatus, string> = {
  pendiente: 'Pendiente',
  en_produccion: 'En Producción',
  completado: 'Completado',
  cancelado: 'Cancelado',
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

const phases: PhaseType[] = ['adaptación', 'voice recording', 'sound editing', 'subtítulos', 'QA']

export function EpisodeEdit({
  episode,
  order,
  onSave,
  onCancel,
  onAddVendor,
  onRemoveVendor,
  onUpdateMinutes,
  onOverrideVendor,
  onRestoreVendor,
}: EpisodeEditProps) {
  const [duration, setDuration] = useState(episode.duration.toString())
  const [status, setStatus] = useState<EpisodeStatus>(episode.status)
  const [editingVendor, setEditingVendor] = useState<{
    vendorId: string
    phase: PhaseType
    minutes: number
  } | null>(null)

  const handleSave = () => {
    const updatedEpisode = {
      ...episode,
      duration: parseInt(duration, 10),
      status,
    }
    onSave?.(updatedEpisode)
  }

  const handleAddVendor = () => {
    // In a real app, this would open a vendor selection dialog
    // For now, we'll use a placeholder
    const newVendor: AssignedVendor = {
      vendorId: 'new-vendor',
      vendorName: 'Nuevo Vendor',
      phase: 'preflight',
      minutesWorked: 0,
    }
    onAddVendor?.(episode.id, newVendor)
  }

  const handleRemoveVendor = (vendorId: string, phase: PhaseType) => {
    onRemoveVendor?.(episode.id, vendorId, phase)
  }

  const handleUpdateMinutes = (vendorId: string, phase: PhaseType, minutes: number) => {
    onUpdateMinutes?.(episode.id, vendorId, phase, minutes)
  }

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

  // Obtener vendors heredados de la Order (solo lectura)
  const inheritedAssignments = order.vendorAssignments || []
  
  // Obtener vendors específicos del episodio (excepciones)
  const episodeSpecificVendors = episode.assignedVendors.filter((vendor) => {
    // Un vendor es específico del episodio si no coincide con ninguna asignación de la Order
    const orderAssignment = inheritedAssignments.find((a) => a.phase === vendor.phase)
    if (!orderAssignment) return true
    // Verificar si el vendor está en la lista de vendors de la Order para esa fase
    return !orderAssignment.vendors?.some((v) => v.vendorId === vendor.vendorId)
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onCancel}
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
              Editar Episodio {episode.episodeNumber}
            </h1>
            <p className="mt-1 text-stone-600 dark:text-stone-400">
              {episode.title} - {order.orderNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Información Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
              >
                Duración (minutos)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
              >
                Estado
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as EpisodeStatus)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_produccion">En Producción</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vendors y Deadlines Heredados de la Order */}
        {inheritedAssignments.length > 0 && (
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Vendors y Deadlines Heredados de la Order
              </h2>
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Solo lectura - Para modificar, edita desde la Order</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inheritedAssignments.map((assignment, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20"
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

        {/* Vendors Específicos del Episodio (Excepciones) */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Vendors Específicos del Episodio
              </h2>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                Excepciones o vendors adicionales para este episodio
              </p>
            </div>
            {onAddVendor && (
              <button
                onClick={handleAddVendor}
                className="inline-flex items-center px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
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
                Agregar Excepción
              </button>
            )}
          </div>

          {episodeSpecificVendors.length === 0 ? (
            <div className="text-center py-8 text-stone-500 dark:text-stone-400">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p>No hay excepciones para este episodio</p>
              <p className="text-xs mt-1">
                Este episodio usa los vendors asignados a nivel de Order
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {episodeSpecificVendors.map((vendor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border border-stone-200 dark:border-stone-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {vendor.vendorName}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                        {phaseVendorLabels[vendor.phase] || phaseLabels[vendor.phase]} (Excepción)
                      </span>
                      {vendor.deadline && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300">
                          Deadline: {formatDate(vendor.deadline)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-sm text-stone-600 dark:text-stone-400">
                        Minutos trabajados:
                        <input
                          type="number"
                          value={vendor.minutesWorked}
                          onChange={(e) =>
                            handleUpdateMinutes(
                              vendor.vendorId,
                              vendor.phase,
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          min="0"
                          className="ml-2 w-20 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                  {onRemoveVendor && (
                    <button
                      onClick={() => handleRemoveVendor(vendor.vendorId, vendor.phase)}
                      className="ml-4 p-2 text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      aria-label="Eliminar vendor"
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
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              Cancelar
            </button>
          )}
          {onSave && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
            >
              Guardar Cambios
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


