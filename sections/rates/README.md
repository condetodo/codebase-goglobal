# Rates Specification

## Overview
Sección de configuración de tarifas: tabla maestra de tarifas por fase/rol con franjas de minutos (con y sin bono), moneda, y tipo de cálculo (por minuto, flat, por hora). Tabla editable para gestionar el tarifario que se utiliza para liquidar pagos a vendors.

## User Flows

### Flow 1: Ver Tabla de Tarifas
1. Usuario accede a la sección Rates
2. Ve tabla con todas las tarifas configuradas
3. Filas representan fases/roles (Preflight, Adaptador, Editor, Editor de sonido, Adaptador PTBR, Editores PTBR)
4. Columnas representan franjas de minutos (cada franja tiene dos columnas: sin bono y con bono)
5. Columnas adicionales: Moneda y Tipo de cálculo

### Flow 2: Crear Nueva Tarifa
1. Usuario hace click en botón "Nueva Tarifa"
2. Se abre formulario/modal para crear nueva fila
3. Usuario selecciona fase/rol
4. Usuario completa tarifas para cada franja de minutos (sin bono y con bono)
5. Usuario selecciona moneda (ARS, USD, BRL)
6. Usuario selecciona tipo de cálculo (x minuto, flat, por hora)
7. Usuario guarda la tarifa

### Flow 3: Editar Tarifa (Doble Click)
1. Usuario hace doble click en una celda de la tabla
2. Se abre editor inline o modal para editar ese valor específico
3. Usuario modifica el valor
4. Usuario guarda los cambios

### Flow 4: Ver Detalle de Tarifa
1. Usuario hace click en una fila o botón "Ver detalle"
2. Ve vista de detalle con toda la información de esa tarifa
3. Puede editar desde el detalle

### Flow 5: Eliminar Tarifa
1. Usuario selecciona una fila
2. Hace click en botón "Eliminar"
3. Sistema confirma la acción
4. Tarifa se elimina de la tabla

## UI Requirements

### Vista Principal - Tabla de Tarifas
- Tabla con estructura:
  - **Filas:** Fases/roles (Preflight, Adaptador, Editor, Editor de sonido, Adaptador PTBR, Editores PTBR)
  - **Columnas:**
    - Fase/Rol (primera columna)
    - Menos de 30 minutos (sin bono)
    - Menos de 30 minutos (con bono)
    - de 30.1 a 59.9 minutos (sin bono)
    - de 30.1 a 59.9 minutos (con bono)
    - de 60 a 89.9 (sin bono)
    - de 60 a 89.9 (con bono)
    - de 90 a 119.9 (sin bono)
    - de 90 a 119.9 (con bono)
    - mas 120 (sin bono)
    - mas 120 (con bono)
    - MONEDA
    - Tipo de cálculo (x minuto, flat, por hora)
- Botón "Nueva Tarifa" para crear nuevas filas
- Doble click en celda para editar valor
- Acciones por fila: ver detalle, editar, eliminar
- Celdas editables inline o con modal

### Vista de Detalle
- Muestra toda la información de una tarifa específica
- Lista todas las franjas de minutos con valores (sin bono y con bono)
- Muestra moneda y tipo de cálculo
- Botón "Editar" para modificar

### Formulario de Creación/Edición
- Campo: Fase/Rol (seleccionable)
- Campos para cada franja de minutos:
  - Menos de 30 minutos (sin bono, con bono)
  - de 30.1 a 59.9 minutos (sin bono, con bono)
  - de 60 a 89.9 (sin bono, con bono)
  - de 90 a 119.9 (sin bono, con bono)
  - mas 120 (sin bono, con bono)
- Campo: Moneda (ARS, USD, BRL)
- Campo: Tipo de cálculo (x minuto, flat, por hora)
- Botones: Guardar, Cancelar

### Funcionalidades Adicionales
- Edición inline con doble click en celda
- Validación de valores numéricos
- Confirmación antes de eliminar

## Configuration
- shell: true

