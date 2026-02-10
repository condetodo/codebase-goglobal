# Test Instructions: Orders

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

This section manages dubbing orders (shows) and their episodes. Key functionality includes viewing orders, managing episodes that automatically inherit vendor assignments from Order level, and editing episode details with exception handling.

---

## User Flow Tests

### Flow 1: View Orders List

**Scenario:** User wants to see all orders in the system

#### Success Path

**Setup:**
- Multiple orders exist in the system
- User is authenticated

**Steps:**
1. User navigates to `/orders`
2. User sees the Orders list page
3. User sees table with orders showing: order number, product type, show name, episode count, status, language
4. User can see status badges with correct colors
5. User can filter orders by status, product type, show, language
6. User can search orders
7. User clicks on an order row

**Expected Results:**
- [ ] Orders table displays all orders correctly
- [ ] Status badges show correct colors (pendiente: stone, en_proceso: blue, completada: green, cancelada: red)
- [ ] Filters work correctly (status, product type, show, language)
- [ ] Search filters orders by order number or show name
- [ ] Clicking order row calls `onView` with order ID
- [ ] Empty state shows when no orders exist

#### Failure Path: No Orders

**Setup:**
- No orders exist in the system

**Expected Results:**
- [ ] Empty state message appears: "No hay órdenes disponibles"
- [ ] "Nueva Orden" button is visible and functional
- [ ] Table shows helpful empty state, not blank screen

---

### Flow 2: View Order Detail

**Scenario:** User wants to see details of a specific order

#### Success Path

**Setup:**
- Order exists with vendor assignments at Order level
- Order has multiple episodes

**Steps:**
1. User clicks on an order from the list
2. User sees order detail view
3. User sees order information: order number, product type, show, language, status, episode count
4. User sees "Vendors y Deadlines Asignados a Nivel de Order" section
5. User sees all 5 phases with assigned vendors and deadlines
6. User sees episodes list with inherited assignments indicator
7. User clicks on an episode

**Expected Results:**
- [ ] Order detail shows all order information correctly
- [ ] Vendor assignments section shows all 5 phases
- [ ] Each phase shows vendor name(s) and deadline
- [ ] Episodes list shows all episodes
- [ ] Each episode shows indicator that it inherits assignments from Order
- [ ] Clicking episode calls `onEpisodeClick` with episode ID
- [ ] "Agregar Episodios" button is visible
- [ ] "Editar Asignaciones y Deadlines" button is visible

---

### Flow 3: Add Episodes to Existing Order

**Scenario:** User wants to add new episodes to an order

#### Success Path

**Setup:**
- Order exists with vendor assignments at Order level
- Order has some episodes already

**Steps:**
1. User is on order detail view
2. User clicks "Agregar Episodios" button
3. User sees form/modal to add episodes
4. User enters number of episodes to add (or episode details)
5. System shows warning: "Los nuevos episodios heredarán automáticamente los vendors y deadlines asignados a nivel de Order"
6. User confirms addition
7. User clicks save/confirm

**Expected Results:**
- [ ] Form/modal opens correctly
- [ ] Warning message is visible about inheritance
- [ ] New episodes are created
- [ ] New episodes automatically inherit all Order-level vendor assignments
- [ ] New episodes appear in episodes list
- [ ] Episodes show inherited assignments indicator
- [ ] `onAddEpisode` is called with order ID

#### Failure Path: Invalid Input

**Setup:**
- User enters invalid number (negative, zero, etc.)

**Steps:**
1. User enters invalid episode count
2. User tries to save

**Expected Results:**
- [ ] Validation error appears
- [ ] Form is not submitted
- [ ] User can correct the input

---

### Flow 4: Edit Episode

**Scenario:** User wants to edit an episode's details

#### Success Path

**Setup:**
- Order exists with vendor assignments at Order level
- Episode exists with inherited assignments

**Steps:**
1. User clicks on an episode from order detail
2. User sees episode edit view
3. User sees "Vendors y Deadlines Heredados de la Order" section (read-only)
4. User sees all 5 phases with inherited vendors and deadlines
5. User edits episode duration
6. User edits episode status
7. User adds vendor exception (override) for a phase
8. User updates minutes worked for a vendor
9. User saves changes

**Expected Results:**
- [ ] Episode edit view shows inherited assignments clearly
- [ ] Inherited assignments section is read-only
- [ ] User can edit duration, status, minutes worked
- [ ] User can add vendor exceptions
- [ ] Vendor exceptions override Order-level assignments for that episode
- [ ] "Restaurar asignación de Order" option appears for overridden assignments
- [ ] Saving calls `onSave` with updated episode data
- [ ] Changes are persisted

#### Failure Path: Validation Errors

**Setup:**
- User enters invalid data

**Steps:**
1. User enters negative duration
2. User tries to save

**Expected Results:**
- [ ] Validation error appears
- [ ] Form is not submitted
- [ ] User can correct the input

---

### Flow 5: Edit Vendor Assignments at Order Level

**Scenario:** User wants to modify vendor assignments that apply to all episodes

#### Success Path

**Setup:**
- Order exists with vendor assignments
- Order has multiple episodes

**Steps:**
1. User is on order detail view
2. User clicks "Editar Asignaciones y Deadlines"
3. User sees form with current assignments for all 5 phases
4. User modifies vendor for a phase
5. User modifies deadline for a phase
6. User saves changes
7. System shows confirmation: "Los cambios se aplicarán a todos los episodios"

**Expected Results:**
- [ ] Form opens with current assignments
- [ ] User can modify vendors and deadlines for all phases
- [ ] Confirmation message appears about propagation
- [ ] Changes are saved
- [ ] All episodes are updated with new assignments
- [ ] Episodes show updated assignments
- [ ] `onEditVendorAssignments` is called

---

## Empty State Tests

### Primary Empty State

**Scenario:** User has no orders yet (first-time or all deleted)

**Setup:**
- Orders list is empty (`[]`)

**Expected Results:**
- [ ] Shows heading "No hay órdenes disponibles"
- [ ] Shows text "Crea tu primera orden para comenzar"
- [ ] Shows button "Nueva Orden"
- [ ] Clicking "Nueva Orden" navigates to order creation (Assignment section)
- [ ] No blank screen - UI is helpful

### Order with No Episodes

**Scenario:** Order exists but has no episodes yet

**Setup:**
- Order exists
- Episodes array is empty (`[]`)

**Expected Results:**
- [ ] Order detail renders correctly
- [ ] Episodes section shows "No hay episodios en esta orden"
- [ ] Shows "Agregar Episodios" button
- [ ] Button is functional

---

## Component Interaction Tests

### OrdersList Component

**Renders correctly:**
- [ ] Displays all orders in table format
- [ ] Shows correct columns: order number, product type, show, episode count, status, language
- [ ] Status badges have correct colors
- [ ] Product type labels are correct (Miniserie, Serie, Película, Documental)

**User interactions:**
- [ ] Clicking order row calls `onView` with order ID
- [ ] Clicking "Nueva Orden" calls `onCreate`
- [ ] Filtering by status updates table
- [ ] Searching updates table
- [ ] All filters can be combined

**Loading and error states:**
- [ ] Shows loading state while fetching orders
- [ ] Shows error message if fetch fails

### OrderDetail Component

**Renders correctly:**
- [ ] Displays all order information
- [ ] Shows vendor assignments section with all 5 phases
- [ ] Shows episodes list
- [ ] Each episode shows inherited assignments indicator

**User interactions:**
- [ ] Clicking episode calls `onEpisodeClick` with episode ID
- [ ] Clicking "Agregar Episodios" calls `onAddEpisode`
- [ ] Clicking "Editar Asignaciones y Deadlines" calls `onEditVendorAssignments`
- [ ] Changing status calls `onStatusChange`

### EpisodeEdit Component

**Renders correctly:**
- [ ] Shows inherited assignments section (read-only)
- [ ] Shows episode-specific exceptions section
- [ ] Displays all editable fields

**User interactions:**
- [ ] Saving calls `onSave` with updated episode
- [ ] Adding vendor exception calls `onAddVendor`
- [ ] Removing vendor exception calls `onRemoveVendor`
- [ ] Updating minutes calls `onUpdateMinutes`
- [ ] Overriding vendor calls `onOverrideVendor`
- [ ] Restoring vendor calls `onRestoreVendor`

---

## Edge Cases

- [ ] Handles orders with 1 episode and 100+ episodes
- [ ] Handles episodes with no vendor exceptions
- [ ] Handles episodes with multiple vendor exceptions
- [ ] Handles very long show names (text truncation)
- [ ] Handles orders with all episodes completed
- [ ] Handles orders with all episodes pending
- [ ] Preserves data when navigating away and back
- [ ] Transition from empty to first order created
- [ ] Transition from order with episodes to all episodes deleted

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
const mockOrder = {
  id: "ord-001",
  orderNumber: "ORD-2024-001",
  productType: "miniserie",
  showId: "show-001",
  showName: "Dark Secrets",
  language: "es-AR",
  status: "en_proceso",
  episodeCount: 6,
  vendorAssignments: [
    {
      phase: "adaptación",
      vendors: [{ vendorId: "ven-001", vendorName: "Adaptation Pro", estimatedMinutes: 45 }],
      deadline: "2024-02-15T10:00:00Z"
    }
    // ... more phases
  ]
};

const mockEpisode = {
  id: "ep-001",
  orderId: "ord-001",
  episodeNumber: 1,
  title: "Dark Secrets - Episodio 1",
  duration: 45,
  status: "en_produccion",
  showId: "show-001",
  showName: "Dark Secrets",
  assignedVendors: [
    {
      vendorId: "ven-001",
      vendorName: "Adaptation Pro",
      phase: "adaptación",
      minutesWorked: 42
    }
  ]
};

// Example test data - empty states
const mockEmptyOrders = [];
const mockOrderWithNoEpisodes = {
  ...mockOrder,
  episodeCount: 0
};
```

---

## Notes for Test Implementation

- Mock API calls to test both success and failure scenarios
- Test each callback prop is called with correct arguments
- Verify UI updates optimistically where appropriate
- Test that loading states appear during async operations
- Ensure error boundaries catch and display errors gracefully
- **Always test empty states** — Pass empty arrays to verify helpful empty state UI appears
- Test transitions: empty → first order created, order with no episodes → episodes added
- Verify that episode assignments correctly inherit from Order level
- Test that vendor exceptions override Order-level assignments correctly
- Verify that modifying Order-level assignments propagates to all episodes
