# Data Model

## Entities

### Order
Una orden de doblaje que entra al sistema. Representa un proyecto completo de doblaje que puede contener múltiples episodios. Las asignaciones de vendors y deadlines se configuran a nivel de Order y se aplican automáticamente a todos los episodios.

### Episode
Un episodio individual que pertenece a una orden. Cada episodio tiene una duración en minutos y hereda automáticamente las asignaciones de vendors y deadlines de su Order. Puede tener excepciones específicas que sobrescriben las asignaciones a nivel de Order.

### Show
Una serie o programa de televisión que agrupa episodios. Los shows pueden tener tarifas excepcionales configuradas que sobrescriben las tarifas estándar.

### Vendor
Un proveedor que realiza trabajo de doblaje. Los vendors pueden ser asignados a episodios en diferentes fases del proceso. Contiene información de contacto, especializaciones por fase, configuración de pagos (moneda, tarifas, bonos), y detalles técnicos (equipo, software, home studio).

### Assignment
Una asignación de trabajo que conecta un vendor con un episodio en una fase específica. Cada asignación representa el trabajo que un vendor debe realizar en una de las 5 fases del proceso de doblaje: adaptación, voice recording, sound editing, subtítulos, QA. Las asignaciones pueden configurarse a nivel de Order (aplicándose a todos los episodios) o como excepciones a nivel de Episode.

### Rate
Reglas de tarifas que definen cómo se calculan los pagos. Incluye tarifas por fase/rol con franjas de minutos (menos de 30, 30.1-59.9, 60-89.9, 90-119.9, más de 120), valores con y sin bono, tipo de cálculo (por minuto, flat, por hora), y soporte multi-moneda (ARS, USD, BRL).

### PurchaseOrder
Una orden de compra consolidada generada automáticamente para liquidar pagos a vendors. Agrupa todas las asignaciones de un vendor por mes y está lista para exportar al ERP. (Entidad futura - sección Settlement)

### Payment
Un registro de pago calculado y procesado. Representa el monto que se debe pagar a un vendor por una asignación específica, calculado según las reglas de tarifas aplicables. (Entidad futura - sección Settlement)

## Relationships

- Order has many Episodes
- Episode belongs to one Order
- Episode belongs to one Show
- Show has many Episodes
- Order has many VendorAssignments (asignaciones a nivel de Order que se aplican a todos los episodios)
- Episode inherits VendorAssignments from Order (puede tener excepciones específicas)
- Assignment belongs to one Episode
- Assignment belongs to one Vendor
- Vendor has many Assignments
- Assignment uses one Rate (determined by phase, show, duration, and other factors)
- Rate can apply to many Assignments
- PurchaseOrder belongs to one Vendor (futuro)
- PurchaseOrder contains many Payments (futuro)
- Payment belongs to one Assignment (futuro)
- Payment belongs to one PurchaseOrder (futuro)

## Fases del Proceso de Doblaje

El sistema maneja 5 fases principales del proceso de doblaje:

1. **adaptación** (PREPRODUCCIÓN) - Adaptación de guion
2. **voice recording** (PRODUCCIÓN) - Voice Talents (puede tener múltiples vendors)
3. **sound editing** (POSTPRODUCCIÓN) - Editor de sonido
4. **subtítulos** (POSTPRODUCCIÓN) - Creación de subtítulos
5. **QA** (POSTPRODUCCIÓN) - QA final

