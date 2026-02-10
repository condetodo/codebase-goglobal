# Milestone 5: Rates

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

See `product-plan/sections/rates/tests.md` for detailed test-writing instructions including:
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

The provided components include empty state designs — make sure to render them when data is empty rather than showing blank screens.

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
