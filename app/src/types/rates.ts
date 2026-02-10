// =============================================================================
// Rate Data Types
// =============================================================================

export type Phase =
  | 'Preflight'
  | 'Adaptador'
  | 'Editor'
  | 'Editor de sonido'
  | 'Adaptador PTBR'
  | 'Editores PTBR'

export type Currency = 'ARS' | 'USD' | 'BRL'

export type CalculationType = 'x minuto' | 'flat' | 'por hora'

export interface MinuteRange {
  withoutBonus: number
  withBonus: number
}

export interface MinuteRanges {
  lessThan30: MinuteRange
  '30_1_to_59_9': MinuteRange
  '60_to_89_9': MinuteRange
  '90_to_119_9': MinuteRange
  moreThan120: MinuteRange
}

export interface Rate {
  id: string
  phase: Phase
  currency: Currency
  calculationType: CalculationType
  minuteRanges: MinuteRanges
}

// =============================================================================
// Component Props
// =============================================================================

export interface RatesTableProps {
  rates: Rate[]
  onCreate?: () => void
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onCellEdit?: (rateId: string, rangeKey: keyof MinuteRanges, bonusType: 'withoutBonus' | 'withBonus', value: number) => void
}

export interface RateDetailProps {
  rate: Rate
  onEdit?: () => void
  onDelete?: () => void
}

export interface RateFormProps {
  rate?: Rate | null
  onSubmit?: (rate: Omit<Rate, 'id'>) => void
  onCancel?: () => void
}

export interface CellEditorProps {
  value: number
  onSave?: (value: number) => void
  onCancel?: () => void
}
