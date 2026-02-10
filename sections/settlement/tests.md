# Test Instructions: Settlement (Liquidación y Pagos)

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

This section handles payment settlement and Purchase Order generation. Key functionality includes automatic payment calculation based on completed assignments, generating consolidated POs by vendor and month, PO approval workflow, duplicate payment detection, and ERP export.

---

## User Flow Tests

### Flow 1: Calculate Payments and Generate POs for a Month

**Scenario:** User wants to calculate payments for a specific month and generate Purchase Orders

#### Success Path

**Setup:**
- User is on the Settlement dashboard
- There are completed assignments for the selected month
- Month selector shows current month (format: YYYY-MM)

**Steps:**
1. User navigates to `/settlement`
2. User sees the Settlement dashboard with month selector, filters, and summary cards
3. User selects a different month from the month selector (e.g., "2025-01")
4. User clicks "Calcular Pagos" button
5. System calculates payments for all vendors with completed assignments in that month
6. User sees the "Cálculos por Vendor" table populated with calculated payments
7. User reviews the calculations (vendor, phase, currency, assignments count, minutes, subtotal, bonuses, total)
8. User clicks "Generar POs" button (or "Generar PO" for a specific vendor)
9. System generates Purchase Orders (one PO per vendor and currency)
10. User sees POs appear in the "Purchase Orders" table with status "Borrador"

**Expected Results:**
- [ ] Month selector updates when user selects a different month
- [ ] "Calcular Pagos" button triggers calculation for selected month
- [ ] Calculated payments table shows all vendors with completed assignments
- [ ] Each calculation row shows: vendor name, phase, currency, # assignments, minutes, subtotal, bonuses, total
- [ ] Status badge shows "Pendiente" for calculations without PO, "PO Generada" for those with PO
- [ ] "Generar POs" button appears when there are pending calculations
- [ ] After generating, POs appear in the Purchase Orders table
- [ ] PO numbers follow format: PO-YYYY-MM-XXX
- [ ] PO status is initially "Borrador"
- [ ] Summary cards update with correct totals (vendors, assignments, minutes, POs generated)

#### Failure Path: No Completed Assignments

**Setup:**
- Selected month has no completed assignments

**Steps:**
1. User selects a month with no completed assignments
2. User clicks "Calcular Pagos"

**Expected Results:**
- [ ] Calculated payments table shows empty state: "No hay cálculos disponibles para el mes seleccionado"
- [ ] "Generar POs" button does not appear
- [ ] Summary cards show zeros

---

### Flow 2: Review and Approve Purchase Orders

**Scenario:** User wants to review a PO and approve it for ERP export

#### Success Path

**Setup:**
- PO exists with status "Borrador" or "Pendiente Aprobación"
- User has permission to approve POs

**Steps:**
1. User is on Settlement dashboard
2. User sees PO in the Purchase Orders table
3. User clicks "Ver" button on a PO
4. System navigates to PO detail view
5. User sees PO information: number, vendor details, month, currency, subtotal, bonuses, total
6. User sees line items table with details of each assignment (order, show, episode, phase, quantity, unit price, amount)
7. User reviews all line items
8. User clicks "Aprobar" button (if status is "Borrador")
9. System changes PO status to "Pendiente Aprobación"
10. User with approval permission clicks "Aprobar definitivamente"
11. System changes PO status to "Aprobada"
12. PO is now ready for ERP export

**Expected Results:**
- [ ] PO detail view displays all PO information correctly
- [ ] Line items table shows all assignments included in the PO
- [ ] Each line item shows: order number, show title, episode, phase, quantity, unit, unit price, amount
- [ ] Totals match sum of line items
- [ ] "Aprobar" button changes status to "Pendiente Aprobación"
- [ ] "Aprobar definitivamente" button changes status to "Aprobada"
- [ ] Status badge updates with correct color and label
- [ ] PO with status "Aprobada" shows "Exportar al ERP" button

#### Failure Path: Invalid PO Data

**Setup:**
- PO has missing or invalid data

**Steps:**
1. User tries to approve a PO with invalid data

**Expected Results:**
- [ ] Error message appears explaining the issue
- [ ] PO status does not change
- [ ] User can edit the PO (if status is "Borrador")

---

### Flow 3: Export PO to ERP

**Scenario:** User wants to export an approved PO to the ERP system

#### Success Path

**Setup:**
- PO exists with status "Aprobada"
- ERP integration is configured

**Steps:**
1. User is on PO detail view for an approved PO
2. User sees "Exportar al ERP" button
3. User clicks "Exportar al ERP"
4. System generates export file (format depends on ERP integration)
5. System updates PO status to "Enviada al ERP"
6. System records export date and ERP reference (if provided)
7. User sees confirmation message

**Expected Results:**
- [ ] "Exportar al ERP" button is only visible for POs with status "Aprobada"
- [ ] Export file is generated in correct format
- [ ] PO status changes to "Enviada al ERP"
- [ ] Export date is recorded
- [ ] ERP reference is stored (if provided by ERP)
- [ ] PO cannot be modified after export
- [ ] Success message appears

#### Failure Path: ERP Export Fails

**Setup:**
- ERP integration fails or is unavailable

**Steps:**
1. User clicks "Exportar al ERP"
2. ERP export fails

**Expected Results:**
- [ ] Error message appears: "Error al exportar al ERP. Por favor, intente nuevamente."
- [ ] PO status remains "Aprobada"
- [ ] User can retry export
- [ ] Export date is not recorded

---

### Flow 4: Detect Duplicate Payments

**Scenario:** System detects potential duplicate payments

#### Success Path

**Setup:**
- System has run duplicate detection
- Duplicate payment groups exist

**Steps:**
1. User navigates to duplicate payments view
2. User sees list of duplicate payment groups
3. Each group shows: vendor, order/show, month, payment count, total paid, POs involved
4. User clicks on a group to review details
5. User sees all POs in the group
6. User confirms one is a duplicate
7. User clicks "Marcar como duplicado" and selects PO to cancel
8. System cancels the selected PO
9. User marks group as "Confirmado como duplicado"

**Expected Results:**
- [ ] Duplicate payments view shows all detected duplicates
- [ ] Each group shows correct vendor, order, month, count, and totals
- [ ] User can view details of each PO in the group
- [ ] "Marcar como duplicado" allows selecting which PO to cancel
- [ ] Cancelled PO status changes to "Cancelada"
- [ ] Group status updates to "Confirmado como duplicado"

#### Failure Path: False Positive

**Setup:**
- System detects a duplicate that is actually legitimate

**Steps:**
1. User reviews duplicate payment group
2. User confirms both payments are legitimate (different work, different periods, etc.)
3. User clicks "Confirmar legítimo"

**Expected Results:**
- [ ] Group status changes to "Confirmado legítimo"
- [ ] Group is removed from active duplicates list
- [ ] No POs are cancelled

---

### Flow 5: Register Payment Processed

**Scenario:** User wants to record that a PO has been paid

#### Success Path

**Setup:**
- PO exists with status "Enviada al ERP" or "Aprobada"
- Payment has been processed

**Steps:**
1. User is on PO detail view
2. User clicks "Registrar Pago"
3. User fills in payment form:
   - Payment date (date picker)
   - Payment method (select: transferencia bancaria, cheque, efectivo, otro)
   - Reference number (text, required)
   - Amount paid (number, required)
   - Notes (optional)
4. User clicks "Guardar y registrar pago"
5. System validates amount (cannot exceed balance)
6. System creates payment record
7. System generates payment hash (MD5) for duplicate detection
8. If payment is full, PO status changes to "Pagada"
9. If payment is partial, PO shows remaining balance

**Expected Results:**
- [ ] Payment form validates all required fields
- [ ] Amount validation prevents paying more than balance
- [ ] Reference number validation checks for duplicates (shows warning if exists)
- [ ] Payment date cannot be in the future
- [ ] Payment record is created with correct data
- [ ] Payment hash is generated correctly
- [ ] PO status updates to "Pagada" if payment is full
- [ ] PO shows remaining balance if payment is partial
- [ ] Payment appears in PO payment history

#### Failure Path: Invalid Payment Data

**Setup:**
- User enters invalid payment data

**Steps:**
1. User enters amount greater than balance
2. User clicks "Guardar"

**Expected Results:**
- [ ] Validation error appears: "El monto no puede ser mayor al saldo pendiente"
- [ ] Form is not submitted
- [ ] User can correct the amount

---

## Empty State Tests

### Primary Empty State

**Scenario:** User has no calculated payments or POs for the selected month

**Setup:**
- Selected month has no completed assignments
- No POs exist for the month

**Expected Results:**
- [ ] Calculated payments table shows: "No hay cálculos disponibles para el mes seleccionado"
- [ ] Purchase Orders table shows: "No hay Purchase Orders para el mes seleccionado"
- [ ] Summary cards show zeros
- [ ] "Generar POs" button does not appear
- [ ] "Calcular Pagos" button is still available

### Filtered Empty State

**Scenario:** User applies filters that return no results

**Setup:**
- Data exists but filters match nothing

**Steps:**
1. User enters vendor filter that matches no vendors
2. User selects status filter that matches no POs

**Expected Results:**
- [ ] Tables show appropriate empty state messages
- [ ] User can clear filters to see results again

---

## Component Interaction Tests

### SettlementDashboard Component

**Renders correctly:**
- [ ] Header shows "Liquidación y Pagos" title and description
- [ ] Month selector displays current month by default
- [ ] Summary cards show correct totals (vendors, assignments, minutes, POs generated)
- [ ] Totals by currency section displays all currencies with correct formatting
- [ ] Calculated payments table shows all calculations
- [ ] Purchase Orders table shows all POs

**User interactions:**
- [ ] Changing month selector calls `onMonthChange` with new month
- [ ] Clicking "Calcular Pagos" calls `onCalculatePayments` with selected month
- [ ] Clicking "Generar POs" calls `onGeneratePOs`
- [ ] Clicking "Ver" on calculation calls `onViewCalculation` with calculation ID
- [ ] Clicking "Generar PO" on specific calculation calls `onGeneratePOs` with vendor ID
- [ ] Clicking "Ver" on PO calls `onViewPO` with PO ID
- [ ] Vendor filter filters both tables correctly
- [ ] Status filter filters PO table correctly

**Loading and error states:**
- [ ] Shows loading state while calculating payments
- [ ] Shows error message if calculation fails
- [ ] Shows error message if PO generation fails

---

## Edge Cases

- [ ] Handles months with very large numbers of calculations (pagination)
- [ ] Handles POs with many line items (table scrolling)
- [ ] Handles multiple currencies in same month correctly
- [ ] Handles partial payments correctly (multiple payments for one PO)
- [ ] Handles very large amounts correctly (currency formatting)
- [ ] Handles zero bonuses correctly (displays as 0, not empty)
- [ ] Handles transition from no calculations to calculations appearing
- [ ] Handles transition from calculations to POs being generated
- [ ] Preserves filter state when navigating away and back

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Form fields have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Focus is managed appropriately after actions
- [ ] Tables have proper headers and structure
- [ ] Status badges have appropriate ARIA labels

---

## Sample Test Data

Use the data from `sample-data.json` or create variations:

```typescript
// Example test data - populated state
const mockSummary = {
  month: "2025-01",
  totalVendors: 4,
  totalAssignments: 14,
  totalMinutes: 531,
  totalsByCurrency: [
    { currency: "ARS", subtotal: 52375, bonuses: 2376, total: 54751 },
    { currency: "USD", subtotal: 39.6, bonuses: 0, total: 39.6 }
  ],
  posGenerated: 4,
  posPendingApproval: 1,
  posApproved: 1,
  posSentToErp: 1,
  posPaid: 1
};

const mockCalculatedPayment = {
  id: "calc-001",
  vendorId: "ven-001",
  vendorName: "Agostina Ferreyra",
  paymentMonth: "2025-01",
  phase: "voice recording",
  currency: "ARS",
  totalAssignments: 3,
  totalMinutes: 135,
  subtotal: 19575,
  qualityBonusTotal: 0,
  monthlyBonusTotal: 0,
  fullShowBonusTotal: 0,
  grandTotal: 19575,
  poGenerated: false,
  calculatedAt: "2025-02-01T10:00:00Z"
};

const mockPurchaseOrder = {
  id: "po-001",
  poNumber: "PO-2025-01-001",
  vendorId: "ven-001",
  vendorName: "Agostina Ferreyra",
  paymentMonth: "2025-01",
  currency: "ARS",
  subtotal: 19575,
  bonuses: 0,
  total: 19575,
  status: "approved",
  generatedAt: "2025-02-01T10:15:00Z"
};

// Example test data - empty states
const mockEmptySummary = {
  month: "2025-02",
  totalVendors: 0,
  totalAssignments: 0,
  totalMinutes: 0,
  totalsByCurrency: [],
  posGenerated: 0,
  posPendingApproval: 0,
  posApproved: 0,
  posSentToErp: 0,
  posPaid: 0
};

const mockEmptyCalculations = [];
const mockEmptyPOs = [];
```

---

## Notes for Test Implementation

- Mock API calls to test both success and failure scenarios
- Test each callback prop is called with correct arguments
- Verify UI updates optimistically where appropriate
- Test that loading states appear during async operations
- Ensure error boundaries catch and display errors gracefully
- **Always test empty states** — Pass empty arrays to verify helpful empty state UI appears (not blank screens)
- Test transitions: empty → calculations appear, calculations → POs generated
- Test currency formatting for all three currencies (ARS, USD, BRL)
- Test date formatting in Spanish locale
- Verify duplicate detection logic works correctly with payment hashes
