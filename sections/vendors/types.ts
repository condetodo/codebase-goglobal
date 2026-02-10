// =============================================================================
// Data Types
// =============================================================================

export type VendorType =
  | 'Voice Talent'
  | 'Editor'
  | 'Adaptador'
  | 'Editor de Sonido'
  | 'QA'
  | 'Preflight'

export type Language = 'Spanish LA' | 'Portuguese' | 'English'

export type Gender = 'Male' | 'Female'

export type Currency = 'ARS' | 'USD' | 'BRL'

export type AssignmentStatus = 'pendiente' | 'en_progreso' | 'completada' | 'retrasada'

export type Phase =
  | 'preflight'
  | 'adaptación'
  | 'edición'
  | 'voice recording'
  | 'sound editing'
  | 'QA'

export interface Vendor {
  id: string
  voiceTalent: string
  vtNewCode: string
  email: string
  language: Language
  active: boolean
  gender: Gender | null
  vendorType: VendorType
  character: string | null
  vocalRange: string | null
  category: string | null
  voiceSample: string | null
  mic: string | null
  software: string | null
  homeStudio: string | null
  currency: Currency | null
  rate: number | null
  bonus: boolean | null
  qualityBonus: number | null
  continuityBonus: number | null
  notes: string | null
  photo: string | null
}

export interface WorkHistoryItem {
  assignmentId: string
  episodeId: string
  episodeTitle: string
  orderNumber: string
  showName: string
  phase: Phase
  status: AssignmentStatus
  startDate: string
  deadline: string
  completedAt: string | null
}

// =============================================================================
// Component Props
// =============================================================================

export interface VendorsListProps {
  /** The list of vendors to display */
  vendors: Vendor[]
  /** Called when user wants to view a vendor's details */
  onView?: (id: string) => void
  /** Called when user wants to create a new vendor */
  onCreate?: () => void
  /** Called when user wants to edit a vendor */
  onEdit?: (id: string) => void
  /** Called when user wants to delete a vendor */
  onDelete?: (id: string) => void
  /** Called when user wants to toggle active/inactive status */
  onToggleActive?: (id: string, active: boolean) => void
  /** Called when user wants to filter vendors */
  onFilter?: (filters: VendorFilters) => void
  /** Called when user wants to search vendors */
  onSearch?: (query: string) => void
}

export interface VendorDetailProps {
  /** The vendor to display */
  vendor: Vendor
  /** The work history for this vendor */
  workHistory?: WorkHistoryItem[]
  /** Called when user wants to edit the vendor */
  onEdit?: () => void
  /** Called when user wants to delete the vendor */
  onDelete?: () => void
  /** Called when user wants to toggle active/inactive status */
  onToggleActive?: (active: boolean) => void
  /** Called when user clicks on a work history item */
  onWorkHistoryClick?: (assignmentId: string) => void
}

export interface VendorFormProps {
  /** The vendor data (for editing) or null (for creating) */
  vendor?: Vendor | null
  /** Called when user submits the form */
  onSubmit?: (vendor: Omit<Vendor, 'id'>) => void
  /** Called when user cancels */
  onCancel?: () => void
}

export interface VendorFilters {
  vendorType?: VendorType[]
  language?: Language[]
  active?: boolean
  currency?: Currency[]
  gender?: Gender[]
}

