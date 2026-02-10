# Test Instructions: Vendors

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

This section manages all vendors (voice talents, adapters, editors, etc.) in the system. Key functionality includes viewing vendors, creating/editing vendors, viewing vendor details with work history, and filtering/searching vendors.

---

## User Flow Tests

### Flow 1: View Vendors List

**Scenario:** User wants to see all vendors

#### Success Path

**Steps:**
1. User navigates to `/vendors`
2. User sees vendors table with columns: Voice talent, VT new code, Email, Language, Vendor Type, Active status
3. User can filter by vendor type, language, currency, gender, active status
4. User can search by name, code, or email
5. User clicks on a vendor row

**Expected Results:**
- [ ] Vendors table displays all vendors
- [ ] Filters work correctly
- [ ] Search filters vendors correctly
- [ ] Clicking vendor row calls `onView` with vendor ID
- [ ] Active/inactive toggle is visible and functional

---

### Flow 2: Create New Vendor

**Scenario:** User creates a new vendor

#### Success Path

**Steps:**
1. User clicks "Nuevo Vendor"
2. User fills in required fields: Voice talent, VT new code, Email, Language, Gender
3. User fills in optional fields: Vendor Type, Character, Vocal Range, Category, etc.
4. User fills in payment config: Currency, Rate, Bonus settings
5. User fills in technical details: Mic, Software, Home Studio
6. User saves vendor

**Expected Results:**
- [ ] Form validates required fields
- [ ] Vendor is created successfully
- [ ] New vendor appears in list
- [ ] Success message appears
- [ ] `onSubmit` is called with vendor data

#### Failure Path: Validation Errors

**Steps:**
1. User leaves required fields empty
2. User enters invalid email
3. User tries to save

**Expected Results:**
- [ ] Validation errors appear for missing required fields
- [ ] Email validation shows error for invalid format
- [ ] Form is not submitted

---

### Flow 3: View Vendor Detail

**Scenario:** User views vendor details with work history

#### Success Path

**Steps:**
1. User clicks on a vendor from list
2. User sees vendor detail view
3. User sees all vendor information
4. User sees work history section
5. User sees list of assignments (past and current)
6. User clicks on a work history item

**Expected Results:**
- [ ] Vendor detail shows all information correctly
- [ ] Work history section displays assignments
- [ ] Each assignment shows: episode, order, show, phase, status, dates
- [ ] Clicking work history item calls `onWorkHistoryClick` with assignment ID
- [ ] Photo displays if available

---

### Flow 4: Edit Vendor

**Scenario:** User edits existing vendor

#### Success Path

**Steps:**
1. User is on vendor detail view
2. User clicks "Editar"
3. User sees form with pre-filled data
4. User modifies fields
5. User saves changes

**Expected Results:**
- [ ] Form is pre-filled with vendor data
- [ ] User can modify any field
- [ ] Changes are saved successfully
- [ ] Updated vendor appears in list
- [ ] Success message appears

---

### Flow 5: Toggle Vendor Active Status

**Scenario:** User activates/deactivates a vendor

#### Success Path

**Steps:**
1. User is on vendors list
2. User toggles active/inactive switch for a vendor
3. Status updates immediately

**Expected Results:**
- [ ] Toggle works correctly
- [ ] Status updates in database
- [ ] UI reflects change immediately
- [ ] Filtered lists update if vendor was filtered out

---

## Empty State Tests

### Primary Empty State

**Scenario:** No vendors exist

**Setup:**
- Vendors list is empty (`[]`)

**Expected Results:**
- [ ] Shows "No hay vendors disponibles"
- [ ] Shows "Nuevo Vendor" button
- [ ] Button is functional

### Vendor with No Work History

**Scenario:** Vendor exists but has no assignments

**Setup:**
- Vendor exists
- Work history is empty (`[]`)

**Expected Results:**
- [ ] Vendor detail renders correctly
- [ ] Work history section shows "No hay trabajos registrados"
- [ ] No broken layouts

---

## Component Interaction Tests

### VendorsList Component

**Renders correctly:**
- [ ] Displays all vendors in table
- [ ] Shows correct columns
- [ ] Active/inactive status is visible

**User interactions:**
- [ ] Clicking vendor calls `onView`
- [ ] Toggling active calls `onToggleActive`
- [ ] Filtering updates table
- [ ] Searching updates table

### VendorDetail Component

**Renders correctly:**
- [ ] Shows all vendor information
- [ ] Shows work history if available
- [ ] Photo displays if available

**User interactions:**
- [ ] Clicking "Editar" calls `onEdit`
- [ ] Clicking work history item calls `onWorkHistoryClick`
- [ ] Toggling active calls `onToggleActive`

### VendorForm Component

**Renders correctly:**
- [ ] Shows all form fields
- [ ] Pre-fills data when editing

**User interactions:**
- [ ] Submitting calls `onSubmit` with vendor data
- [ ] Canceling calls `onCancel`
- [ ] Validation works correctly

---

## Edge Cases

- [ ] Handles vendors with very long names
- [ ] Handles vendors with no photo
- [ ] Handles vendors with extensive work history (100+ assignments)
- [ ] Handles vendors with special characters in names/emails
- [ ] Handles inactive vendors correctly in filters

---

## Accessibility Checks

- [ ] All form fields have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Focus is managed appropriately
- [ ] Tables have proper headers

---

## Sample Test Data

```typescript
// Example test data - populated state
const mockVendor = {
  id: "ven-001",
  voiceTalent: "Agostina Ferreyra",
  vtNewCode: "AF(042)",
  email: "ferreyralocutora@gmail.com",
  language: "Spanish LA",
  active: true,
  gender: "Female",
  vendorType: "Voice Talent",
  currency: "ARS",
  rate: 145,
  bonus: true
};

const mockWorkHistory = [
  {
    assignmentId: "asg-001",
    episodeId: "ep-001",
    episodeTitle: "Dark Secrets - Episodio 1",
    orderNumber: "ORD-2024-001",
    showName: "Dark Secrets",
    phase: "voice recording",
    status: "completada",
    startDate: "2024-01-16",
    deadline: "2024-01-20",
    completedAt: "2024-01-19T14:30:00Z"
  }
];
```

---

## Notes for Test Implementation

- Mock API calls for vendor CRUD operations
- Test work history aggregation from assignments
- Verify filtering and searching work correctly
- Test active/inactive toggle functionality
- **Always test empty states** — No vendors, no work history scenarios
