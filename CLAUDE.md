# ElectroUniónSMA

## Descripción del proyecto

Webapp para un taller electromecánico. Permite a los clientes consultar el historial de revisiones de su vehículo (sin necesidad de crear una cuenta) y contactar directamente a los mecánicos por WhatsApp.

### Funcionalidades principales

- Buscar el historial de un vehículo por **patente** o **teléfono** (sin login)
- Ver la **fecha de la última revisión** y el **detalle de qué se revisó/reparó**
- Botón de contacto que abre **WhatsApp** (`wa.me`) con un mensaje prearmado hacia el número del taller
- Diseño **moderno, sobrio y fácil de navegar**

## Stack

- **Frontend:** React + Vite + TypeScript, Tailwind CSS (`/frontend`)
- **Backend:** Node.js + Express + TypeScript (`/backend`)
- **Base de datos:** SQLite + Prisma (simple, sin servidor de DB propio; fácil de migrar a PostgreSQL si el taller crece)
- **WhatsApp:** sin integración de API — link directo `https://wa.me/<numero>?text=<mensaje>`

## Estructura

```
ElectroUnionSMA/
├── frontend/    React app (UI, búsqueda de vehículo, historial, botón WhatsApp)
├── backend/     API Express (endpoints de vehículos, revisiones, clientes)
└── .claude/
    └── agents/  Agentes especializados (backend-specialist, frontend-specialist)
```

## Convenciones

- Componentes en **PascalCase**
- Todo el código, variables, comentarios y UI en **español**
- Commits y nombres de archivos en **inglés** salvo textos visibles al usuario

## Modelo de datos (referencia inicial)

- **Cliente:** nombre, teléfono, patente(s) asociadas
- **Vehículo:** patente, marca, modelo, año, cliente asociado
- **Revisión:** vehículo asociado, fecha, descripción de lo revisado/reparado, mecánico a cargo

## Agentes especializados

- **backend-specialist** (`.claude/agents/backend-specialist.md`): API, base de datos, modelos, lógica de búsqueda por patente/teléfono.
- **frontend-specialist** (`.claude/agents/frontend-specialist.md`): UI en React, diseño visual, componentes, integración con la API y con el link de WhatsApp.

## Notas

- No se requiere autenticación de usuarios en esta primera versión.
- Priorizar una interfaz simple: buscar vehículo → ver historial → contactar por WhatsApp.

---

## API

- **Base URL (dev):** `http://localhost:3001/api`
- **Puerto:** `3001` (configurable con la variable de entorno `PORT`)

### 1. Health check
- **GET** `/api/health`

**Respuesta:**
```json
{ "status": "ok" }
```

---

### 2. Buscar vehículo(s)
- **GET** `/api/vehiculos?patente=<patente>`
- **GET** `/api/vehiculos?telefono=<telefono>`
- Busca por patente exacta (devuelve 1 vehículo) o por teléfono del cliente (devuelve todos sus vehículos).

**Respuesta:**
```json
[
  {
    "id": 1,
    "patente": "AB123CD",
    "marca": "Volkswagen",
    "modelo": "Gol Trend",
    "anio": 2015,
    "cliente": { "nombre": "Marcela Gómez", "telefono": "+5492604123456" }
  }
]
```

**Errores:**
- `400` — falta el parámetro `patente`/`telefono`, o el formato es inválido
- `404` — no se encontró ningún vehículo/cliente

---

### 3. Historial de revisiones de un vehículo
- **GET** `/api/vehiculos/<patente>/historial`
- Devuelve los datos del vehículo, su última revisión y el historial completo (orden descendente por fecha).

**Respuesta:**
```json
{
  "id": 3,
  "patente": "AD789GH",
  "marca": "Chevrolet",
  "modelo": "Onix",
  "anio": 2019,
  "cliente": { "nombre": "Roberto Díaz", "telefono": "+5492604987654" },
  "ultimaRevision": {
    "id": 10,
    "fecha": "2026-05-30T00:00:00.000Z",
    "descripcion": "Cambio de pastillas de freno y discos traseros.",
    "mecanico": "Juan Pérez"
  },
  "revisiones": [
    {
      "id": 10,
      "fecha": "2026-05-30T00:00:00.000Z",
      "descripcion": "Cambio de pastillas de freno y discos traseros.",
      "mecanico": "Juan Pérez"
    }
  ]
}
```

**Errores:**
- `400` — formato de patente inválido
- `404` — no se encontró ningún vehículo con esa patente

---

### 4. Solicitar turno
- **POST** `/api/turnos`
- Crea una solicitud de turno/cita. No requiere que el vehículo o el cliente existan previamente en la base.

**Body esperado:**
```json
{
  "nombre": "Marcela Gómez",
  "telefono": "+5492604123456",
  "patente": "AB123CD",
  "servicio": "Cambio de aceite y filtro",
  "fechaDeseada": "2026-07-02T10:00:00",
  "comentario": "Preferiría a la mañana, si es posible."
}
```
- `patente` y `comentario` son opcionales.
- `fechaDeseada` debe ser una fecha válida y no puede estar en el pasado (con una tolerancia de 60 segundos).

**Respuesta (`201`):**
```json
{
  "id": 1,
  "nombre": "Marcela Gómez",
  "telefono": "+5492604123456",
  "patente": "AB123CD",
  "servicio": "Cambio de aceite y filtro",
  "fechaDeseada": "2026-07-02T10:00:00.000Z",
  "comentario": "Preferiría a la mañana, si es posible.",
  "estado": "pendiente"
}
```

**Errores:**
- `400` — falta `nombre`, `telefono`, `servicio` o `fechaDeseada`, o alguno tiene formato inválido (incluye `patente` inválida si se envía, o `fechaDeseada` en el pasado)

---

## Cómo levantar el backend en desarrollo

```bash
cd backend
npm install
npx prisma migrate dev   # crea/actualiza la base de datos SQLite
npm run prisma:seed      # carga datos de ejemplo
npm run dev               # levanta el servidor en http://localhost:3001
```

## Notas técnicas del backend

- Se usa **Prisma 7**, que requiere un **Driver Adapter** explícito para SQLite (`@prisma/adapter-better-sqlite3` + `better-sqlite3`). El cliente se construye en `src/prisma/client.ts` pasando el adapter; no alcanza con `DATABASE_URL` solo.
- El cliente generado de Prisma queda en `src/generated/prisma/` (ignorado en git) y se importa desde `src/generated/prisma/client` (no desde el índice de la carpeta).
