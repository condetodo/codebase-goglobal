// =============================================================================
// Settlement Data Types
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

export interface CalculatedPayment {
  id: string
  vendorId: string
  vendorName: string
  paymentMonth: string
  phase: Phase
  currency: Currency
  totalAssignments: number
  totalMinutes: number
  totalLines?: number
  subtotal: number
  qualityBonusTotal: number
  monthlyBonusTotal: number
  fullShowBonusTotal: number
  grandTotal: number
  poGenerated: boolean
  poId?: string
  calculatedAt: string
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  vendorId: string
  vendorName: string
  vendorEmail?: string
  paymentMonth: string
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

export interface Payment {
  id: string
  poId: string
  vendorId: string
  amount: number
  currency: Currency
  paymentDate: string
  paymentMethod: PaymentMethod
  referenceNumber: string
  paymentHash: string
  createdAt: string
}

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

export interface SettlementSummary {
  month: string
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

export interface SettlementFilters {
  month?: string
  vendorId?: string
  status?: POStatus[]
  currency?: Currency[]
}

export interface SettlementDashboardProps {
  summary: SettlementSummary
  calculatedPayments: CalculatedPayment[]
  purchaseOrders: PurchaseOrder[]
  onMonthChange?: (month: string) => void
  onCalculatePayments?: (month: string) => void
  onGeneratePOs?: (vendorIds?: string[]) => void
  onViewCalculation?: (calculatedPaymentId: string) => void
  onViewPO?: (poId: string) => void
  onFilter?: (filters: SettlementFilters) => void
}

export interface CalculatedPaymentDetailProps {
  calculatedPayment: CalculatedPayment
  assignmentDetails: AssignmentDetail[]
  onGeneratePO?: (calculatedPaymentId: string) => void
  onExportToExcel?: (calculatedPaymentId: string) => void
  onBack?: () => void
}

export interface PurchaseOrderDetailProps {
  purchaseOrder: PurchaseOrder
  lineItems: POLineItem[]
  payments?: Payment[]
  onApprove?: (poId: string) => void
  onReject?: (poId: string) => void
  onExportToERP?: (poId: string) => void
  onViewPDF?: (poId: string) => void
  onRegisterPayment?: (poId: string) => void
  onEdit?: (poId: string) => void
  onDelete?: (poId: string) => void
  onUpdateNotes?: (poId: string, notes: string) => void
}

export interface DuplicatePaymentsViewProps {
  duplicateGroups: DuplicatePaymentGroup[]
  onRunDetection?: () => void
  onConfirmDuplicate?: (groupId: string, poIdToCancel: string) => void
  onConfirmLegitimate?: (groupId: string) => void
  onViewPO?: (poId: string) => void
}

export interface PaymentRegistrationFormProps {
  purchaseOrder: PurchaseOrder
  amountPaid?: number
  onSubmit?: (paymentData: {
    poId: string
    amount: number
    paymentDate: string
    paymentMethod: PaymentMethod
    referenceNumber: string
    notes?: string
  }) => void
  onCancel?: () => void
}
