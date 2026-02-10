// =============================================================================
// Data Types
// =============================================================================

// Las 5 etapas del proceso de doblaje
export type Phase =
  | 'adaptación' // PREPRODUCCIÓN - Adaptación de guion
  | 'voice recording' // PRODUCCIÓN - Voice Talents
  | 'sound editing' // POSTPRODUCCIÓN - Editor de sonido
  | 'subtítulos' // POSTPRODUCCIÓN - Creación de subtítulos
  | 'QA' // POSTPRODUCCIÓN - QA final

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  specializations: Phase[]
  currency: 'ARS' | 'USD' | 'BRL'
  active: boolean
}

export interface Show {
  id: string
  name: string
  description: string
}

export type ProductType = 'miniserie' | 'serie' | 'pelicula' | 'documental'

// Asignación de vendor individual (puede haber múltiples por etapa)
export interface VendorAssignmentItem {
  vendorId: string
  vendorName: string
  estimatedMinutes: number // Minutos estimados de trabajo para este vendor específico
  isNew?: boolean // Indica si es un vendor nuevo que se está creando
  newVendorData?: {
    name: string
    email: string
    phone: string
    currency: 'ARS' | 'USD' | 'BRL'
  }
}

// Asignación completa de una etapa (puede tener múltiples vendors, especialmente para Voice Talents)
// Compatible con OrderVendorAssignment de orders/types.ts
export interface VendorAssignment {
  phase: Phase
  vendors: VendorAssignmentItem[] // Array de vendors (múltiples para voice recording, uno para otras etapas)
  deadline: string // Fecha y hora en formato ISO (obligatorio) - compartido para todos los vendors de la etapa
}

// Datos del formulario de creación de Order
export interface OrderCreationData {
  // Paso 1: Información básica
  productType: ProductType
  episodeCount: number
  language: string
  showId: string
  showName: string
  // Paso 2: Asignaciones de vendors
  vendorAssignments: VendorAssignment[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface OrderCreationFormProps {
  /** Called when user cancels creating the order */
  onCancel?: () => void
  /** Called when user completes creating the order with all data */
  onCreate?: (orderData: OrderCreationData) => void
  /** Available shows to select from */
  shows?: Show[]
  /** Available vendors to assign */
  vendors?: Vendor[]
  /** If editing an existing order, pass the order ID and current data */
  editingOrderId?: string
  /** Current order data if editing */
  currentOrderData?: Partial<OrderCreationData>
}

export interface VendorAssignmentStepProps {
  /** The vendor assignments for each phase */
  assignments: VendorAssignment[]
  /** Available vendors */
  vendors: Vendor[]
  /** Called when an assignment is updated */
  onAssignmentChange: (phase: Phase, assignment: VendorAssignment) => void
  /** Called when user wants to create a new vendor */
  onCreateVendor?: (vendorData: {
    name: string
    email: string
    phone: string
    currency: 'ARS' | 'USD' | 'BRL'
    specializations: Phase[]
  }) => Promise<Vendor> | Vendor
  /** Validation errors for each phase */
  errors?: Record<Phase, { vendor?: string; deadline?: string; minutes?: string }>
}

