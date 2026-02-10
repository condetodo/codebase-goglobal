# Milestone 6: Settlement

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation), Milestone 2 (Orders), Milestone 4 (Vendors), and Milestone 5 (Rates) complete

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

See `product-plan/sections/settlement/tests.md` for detailed test-writing instructions including:
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

The provided components include empty state designs — make sure to render them when data is empty rather than showing blank screens.

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
