// =============================================================================
// Assignment Data Types
// =============================================================================

export type Phase =
  | 'adaptación'
  | 'voice recording'
  | 'sound editing'
  | 'subtítulos'
  | 'QA'

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

export interface VendorAssignmentItem {
  vendorId: string
  vendorName: string
  estimatedMinutes: number
  isNew?: boolean
  newVendorData?: {
    name: string
    email: string
    phone: string
    currency: 'ARS' | 'USD' | 'BRL'
  }
}

export interface VendorAssignment {
  phase: Phase
  vendors: VendorAssignmentItem[]
  deadline: string
}

export interface OrderCreationData {
  productType: ProductType
  episodeCount: number
  language: string
  showId: string
  showName: string
  vendorAssignments: VendorAssignment[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface OrderCreationFormProps {
  onCancel?: () => void
  onCreate?: (orderData: OrderCreationData) => void
  shows?: Show[]
  vendors?: Vendor[]
  editingOrderId?: string
  currentOrderData?: Partial<OrderCreationData>
}

export interface VendorAssignmentStepProps {
  assignments: VendorAssignment[]
  vendors: Vendor[]
  onAssignmentChange: (phase: Phase, assignment: VendorAssignment) => void
  onCreateVendor?: (vendorData: {
    name: string
    email: string
    phone: string
    currency: 'ARS' | 'USD' | 'BRL'
    specializations: Phase[]
  }) => Promise<Vendor> | Vendor
  errors?: Record<Phase, { vendor?: string; deadline?: string; minutes?: string }>
}
