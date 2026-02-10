# Settlement Specification (Liquidación y Pagos)

## Overview
Sección para liquidar pagos a vendors: cálculo automático de pagos basado en asignaciones completadas, minutos trabajados y reglas de tarifas, generación de Purchase Orders (POs) consolidadas por vendor y mes, aprobación de POs, detección de pagos duplicados, y exportación al ERP.

**Funcionalidad clave**: 
- Cálculo automático de pagos por vendor, mes y fase según reglas de tarifas
- Generación de POs consolidadas que agrupan todas las asignaciones de un vendor por mes
- Detección automática de pagos duplicados
- Flujo de aprobación para POs antes de enviar al ERP
- Exportación de POs al sistema ERP

## User Flows

### Flow 1: Calcular Pagos y Generar POs para un Mes
1. Usuario accede a la sección Settlement
2. Usuario selecciona mes de liquidación (formato YYYY-MM, ej: "2025-09")
3. Sistema muestra lista de vendors con asignaciones completadas en ese mes
4. Para cada vendor, sistema muestra:
   - Total de asignaciones
   - Total de minutos trabajados
   - Desglose por fase (adaptación, voice recording, sound editing, subtítulos, QA)
   - Subtotal (sin bonos)
   - Bonos aplicables (calidad, mensual, show completo)
   - Total a pagar
   - Moneda
5. Usuario revisa los cálculos
6. Usuario hace clic en "Generar POs" o "Generar PO para este vendor"
7. Sistema genera Purchase Orders:
   - Una PO por vendor y moneda
   - Número de PO automático (formato: PO-YYYY-MM-XXX)
   - Estado inicial: "draft"
   - Incluye line items con detalle de cada asignación (order, show, episode, fase, minutos, tarifa, monto)
8. Sistema muestra resumen de POs generadas

### Flow 2: Revisar y Aprobar POs
1. Usuario accede a lista de POs (filtradas por mes, estado, vendor)
2. Usuario hace clic en una PO para ver detalle
3. Vista de detalle muestra:
   - Información del vendor
   - Mes de liquidación
   - Moneda
   - Desglose de line items (cada asignación con detalles)
   - Subtotal
   - Bonos
   - Total
   - Estado actual
4. Usuario revisa cada line item
5. Usuario puede:
   - Aprobar la PO (cambia estado a "pending_approval")
   - Rechazar/Editar la PO (si está en draft)
   - Ver PDF generado de la PO
6. Usuario con permisos de aprobación puede aprobar definitivamente (cambia estado a "approved")
7. PO aprobada queda lista para exportar al ERP

### Flow 3: Exportar PO al ERP
1. Usuario accede a PO con estado "approved"
2. Usuario hace clic en "Exportar al ERP"
3. Sistema genera archivo de exportación (formato según integración ERP)
4. Sistema actualiza estado de PO a "sent_to_erp"
5. Sistema registra fecha de exportación y referencia del ERP (si aplica)
6. PO queda marcada como enviada

### Flow 4: Detectar Pagos Duplicados
1. Sistema ejecuta detección automática de duplicados (diaria o manual)
2. Usuario accede a vista de "Pagos Duplicados"
3. Sistema muestra grupos de pagos potencialmente duplicados:
   - Mismo vendor
   - Mismo order/show
   - Mismo mes
   - Montos similares o idénticos
4. Usuario revisa cada caso
5. Usuario puede:
   - Marcar como duplicado y cancelar uno de los pagos
   - Confirmar que no es duplicado (son pagos legítimos diferentes)
6. Sistema registra acciones tomadas

### Flow 5: Registrar Pago Procesado
1. Usuario accede a PO con estado "sent_to_erp" o "approved"
2. Usuario hace clic en "Registrar Pago"
3. Usuario ingresa:
   - Fecha de pago
   - Método de pago (transferencia bancaria, cheque, etc.)
   - Número de referencia
   - Monto pagado (puede ser parcial)
4. Sistema actualiza estado de PO a "paid" (si es pago completo)
5. Sistema registra el pago en historial
6. Sistema genera hash MD5 para detección de duplicados

## Screen Designs

### 1. Settlement Dashboard (Vista Principal)
**Ruta:** `/settlement`

**Componentes:**
- **Filtros superiores:**
  - Selector de mes (YYYY-MM) - default: mes actual
  - Filtro por vendor (opcional)
  - Filtro por estado de PO (draft, pending_approval, approved, sent_to_erp, paid)
  - Botón "Calcular Pagos" para mes seleccionado
  - Botón "Generar POs" (solo si hay cálculos pendientes)

- **Resumen del mes:**
  - Total de vendors con asignaciones
  - Total de asignaciones
  - Total de minutos trabajados
  - Total a pagar (desglosado por moneda: ARS, USD, BRL)
  - Cantidad de POs generadas
  - Cantidad de POs pendientes de aprobación

- **Lista de Cálculos por Vendor:**
  - Tabla con columnas:
    - Vendor (nombre)
    - Fase/Rol
    - Moneda
    - # Asignaciones
    - Minutos totales
    - Subtotal
    - Bonos
    - Total
    - Estado (calculado, PO generada, PO aprobada)
    - Acciones (Ver detalle, Generar PO)
  - Agrupado por vendor y moneda
  - Ordenable por cualquier columna
  - Paginación si hay muchos vendors

- **Lista de POs:**
  - Tabla con columnas:
    - Número de PO
    - Vendor
    - Mes
    - Moneda
    - Total
    - Estado
    - Fecha generación
    - Acciones (Ver, Aprobar, Exportar, PDF)
  - Filtros aplicados
  - Indicadores visuales de estado (badges de colores)

### 2. Vista de Detalle de Cálculo (Pre-PO)
**Ruta:** `/settlement/calculations/:vendorId/:month/:phase`

**Componentes:**
- **Header:**
  - Nombre del vendor
  - Mes de liquidación
  - Fase/Rol
  - Moneda

- **Resumen:**
  - Total de asignaciones incluidas
  - Total de minutos trabajados
  - Subtotal (sin bonos)
  - Bonos desglosados:
    - Bono de calidad
    - Bono mensual
    - Bono show completo
  - Total a pagar

- **Lista de Asignaciones:**
  - Tabla con detalle de cada assignment:
    - Order Number
    - Show
    - Episode
    - Minutos trabajados
    - Tarifa aplicada
    - Subtotal
    - Bonos aplicados
    - Total
  - Ordenable y filtrable

- **Acciones:**
  - Botón "Generar PO" (crea PO con estos cálculos)
  - Botón "Exportar a Excel" (para revisión externa)
  - Botón "Volver"

### 3. Vista de Detalle de PO
**Ruta:** `/settlement/purchase-orders/:poId`

**Componentes:**
- **Header de PO:**
  - Número de PO
  - Vendor (nombre completo, email, datos de contacto)
  - Mes de liquidación
  - Moneda
  - Estado (badge con color)
  - Fechas relevantes (generación, aprobación, envío al ERP, pago)

- **Resumen Financiero:**
  - Subtotal
  - Bonos totales
  - Total a pagar
  - Monto pagado (si aplica)
  - Saldo pendiente (si aplica)

- **Line Items:**
  - Tabla con detalle de cada asignación:
    - # Línea
    - Order Number
    - Show
    - Episode
    - Fase
    - Cantidad (minutos o líneas)
    - Unidad
    - Precio unitario
    - Monto
  - Total de line items
  - Ordenable

- **Historial de Estados:**
  - Timeline mostrando cambios de estado
  - Usuario que realizó cada cambio
  - Fecha y hora

- **Acciones según estado:**
  - **Draft:** Editar, Aprobar, Eliminar
  - **Pending Approval:** Ver, Aprobar definitivamente, Rechazar
  - **Approved:** Exportar al ERP, Ver PDF, Registrar Pago
  - **Sent to ERP:** Ver PDF, Registrar Pago, Ver referencia ERP
  - **Paid:** Ver PDF, Ver detalles de pago

- **Notas:**
  - Campo de texto para notas internas
  - Historial de notas

### 4. Vista de Detección de Duplicados
**Ruta:** `/settlement/duplicates`

**Componentes:**
- **Header:**
  - Título: "Detección de Pagos Duplicados"
  - Botón "Ejecutar Detección" (manual)
  - Última ejecución automática

- **Lista de Duplicados Detectados:**
  - Agrupados por vendor + order + mes
  - Cada grupo muestra:
    - Vendor
    - Order/Show
    - Mes
    - Cantidad de pagos detectados
    - Total pagado (suma)
    - POs involucradas (links)
    - Acciones (Revisar, Marcar como duplicado, Confirmar legítimo)
  - Filtros por vendor, mes, estado

- **Acciones masivas:**
  - Seleccionar múltiples duplicados
  - Marcar como revisados
  - Exportar reporte

### 5. Formulario de Registro de Pago
**Ruta:** `/settlement/purchase-orders/:poId/payment` (modal o página)

**Componentes:**
- **Información de PO:**
  - Número de PO
  - Vendor
  - Total a pagar
  - Monto ya pagado (si aplica)
  - Saldo pendiente

- **Campos del formulario:**
  - Fecha de pago (date picker, requerido)
  - Método de pago (select: transferencia bancaria, cheque, efectivo, otro)
  - Número de referencia (text, requerido)
  - Monto pagado (number, requerido, validación: no mayor al saldo)
  - Notas (textarea, opcional)

- **Validaciones:**
  - Monto no puede ser mayor al saldo pendiente
  - Número de referencia debe ser único (o mostrar advertencia si existe)
  - Fecha de pago no puede ser futura

- **Acciones:**
  - Guardar y registrar pago
  - Cancelar

## Business Rules

### Cálculo de Pagos
1. Solo se calculan pagos para asignaciones con estado "completada" o "delivered"
2. El cálculo se basa en:
   - Minutos trabajados reales (actual_minutes de assignment)
   - Tarifa aplicable según:
     - Fase del assignment
     - Duración del episodio (franja de minutos)
     - Tarifa estándar o excepción por show
     - Moneda del vendor
   - Bonos aplicables:
     - Bono de calidad (si quality_bonus_eligible = true)
     - Bono mensual (si monthly_bonus_eligible = true)
     - Bono show completo (si aplica)
3. Los cálculos se agrupan por:
   - Vendor
   - Mes de liquidación (payment_month del assignment)
   - Fase/Rol
   - Moneda

### Generación de POs
1. Una PO se genera por:
   - Vendor
   - Mes de liquidación
   - Moneda
2. El número de PO sigue formato: `PO-YYYY-MM-XXX` (ej: PO-2025-09-001)
3. Estado inicial: "draft"
4. Una PO puede incluir múltiples fases/roles del mismo vendor
5. Cada line item representa una asignación individual

### Flujo de Aprobación
1. **Draft:** PO recién generada, puede editarse o eliminarse
2. **Pending Approval:** PO enviada para aprobación, requiere revisión
3. **Approved:** PO aprobada, lista para exportar al ERP
4. **Sent to ERP:** PO exportada al ERP, no puede modificarse
5. **Paid:** PO pagada completamente
6. **Cancelled:** PO cancelada (solo si está en draft o pending_approval)

### Detección de Duplicados
1. Se consideran duplicados potenciales cuando:
   - Mismo vendor
   - Mismo order/show
   - Mismo mes de liquidación
   - Montos idénticos o muy similares
2. El sistema genera hash MD5 basado en: vendor_id + order_number + amount + payment_month
3. Se ejecuta detección automática diaria
4. Usuario puede ejecutar detección manual en cualquier momento

### Exportación al ERP
1. Solo POs con estado "approved" pueden exportarse
2. Formato de exportación depende de integración ERP (CSV, JSON, API)
3. Al exportar, se actualiza:
   - Estado a "sent_to_erp"
   - Fecha de exportación
   - Referencia del ERP (si se recibe)
4. Una PO exportada no puede modificarse

## Data Requirements

### CalculatedPayment (Pre-PO)
- vendorId, paymentMonth, phase, currency
- totalAssignments, totalMinutes, totalLines (para VTs)
- subtotal, qualityBonusTotal, monthlyBonusTotal, fullShowBonusTotal
- grandTotal
- poGenerated, poId (si ya se generó PO)

### PurchaseOrder
- poNumber, vendorId, paymentMonth, currency
- subtotal, bonuses, total
- status (draft, pending_approval, approved, sent_to_erp, paid, cancelled)
- generatedAt, approvedBy, approvedAt, sentToErpAt, paidAt
- pdfUrl, erpReference, notes

### POLineItem
- poId, assignmentId (opcional)
- description, orderNumber, showTitle, episode
- quantity, unit (minutes, lines, flat, hours)
- unitPrice, amount
- lineOrder

### Payment
- poId, vendorId
- amount, currency, paymentDate
- paymentMethod, referenceNumber
- paymentHash (MD5 para detección duplicados)

## Integration Points

- **Rates Section:** Obtiene reglas de tarifas para cálculos
- **Vendors Section:** Obtiene información de vendors y configuración de pagos
- **Orders/Assignments:** Obtiene asignaciones completadas con minutos trabajados
- **ERP System:** Exporta POs aprobadas (formato según integración)

## Configuration

- shell: true
