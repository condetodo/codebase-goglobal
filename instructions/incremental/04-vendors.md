# Milestone 4: Vendors

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

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

See `product-plan/sections/vendors/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

The test instructions are framework-agnostic — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

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

The provided components include empty state designs — make sure to render them when data is empty rather than showing blank screens.

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
