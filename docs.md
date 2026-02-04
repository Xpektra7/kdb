# Frontend API Usage Guide

This document describes the API routes available to the frontend, their purpose, and the recommended flow.

## Base URL
- Local dev: `http://localhost:3000`
- All paths below are relative to the base URL.

## Auth & Session
- NextAuth handlers are exposed at `/api/auth/*`.
- Registration endpoint: `POST /api/auth/register`.
- Some routes currently use a temporary hardcoded user in the backend (`/api/projects`); auth integration is still in progress.

## Common Conventions
- JSON request/response unless stated otherwise.
- Errors are returned as `{ error: string, ... }` with a non-2xx status.

---

## Core Project Flow (Recommended)

1) **Create a project and decision matrix (AI)**
- `POST /api/projects`
- Creates the project and immediately generates subsystems/options via AI.

2) **Fetch subsystems + options**
- `GET /api/projects/:id/subsystems`
- Use to render the decision matrix UI.

3) **Save decisions**
- `POST /api/projects/:id/decisions`
- Or `PUT /api/projects/:id/decisions/:subsystemId` for a specific subsystem.

4) **Generate blueprint (AI)**
- `POST /api/generate/blueprint` (AI call)
- `POST /api/projects/:id/blueprint/generate` (persist results)

5) **Generate build guide (AI)**
- `POST /api/generate/build-guide` (AI call)
- `POST /api/projects/:id/build-guide/generate` (persist results)

6) **Optional: PDF export**
- `POST /api/pdf`

---

## Project Endpoints

### Create project (AI decision matrix included)
**POST** `/api/projects`

**Body**
```json
{ "title": "string", "description": "string?", "location": "string?" }
```

**Response (201)**
```json
{
  "projectId": 1,
  "subsystemCount": 4,
  "optionCount": 12,
  "subsystems": [{ "id": 1, "name": "Power", "optionCount": 3 }]
}
```

---

### Get project details
**GET** `/api/projects/:id`

Returns the project, subsystems, options, decisions, and cached decision matrix/blueprint metadata.

---

### Update project
**PUT** `/api/projects/:id`

**Body**
```json
{ "title": "string?", "description": "string?" }
```

---

### Delete project
**DELETE** `/api/projects/:id`

---

### Get stage + progress
**GET** `/api/projects/:id/stage`

---

### Update stage (validated transitions)
**POST** `/api/projects/:id/stage`

**Body**
```json
{ "stage": "DECISION_MATRIX" | "DECISION_MATRIX_COMPLETE" | "BLUEPRINT" | "BLUEPRINT_COMPLETE" | "BUILDING" | "COMPLETED" }
```

---

## Subsystems & Decisions

### Get all subsystems
**GET** `/api/projects/:id/subsystems`

---

### Get single subsystem
**GET** `/api/projects/:id/subsystems/:subsystemId`

---

### Get all decisions
**GET** `/api/projects/:id/decisions`

---

### Create or update a decision
**POST** `/api/projects/:id/decisions`

**Body**
```json
{ "subsystemId": 1, "selectedOptionId": 10 }
```

---

### Update a decision (specific subsystem)
**PUT** `/api/projects/:id/decisions/:subsystemId`

**Body**
```json
{ "selectedOptionId": 10 }
```

---

### Delete a decision
**DELETE** `/api/projects/:id/decisions/:subsystemId`

---

## Decision Matrix Cache

### Get cached decision matrix
**GET** `/api/projects/:id/decision-matrix`

Returns cached result if not expired; returns 410 if expired.

---

### Persist decision matrix AI output
**POST** `/api/projects/:id/decision-matrix/generate`

**Body**
```json
{
  "aiOutput": {
    "project": "string",
    "concept": "string",
    "research": ["string"],
    "goals": ["string"],
    "problems_overall": [{"problem":"string","suggested_solution":"string"}],
    "decision_matrix": [
      {
        "subsystem": "string",
        "from": "string|array|null",
        "to": "string|array|null",
        "options": [
          {
            "name": "string",
            "why_it_works": "string",
            "features": ["string"],
            "pros": ["string"],
            "cons": ["string"],
            "estimated_cost": ["string"],
            "availability": "string"
          }
        ]
      }
    ],
    "skills": "string"
  }
}
```

---

## Blueprint Cache

### Get cached blueprint
**GET** `/api/projects/:id/blueprint`

Returns cached result if not expired; returns 410 if expired.

---

### Persist blueprint AI output
**POST** `/api/projects/:id/blueprint/generate`

**Body**
```json
{
  "aiOutput": {
    "project": "string",
    "problem": {"statement":"string","constraints":["string"]},
    "architecture": {"overview":"string","block_diagram":["string"]},
    "components": [{"subsystem":"string","chosen_option":"string","why_chosen":"string","pros":["string"],"cons":["string"]}],
    "execution_steps": ["string"],
    "testing": {"methods":["string"],"success_criteria":"string"},
    "references": ["string"],
    "extensions": ["string"],
    "cost": "string",
    "skills": "string"
  }
}
```

---

## Build Guide

### Persist build guide AI output
**POST** `/api/projects/:id/build-guide/generate`

**Body**
```json
{
  "aiOutput": {
    "project": "string",
    "build_overview": "string",
    "prerequisites": {"tools":["string"],"materials":["string"]},
    "wiring": {"description":"string","connections":["string"]},
    "firmware": {"language":"string","structure":["string"],"key_logic":["string"]},
    "calibration": ["string"],
    "testing": {"unit":["string"],"integration":["string"],"acceptance":["string"]},
    "common_failures": [{"issue":"string","cause":"string","fix":"string"}],
    "safety": ["string"],
    "next_steps": ["string"]
  }
}
```

---

## AI Generation Routes (Direct Model Calls)

These routes call Gemini directly and return AI output. They require `GEMINI_API_KEY` in the environment.

### Decision matrix generation
**POST** `/api/generate/decision-matrix`

**Body**
```json
{ "project": "string" }
```

**Response**
```json
{ "output": "<minified-json-string>" }
```

---

### Blueprint generation
**POST** `/api/generate/blueprint`

**Body**
```json
{ "project": "string", "selectedOptions": {} }
```

**Response**
```json
{ "output": "<minified-json-string>" }
```

---

### Build guide generation
**POST** `/api/generate/build-guide`

**Body**
```json
{ "project": "string", "blueprint": {} }
```

**Response (200)**
```json
{ "output": { /* parsed JSON */ } }
```

---

## Request Stores (Short-Lived In-Memory)

These are temporary request caches (in-memory) used by the frontend to store AI outputs briefly.

### Decision matrix request store
- **POST** `/api/decision-matrix-requests`
- **GET** `/api/decision-matrix-requests/:requestId`

### Blueprint request store
- **POST** `/api/blueprint-requests`
- **GET** `/api/blueprint-requests/:requestId`

### Build guide request store
- **POST** `/api/build-guide-requests`
- **GET** `/api/build-guide-requests/:requestId`

---

## PDF Export

### Generate PDF
**POST** `/api/pdf`

**Body**
```json
{ "data": { "title": "string", "...": "..." } }
```

**Response**
- `application/pdf` stream with `Content-Disposition: attachment`.

---

## User Management (Basic)

### Create user
**POST** `/api/user`

**Body**
```json
{ "email": "string", "name": "string", "password": "string" }
```

### List users
**GET** `/api/user`

### Delete all users
**DELETE** `/api/user`

### Get user by id
**GET** `/api/user/:id`

---

## Notes for Frontend
- Handle `410` on cached endpoints (`/decision-matrix`, `/blueprint`) to trigger regeneration.
- Some routes currently expect server-side usage (AI generation); wire them via server actions or API calls from the frontend.
- Request-store routes are temporary and not durable; do not rely on them for long-term data.
