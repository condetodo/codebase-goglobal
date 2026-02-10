// =============================================================================
// Core Data Types
// =============================================================================

export type ProductType = 'miniserie' | 'serie' | 'pelicula' | 'documental'

export type OrderStatus = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada'

export type EpisodeStatus = 'pendiente' | 'en_produccion' | 'completado' | 'cancelado'

// Las 5 etapas del proceso de doblaje
export type PhaseType =
  | 'adaptación' // PREPRODUCCIÓN - Adaptación de guion
  | 'voice recording' // PRODUCCIÓN - Voice Talents
  | 'sound editing' // POSTPRODUCCIÓN - Editor de sonido
  | 'subtítulos' // POSTPRODUCCIÓN - Creación de subtítulos
  | 'QA' // POSTPRODUCCIÓN - QA final

export interface AssignedVendor {
  vendorId: string
  vendorName: string
  phase: PhaseType
  minutesWorked: number
  deadline?: string
}

export interface OrderVendorAssignmentItem {
  vendorId: string
  vendorName: string
  estimatedMinutes: number
}

export interface OrderVendorAssignment {
  phase: PhaseType
  vendors: OrderVendorAssignmentItem[]
  deadline: string
}

export interface Episode {
  id: string
  orderId: string
  episodeNumber: number
  title: string
  duration: number
  status: EpisodeStatus
  showId: string
  showName: string
  assignedVendors: AssignedVendor[]
}

export interface Order {
  id: string
  orderNumber: string
  productType: ProductType
  showId: string
  showName: string
  language: string
  status: OrderStatus
  episodeCount: number
  createdAt: string
  createdBy: string
  vendorAssignments?: OrderVendorAssignment[]
}

export interface Show {
  id: string
  name: string
  description: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface OrderFilters {
  status?: OrderStatus[]
  productType?: ProductType[]
  showId?: string[]
  language?: string[]
  createdFrom?: string
  createdTo?: string
}

export interface OrdersListProps {
  orders: Order[]
  episodes?: Episode[]
  onView?: (orderId: string) => void
  onEdit?: (orderId: string) => void
  onDelete?: (orderId: string) => void
  onCreate?: () => void
  onFilter?: (filters: OrderFilters) => void
  onSearch?: (query: string) => void
}

export interface OrderDetailProps {
  order: Order
  episodes: Episode[]
  onEdit?: (orderId: string) => void
  onDelete?: (orderId: string) => void
  onAddEpisode?: (orderId: string) => void
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
  onEpisodeClick?: (episodeId: string) => void
  onEditVendorAssignments?: (orderId: string) => void
}

export interface EpisodeEditProps {
  episode: Episode
  order: Order
  onSave?: (episode: Episode) => void
  onCancel?: () => void
  onAddVendor?: (episodeId: string, vendor: AssignedVendor) => void
  onRemoveVendor?: (episodeId: string, vendorId: string, phase: PhaseType) => void
  onUpdateMinutes?: (episodeId: string, vendorId: string, phase: PhaseType, minutes: number) => void
  onOverrideVendor?: (episodeId: string, phase: PhaseType, vendor: AssignedVendor) => void
  onRestoreVendor?: (episodeId: string, phase: PhaseType) => void
}

export interface OrderCreateFormProps {
  onCancel?: () => void
  onCreate?: (orderData: {
    productType: ProductType
    showId: string
    showName: string
    language: string
    episodeCount: number
    vendorAssignments: OrderVendorAssignment[]
  }) => void
  shows?: Show[]
  vendors?: Array<{ id: string; name: string; specializations: PhaseType[] }>
}
