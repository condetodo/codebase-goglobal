import { useState } from 'react'
import type {
  VendorAssignmentStepProps,
  VendorAssignment,
  VendorAssignmentItem,
  Phase,
  Vendor,
} from '../types'

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

const phaseDescriptions: Record<Phase, string> = {
  adaptación:
    'Convierte el guion original en texto listo para doblaje. Ajusta lipsync, intención actoral y estilo.',
  'voice recording':
    'Los actores asignados graban sus líneas siguiendo el guion adaptado. Se respetan rangos vocales y disponibilidad.',
  'sound editing':
    'Ensambla y sincroniza las voces grabadas con el video original. Trabaja con las pistas M&E (Music & Effects).',
  subtítulos:
    'Genera los subtítulos finales en formato SRT. Sigue las normas específicas del cliente y ajusta al contenido doblado.',
  QA: 'Realiza auditoría de calidad final de todo el material entregado. Verifica audio, subtítulos y sincronización.',
}

const phaseColors: Record<Phase, string> = {
  adaptación: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20',
  'voice recording': 'border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20',
  'sound editing': 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20',
  subtítulos: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
  QA: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
}

interface VendorAssignmentStepPropsWithActions extends VendorAssignmentStepProps {
  onNext: (assignments: VendorAssignment[]) => void
  onBack: () => void
}

export function VendorAssignmentStep({
  assignments,
  vendors,
  onAssignmentChange,
  onCreateVendor,
  errors = {},
  onNext,
  onBack,
}: VendorAssignmentStepPropsWithActions) {
  const [localAssignments, setLocalAssignments] = useState<VendorAssignment[]>(
    assignments.map((a) => ({
      ...a,
      vendors: a.vendors && a.vendors.length > 0 ? a.vendors : [{ vendorId: '', vendorName: '', estimatedMinutes: 0 }],
    }))
  )
  const [creatingVendorFor, setCreatingVendorFor] = useState<{
    phase: Phase
    vendorIndex: number
  } | null>(null)
  const [newVendorData, setNewVendorData] = useState({
    name: '',
    email: '',
    phone: '',
    currency: 'ARS' as 'ARS' | 'USD' | 'BRL',
  })

  const handleAddVendor = (phase: Phase) => {
    const assignment = localAssignments.find((a) => a.phase === phase)
    if (assignment) {
      const updated: VendorAssignment = {
        ...assignment,
        vendors: [
          ...assignment.vendors,
          { vendorId: '', vendorName: '', estimatedMinutes: 0 },
        ],
      }
      const updatedAssignments = localAssignments.map((a) => (a.phase === phase ? updated : a))
      setLocalAssignments(updatedAssignments)
      onAssignmentChange(phase, updated)
    }
  }

  const handleRemoveVendor = (phase: Phase, vendorIndex: number) => {
    const assignment = localAssignments.find((a) => a.phase === phase)
    if (assignment && assignment.vendors.length > 1) {
      const updated: VendorAssignment = {
        ...assignment,
        vendors: assignment.vendors.filter((_, idx) => idx !== vendorIndex),
      }
      const updatedAssignments = localAssignments.map((a) => (a.phase === phase ? updated : a))
      setLocalAssignments(updatedAssignments)
      onAssignmentChange(phase, updated)
    }
  }

  const handleVendorChange = (
    phase: Phase,
    vendorIndex: number,
    field: keyof VendorAssignmentItem,
    value: any
  ) => {
    const assignment = localAssignments.find((a) => a.phase === phase)
    if (assignment) {
      const updatedVendors = assignment.vendors.map((v, idx) => {
        if (idx === vendorIndex) {
          return {
            ...v,
            [field]: value,
            ...(field === 'vendorId' && {
              vendorName: vendors.find((vend) => vend.id === value)?.name || '',
              isNew: false,
            }),
          }
        }
        return v
      })
      const updated: VendorAssignment = {
        ...assignment,
        vendors: updatedVendors,
      }
      const updatedAssignments = localAssignments.map((a) => (a.phase === phase ? updated : a))
      setLocalAssignments(updatedAssignments)
      onAssignmentChange(phase, updated)
    }
  }

  const handleCreateNewVendor = async (phase: Phase, vendorIndex: number) => {
    if (!onCreateVendor) {
      // Si no hay callback, crear vendor localmente (para preview)
      const newVendor: Vendor = {
        id: `ven-new-${Date.now()}`,
        name: newVendorData.name,
        email: newVendorData.email,
        phone: newVendorData.phone,
        currency: newVendorData.currency,
        specializations: [phase],
        active: true,
      }
      handleVendorChange(phase, vendorIndex, 'vendorId', newVendor.id)
      handleVendorChange(phase, vendorIndex, 'vendorName', newVendor.name)
      setCreatingVendorFor(null)
      setNewVendorData({ name: '', email: '', phone: '', currency: 'ARS' })
      return
    }

    try {
      const newVendor = await onCreateVendor({
        ...newVendorData,
        specializations: [phase],
      })
      handleVendorChange(phase, vendorIndex, 'vendorId', newVendor.id)
      handleVendorChange(phase, vendorIndex, 'vendorName', newVendor.name)
      setCreatingVendorFor(null)
      setNewVendorData({ name: '', email: '', phone: '', currency: 'ARS' })
    } catch (error) {
      console.error('Error creating vendor:', error)
    }
  }

  const getVendorsForPhase = (phase: Phase): Vendor[] => {
    return vendors.filter(
      (v) => v.active && (v.specializations.includes(phase) || v.specializations.length === 0)
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  const handleDateChange = (phase: Phase, value: string) => {
    const date = new Date(value)
    const assignment = localAssignments.find((a) => a.phase === phase)
    if (assignment) {
      const updated: VendorAssignment = {
        ...assignment,
        deadline: date.toISOString(),
      }
      const updatedAssignments = localAssignments.map((a) => (a.phase === phase ? updated : a))
      setLocalAssignments(updatedAssignments)
      onAssignmentChange(phase, updated)
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    if (!deadline) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isAllValid = localAssignments.every((assignment) => {
    if (!assignment.deadline || new Date(assignment.deadline) <= new Date()) return false
    if (!assignment.vendors || assignment.vendors.length === 0) return false
    return assignment.vendors.every(
      (vendor) => vendor.vendorId && vendor.estimatedMinutes > 0
    )
  })

  const handleNext = () => {
    if (isAllValid) {
      onNext(localAssignments)
    }
  }

  const canAddMoreVendors = (phase: Phase) => {
    // Para Voice Talents siempre se puede agregar más, para otras etapas también pero es menos común
    return true
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Asignar Vendors y Deadlines por Etapa
        </h2>
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Estas asignaciones se aplicarán automáticamente a todos los episodios que se generen.
            Puedes agregar múltiples vendors, especialmente para Voice Talents (múltiples actores de voz).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {localAssignments.map((assignment) => {
          const phaseVendors = getVendorsForPhase(assignment.phase)
          const daysUntil = getDaysUntilDeadline(assignment.deadline)
          const phaseError = errors[assignment.phase]
          const isVoiceRecording = assignment.phase === 'voice recording'

          return (
            <div
              key={assignment.phase}
              className={`p-6 border-2 rounded-lg ${phaseColors[assignment.phase]} ${
                phaseError && Object.keys(phaseError).length > 0
                  ? 'border-red-300 dark:border-red-700'
                  : ''
              }`}
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {phaseLabels[assignment.phase]}
                </h3>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-1">
                  {phaseVendorLabels[assignment.phase]}
                  {isVoiceRecording && ' (Puedes agregar múltiples actores)'}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
                  {phaseDescriptions[assignment.phase]}
                </p>
              </div>

              {/* Deadline (compartido para todos los vendors de la etapa) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formatDate(assignment.deadline)}
                  onChange={(e) => handleDateChange(assignment.phase, e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    phaseError?.deadline
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-stone-300 dark:border-stone-600'
                  }`}
                />
                {daysUntil !== null && daysUntil >= 0 && (
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    {daysUntil === 0
                      ? 'Hoy'
                      : daysUntil === 1
                        ? 'Mañana'
                        : `En ${daysUntil} días`}
                  </p>
                )}
                {phaseError?.deadline && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {phaseError.deadline}
                  </p>
                )}
              </div>

              {/* Lista de Vendors */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Vendors <span className="text-red-500">*</span>
                  </label>
                  {canAddMoreVendors(assignment.phase) && (
                    <button
                      type="button"
                      onClick={() => handleAddVendor(assignment.phase)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-900 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Agregar Vendor
                    </button>
                  )}
                </div>

                {assignment.vendors.map((vendorItem, vendorIndex) => {
                  const isCreatingNew =
                    creatingVendorFor?.phase === assignment.phase &&
                    creatingVendorFor?.vendorIndex === vendorIndex

                  return (
                    <div
                      key={vendorIndex}
                      className="p-4 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                          Vendor {vendorIndex + 1}
                          {assignment.vendors.length > 1 && ` de ${assignment.vendors.length}`}
                        </span>
                        {assignment.vendors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVendor(assignment.phase, vendorIndex)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Eliminar vendor"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {!isCreatingNew ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Selector de Vendor */}
                          <div>
                            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">
                              Seleccionar Vendor
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={vendorItem.vendorId}
                                onChange={(e) =>
                                  handleVendorChange(
                                    assignment.phase,
                                    vendorIndex,
                                    'vendorId',
                                    e.target.value
                                  )
                                }
                                className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  phaseError?.vendor
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-stone-300 dark:border-stone-600'
                                }`}
                              >
                                <option value="">Seleccionar vendor</option>
                                {phaseVendors.map((vendor) => (
                                  <option key={vendor.id} value={vendor.id}>
                                    {vendor.name} {!vendor.active && '(Inactivo)'}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() =>
                                  setCreatingVendorFor({
                                    phase: assignment.phase,
                                    vendorIndex,
                                  })
                                }
                                className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                                title="Crear nuevo vendor"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>
                            {phaseError?.vendor && (
                              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {phaseError.vendor}
                              </p>
                            )}
                          </div>

                          {/* Minutos Estimados */}
                          <div>
                            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">
                              Minutos Estimados <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={vendorItem.estimatedMinutes || ''}
                              onChange={(e) =>
                                handleVendorChange(
                                  assignment.phase,
                                  vendorIndex,
                                  'estimatedMinutes',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min="0.1"
                              step="0.1"
                              className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                phaseError?.minutes
                                  ? 'border-red-300 dark:border-red-700'
                                  : 'border-stone-300 dark:border-stone-600'
                              }`}
                            />
                            {phaseError?.minutes && (
                              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {phaseError.minutes}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-200 dark:border-stone-700">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            Crear Nuevo Vendor
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                                Nombre <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newVendorData.name}
                                onChange={(e) =>
                                  setNewVendorData({ ...newVendorData, name: e.target.value })
                                }
                                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nombre del vendor"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                                Email <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                value={newVendorData.email}
                                onChange={(e) =>
                                  setNewVendorData({ ...newVendorData, email: e.target.value })
                                }
                                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="email@ejemplo.com"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                                Teléfono <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                value={newVendorData.phone}
                                onChange={(e) =>
                                  setNewVendorData({ ...newVendorData, phone: e.target.value })
                                }
                                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="+54 11 1234-5678"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                                Moneda <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={newVendorData.currency}
                                onChange={(e) =>
                                  setNewVendorData({
                                    ...newVendorData,
                                    currency: e.target.value as 'ARS' | 'USD' | 'BRL',
                                  })
                                }
                                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="ARS">ARS - Peso Argentino</option>
                                <option value="USD">USD - Dólar</option>
                                <option value="BRL">BRL - Real Brasileño</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleCreateNewVendor(assignment.phase, vendorIndex)
                              }
                              disabled={
                                !newVendorData.name ||
                                !newVendorData.email ||
                                !newVendorData.phone
                              }
                              className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Crear y Asignar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCreatingVendorFor(null)
                                setNewVendorData({ name: '', email: '', phone: '', currency: 'ARS' })
                              }}
                              className="px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Success Indicator */}
              {assignment.deadline &&
                assignment.vendors.every(
                  (v) => v.vendorId && v.estimatedMinutes > 0
                ) && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Esta asignación se aplicará a todos los episodios</span>
                  </div>
                )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-700">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isAllValid}
          className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Revisar y Crear
        </button>
      </div>
    </div>
  )
}

