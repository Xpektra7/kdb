# Apollo Database Schema Design

**Document Purpose:** Architecture and design decisions for Apollo's database schema to support the 3-stage engineering project planning system.

---

## Table of Contents

1. [Core Concept](#core-concept)
2. [Data Flow](#data-flow)
3. [Entity Relationship Diagram](#entity-relationship-diagram)
4. [Detailed Models](#detailed-models)
5. [Query Patterns](#query-patterns)
6. [Future Considerations](#future-considerations)

---

## Core Concept

Apollo manages **engineering projects** through **3 distinct stages**:

1. **Decision Matrix Stage** — User explores subsystems and options
2. **Blueprint Stage** — User locks choices and gets integrated design
3. **Build Guide Stage** *(future)* — Step-by-step construction instructions

**Database must support:**
- Multiple projects per user
- Tracking progress through stages
- Storing AI-generated content (JSON)
- User decision history
- Caching to reduce API costs

---

## Data Flow

```
User Creates Project
         ↓
Project enters DECISION_MATRIX stage
         ↓
Apollo generates subsystems + options (cached in DB)
         ↓
User selects options for each subsystem
         ↓
Selections saved as ProjectDecisions
         ↓
Project moves to BLUEPRINT stage
         ↓
Apollo generates architecture (cached in DB)
         ↓
User can export, save, or edit
         ↓
Project moves to BUILDING or COMPLETED
```

---

## Entity Relationship Diagram

```
User (1) ─────────────┬─────→ (Many) Project
                      │
                      ├─────→ (Many) Credit
                      │
                      ├─────→ (Many) Usage
                      └─────→ (1) Profile

Project (1) ─────────────┬─────→ (Many) Subsystem
                         │
                         ├─────→ (Many) ProjectDecision
                         │
                         ├─────→ (1) DecisionMatrixResult
                         │
                         └─────→ (1) BlueprintResult

Subsystem (1) ─────────────┬─────→ (Many) SubsystemOption
                           │
                           └─────→ (Many) ProjectDecision

SubsystemOption (1) ─────────→ (Many) ProjectDecision

ProjectDecision ─────→ logs which option user selected
```

---

## Detailed Models

### 1. **User** (Already exists — minor adjustments)

```typescript
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String?
  role      Role      @default(USER)  // ADMIN, USER, MODERATOR
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  profile      Profile?
  credits      Credit?
  accounts     Account[]
  sessions     Session[]
  usages       Usage[]
  projects     Project[]      // NEW: All projects by this user

  @@map("users")
}
```

**Purpose:** Identify who is doing engineering projects

---

### 2. **Project** (Enhanced)

```typescript
enum ProjectStage {
  IDEATION                  // User just entered project title
  DECISION_MATRIX           // Generating/exploring subsystems
  DECISION_MATRIX_COMPLETE  // User selected all options
  BLUEPRINT                 // Generating final design
  BLUEPRINT_COMPLETE        // Final design locked
  BUILDING                  // User is constructing
  COMPLETED                 // Project finished
}

model Project {
  id          Int          @id @default(autoincrement())
  userId      Int
  
  title       String       // e.g., "Automatic Plant Watering System"
  description String?
  stage       ProjectStage @default(IDEATION)
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Relations
  user              User                    @relation(fields: [userId], references: [id], onDelete: Cascade)
  subsystems        Subsystem[]             // All subsystems for this project
  decisions         ProjectDecision[]       // All user decisions
  decisionMatrix    DecisionMatrixResult?   // Cached AI output
  blueprint         BlueprintResult?        // Cached AI output
  
  @@index([userId])
  @@map("projects")
}
```

**Purpose:** Container for a single engineering project

**Key Fields:**
- `title` — What the user is building
- `stage` — Tracks where in the 3-stage process they are
- `userId` — Whose project is this

---

### 3. **Subsystem**

```typescript
model Subsystem {
  id        Int     @id @default(autoincrement())
  projectId Int
  
  name      String  // e.g., "Power Source", "Motor Control", "Sensing"
  description String?
  order     Int     // Position in list (1st, 2nd, 3rd...)
  
  // Relations
  project   Project           @relation(fields: [projectId], references: [id], onDelete: Cascade)
  options   SubsystemOption[] // All options for this subsystem
  decisions ProjectDecision[] // Which option was selected
  
  @@index([projectId])
  @@map("subsystems")
}
```

**Purpose:** Represent a "part" of the project

**Examples:**
- Power Source (for plant watering system)
- Motor Control (for door lock)
- Sensing (for any project)

**Note:** Apollo breaks down projects into subsystems automatically

---

### 4. **SubsystemOption**

```typescript
model SubsystemOption {
  id              Int     @id @default(autoincrement())
  subsystemId     Int
  
  name            String  // e.g., "9V Battery", "Solar Panel", "USB Power"
  description     String  @db.Text
  whyItWorks      String  @db.Text  // Engineering explanation
  
  // Tradeoffs
  pros            String[] @db.Text  // Array: ["Cheap", "Reliable", "Easy to find"]
  cons            String[] @db.Text  // Array: ["Heavy", "Needs recharge"]
  estimatedCost   String  // e.g., "₦2,500 - ₦5,000"
  availability    String  // e.g., "Common in Nigeria", "Import only"
  
  // Optional
  imageUrl        String?
  datasheet       String? // Link to technical spec
  
  // Relations
  subsystem       Subsystem        @relation(fields: [subsystemId], references: [id], onDelete: Cascade)
  selections      ProjectDecision[] // How many users picked this
  
  @@index([subsystemId])
  @@map("subsystem_options")
}
```

**Purpose:** A single choice for a subsystem

**Key Fields:**
- `name` — What is this option called
- `whyItWorks` — Why you'd use this (not marketing fluff, engineering reasoning)
- `pros/cons` — Real tradeoffs
- `estimatedCost` — Budget impact
- `availability` — Can you actually buy this in Nigeria?

**Data Source:** AI-generated via prompt, cached in DB

---

### 5. **ProjectDecision**

```typescript
model ProjectDecision {
  id                Int       @id @default(autoincrement())
  projectId         Int
  subsystemId       Int
  selectedOptionId  Int
  
  decidedAt         DateTime  @default(now())
  
  // Relations
  project       Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)
  subsystem     Subsystem       @relation(fields: [subsystemId], references: [id], onDelete: Cascade)
  selectedOption SubsystemOption @relation(fields: [selectedOptionId], references: [id], onDelete: Cascade)
  
  @@unique([projectId, subsystemId])  // One decision per subsystem
  @@index([projectId])
  @@map("project_decisions")
}
```

**Purpose:** Record what the user chose

**Why a separate table?**
- Track decision history (when did they decide?)
- Validate that all subsystems have decisions before moving to blueprint
- Support "change your mind" functionality

**Example Row:**
```
projectId: 42
subsystemId: 1 (Power Source)
selectedOptionId: 3 (Solar Panel)
decidedAt: 2026-01-28 14:30:00
```

---

### 6. **DecisionMatrixResult**

```typescript
model DecisionMatrixResult {
  id          Int       @id @default(autoincrement())
  projectId   Int       @unique
  
  // Raw AI output (cache this to avoid re-calling API)
  aiOutput    Json      // Full JSON from Apollo's decision matrix generation
  
  // Parsed data (optional, for quick queries)
  projectTitle    String?
  concept         String?
  problemsOverall Json?   // Problems the project needs to solve
  skillsRequired  String?
  
  generatedAt DateTime  @default(now())
  expiresAt   DateTime  @default(dbgenerated("NOW() + INTERVAL '30 days'"))
  
  // Relations
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId])
  @@map("decision_matrix_results")
}
```

**Purpose:** Cache AI-generated decision matrix

**Why cache?**
- Gemini API calls cost money
- Same project might be requested multiple times
- Expiry strategy prevents stale data

**Structure:**
```json
{
  "project": "Automatic Plant Watering System",
  "concept": "Water plants when soil is dry",
  "research": ["..."],
  "problems_overall": [
    {
      "problem": "Plants die if overwatered",
      "suggested_solution": "Use soil moisture sensor"
    }
  ],
  "decision_matrix": [
    {
      "subsystem": "Power Source",
      "options": [
        {
          "name": "9V Battery",
          "why_it_works": "...",
          "pros": ["Cheap", "..."],
          "cons": ["Needs replacement", "..."],
          "estimated_cost": "₦1000",
          "availability": "Common"
        }
      ]
    }
  ]
}
```

---

### 7. **BlueprintResult**

```typescript
model BlueprintResult {
  id          Int       @id @default(autoincrement())
  projectId   Int       @unique
  
  // Raw AI output
  aiOutput    Json      // Full JSON from Apollo's blueprint generation
  
  // Parsed data (for display)
  architecture        String?      // Overview description
  blockDiagram        Json?        // Diagram data structure
  estimatedTotalCost  String?      // e.g., "₦25,000 - ₦35,000"
  requiredSkills      String[]     // ["Soldering", "Basic Arduino", "C++"]
  executionSteps      String[]     // ["Step 1: ...", "Step 2: ...", ...]
  
  generatedAt DateTime  @default(now())
  expiresAt   DateTime  @default(dbgenerated("NOW() + INTERVAL '90 days'"))
  
  // Relations
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId])
  @@map("blueprint_results")
}
```

**Purpose:** Cache final blueprint design

**Structure:**
```json
{
  "project": "Automatic Plant Watering System",
  "problem": {
    "statement": "...",
    "constraints": [...]
  },
  "architecture": {
    "overview": "System consists of sensor, controller, and actuator",
    "block_diagram": ["Moisture Sensor", "ESP32", "Water Pump"]
  },
  "components": [
    {
      "subsystem": "Power Source",
      "chosen_option": "Solar Panel with Battery",
      "why_chosen": "Eco-friendly, no wires needed",
      "pros": [...],
      "cons": [...]
    }
  ],
  "execution_steps": ["...", "..."],
  "testing": {...},
  "estimated_total_cost": "₦35,000",
  "skills": "Basic electronics, Arduino programming"
}
```

---

### 8. **BuildGuide** (Future)

```typescript
model BuildGuide {
  id          Int       @id @default(autoincrement())
  projectId   Int       @unique
  blueprintId Int
  
  // AI-generated build instructions
  aiOutput            Json
  wiringInstructions  String @db.Text
  codeStructure       String @db.Text
  calibrationSteps    String[]
  testingProcedures   String[]
  commonFailureModes  String[]
  
  generatedAt DateTime  @default(now())
  
  // Relations
  project     Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)
  blueprint   BlueprintResult @relation(fields: [blueprintId], references: [id])
  
  @@index([projectId])
  @@map("build_guides")
}
```

**Purpose:** Step-by-step construction guide (stage 3)

---

### 9. **Usage** (Already exists — unchanged)

```typescript
model Usage {
  id        Int       @id @default(autoincrement())
  userId    Int
  action    String    // "DECISION_MATRIX_GENERATED", "BLUEPRINT_GENERATED", etc.
  cost      Int       // Cost in credits
  createdAt DateTime  @default(now())
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@map("usages")
}
```

**Purpose:** Track API usage for billing/rate limiting

---

### 10. **Credit** (Already exists — unchanged)

```typescript
model Credit {
  id        Int       @id @default(autoincrement())
  userId    Int       @unique
  balance   Int       @default(10)  // Start with 10 free credits
  updatedAt DateTime  @updatedAt
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("credits")
}
```

**Purpose:** Track user's API budget

---

## Query Patterns

### Pattern 1: Get Full Project with All Decisions

```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    subsystems: {
      include: {
        options: true,
        decisions: { include: { selectedOption: true } }
      }
    },
    decisionMatrix: true,
    blueprint: true
  }
});
```

**Use Case:** Display full project status on dashboard

---

### Pattern 2: Check if All Subsystems Decided

```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    subsystems: {
      include: {
        decisions: { select: { id: true } }
      }
    }
  }
});

const allDecided = project.subsystems.every(s => s.decisions.length > 0);
```

**Use Case:** Before moving to blueprint stage, validate all decisions made

---

### Pattern 3: Get Cached Decision Matrix (or regenerate)

```typescript
let dm = await prisma.decisionMatrixResult.findUnique({
  where: { projectId }
});

if (!dm || new Date() > dm.expiresAt) {
  // Cache expired, regenerate
  const aiOutput = await callGeminiAPI(project);
  dm = await prisma.decisionMatrixResult.upsert({
    where: { projectId },
    update: { aiOutput, generatedAt: new Date() },
    create: { projectId, aiOutput }
  });
}

return dm.aiOutput;
```

**Use Case:** Show decision matrix to user (with smart caching)

---

### Pattern 4: User's Project History

```typescript
const projects = await prisma.project.findMany({
  where: { userId },
  select: {
    id: true,
    title: true,
    stage: true,
    createdAt: true
  },
  orderBy: { updatedAt: 'desc' }
});
```

**Use Case:** Show user's project list on dashboard

---

## Schema Relationships at a Glance

| Table | Relates To | Type | Purpose |
|-------|-----------|------|---------|
| Project | User | N:1 | Which user owns project |
| Subsystem | Project | N:1 | What parts does project need |
| SubsystemOption | Subsystem | N:1 | What choices exist for part |
| ProjectDecision | Project, Subsystem, SubsystemOption | N:1 | Which option did user pick |
| DecisionMatrixResult | Project | 1:1 | Cache decision matrix AI output |
| BlueprintResult | Project | 1:1 | Cache blueprint AI output |
| BuildGuide | Project | 1:1 | Cache build guide (future) |

---

## Future Considerations

### 1. **Versioning**
Currently, changing a decision overwrites the old one. Consider:
```typescript
model ProjectDecisionHistory {
  id          Int
  projectId   Int
  subsystemId Int
  optionId    Int
  decidedAt   DateTime
  changedAt   DateTime?  // If user changed their mind
  changedTo   Int?       // New option ID
}
```

### 2. **Collaboration**
For team projects, add:
```typescript
enum ProjectRole {
  OWNER
  EDITOR
  VIEWER
}

model ProjectCollaborator {
  id        Int
  projectId Int
  userId    Int
  role      ProjectRole
}
```

### 3. **Comments/Feedback**
For design reviews:
```typescript
model DecisionComment {
  id        Int
  decisionId Int
  userId    Int
  text      String
  createdAt DateTime
}
```

### 4. **Cost Tracking**
Implement credit deduction:
```typescript
model APICall {
  id        Int
  userId    Int
  action    String          // "decision_matrix", "blueprint"
  costCredits Int
  successAt DateTime?
}
```

---

## Migration Path

1. ✅ Keep existing `User`, `Account`, `Session`, `VerificationToken`, `Profile`, `Credit`, `Usage`
2. 📝 Enhance `Project` model (add stage, description)
3. ✨ Create new models: `Subsystem`, `SubsystemOption`, `ProjectDecision`, `DecisionMatrixResult`, `BlueprintResult`
4. 🔄 Update backend APIs to use new structure
5. 🎨 Update frontend to consume new data structure

---

## Implementation Notes

- **JSON Storage:** Use PostgreSQL JSON type for AI outputs (searchable, flexible)
- **Indexes:** Add on `userId`, `projectId` for fast lookups
- **Cascade Deletes:** Delete project → deletes all subsystems, decisions, results
- **Timestamps:** Track `createdAt`, `updatedAt` for audit trail
- **Expiry:** Use database triggers or scheduled jobs to clean expired cache

---

## Summary

This schema enables Apollo to:

✅ Manage multiple projects per user  
✅ Track 3-stage progression (Decision Matrix → Blueprint → Build)  
✅ Cache AI outputs to reduce costs  
✅ Record user decisions for history/changes  
✅ Support future features (versioning, collaboration)  
✅ Enable quick queries for dashboards  

The design is **engineering-focused** and **data-driven**, supporting Apollo's mission to make users think through projects systematically.
