# Orders Specification

## Overview
Sección para gestionar órdenes y episodios de doblaje. Permite crear nuevas órdenes, visualizar y filtrar órdenes existentes, y gestionar los episodios asociados a cada orden. 

**Funcionalidad clave**: Al crear una Order (show), se asignan los vendors y deadlines una sola vez para cada una de las 5 etapas del proceso de doblaje, y estas asignaciones se aplican automáticamente a todos los capítulos/episodios, eliminando la necesidad de asignar manualmente episodio por episodio.

Si posteriormente se agregan más episodios a una Order existente, estos nuevos episodios heredan automáticamente los vendors y deadlines asignados a nivel de Order. Si es necesario, se puede repetir el proceso de asignación de vendors y deadlines a nivel de Order, lo cual afectará a todos los episodios (existentes y nuevos).

Cada episodio tiene su propia vista de edición con información detallada sobre vendors y deadlines (heredados de la Order), minutos trabajados y estado.

## User Flows

### Flow 1: Crear Nueva Orden con Asignación de Vendors
1. Usuario hace clic en botón "Nueva Orden"
2. Se abre formulario/modal de creación con múltiples pasos o secciones
3. **Paso 1 - Información básica:**
   - Usuario selecciona tipo de producto (miniserie, serie, película, documental)
   - Usuario ingresa cantidad de capítulos
   - Usuario selecciona/ingresa otros campos (idioma, show, etc.)
4. **Paso 2 - Asignación de Vendors y Deadlines por Etapa:**
   - Usuario asigna vendors y deadlines (obligatorio) para cada una de las 5 etapas del proceso de doblaje:
     - **PREPRODUCCIÓN - Adaptación de guion**: Selecciona Adaptador + establece deadline
     - **PRODUCCIÓN - Voice Talents**: Selecciona Actores de voz (puede ser múltiples) + establece deadline
     - **POSTPRODUCCIÓN - Editor de sonido**: Selecciona Editor de sonido + establece deadline
     - **POSTPRODUCCIÓN - Creación de subtítulos**: Selecciona Subtitulador + establece deadline
     - **POSTPRODUCCIÓN - QA final**: Selecciona Auditor de calidad + establece deadline
   - Para cada etapa, el usuario debe:
     - Seleccionar uno o más vendors según corresponda
     - Establecer un deadline obligatorio para esa etapa
   - Indicador visual de que estas asignaciones y deadlines se aplicarán a todos los episodios
5. Usuario guarda la orden
6. Sistema crea la orden y genera los episodios automáticamente
7. **Sistema aplica automáticamente las asignaciones de vendors y deadlines a todos los episodios generados** - cada episodio hereda las asignaciones de vendors y deadlines definidas a nivel de Order

### Flow 2: Ver Lista de Órdenes
1. Usuario accede a sección Orders
2. Ve tabla/lista de órdenes con columnas principales
3. Usuario puede filtrar por criterios - **A VALIDAR: filtros específicos**
4. Usuario puede buscar órdenes - **A VALIDAR: campos de búsqueda**
5. Usuario hace clic en una orden para ver detalles

### Flow 3: Ver Detalle de Orden
1. Usuario hace clic en una orden desde la lista
2. Se muestra vista de detalle con información general de la orden
3. **Se muestra sección de "Vendors y Deadlines Asignados"** mostrando los vendors asignados y deadlines a nivel de Order para cada una de las 5 etapas
4. Se muestra lista de episodios asociados (cada uno con indicador visual de que hereda las asignaciones y deadlines de la Order)
5. Usuario puede agregar nuevos episodios - **A VALIDAR: desde detalle o desde lista**
6. Usuario puede editar información de la orden - **A VALIDAR: qué campos son editables**
7. Usuario puede modificar asignaciones de vendors y deadlines a nivel de Order (los cambios se propagan a todos los episodios existentes)
8. Usuario puede cambiar estado de la orden - **A VALIDAR: estados disponibles**

### Flow 5: Agregar Episodios a Order Existente
1. Usuario está en la vista de detalle de una Order existente
2. Usuario hace clic en "Agregar Episodios" o botón similar
3. Se abre formulario/modal para agregar episodios
4. Usuario ingresa cantidad de episodios a agregar o información de cada episodio
5. **Sistema muestra advertencia/información**: Los nuevos episodios heredarán automáticamente los vendors y deadlines asignados a nivel de Order
6. Usuario confirma la adición de episodios
7. Sistema crea los nuevos episodios
8. **Sistema aplica automáticamente las asignaciones de vendors y deadlines de la Order a los nuevos episodios**
9. Si el usuario necesita asignar vendors o deadlines diferentes para los nuevos episodios, puede:
   - Modificar las asignaciones a nivel de Order (afecta a todos los episodios, incluyendo los nuevos)
   - O editar individualmente cada episodio para crear excepciones

### Flow 4: Editar Episodio
1. Usuario hace clic en un episodio desde la vista de detalle de orden
2. Se abre vista separada de edición del episodio
3. **Se muestra información de vendors y deadlines heredados de la Order** (con indicador visual de que provienen de la asignación a nivel de Order)
4. Usuario puede editar:
   - Duración (minutos)
   - Estado del episodio - **A VALIDAR: estados disponibles**
   - **Vendors y deadlines involucrados**: 
     - Por defecto muestra los vendors y deadlines asignados a nivel de Order
     - Usuario puede sobrescribir asignaciones o deadlines específicos para este episodio (excepciones)
     - Usuario puede agregar vendors adicionales si es necesario
   - Minutos trabajados por vendor - **A VALIDAR: formato y validaciones**
5. Usuario guarda cambios

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

### Formulario de Creación de Orden
- **Paso 1 - Información Básica:**
  - Campo: Tipo de producto (dropdown: miniserie, serie, película, documental)
  - Campo: Cantidad de capítulos (número)
  - Campo: Idioma (dropdown o input)
  - Campo: Show/Serie (selector o creación)
  - Otros campos básicos según validaciones
- **Paso 2 - Asignación de Vendors y Deadlines por Etapa:**
  - Sección para cada una de las 5 etapas del proceso
  - Para cada etapa:
    - Título de la etapa con descripción breve
    - Selector de vendor(s) - puede ser múltiple según la etapa (obligatorio)
    - Campo para deadline por etapa (obligatorio, selector de fecha/hora)
    - Indicador visual de que estas asignaciones y deadlines se aplicarán a todos los episodios
  - Validación: No se puede continuar sin completar vendor y deadline para todas las etapas
  - Botón "Continuar" o "Guardar" para completar la creación
  - Opción de "Guardar y crear episodios" o crear episodios después

### Vista Principal (Lista de Órdenes)
- Tabla/lista de órdenes con columnas: **A VALIDAR: columnas exactas a mostrar**
  - ID/Número de orden
  - Tipo de producto
  - Show/Serie - **A VALIDAR: si se muestra y cómo**
  - Cantidad de episodios
  - Estado - **A VALIDAR: estados disponibles**
  - Fecha de creación - **A VALIDAR: si se incluye**
  - Otras columnas a definir
- Filtros: **A VALIDAR: filtros específicos (estado, tipo, show, fecha, etc.)**
- Búsqueda: **A VALIDAR: campos de búsqueda**
- Botón "Nueva Orden" para crear orden
- Sin resumen ni estadísticas en esta vista

### Vista de Detalle de Orden
- Información general de la orden:
  - Tipo de producto
  - Show/Serie - **A VALIDAR: relación con shows, si se selecciona o crea desde orden**
  - Cantidad de episodios
  - Idioma - **A VALIDAR: otros campos adicionales**
  - Estado
  - Otros campos a definir
- **Sección "Vendors y Deadlines Asignados a Nivel de Order"**:
  - Muestra las 5 etapas del proceso de doblaje:
    1. PREPRODUCCIÓN - Adaptación de guion (Adaptador)
    2. PRODUCCIÓN - Voice Talents (Actores de voz)
    3. POSTPRODUCCIÓN - Editor de sonido
    4. POSTPRODUCCIÓN - Creación de subtítulos (Subtitulador)
    5. POSTPRODUCCIÓN - QA final (Auditor de calidad)
  - Para cada etapa muestra:
    - Nombre del vendor(s) asignado(s)
    - Deadline asignado (fecha y hora)
    - Indicador visual de que estas asignaciones y deadlines se aplican a todos los episodios
    - Opción para editar/modificar asignaciones y deadlines
  - Botón "Editar Asignaciones y Deadlines" para modificar vendors y deadlines (los cambios se propagan a todos los episodios existentes)
- Lista de episodios (tabla o cards) - **A VALIDAR: formato preferido**
  - Cada episodio muestra indicador visual de que hereda las asignaciones y deadlines de la Order
- Acciones:
  - **Agregar episodios** - Botón para agregar nuevos episodios a la Order (los nuevos episodios heredarán automáticamente vendors y deadlines de la Order)
  - Editar orden - **A VALIDAR: qué campos son editables**
  - Cambiar estado

### Vista de Edición de Episodio
- Vista separada (no modal) para editar episodio
- **Sección "Vendors y Deadlines Heredados de la Order"**:
  - Muestra los vendors y deadlines asignados a nivel de Order para cada una de las 5 etapas
  - Indicador visual claro de que estas asignaciones y deadlines provienen de la Order
  - Información de solo lectura (para modificar, se debe editar desde la Order)
  - Muestra deadline por cada etapa
- **Sección "Vendors y Deadlines Específicos del Episodio"** (si hay excepciones):
  - Muestra vendors y deadlines que fueron sobrescritos o agregados específicamente para este episodio
  - Opción para agregar excepciones o vendors adicionales con sus deadlines
  - Opción para restaurar asignación y deadline de la Order si se sobrescribió
- Campos editables:
  - Duración (minutos)
  - Estado del episodio - **A VALIDAR: estados disponibles**
  - Vendors involucrados (excepciones y adicionales) - **A VALIDAR: formato (lista, tabla, etc.)**
  - Minutos trabajados por vendor - **A VALIDAR: formato y validaciones**
  - Otros campos a definir - **A VALIDAR: información adicional del episodio**

## Configuration
- shell: true

## Pending Validations

### Campos y Datos
- [ ] Lista completa de tipos de producto (miniserie, etc.)
- [ ] Campos adicionales al crear orden (idioma, show, etc.)
- [ ] Relación con Shows: ¿se selecciona al crear orden o se crea desde la orden?
- [ ] Generación de episodios: ¿automática al crear orden o manual?
- [ ] Estados disponibles para órdenes
- [ ] Estados disponibles para episodios
- [ ] Campos editables en orden existente
- [ ] Información adicional del episodio

### UI y Flujos
- [ ] Columnas exactas en tabla de órdenes
- [ ] Filtros específicos (estado, tipo, show, fecha, etc.)
- [ ] Campos de búsqueda
- [ ] Formato de lista de episodios (tabla vs cards)
- [ ] Dónde se agregan episodios (desde detalle de orden o desde otro lugar)
- [ ] Formato de visualización de vendors en episodio (lista, tabla, etc.)
- [ ] Formato y validaciones para minutos trabajados por vendor

