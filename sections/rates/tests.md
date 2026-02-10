# Test Instructions: Rates

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

This section manages the master rate table that defines how payments are calculated. Key functionality includes viewing rates, creating/editing rates, and inline cell editing for quick updates.

---

## User Flow Tests

### Flow 1: View Rates Table

**Scenario:** User wants to see all configured rates

#### Success Path

**Steps:**
1. User navigates to `/rates`
2. User sees rates table
3. Rows represent phases/roles (Preflight, Adaptador, Editor, etc.)
4. Columns represent minute ranges (each with "sin bono" and "con bono")
5. User sees currency and calculation type for each rate

**Expected Results:**
- [ ] Rates table displays all rates correctly
- [ ] Rows show phase/role names
- [ ] Columns show minute ranges with bonus/without bonus
- [ ] Currency and calculation type are visible
- [ ] Table is scrollable if many rates exist

---

### Flow 2: Create New Rate

**Scenario:** User creates a new rate entry

#### Success Path

**Steps:**
1. User clicks "Nueva Tarifa"
2. User sees rate form
3. User selects phase: "Adaptador"
4. User selects currency: "ARS"
5. User selects calculation type: "x minuto"
6. User enters values for all minute ranges:
   - Less than 30: without bonus 800, with bonus 1000
   - 30.1-59.9: without bonus 800, with bonus 1000
   - 60-89.9: without bonus 800, with bonus 1000
   - 90-119.9: without bonus 800, with bonus 1000
   - More than 120: without bonus 800, with bonus 1000
7. User saves rate

**Expected Results:**
- [ ] Form validates all required fields
- [ ] All minute ranges can be filled
- [ ] Rate is created successfully
- [ ] New rate appears in table
- [ ] Success message appears

---

### Flow 3: Edit Rate Inline (Double-Click)

**Scenario:** User edits a cell value directly in the table

#### Success Path

**Steps:**
1. User double-clicks on a cell in the rates table
2. Inline editor appears with current value
3. User modifies the value
4. User presses Enter or clicks save
5. Cell value updates

**Expected Results:**
- [ ] Double-click opens inline editor
- [ ] Current value is pre-filled
- [ ] User can modify value
- [ ] Saving updates the cell
- [ ] Table reflects change immediately
- [ ] Canceling (Escape) discards changes

---

### Flow 4: Edit Rate via Form

**Scenario:** User edits a rate using the form

#### Success Path

**Steps:**
1. User clicks on a rate row or "Editar" button
2. User sees rate detail view
3. User clicks "Editar"
4. User modifies rate values
5. User saves changes

**Expected Results:**
- [ ] Rate detail shows all information
- [ ] Edit form is pre-filled
- [ ] User can modify any value
- [ ] Changes are saved
- [ ] Table reflects updates

---

## Empty State Tests

### Primary Empty State

**Scenario:** No rates configured yet

**Setup:**
- Rates table is empty (`[]`)

**Expected Results:**
- [ ] Shows "No hay tarifas configuradas"
- [ ] Shows "Nueva Tarifa" button
- [ ] Button is functional

---

## Component Interaction Tests

### RatesTable Component

**Renders correctly:**
- [ ] Displays all rates in table format
- [ ] Shows correct structure (rows = phases, columns = ranges)
- [ ] Currency and calculation type are visible

**User interactions:**
- [ ] Double-clicking cell opens inline editor
- [ ] Clicking row calls `onView`
- [ ] Creating new rate calls `onCreate`
- [ ] Editing rate calls `onEdit`
- [ ] Deleting rate calls `onDelete`

### CellEditor Component

**Renders correctly:**
- [ ] Shows input with current value
- [ ] Focus is on input

**User interactions:**
- [ ] Enter key saves value
- [ ] Escape key cancels editing
- [ ] Clicking outside cancels editing
- [ ] Saving calls `onSave` with new value

---

## Edge Cases

- [ ] Handles very large rate values
- [ ] Handles decimal values correctly
- [ ] Handles rates with same phase but different currency
- [ ] Handles editing multiple cells in sequence
- [ ] Handles network errors during save

---

## Accessibility Checks

- [ ] All form fields have associated labels
- [ ] Inline editor is keyboard accessible
- [ ] Error messages are announced
- [ ] Tables have proper headers

---

## Sample Test Data

```typescript
// Example test data - populated state
const mockRate = {
  id: "rate-001",
  phase: "Preflight",
  currency: "ARS",
  calculationType: "x minuto",
  minuteRanges: {
    lessThan30: { withoutBonus: 400, withBonus: 460 },
    "30_1_to_59_9": { withoutBonus: 400, withBonus: 460 },
    "60_to_89_9": { withoutBonus: 400, withBonus: 460 },
    "90_to_119_9": { withoutBonus: 400, withBonus: 460 },
    moreThan120: { withoutBonus: 400, withBonus: 460 }
  }
};
```

---

## Notes for Test Implementation

- Mock API calls for rate CRUD operations
- Test inline cell editing thoroughly
- Verify all minute ranges are editable
- Test currency and calculation type changes
- **Always test empty states** — No rates scenario
