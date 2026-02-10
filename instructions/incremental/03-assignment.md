# Milestone 3: Assignment

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) and Milestone 2 (Orders) complete

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

See `product-plan/sections/assignment/tests.md` for detailed test-writing instructions including:
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

The provided components include empty state designs — make sure to render them when data is empty rather than showing blank screens.

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
