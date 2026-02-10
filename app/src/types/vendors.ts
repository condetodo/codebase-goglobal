// =============================================================================
// Vendor Data Types
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

export interface VendorFilters {
  vendorType?: VendorType[]
  language?: Language[]
  active?: boolean
  currency?: Currency[]
  gender?: Gender[]
}

export interface VendorsListProps {
  vendors: Vendor[]
  onView?: (id: string) => void
  onCreate?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleActive?: (id: string, active: boolean) => void
  onFilter?: (filters: VendorFilters) => void
  onSearch?: (query: string) => void
}

export interface VendorDetailProps {
  vendor: Vendor
  workHistory?: WorkHistoryItem[]
  onEdit?: () => void
  onDelete?: () => void
  onToggleActive?: (active: boolean) => void
  onWorkHistoryClick?: (assignmentId: string) => void
}

export interface VendorFormProps {
  vendor?: Vendor | null
  onSubmit?: (vendor: Omit<Vendor, 'id'>) => void
  onCancel?: () => void
}
