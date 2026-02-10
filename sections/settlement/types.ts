// =============================================================================
// Data Types
// =============================================================================

export type POStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'approved' 
  | 'sent_to_erp' 
  | 'paid' 
  | 'cancelled'

export type PaymentMethod = 
  | 'bank_transfer' 
  | 'check' 
  | 'cash' 
  | 'other'

export type Currency = 'ARS' | 'USD' | 'BRL'

export type Unit = 'minutes' | 'lines' | 'flat' | 'hours'

export type Phase = 
  | 'adaptación' 
  | 'voice recording' 
  | 'sound editing' 
  | 'subtítulos' 
  | 'QA'

// Calculated Payment (Pre-PO) - Agregación de asignaciones por vendor/mes/fase
export interface CalculatedPayment {
  id: string
  vendorId: string
  vendorName: string
  paymentMonth: string // 'YYYY-MM'
  phase: Phase
  currency: Currency
  totalAssignments: number
  totalMinutes: number
  totalLines?: number // Para Voice Talents
  subtotal: number
  qualityBonusTotal: number
  monthlyBonusTotal: number
  fullShowBonusTotal: number
  grandTotal: number
  poGenerated: boolean
  poId?: string
  calculatedAt: string
}

// Purchase Order - PO consolidada por vendor/mes/moneda
export interface PurchaseOrder {
  id: string
  poNumber: string // Formato: PO-YYYY-MM-XXX
  vendorId: string
  vendorName: string
  vendorEmail?: string
  paymentMonth: string // 'YYYY-MM'
  currency: Currency
  subtotal: number
  bonuses: number
  total: number
  status: POStatus
  generatedAt: string
  approvedBy?: string
  approvedAt?: string
  sentToErpAt?: string
  paidAt?: string
  pdfUrl?: string
  erpReference?: string
  notes?: string
}

// PO Line Item - Detalle de cada asignación en una PO
export interface POLineItem {
  id: string
  poId: string
  assignmentId?: string
  description: string
  orderNumber: string
  showTitle: string
  episode: string
  phase: Phase
  quantity: number
  unit: Unit
  unitPrice: number
  amount: number
  lineOrder: number
}

// Payment - Registro de pago procesado
export interface Payment {
  id: string
  poId: string
  vendorId: string
  amount: number
  currency: Currency
  paymentDate: string
  paymentMethod: PaymentMethod
  referenceNumber: string
  paymentHash: string // MD5 para detección de duplicados
  createdAt: string
}

// Duplicate Payment Detection - Grupo de pagos potencialmente duplicados
export interface DuplicatePaymentGroup {
  id: string
  vendorId: string
  vendorName: string
  orderNumber: string
  showTitle: string
  paymentMonth: string
  paymentCount: number
  totalPaid: number
  poIds: string[]
  status: 'pending_review' | 'confirmed_duplicate' | 'confirmed_legitimate'
  detectedAt: string
}

// Assignment Detail - Detalle de asignación para cálculos
export interface AssignmentDetail {
  assignmentId: string
  orderId: string
  orderNumber: string
  episodeId: string
  episodeTitle: string
  showId: string
  showTitle: string
  vendorId: string
  vendorName: string
  phase: Phase
  minutesWorked: number
  linesWorked?: number
  rateApplied: number
  currency: Currency
  subtotal: number
  qualityBonus: number
  monthlyBonus: number
  fullShowBonus: number
  total: number
  paymentMonth: string
}

// Settlement Summary - Resumen del mes
export interface SettlementSummary {
  month: string // 'YYYY-MM'
  totalVendors: number
  totalAssignments: number
  totalMinutes: number
  totalsByCurrency: {
    currency: Currency
    subtotal: number
    bonuses: number
    total: number
  }[]
  posGenerated: number
  posPendingApproval: number
  posApproved: number
  posSentToErp: number
  posPaid: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface SettlementDashboardProps {
  /** Summary data for the selected month */
  summary: SettlementSummary
  /** List of calculated payments (pre-PO) */
  calculatedPayments: CalculatedPayment[]
  /** List of purchase orders */
  purchaseOrders: PurchaseOrder[]
  /** Called when user selects a different month */
  onMonthChange?: (month: string) => void
  /** Called when user wants to calculate payments for a month */
  onCalculatePayments?: (month: string) => void
  /** Called when user wants to generate POs */
  onGeneratePOs?: (vendorIds?: string[]) => void
  /** Called when user wants to view calculation details */
  onViewCalculation?: (calculatedPaymentId: string) => void
  /** Called when user wants to view PO details */
  onViewPO?: (poId: string) => void
  /** Called when user wants to filter */
  onFilter?: (filters: SettlementFilters) => void
}

export interface CalculatedPaymentDetailProps {
  /** The calculated payment to display */
  calculatedPayment: CalculatedPayment
  /** List of assignment details included in this calculation */
  assignmentDetails: AssignmentDetail[]
  /** Called when user wants to generate a PO from this calculation */
  onGeneratePO?: (calculatedPaymentId: string) => void
  /** Called when user wants to export to Excel */
  onExportToExcel?: (calculatedPaymentId: string) => void
  /** Called when user wants to go back */
  onBack?: () => void
}

export interface PurchaseOrderDetailProps {
  /** The purchase order to display */
  purchaseOrder: PurchaseOrder
  /** List of line items in this PO */
  lineItems: POLineItem[]
  /** List of payments made for this PO */
  payments?: Payment[]
  /** Called when user wants to approve the PO */
  onApprove?: (poId: string) => void
  /** Called when user wants to reject the PO */
  onReject?: (poId: string) => void
  /** Called when user wants to export to ERP */
  onExportToERP?: (poId: string) => void
  /** Called when user wants to view PDF */
  onViewPDF?: (poId: string) => void
  /** Called when user wants to register a payment */
  onRegisterPayment?: (poId: string) => void
  /** Called when user wants to edit the PO (only if draft) */
  onEdit?: (poId: string) => void
  /** Called when user wants to delete the PO (only if draft) */
  onDelete?: (poId: string) => void
  /** Called when user updates notes */
  onUpdateNotes?: (poId: string, notes: string) => void
}

export interface DuplicatePaymentsViewProps {
  /** List of duplicate payment groups */
  duplicateGroups: DuplicatePaymentGroup[]
  /** Called when user wants to run duplicate detection */
  onRunDetection?: () => void
  /** Called when user confirms a group as duplicate */
  onConfirmDuplicate?: (groupId: string, poIdToCancel: string) => void
  /** Called when user confirms a group as legitimate */
  onConfirmLegitimate?: (groupId: string) => void
  /** Called when user wants to view a PO */
  onViewPO?: (poId: string) => void
}

export interface PaymentRegistrationFormProps {
  /** The purchase order this payment is for */
  purchaseOrder: PurchaseOrder
  /** Amount already paid (if partial payments exist) */
  amountPaid?: number
  /** Called when user submits the payment */
  onSubmit?: (paymentData: {
    poId: string
    amount: number
    paymentDate: string
    paymentMethod: PaymentMethod
    referenceNumber: string
    notes?: string
  }) => void
  /** Called when user cancels */
  onCancel?: () => void
}

export interface SettlementFilters {
  month?: string
  vendorId?: string
  status?: POStatus[]
  currency?: Currency[]
}
