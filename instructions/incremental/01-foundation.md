# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/product-overview.md` — Product context

## Done When

- [ ] Design tokens are configured
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Application shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] User menu shows user info (if applicable)
- [ ] Responsive on mobile
