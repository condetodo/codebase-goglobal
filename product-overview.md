# Go Global Dubbing Manager — Product Overview

## Summary

Sistema para gestionar el ciclo completo de proyectos de doblaje: desde la entrada de una orden hasta el pago a cada vendor. Reemplaza una planilla de Excel con fórmulas frágiles y procesos manuales, automatizando la asignación de trabajo, el seguimiento del avance y la liquidación de pagos con reglas de tarifas complejas.

El sistema permite asignar vendors a nivel de Order (show) una sola vez, y estas asignaciones se aplican automáticamente a todos los capítulos/episodios, eliminando la necesidad de configurar manualmente cada episodio individual. Esto acelera significativamente la configuración de nuevos proyectos y asegura consistencia en las asignaciones.

## Planned Sections

1. **Orders** — Gestión de órdenes (shows) y episodios: visualización de órdenes existentes, detalle de órdenes con información de vendors asignados a nivel de Order, gestión de episodios que heredan automáticamente las asignaciones de vendors y deadlines. Permite agregar nuevos episodios a órdenes existentes (que heredan automáticamente las asignaciones) y editar información básica de órdenes.

2. **Assignment** — Formulario de creación de nuevas Orders (shows) con asignación completa de vendors, deadlines y minutos estimados para cada una de las 5 etapas del proceso de doblaje. Este es el punto de entrada principal para crear nuevos proyectos.

3. **Vendors** — Gestión de vendors: registro y administración de proveedores (voice talents, adaptadores, editores, subtituladores, auditores) con información de contacto, especializaciones por etapa del proceso, configuración de pagos, estado activo/inactivo, y detalles técnicos.

4. **Rates** — Configuración de tarifas: tabla maestra de tarifas por fase/rol con franjas de minutos, bonos, excepciones por show, y soporte multi-moneda (ARS, USD, BRL). Permite calcular automáticamente los pagos basados en los minutos trabajados y las reglas de tarifas configuradas.

5. **Settlement** — Liquidación y pagos: cálculo automático de pagos basado en asignaciones de vendors, minutos trabajados y reglas de tarifas, detección de pagos duplicados, generación de POs consolidadas por vendor y mes, y exportación al ERP.

## Data Model

**Core Entities:**
- Order — Una orden de doblaje que entra al sistema. Representa un proyecto completo de doblaje que puede contener múltiples episodios.
- Episode — Un episodio individual que pertenece a una orden. Cada episodio tiene una duración en minutos y hereda automáticamente las asignaciones de vendors y deadlines de su Order.
- Show — Una serie o programa de televisión que agrupa episodios. Los shows pueden tener tarifas excepcionales configuradas.
- Vendor — Un proveedor que realiza trabajo de doblaje. Los vendors pueden ser asignados a episodios en diferentes fases del proceso.
- Assignment — Una asignación de trabajo que conecta un vendor con un episodio en una fase específica.
- Rate — Reglas de tarifas que definen cómo se calculan los pagos.
- PurchaseOrder — Una orden de compra consolidada generada automáticamente para liquidar pagos a vendors.
- Payment — Un registro de pago calculado y procesado.

**Fases del Proceso de Doblaje:**
1. adaptación (PREPRODUCCIÓN) - Adaptación de guion
2. voice recording (PRODUCCIÓN) - Voice Talents
3. sound editing (POSTPRODUCCIÓN) - Editor de sonido
4. subtítulos (POSTPRODUCCIÓN) - Creación de subtítulos
5. QA (POSTPRODUCCIÓN) - QA final

## Design System

**Colors:**
- Primary: blue-900
- Secondary: red-700
- Neutral: stone

**Typography:**
- Heading: Montserrat
- Body: Open Sans
- Mono: IBM Plex Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, and routing structure
2. **Orders** — Gestión de órdenes y episodios con asignaciones heredadas
3. **Assignment** — Formulario de creación de Orders con asignación de vendors
4. **Vendors** — Gestión de proveedores y sus especializaciones
5. **Rates** — Configuración de tarifas con franjas y bonos
6. **Settlement** — Liquidación y generación de POs

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
