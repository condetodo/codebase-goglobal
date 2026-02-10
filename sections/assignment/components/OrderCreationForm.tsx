import { useState } from 'react'
import type {
  OrderCreationFormProps,
  OrderCreationData,
  Phase,
  Vendor,
} from '../types'
import { BasicInfoStep } from './BasicInfoStep'
import { VendorAssignmentStep } from './VendorAssignmentStep'
import { OrderSummaryStep } from './OrderSummaryStep'

const phases: Phase[] = ['adaptación', 'voice recording', 'sound editing', 'subtítulos', 'QA']

const phaseLabels: Record<Phase, string> = {
  adaptación: 'PREPRODUCCIÓN - Adaptación de guion',
  'voice recording': 'PRODUCCIÓN - Voice Talents',
  'sound editing': 'POSTPRODUCCIÓN - Editor de sonido',
  subtítulos: 'POSTPRODUCCIÓN - Creación de subtítulos',
  QA: 'POSTPRODUCCIÓN - QA final',
}

export function OrderCreationForm({
  onCancel,
  onCreate,
  shows = [],
  vendors = [],
  editingOrderId,
  currentOrderData,
}: OrderCreationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<OrderCreationData>>({
    productType: currentOrderData?.productType || 'serie',
    episodeCount: currentOrderData?.episodeCount || 1,
    language: currentOrderData?.language || 'es-AR',
    showId: currentOrderData?.showId || '',
    showName: currentOrderData?.showName || '',
    vendorAssignments:
      currentOrderData?.vendorAssignments ||
      phases.map((phase) => ({
        phase,
        vendors: [{ vendorId: '', vendorName: '', estimatedMinutes: 0 }],
        deadline: '',
      })),
  })

  const [validationErrors, setValidationErrors] = useState<
    Record<Phase, { vendor?: string; deadline?: string; minutes?: string }>
  >({
    adaptación: {},
    'voice recording': {},
    'sound editing': {},
    subtítulos: {},
    QA: {},
  })

  const isEditing = !!editingOrderId

  const validateStep1 = (): boolean => {
    if (!formData.productType || !formData.episodeCount || !formData.language || !formData.showId) {
      return false
    }
    return true
  }

  const validateStep2 = (): boolean => {
    const errors: typeof validationErrors = {
      adaptación: {},
      'voice recording': {},
      'sound editing': {},
      subtítulos: {},
      QA: {},
    }

    let isValid = true

    formData.vendorAssignments?.forEach((assignment) => {
      if (!assignment.deadline) {
        errors[assignment.phase].deadline = 'Deadline es obligatorio'
        isValid = false
      } else {
        const deadlineDate = new Date(assignment.deadline)
        const now = new Date()
        if (deadlineDate <= now) {
          errors[assignment.phase].deadline = 'Deadline debe ser una fecha futura'
          isValid = false
        }
      }
      if (!assignment.vendors || assignment.vendors.length === 0) {
        errors[assignment.phase].vendor = 'Al menos un vendor es obligatorio'
        isValid = false
      } else {
        const hasInvalidVendor = assignment.vendors.some(
          (v) => !v.vendorId || !v.estimatedMinutes || v.estimatedMinutes < 0.1
        )
        if (hasInvalidVendor) {
          errors[assignment.phase].vendor = 'Todos los vendors deben estar completos'
          errors[assignment.phase].minutes = 'Minutos estimados debe ser mayor a 0'
          isValid = false
        }
      }
    })

    setValidationErrors(errors)
    return isValid
  }

  const handleStep1Next = (data: Partial<OrderCreationData>) => {
    setFormData({ ...formData, ...data })
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleStep2Next = (assignments: typeof formData.vendorAssignments) => {
    setFormData({ ...formData, vendorAssignments: assignments })
    if (validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleStep2Back = () => {
    setCurrentStep(1)
  }

  const handleStep3Back = () => {
    setCurrentStep(2)
  }

  const handleCreate = () => {
    if (validateStep1() && validateStep2() && formData.vendorAssignments) {
      onCreate?.(formData as OrderCreationData)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            {isEditing ? 'Editar Asignaciones de Order' : 'Crear Nueva Order (Show)'}
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            {isEditing
              ? 'Modifica las asignaciones de vendors y deadlines. Los cambios se aplicarán a todos los episodios existentes.'
              : 'Completa la información para crear una nueva order y asignar vendors a todas las etapas del proceso.'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep >= step
                        ? 'bg-blue-900 text-white dark:bg-blue-800'
                        : 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step
                        ? 'text-blue-900 dark:text-blue-400'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {step === 1 && 'Información Básica'}
                    {step === 2 && 'Asignar Vendors'}
                    {step === 3 && 'Resumen'}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      currentStep > step
                        ? 'bg-blue-900 dark:bg-blue-800'
                        : 'bg-stone-200 dark:bg-stone-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6 sm:p-8">
          {currentStep === 1 && (
            <BasicInfoStep
              initialData={formData}
              shows={shows}
              onNext={handleStep1Next}
              onCancel={onCancel}
            />
          )}

          {currentStep === 2 && (
            <VendorAssignmentStep
              assignments={formData.vendorAssignments || []}
              vendors={vendors}
              onAssignmentChange={(phase, assignment) => {
                const updated = formData.vendorAssignments?.map((a) =>
                  a.phase === phase ? assignment : a
                )
                setFormData({ ...formData, vendorAssignments: updated })
              }}
              onCreateVendor={async (vendorData) => {
                // En una app real, esto haría una llamada API
                // Por ahora, creamos un vendor temporal
                const newVendor: Vendor = {
                  id: `ven-new-${Date.now()}`,
                  name: vendorData.name,
                  email: vendorData.email,
                  phone: vendorData.phone,
                  currency: vendorData.currency,
                  specializations: vendorData.specializations,
                  active: true,
                }
                return newVendor
              }}
              onNext={handleStep2Next}
              onBack={handleStep2Back}
              errors={validationErrors}
            />
          )}

          {currentStep === 3 && (
            <OrderSummaryStep
              orderData={formData as OrderCreationData}
              onBack={handleStep3Back}
              onConfirm={handleCreate}
              onCancel={onCancel}
            />
          )}
        </div>
      </div>
    </div>
  )
}

