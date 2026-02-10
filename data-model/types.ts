// =============================================================================
// Data Types
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
  deadline?: string // Deadline específico para esta asignación (si es excepción)
}

// Asignación de vendor individual a nivel de Order
export interface OrderVendorAssignmentItem {
  vendorId: string
  vendorName: string
  estimatedMinutes: number // Minutos estimados de trabajo para este vendor específico
}

// Asignación completa de una etapa a nivel de Order (puede tener múltiples vendors, especialmente para Voice Talents)
// Se aplica a todos los episodios
export interface OrderVendorAssignment {
  phase: PhaseType
  vendors: OrderVendorAssignmentItem[] // Array de vendors (múltiples para voice recording, uno para otras etapas)
  deadline: string // Obligatorio a nivel de Order (compartido para todos los vendors de la etapa)
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
  // Asignaciones de vendors y deadlines a nivel de Order (se aplican a todos los episodios)
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

export interface OrdersListProps {
  /** The list of orders to display */
  orders: Order[]
  /** The list of episodes (used to calculate episode counts and statuses) */
  episodes?: Episode[]
  /** Called when user wants to view an order's details */
  onView?: (orderId: string) => void
  /** Called when user wants to edit an order */
  onEdit?: (orderId: string) => void
  /** Called when user wants to delete an order */
  onDelete?: (orderId: string) => void
  /** Called when user wants to create a new order */
  onCreate?: () => void
  /** Called when user wants to filter orders */
  onFilter?: (filters: OrderFilters) => void
  /** Called when user searches for orders */
  onSearch?: (query: string) => void
}

export interface OrderDetailProps {
  /** The order to display */
  order: Order
  /** The episodes associated with this order */
  episodes: Episode[]
  /** Called when user wants to edit the order */
  onEdit?: (orderId: string) => void
  /** Called when user wants to delete the order */
  onDelete?: (orderId: string) => void
  /** Called when user wants to add a new episode to the order */
  onAddEpisode?: (orderId: string) => void
  /** Called when user wants to change the order status */
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
  /** Called when user clicks on an episode to view/edit it */
  onEpisodeClick?: (episodeId: string) => void
  /** Called when user wants to edit vendor assignments and deadlines at Order level */
  onEditVendorAssignments?: (orderId: string) => void
}

export interface EpisodeEditProps {
  /** The episode to edit */
  episode: Episode
  /** The order this episode belongs to */
  order: Order
  /** Called when user saves changes to the episode */
  onSave?: (episode: Episode) => void
  /** Called when user cancels editing */
  onCancel?: () => void
  /** Called when user wants to add a vendor assignment (exception) */
  onAddVendor?: (episodeId: string, vendor: AssignedVendor) => void
  /** Called when user wants to remove a vendor assignment (exception) */
  onRemoveVendor?: (episodeId: string, vendorId: string, phase: PhaseType) => void
  /** Called when user updates minutes worked for a vendor */
  onUpdateMinutes?: (episodeId: string, vendorId: string, phase: PhaseType, minutes: number) => void
  /** Called when user wants to override a vendor assignment from Order level */
  onOverrideVendor?: (episodeId: string, phase: PhaseType, vendor: AssignedVendor) => void
  /** Called when user wants to restore a vendor assignment from Order level */
  onRestoreVendor?: (episodeId: string, phase: PhaseType) => void
}

export interface OrderFilters {
  status?: OrderStatus[]
  productType?: ProductType[]
  showId?: string[]
  language?: string[]
  createdFrom?: string
  createdTo?: string
}

// Props para el formulario de creación de Order
export interface OrderCreateFormProps {
  /** Called when user cancels creating the order */
  onCancel?: () => void
  /** Called when user completes creating the order with all data */
  onCreate?: (orderData: {
    productType: ProductType
    showId: string
    showName: string
    language: string
    episodeCount: number
    vendorAssignments: OrderVendorAssignment[]
  }) => void
  /** Available shows to select from */
  shows?: Show[]
  /** Available vendors to assign */
  vendors?: Array<{ id: string; name: string; specializations: PhaseType[] }>
}
