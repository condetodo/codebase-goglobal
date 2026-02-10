# Go Global Dubbing Manager — Complete Implementation Instructions

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic** — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions include:
- Specific UI elements, button labels, and interactions to verify
- Expected success and failure behaviors
- Empty state handling (when no records exist yet)
- Data assertions and state validations

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, routing structure.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Color Palette:**
- Primary: `blue-900` — Used for buttons, links, key accents
- Secondary: `red-700` — Used for tags, highlights, secondary elements
- Neutral: `stone` — Used for backgrounds, text, borders

**Typography:**
- Heading: Montserrat
- Body: Open Sans
- Mono: IBM Plex Mono

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Core Entities:**
- Order — Una orden de doblaje que entra al sistema
- Episode — Un episodio individual que pertenece a una orden
- Show — Una serie o programa de televisión que agrupa episodios
- Vendor — Un proveedor que realiza trabajo de doblaje
- Assignment — Una asignación de trabajo que conecta un vendor con un episodio
- Rate — Reglas de tarifas que definen cómo se calculan los pagos
- PurchaseOrder — Una orden de compra consolidada
- Payment — Un registro de pago calculado y procesado

### 3. Routing Structure

Create placeholder routes for each section:

- `/orders` — Gestión de órdenes y episodios
- `/assignment` — Creación de nuevas Orders
- `/vendors` — Gestión de vendors
- `/rates` — Configuración de tarifas
- `/settlement` — Liquidación y pagos

### 4. Application Shell

**Note:** An application shell hasn't been designed yet. You'll need to design and implement your own application shell with:
- Navigation for all sections (Orders, Assignment, Vendors, Rates, Settlement)
- User menu with avatar
- Responsive layout
- Consistent header/footer structure

## Done When

- [ ] Design tokens are configured
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Application shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] User menu shows user info (if applicable)
- [ ] Responsive on mobile

---

# Milestone 2: Orders

## Goal

Implement the Orders feature — gestión de órdenes (shows) y episodios con asignaciones heredadas automáticamente.

## Overview

This section enables users to manage dubbing orders (shows) and their episodes. The key functionality is that vendor assignments and deadlines are configured once at the Order level and automatically apply to all episodes, eliminating the need to manually configure each episode individually.

**Key Functionality:**
- View a list of all orders with status indicators and filters
- View order details with vendor assignments and episode list
- Edit episodes with inherited vendor assignments from Order level
- Add new episodes to existing orders (they automatically inherit assignments)
- Edit basic order information
- Modify vendor assignments at Order level (changes propagate to all episodes)

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/orders/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/orders/components/`:

- `OrdersList.tsx` — Main list view of all orders
- `OrderDetail.tsx` — Detail view of a single order with episodes
- `EpisodeEdit.tsx` — Edit view for individual episodes

### Data Layer

The components expect these data shapes:

- `Order` — Order with vendor assignments at Order level
- `Episode` — Episode that inherits assignments from Order
- `Show` — Show/series that groups episodes
- `AssignedVendor` — Vendor assignment with phase and minutes worked

You'll need to:
- Create API endpoints for orders, episodes, and shows
- Implement logic to automatically apply Order-level assignments to episodes
- Handle episode exceptions (overrides of Order-level assignments)
- Connect real data to the components

### Callbacks

Wire up these user actions:

- `onView` — Navigate to order detail view
- `onEdit` — Edit order information
- `onDelete` — Delete an order
- `onCreate` — Navigate to order creation (Assignment section)
- `onAddEpisode` — Add new episodes to an order
- `onEpisodeClick` — Navigate to episode edit view
- `onEditVendorAssignments` — Edit vendor assignments at Order level
- `onStatusChange` — Change order status
- `onSave` (EpisodeEdit) — Save episode changes
- `onAddVendor` (EpisodeEdit) — Add vendor exception to episode
- `onRemoveVendor` (EpisodeEdit) — Remove vendor exception
- `onUpdateMinutes` (EpisodeEdit) — Update minutes worked for vendor
- `onOverrideVendor` (EpisodeEdit) — Override Order-level assignment
- `onRestoreVendor` (EpisodeEdit) — Restore Order-level assignment

### Empty States

Implement empty state UI for when no records exist yet:

- **No orders yet:** Show helpful message and "Nueva Orden" CTA when orders list is empty
- **No episodes in order:** Show message when order has no episodes yet
- **First-time user experience:** Guide users to create their first order

## Files to Reference

- `product-plan/sections/orders/README.md` — Feature overview and design intent
- `product-plan/sections/orders/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/orders/components/` — React components
- `product-plan/sections/orders/types.ts` — TypeScript interfaces
- `product-plan/sections/orders/sample-data.json` — Test data

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: View Orders List

1. User navigates to `/orders`
2. User sees list of all orders with key information
3. User can filter by status, product type, show, language
4. User can search orders
5. User clicks on an order to view details
6. **Outcome:** Order detail view opens with all information

### Flow 2: View Order Detail

1. User clicks on an order from the list
2. User sees order information and vendor assignments at Order level
3. User sees list of episodes (each showing inherited assignments indicator)
4. User can add new episodes
5. User can edit order information
6. User can modify vendor assignments at Order level
7. **Outcome:** Changes propagate to all episodes automatically

### Flow 3: Edit Episode

1. User clicks on an episode from order detail
2. User sees episode edit view with inherited assignments from Order
3. User can edit episode duration, status, minutes worked
4. User can add vendor exceptions (overrides)
5. User can restore Order-level assignments if overridden
6. User saves changes
7. **Outcome:** Episode updates, exceptions are preserved

### Flow 4: Add Episodes to Order

1. User is on order detail view
2. User clicks "Agregar Episodios"
3. User enters number of episodes or episode details
4. System shows warning that new episodes will inherit Order assignments
5. User confirms
6. **Outcome:** New episodes are created and automatically inherit all Order-level vendor assignments and deadlines

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] Order list shows all orders with filters and search working
- [ ] Order detail shows vendor assignments at Order level
- [ ] Episodes inherit assignments from Order automatically
- [ ] Episode exceptions (overrides) work correctly
- [ ] Adding new episodes applies Order assignments automatically
- [ ] All user actions work (view, edit, delete, add episodes)
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design
- [ ] Responsive on mobile

---

# Milestone 3: Assignment

## Goal

Implement the Assignment feature — formulario de creación de nuevas Orders con asignación completa de vendors, deadlines y minutos estimados para cada una de las 5 etapas del proceso de doblaje.

## Overview

This section is the main entry point for creating new dubbing orders. It provides a multi-step form that allows users to configure all necessary information for a dubbing project, including vendor assignments that automatically apply to all episodes.

**Key Functionality:**
- Multi-step form (Basic Info → Vendor Assignments → Summary)
- Assign multiple vendors per phase (especially for Voice Talents)
- Create new vendors directly from the form
- Assign deadlines and estimated minutes per phase
- All assignments automatically apply to all generated episodes

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/assignment/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/assignment/components/`:

- `OrderCreationForm.tsx` — Main multi-step form container
- `BasicInfoStep.tsx` — Step 1: Basic order information
- `VendorAssignmentStep.tsx` — Step 2: Vendor assignments for all 5 phases
- `OrderSummaryStep.tsx` — Step 3: Review and confirm

### Data Layer

The components expect these data shapes:

- `OrderCreationData` — Complete order data with vendor assignments
- `VendorAssignment` — Vendor assignment per phase with deadline
- `VendorAssignmentItem` — Individual vendor in a phase assignment
- `Show` — Show/series (can be selected or created)
- `Vendor` — Vendor (can be selected or created)

You'll need to:
- Create API endpoint to create orders with episodes
- Implement logic to automatically generate episodes from episode count
- Apply vendor assignments to all generated episodes
- Handle vendor creation during order creation
- Handle show creation during order creation

### Callbacks

Wire up these user actions:

- `onCreate` — Create the order with all data
- `onCancel` — Cancel order creation
- `onCreateVendor` (VendorAssignmentStep) — Create new vendor during assignment
- `onAssignmentChange` (VendorAssignmentStep) — Update vendor assignment for a phase

### Empty States

Implement empty state UI for when no records exist yet:

- **No shows available:** Show option to create new show
- **No vendors available:** Show option to create new vendor
- **First-time user experience:** Guide users through the form steps

## Files to Reference

- `product-plan/sections/assignment/README.md` — Feature overview and design intent
- `product-plan/sections/assignment/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/assignment/components/` — React components
- `product-plan/sections/assignment/types.ts` — TypeScript interfaces
- `product-plan/sections/assignment/sample-data.json` — Test data

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Create New Order with Complete Vendor Assignments

1. User navigates to `/assignment` or clicks "Nueva Order" from Orders
2. User sees multi-step form
3. **Step 1:** User enters basic info (product type, episode count, language, show)
4. **Step 2:** User assigns vendors and deadlines for all 5 phases:
   - Adaptación: Select adaptador, set deadline, enter minutes
   - Voice Recording: Select multiple voice talents, set deadline, enter minutes
   - Sound Editing: Select editor, set deadline, enter minutes
   - Subtítulos: Select subtitulador, set deadline, enter minutes
   - QA: Select auditor, set deadline, enter minutes
5. User can create new vendors or shows during the process
6. **Step 3:** User reviews summary
7. User confirms and creates order
8. **Outcome:** Order is created, episodes are generated automatically, all episodes inherit vendor assignments and deadlines

### Flow 2: Create Vendor During Order Creation

1. User is on Step 2 (Vendor Assignments)
2. User clicks "Crear Nuevo Vendor" for a phase
3. User fills in vendor form (name, email, phone, currency, specializations)
4. User saves new vendor
5. **Outcome:** New vendor is created and automatically selected for that phase

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data
- [ ] Multi-step form navigation works correctly
- [ ] All 5 phases can have vendors assigned
- [ ] Multiple vendors can be assigned to Voice Recording phase
- [ ] Deadlines and minutes are required for all phases
- [ ] New vendors can be created during order creation
- [ ] New shows can be created during order creation
- [ ] Order creation generates episodes automatically
- [ ] Generated episodes inherit all vendor assignments
- [ ] Validation prevents proceeding without completing all required fields
- [ ] Empty states display properly
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design
- [ ] Responsive on mobile

---

# Milestone 4: Vendors

## Goal

Implement the Vendors feature — gestión de vendors (proveedores) con información completa, especializaciones, configuración de pagos, y historial de trabajos.

## Overview

This section enables users to manage all vendors (voice talents, adapters, editors, etc.) in the system. Vendors can be assigned to episodes in different phases and contain contact information, payment configuration, technical details, and work history.

**Key Functionality:**
- View a list of all vendors with filters and search
- Create new vendors with complete information
- Edit existing vendor details
- View vendor detail with work history
- Toggle vendor active/inactive status
- Filter vendors by type, language, currency, gender, active status

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/vendors/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/vendors/components/`:

- `VendorsList.tsx` — Main list view of all vendors
- `VendorDetail.tsx` — Detail view of a single vendor with work history
- `VendorForm.tsx` — Form for creating/editing vendors

### Data Layer

The components expect these data shapes:

- `Vendor` — Complete vendor information with contact, payment config, technical details
- `WorkHistoryItem` — Assignment history for a vendor

You'll need to:
- Create API endpoints for vendors CRUD operations
- Implement work history aggregation from assignments
- Connect real data to the components

### Callbacks

Wire up these user actions:

- `onView` — Navigate to vendor detail view
- `onEdit` — Edit vendor information
- `onDelete` — Delete a vendor
- `onCreate` — Create new vendor
- `onToggleActive` — Toggle vendor active/inactive status
- `onFilter` — Apply filters to vendor list
- `onSearch` — Search vendors by name/code/email
- `onSubmit` (VendorForm) — Save vendor (create or update)
- `onCancel` (VendorForm) — Cancel form
- `onWorkHistoryClick` (VendorDetail) — Navigate to assignment detail

### Empty States

Implement empty state UI for when no records exist yet:

- **No vendors yet:** Show helpful message and "Nuevo Vendor" CTA when vendors list is empty
- **No work history:** Show message when vendor has no assignments yet
- **First-time user experience:** Guide users to create their first vendor

## Files to Reference

- `product-plan/sections/vendors/README.md` — Feature overview and design intent
- `product-plan/sections/vendors/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/vendors/components/` — React components
- `product-plan/sections/vendors/types.ts` — TypeScript interfaces
- `product-plan/sections/vendors/sample-data.json` — Test data

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: View Vendors List

1. User navigates to `/vendors`
2. User sees list of all vendors with key information
3. User can filter by vendor type, language, currency, gender, active status
4. User can search by name, code, or email
5. User clicks on a vendor to view details
6. **Outcome:** Vendor detail view opens with all information and work history

### Flow 2: Create New Vendor

1. User clicks "Nuevo Vendor" button
2. User fills in vendor form with all required fields
3. User completes optional fields (photo, notes, technical details)
4. User saves the vendor
5. **Outcome:** New vendor appears in the list, success message shown

### Flow 3: Edit Vendor

1. User clicks on a vendor from the list
2. User sees vendor detail view
3. User clicks "Editar" button
4. User modifies vendor information
5. User saves changes
6. **Outcome:** Vendor updates in place, changes persisted

### Flow 4: Toggle Vendor Active Status

1. User is on vendors list
2. User toggles active/inactive status for a vendor
3. **Outcome:** Vendor status updates immediately, filtered lists reflect change

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] Vendor list shows all vendors with filters and search working
- [ ] Vendor detail shows complete information and work history
- [ ] Vendor form validates required fields
- [ ] All user actions work (view, edit, delete, create, toggle active)
- [ ] Work history displays correctly with assignment details
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design
- [ ] Responsive on mobile

---

# Milestone 5: Rates

## Goal

Implement the Rates feature — configuración de tarifas por fase/rol con franjas de minutos, bonos, y soporte multi-moneda.

## Overview

This section enables users to configure the master rate table that defines how payments are calculated. Rates vary by phase/role, minute ranges, bonuses, and currency, supporting complex payment calculation rules.

**Key Functionality:**
- View master rate table with all phases and minute ranges
- Create new rate entries
- Edit rate values inline (double-click on cells)
- View rate details
- Delete rate entries
- Support for multiple currencies (ARS, USD, BRL)
- Support for different calculation types (per minute, flat, per hour)

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/rates/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/rates/components/`:

- `RatesTable.tsx` — Main table view of all rates
- `RateDetail.tsx` — Detail view of a single rate
- `RateForm.tsx` — Form for creating/editing rates
- `CellEditor.tsx` — Inline cell editor for double-click editing

### Data Layer

The components expect these data shapes:

- `Rate` — Rate with phase, currency, calculation type, and minute ranges
- `MinuteRanges` — Rate values for different minute ranges (with and without bonus)

You'll need to:
- Create API endpoints for rates CRUD operations
- Implement inline editing for table cells
- Connect real data to the components

### Callbacks

Wire up these user actions:

- `onCreate` — Create new rate entry
- `onView` — View rate details
- `onEdit` — Edit rate entry
- `onDelete` — Delete rate entry
- `onCellEdit` — Edit specific cell value (double-click)
- `onSave` (CellEditor) — Save edited cell value
- `onCancel` (CellEditor) — Cancel cell editing

### Empty States

Implement empty state UI for when no records exist yet:

- **No rates yet:** Show helpful message and "Nueva Tarifa" CTA when rates table is empty
- **First-time user experience:** Guide users to create their first rate

## Files to Reference

- `product-plan/sections/rates/README.md` — Feature overview and design intent
- `product-plan/sections/rates/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/rates/components/` — React components
- `product-plan/sections/rates/types.ts` — TypeScript interfaces
- `product-plan/sections/rates/sample-data.json` — Test data

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: View Rates Table

1. User navigates to `/rates`
2. User sees table with all rates configured
3. Rows represent phases/roles
4. Columns represent minute ranges (each with "sin bono" and "con bono" columns)
5. User can see currency and calculation type for each rate
6. **Outcome:** Complete rate table displayed with all information

### Flow 2: Create New Rate

1. User clicks "Nueva Tarifa" button
2. User fills in rate form:
   - Selects phase/role
   - Selects currency
   - Selects calculation type
   - Enters values for all minute ranges (with and without bonus)
3. User saves the rate
4. **Outcome:** New rate appears in the table

### Flow 3: Edit Rate Inline (Double-Click)

1. User double-clicks on a cell in the rates table
2. Inline editor appears with current value
3. User modifies the value
4. User saves (or cancels)
5. **Outcome:** Cell value updates in place, table reflects change

### Flow 4: Edit Rate via Form

1. User clicks on a rate row or "Editar" button
2. User sees rate detail view
3. User clicks "Editar"
4. User modifies rate values in form
5. User saves changes
6. **Outcome:** Rate updates, table reflects changes

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] Rates table displays all rates correctly
- [ ] Inline cell editing works (double-click)
- [ ] Rate form creates and updates rates correctly
- [ ] All minute ranges are editable
- [ ] Currency and calculation type are configurable
- [ ] All user actions work (view, edit, delete, create, inline edit)
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design
- [ ] Responsive on mobile

---

# Milestone 6: Settlement

## Goal

Implement the Settlement feature — liquidación y pagos con cálculo automático, generación de POs, aprobación, y exportación al ERP.

## Overview

This section enables users to settle payments to vendors: automatically calculate payments based on completed assignments, generate consolidated Purchase Orders by vendor and month, approve POs, detect duplicate payments, and export to ERP.

**Key Functionality:**
- Calculate payments automatically by vendor, month, and phase according to rate rules
- Generate consolidated POs that group all assignments of a vendor per month
- Review and approve POs before sending to ERP
- Export approved POs to ERP system
- Detect duplicate payments automatically
- Register processed payments

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/settlement/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/settlement/components/`:

- `SettlementDashboard.tsx` — Main dashboard with calculations and POs

### Data Layer

The components expect these data shapes:

- `SettlementSummary` — Summary of the month with totals
- `CalculatedPayment` — Pre-PO calculation aggregation
- `PurchaseOrder` — Consolidated PO by vendor, month, currency
- `POLineItem` — Detail line item in a PO
- `Payment` — Payment record
- `DuplicatePaymentGroup` — Detected duplicate payments

You'll need to:
- Create API endpoints for payment calculations
- Implement PO generation logic
- Implement PO approval workflow
- Implement ERP export functionality
- Implement duplicate payment detection
- Implement payment registration

### Callbacks

Wire up these user actions:

- `onMonthChange` — Change selected month
- `onCalculatePayments` — Calculate payments for selected month
- `onGeneratePOs` — Generate POs from calculations
- `onViewCalculation` — View calculation details
- `onViewPO` — View PO details
- `onFilter` — Apply filters to lists

### Empty States

Implement empty state UI for when no records exist yet:

- **No calculations for month:** Show message when no completed assignments exist
- **No POs for month:** Show message when no POs have been generated
- **First-time user experience:** Guide users through the settlement process

## Files to Reference

- `product-plan/sections/settlement/README.md` — Feature overview and design intent
- `product-plan/sections/settlement/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/settlement/components/` — React components
- `product-plan/sections/settlement/types.ts` — TypeScript interfaces
- `product-plan/sections/settlement/sample-data.json` — Test data

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Calculate Payments and Generate POs

1. User navigates to `/settlement`
2. User selects month for settlement
3. User clicks "Calcular Pagos"
4. System calculates payments for all vendors with completed assignments
5. User reviews calculations in the table
6. User clicks "Generar POs"
7. **Outcome:** POs are generated, one per vendor and currency, with status "Borrador"

### Flow 2: Review and Approve PO

1. User views PO detail
2. User reviews all line items
3. User approves PO (changes status to "Pendiente Aprobación")
4. User with approval permission approves definitively
5. **Outcome:** PO status changes to "Aprobada", ready for ERP export

### Flow 3: Export PO to ERP

1. User views approved PO
2. User clicks "Exportar al ERP"
3. System generates export file
4. **Outcome:** PO status changes to "Enviada al ERP", export date recorded

### Flow 4: Register Payment

1. User views PO with status "Enviada al ERP"
2. User clicks "Registrar Pago"
3. User enters payment details (date, method, reference, amount)
4. User saves payment
5. **Outcome:** Payment recorded, PO status changes to "Pagada" if full payment

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] Payment calculation works correctly based on assignments and rates
- [ ] PO generation creates correct POs (one per vendor, month, currency)
- [ ] PO approval workflow works (draft → pending_approval → approved)
- [ ] ERP export generates correct file format
- [ ] Duplicate payment detection works
- [ ] Payment registration works correctly
- [ ] All user actions work
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design
- [ ] Responsive on mobile
