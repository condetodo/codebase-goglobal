// =============================================================================
// Data Types
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
  /** The list of rates to display */
  rates: Rate[]
  /** Called when user wants to create a new rate */
  onCreate?: () => void
  /** Called when user wants to view a rate's details */
  onView?: (id: string) => void
  /** Called when user wants to edit a rate */
  onEdit?: (id: string) => void
  /** Called when user wants to delete a rate */
  onDelete?: (id: string) => void
  /** Called when user double-clicks a cell to edit a specific value */
  onCellEdit?: (rateId: string, rangeKey: keyof MinuteRanges, bonusType: 'withoutBonus' | 'withBonus', value: number) => void
}

export interface RateDetailProps {
  /** The rate to display */
  rate: Rate
  /** Called when user wants to edit the rate */
  onEdit?: () => void
  /** Called when user wants to delete the rate */
  onDelete?: () => void
}

export interface RateFormProps {
  /** The rate data (for editing) or null (for creating) */
  rate?: Rate | null
  /** Called when user submits the form */
  onSubmit?: (rate: Omit<Rate, 'id'>) => void
  /** Called when user cancels */
  onCancel?: () => void
}

export interface CellEditorProps {
  /** The current value */
  value: number
  /** Called when user saves the edited value */
  onSave?: (value: number) => void
  /** Called when user cancels editing */
  onCancel?: () => void
}

