# Milestone 2: Orders

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

See `product-plan/sections/orders/tests.md` for detailed test-writing instructions including:
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

The provided components include empty state designs — make sure to render them when data is empty rather than showing blank screens.

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
