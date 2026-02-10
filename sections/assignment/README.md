# Assignment Specification (Creación de Order/Show)

## Overview
Sección para crear nuevas Orders (shows) con asignación completa de vendors, deadlines y minutos estimados para cada una de las 5 etapas del proceso de doblaje. Este formulario permite configurar toda la información necesaria para un proyecto de doblaje, incluyendo la asignación de vendors que se aplicará automáticamente a todos los episodios.

**Funcionalidad clave**: Al crear una Order (show), se asignan los vendors, deadlines y minutos estimados una sola vez para cada una de las 5 etapas del proceso de doblaje. Estas asignaciones se aplican automáticamente a todos los capítulos/episodios que se generen, eliminando la necesidad de configurar manualmente cada episodio individual.

## User Flows

### Flow 1: Crear Nueva Order con Asignación Completa de Vendors
1. Usuario accede a la sección Assignment (o hace clic en "Nueva Order" desde Orders)
2. Se abre formulario de creación con múltiples pasos
3. **Paso 1 - Información Básica de la Order:**
   - Usuario selecciona tipo de producto (miniserie, serie, película, documental)
   - Usuario ingresa cantidad de capítulos/episodios
   - Usuario selecciona/ingresa idioma
   - Usuario selecciona o crea Show/Serie
   - Otros campos básicos según validaciones
4. **Paso 2 - Asignación de Vendors, Deadlines y Minutos por Etapa:**
   - Para cada una de las 5 etapas del proceso de doblaje:
     - **PREPRODUCCIÓN - Adaptación de guion**: 
       - Selecciona Adaptador (obligatorio)
       - Establece deadline (obligatorio)
       - Ingresa minutos estimados (obligatorio)
     - **PRODUCCIÓN - Voice Talents**: 
       - Selecciona Actores de voz (puede ser múltiples, obligatorio)
       - Establece deadline (obligatorio)
       - Ingresa minutos estimados (obligatorio)
     - **POSTPRODUCCIÓN - Editor de sonido**: 
       - Selecciona Editor de sonido (obligatorio)
       - Establece deadline (obligatorio)
       - Ingresa minutos estimados (obligatorio)
     - **POSTPRODUCCIÓN - Creación de subtítulos**: 
       - Selecciona Subtitulador (obligatorio)
       - Establece deadline (obligatorio)
       - Ingresa minutos estimados (obligatorio)
     - **POSTPRODUCCIÓN - QA final**: 
       - Selecciona Auditor de calidad (obligatorio)
       - Establece deadline (obligatorio)
       - Ingresa minutos estimados (obligatorio)
   - Indicador visual de que estas asignaciones se aplicarán a todos los episodios
   - Validación: No se puede continuar sin completar vendor, deadline y minutos para todas las etapas
5. Usuario revisa resumen de la Order y asignaciones
6. Usuario confirma y guarda la Order
7. Sistema crea la Order y genera los episodios automáticamente
8. **Sistema aplica automáticamente las asignaciones de vendors, deadlines y minutos a todos los episodios generados**

### Flow 2: Editar Asignaciones de Order Existente
1. Usuario accede a una Order existente desde la sección Orders
2. Usuario hace clic en "Editar Asignaciones y Deadlines"
3. Se abre el mismo formulario de asignación (Paso 2) con los valores actuales
4. Usuario modifica vendors, deadlines o minutos según sea necesario
5. Usuario guarda los cambios
6. **Sistema propaga los cambios a todos los episodios existentes** (a menos que tengan excepciones específicas)

## Proceso de Doblaje - 5 Etapas

Cada Order (show) sigue un flujo de 5 etapas principales, cada una asignada a vendors externos especializados:

1. **PREPRODUCCIÓN – Adaptación de guion** (Vendor: Adaptador)
   - Convierte el guion original en texto listo para doblaje
   - Ajusta lipsync, intención actoral y estilo
   - Entrega en formato SRT que se convierte a Excel con GPT
   - A partir del detalle del guion se asignan los Voice Talents según rango vocal y disponibilidad

2. **PRODUCCIÓN – Voice Talents** (Vendor: Actores de voz)
   - Los actores asignados graban sus líneas siguiendo el guion adaptado
   - Se respetan rangos vocales, disponibilidad y estilo interpretativo
   - La asignación se realiza según el análisis del guion adaptado

3. **POSTPRODUCCIÓN – Editor de sonido** (Vendor: Editor de sonido)
   - Ensambla y sincroniza las voces grabadas con el video original
   - Trabaja con las pistas M&E (Music & Effects)
   - Asegura limpieza y timing adecuados del audio

4. **POSTPRODUCCIÓN – Creación de subtítulos** (Vendor: Subtitulador)
   - Genera los subtítulos finales en formato SRT
   - Sigue las normas específicas del cliente
   - Ajusta al contenido doblado

5. **POSTPRODUCCIÓN – QA final** (Vendor: Auditor de calidad)
   - Realiza auditoría de calidad final de todo el material entregado
   - Verifica audio, subtítulos y sincronización
   - Validación antes de la entrega al cliente

## UI Requirements

### Vista Principal - Formulario de Creación de Order

#### Paso 1: Información Básica
- **Título**: "Crear Nueva Order (Show)"
- **Campos del formulario:**
  - Tipo de producto (dropdown/select):
    - Miniserie
    - Serie
    - Película
    - Documental
  - Cantidad de capítulos/episodios (input numérico, mínimo 1)
  - Idioma (dropdown o input):
    - es-AR (Español Argentina)
    - es-MX (Español México)
    - pt-BR (Portugués Brasil)
    - Otros según necesidades
  - Show/Serie (selector con opción de crear nuevo):
    - Dropdown con shows existentes
    - Botón "Crear nuevo show" que abre modal/formulario
    - Si se crea nuevo, campos: nombre, descripción
  - Otros campos básicos según validaciones
- **Navegación:**
  - Botón "Cancelar" (izquierda)
  - Botón "Siguiente: Asignar Vendors" (derecha, deshabilitado hasta completar campos obligatorios)
- **Indicador de progreso**: "Paso 1 de 2" o similar

#### Paso 2: Asignación de Vendors, Deadlines y Minutos
- **Título**: "Asignar Vendors y Deadlines por Etapa"
- **Subtítulo/Info**: "Estas asignaciones se aplicarán automáticamente a todos los episodios"
- **Sección para cada una de las 5 etapas:**
  - Card/panel para cada etapa con:
    - **Encabezado de etapa:**
      - Título: "PREPRODUCCIÓN - Adaptación de guion" (ejemplo)
      - Subtítulo: "Vendor: Adaptador"
      - Descripción breve de la etapa
    - **Campos de asignación:**
      - **Vendors** (múltiples, obligatorio):
        - Para cada etapa, lista de vendors asignados
        - **Para Voice Talents**: Múltiples vendors permitidos (múltiples actores de voz)
        - **Para otras etapas**: Generalmente un vendor, pero se puede agregar más si es necesario
        - Cada vendor tiene:
          - Selector de vendor existente (dropdown filtrado por especialización)
          - **O** Botón "Crear nuevo vendor" que abre formulario/modal para crear vendor nuevo
          - Input de minutos estimados específico para ese vendor
          - Botón "Eliminar" para quitar vendor de la lista
        - **Botón "+" (Agregar Vendor)**: Permite agregar más vendors a la etapa
          - Especialmente visible y útil para Voice Talents
          - Al hacer clic, se agrega un nuevo slot de vendor a la lista
      - **Deadline** (selector de fecha/hora, obligatorio):
        - Date picker con selector de hora
        - Compartido para todos los vendors de la etapa
        - Validación: fecha debe ser futura
        - Indicador visual de días hasta deadline
      - **Formulario de creación de nuevo vendor** (modal o inline):
        - Campos: Nombre, Email, Teléfono, Moneda (ARS/USD/BRL)
        - Se asigna automáticamente la especialización de la etapa actual
        - Botón "Crear y Asignar"
    - **Indicador visual**: "✓ Esta asignación se aplicará a todos los episodios"
- **Validación y navegación:**
  - Validación en tiempo real: todos los campos obligatorios deben estar completos
  - Mensajes de error claros si falta algún campo
  - Botón "Anterior" (volver a Paso 1)
  - Botón "Revisar y Crear" o "Guardar Order" (derecha)
- **Indicador de progreso**: "Paso 2 de 2"

#### Paso 3 (Opcional): Resumen y Confirmación
- **Título**: "Resumen de la Order"
- **Información básica:**
  - Tipo de producto, cantidad de episodios, idioma, show
- **Resumen de asignaciones:**
  - Tabla o cards mostrando las 5 etapas con:
    - Vendor asignado
    - Deadline
    - Minutos estimados
- **Acciones:**
  - Botón "Editar" para volver a pasos anteriores
  - Botón "Confirmar y Crear Order" (acción final)
  - Botón "Cancelar"

### Vista de Edición de Asignaciones (para Orders existentes)
- Similar al Paso 2 del formulario de creación
- Pre-llenado con valores actuales de la Order
- Advertencia visual: "Los cambios se aplicarán a todos los episodios existentes"
- Opción para ver qué episodios se verán afectados
- Botón "Guardar Cambios" y "Cancelar"

## Validaciones

### Paso 1 - Información Básica
- Tipo de producto: obligatorio
- Cantidad de capítulos: obligatorio, mínimo 1, número entero
- Idioma: obligatorio
- Show/Serie: obligatorio (puede ser nuevo o existente)

### Paso 2 - Asignaciones
- Para cada una de las 5 etapas:
  - **Vendors**: 
    - Mínimo 1 vendor obligatorio por etapa
    - Para Voice Talents: Se recomienda múltiples vendors (múltiples actores)
    - Cada vendor debe tener minutos estimados (obligatorio, mínimo 0.1)
    - Si se crea nuevo vendor, todos los campos del formulario son obligatorios
  - **Deadline**: obligatorio, debe ser fecha/hora futura (compartido para todos los vendors de la etapa)
  - **Minutos estimados**: obligatorio por vendor, mínimo 0.1, número entero o decimal
- No se puede avanzar sin completar todas las asignaciones (al menos un vendor por etapa con deadline y minutos)

## Configuration
- shell: true

## Pending Validations

### Campos y Datos
- [ ] Lista completa de tipos de producto
- [ ] Lista completa de idiomas disponibles
- [ ] Validaciones específicas para minutos estimados (rango, formato)
- [ ] Si se permite múltiples vendors para etapas que no sean Voice Talents
- [ ] Formato exacto de fecha/hora para deadlines
- [ ] Si se muestra cálculo de costos estimados basado en tarifas

### UI y Flujos
- [ ] Si se incluye paso de resumen o se crea directamente desde Paso 2
- [ ] Si se puede guardar como borrador
- [ ] Si se puede previsualizar cómo quedarán los episodios antes de crear
- [ ] Navegación entre pasos (si se puede volver atrás)
- [ ] Manejo de errores y validaciones en tiempo real
