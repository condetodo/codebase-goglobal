# Vendors Specification

## Overview
Sección de gestión de vendors (proveedores): registro y administración de proveedores de doblaje (voice talents, editores, adaptadores, etc.) con información de contacto, configuración de pagos, estado activo/inactivo, detalles técnicos, y historial de trabajos.

## User Flows

### Flow 1: Ver Lista de Vendors
1. Usuario accede a la sección Vendors
2. Ve tabla con todos los vendors registrados
3. Puede filtrar por tipo de vendor, buscar por nombre/código/email
4. Puede ordenar por columnas
5. Puede activar/desactivar vendors directamente desde la tabla

### Flow 2: Crear Nuevo Vendor
1. Usuario hace click en botón "Nuevo Vendor"
2. Se abre formulario completo con todos los campos
3. Usuario completa campos obligatorios: Voice talent, VT new code, Email, Language, Gender
4. Usuario completa campos opcionales según corresponda
5. Usuario guarda el vendor

### Flow 3: Ver Detalle de Vendor
1. Usuario hace click en un vendor de la tabla
2. Ve vista de detalle con todos los campos del vendor (incluyendo foto si está disponible)
3. Ve historial de trabajos: asignaciones pasadas y actuales del vendor
4. Puede editar el vendor desde la vista de detalle

### Flow 4: Editar Vendor
1. Usuario accede a vista de detalle del vendor
2. Hace click en botón "Editar"
3. Se abre formulario con datos pre-cargados
4. Usuario modifica los campos necesarios
5. Usuario guarda los cambios

### Flow 5: Eliminar/Desactivar Vendor
1. Usuario puede desactivar un vendor desde la tabla (toggle activo/inactivo)
2. Usuario puede eliminar un vendor desde la vista de detalle o acciones de la tabla
3. Sistema confirma la acción antes de ejecutarla

### Flow 6: Filtrar y Buscar Vendors
1. Usuario aplica filtros por tipo de vendor
2. Usuario busca por nombre, código, o email
3. Tabla se actualiza mostrando solo los resultados que coinciden
4. Usuario puede combinar múltiples filtros

## UI Requirements

### Vista Principal - Tabla de Vendors
- Tabla con columnas:
  - Voice talent (nombre)
  - VT new code (código)
  - Email
  - Language
  - Active (toggle activo/inactivo)
  - Gender
  - Character
  - Vocal range
  - Category
  - Voice sample
  - Mic (micrófono)
  - Software
  - Home studio
  - Currency
  - RATE
  - Bonus?
  - Quality Bonus
  - Continuity Bonus
  - Notes
- Botón "Nuevo Vendor" para crear nuevos registros
- Filtros:
  - Por tipo de vendor (Voice Talent, Editor, Adaptador, Editor de Sonido, QA, etc.)
  - Búsqueda por nombre, código, email
  - Otros filtros a definir
- Ordenamiento por cualquier columna
- Acciones por fila: ver detalle, editar, eliminar, activar/desactivar

### Vista de Detalle
- Muestra todos los campos del vendor
- Foto del vendor (si está disponible)
- Botón "Editar" para modificar información
- Sección de "Historial de Trabajos":
  - Lista de asignaciones pasadas y actuales del vendor
  - Muestra episodio, orden, fase, fechas, estado
  - Links a las asignaciones/episodios relacionados

### Formulario de Creación/Edición
- Formulario completo con todos los campos:
  - Voice talent (obligatorio)
  - VT new code (obligatorio)
  - Email (obligatorio)
  - Language (obligatorio)
  - Active (checkbox o toggle)
  - Gender (obligatorio)
  - Character (opcional)
  - Vocal range (opcional)
  - Category (opcional)
  - Voice sample (opcional - campo para URL o archivo)
  - Mic (opcional)
  - Software (opcional)
  - Home studio (opcional)
  - Currency (opcional)
  - RATE (opcional)
  - Bonus? (opcional - checkbox)
  - Quality Bonus (opcional)
  - Continuity Bonus (opcional)
  - Notes (opcional - textarea)
- Validación de campos obligatorios
- Botones: Guardar, Cancelar

### Funcionalidades Adicionales
- Toggle activo/inactivo desde la tabla (acción suave, alternativa a eliminar)
- Historial de trabajos en vista de detalle muestra asignaciones relacionadas
- Búsqueda y filtros combinables

## Configuration
- shell: true

