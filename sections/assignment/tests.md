# Test Instructions: Assignment

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

This section is the main entry point for creating new dubbing orders. It provides a multi-step form that allows users to configure all necessary information for a dubbing project, including vendor assignments that automatically apply to all episodes.

---

## User Flow Tests

### Flow 1: Create New Order with Complete Vendor Assignments

**Scenario:** User creates a new order with vendor assignments for all 5 phases

#### Success Path

**Setup:**
- Shows and vendors exist in the system
- User is authenticated

**Steps:**
1. User navigates to `/assignment` or clicks "Nueva Order"
2. User sees multi-step form
3. **Step 1 - Basic Info:**
   - User selects product type: "miniserie"
   - User enters episode count: 6
   - User selects language: "es-AR"
   - User selects show: "Dark Secrets" (or creates new)
   - User clicks "Continuar"
4. **Step 2 - Vendor Assignments:**
   - For "Adaptación" phase:
     - User selects vendor: "Adaptation Pro"
     - User sets deadline: "2024-02-15T10:00:00Z"
     - User enters estimated minutes: 45
   - For "Voice Recording" phase:
     - User selects multiple vendors: "Voice Talent One", "Voice Talent Two"
     - User sets deadline: "2024-02-20T10:00:00Z"
     - User enters estimated minutes: 50
   - For "Sound Editing" phase:
     - User selects vendor: "Sound Masters"
     - User sets deadline: "2024-02-25T10:00:00Z"
     - User enters estimated minutes: 45
   - For "Subtítulos" phase:
     - User selects vendor: "Subtitles Pro"
     - User sets deadline: "2024-02-28T10:00:00Z"
     - User enters estimated minutes: 30
   - For "QA" phase:
     - User selects vendor: "QA Specialists"
     - User sets deadline: "2024-03-01T10:00:00Z"
     - User enters estimated minutes: 20
   - User sees indicator: "Estas asignaciones se aplicarán automáticamente a todos los episodios"
   - User clicks "Continuar"
5. **Step 3 - Summary:**
   - User reviews all information
   - User clicks "Crear Order"
6. System creates order and generates 6 episodes
7. System applies vendor assignments to all 6 episodes automatically

**Expected Results:**
- [ ] Step 1 form validates required fields
- [ ] User can select existing show or create new
- [ ] Step 2 shows all 5 phases
- [ ] Each phase requires vendor, deadline, and minutes
- [ ] Multiple vendors can be selected for Voice Recording
- [ ] Indicator shows assignments will apply to all episodes
- [ ] Validation prevents proceeding without completing all phases
- [ ] Step 3 shows complete summary
- [ ] Order is created successfully
- [ ] 6 episodes are generated automatically
- [ ] All episodes inherit vendor assignments from Order
- [ ] Success message appears
- [ ] User is redirected to order detail view

#### Failure Path: Missing Required Fields

**Setup:**
- User doesn't complete all required fields

**Steps:**
1. User tries to proceed from Step 1 without selecting product type
2. User tries to proceed from Step 2 without completing all phases

**Expected Results:**
- [ ] Validation errors appear for missing fields
- [ ] User cannot proceed to next step
- [ ] Error messages are clear and specific

#### Failure Path: Create Vendor During Order Creation

**Steps:**
1. User is on Step 2 (Vendor Assignments)
2. User clicks "Crear Nuevo Vendor" for a phase
3. User fills in vendor form: name, email, phone, currency, specializations
4. User saves new vendor
5. New vendor is automatically selected for that phase

**Expected Results:**
- [ ] Vendor creation form opens
- [ ] New vendor is created
- [ ] New vendor is automatically selected
- [ ] User can continue with order creation

---

## Empty State Tests

### No Shows Available

**Scenario:** No shows exist when creating order

**Setup:**
- Shows list is empty

**Expected Results:**
- [ ] Show selector shows option to create new show
- [ ] User can create show during order creation
- [ ] New show is available for selection

### No Vendors Available for Phase

**Scenario:** No vendors exist for a specific phase

**Setup:**
- No vendors with required specialization exist

**Expected Results:**
- [ ] Phase shows option to create new vendor
- [ ] User can create vendor during assignment
- [ ] New vendor is available for selection

---

## Component Interaction Tests

### OrderCreationForm Component

**Multi-step navigation:**
- [ ] Step 1 shows basic info form
- [ ] Step 2 shows vendor assignments form
- [ ] Step 3 shows summary
- [ ] User can navigate back and forth between steps
- [ ] Form data is preserved when navigating between steps

**Validation:**
- [ ] Step 1 validates: product type, episode count, language, show
- [ ] Step 2 validates: vendor, deadline, minutes for all 5 phases
- [ ] Cannot proceed to next step without completing current step
- [ ] Error messages appear for invalid fields

### VendorAssignmentStep Component

**Renders correctly:**
- [ ] Shows all 5 phases
- [ ] Each phase has vendor selector, deadline picker, minutes input
- [ ] Voice Recording phase allows multiple vendors
- [ ] Indicator shows assignments apply to all episodes

**User interactions:**
- [ ] Selecting vendor updates assignment
- [ ] Setting deadline updates assignment
- [ ] Entering minutes updates assignment
- [ ] Creating new vendor calls `onCreateVendor`
- [ ] Changes call `onAssignmentChange`

---

## Edge Cases

- [ ] Handles creating order with 1 episode and 100+ episodes
- [ ] Handles creating order with very long show names
- [ ] Handles creating multiple vendors during one order creation
- [ ] Handles creating show and vendors in same session
- [ ] Preserves form data when navigating away and back
- [ ] Handles network errors during order creation
- [ ] Handles partial failures (order created but episodes failed)

---

## Accessibility Checks

- [ ] All form fields have associated labels
- [ ] Multi-step navigation is keyboard accessible
- [ ] Error messages are announced to screen readers
- [ ] Focus is managed appropriately between steps
- [ ] Required fields are clearly marked

---

## Sample Test Data

```typescript
// Example test data - order creation
const mockOrderCreationData = {
  productType: "miniserie",
  episodeCount: 6,
  language: "es-AR",
  showId: "show-001",
  showName: "Dark Secrets",
  vendorAssignments: [
    {
      phase: "adaptación",
      vendors: [{ vendorId: "ven-001", vendorName: "Adaptation Pro", estimatedMinutes: 45 }],
      deadline: "2024-02-15T10:00:00Z"
    },
    {
      phase: "voice recording",
      vendors: [
        { vendorId: "ven-002", vendorName: "Voice Talent One", estimatedMinutes: 50 },
        { vendorId: "ven-003", vendorName: "Voice Talent Two", estimatedMinutes: 50 }
      ],
      deadline: "2024-02-20T10:00:00Z"
    }
    // ... more phases
  ]
};

// Example test data - validation errors
const mockValidationErrors = {
  productType: "Tipo de producto es requerido",
  episodeCount: "Cantidad de episodios debe ser mayor a 0",
  vendorAssignments: {
    adaptación: {
      vendor: "Debe seleccionar un vendor para Adaptación",
      deadline: "Debe establecer un deadline para Adaptación",
      minutes: "Debe ingresar minutos estimados para Adaptación"
    }
  }
};
```

---

## Notes for Test Implementation

- Mock API calls for order creation, show creation, vendor creation
- Test that all 5 phases are required
- Verify that multiple vendors can be assigned to Voice Recording
- Test that form data persists when navigating between steps
- Verify that order creation generates correct number of episodes
- Verify that all episodes inherit vendor assignments
- Test vendor and show creation during order creation flow
- **Always test empty states** — No shows, no vendors scenarios
