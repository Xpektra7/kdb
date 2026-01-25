# Apollo 🚀

**A structured engineering project planning system**

Apollo helps engineering students turn a **project idea** into a **clear, buildable plan**.
Instead of dumping inspiration or random advice, Apollo forces **engineering decisions** and shows **how each choice affects the final system**.

## The Problem Apollo Solves

Most students:

* Pick a project idea
* Randomly choose sensors, MCUs, and power systems
* Realize too late that parts are incompatible, expensive, or unavailable.
* End up with half-working demos and shallow understanding

Apollo fixes this by **slowing the user down in the right places**.


## How Apollo Thinks (Very Important)

Apollo does **not** jump straight to code or wiring.

It always follows **three layers**, in order:

---

### 1️⃣ Decision Matrix — *“What systems does this project need?”*

At this stage, Apollo:

* Breaks the project into **subsystems** (like sensing, control, power)
* Lists **realistic options** for each subsystem
* Explains **why each option works**
* Shows **tradeoffs** (cost, complexity, availability)

Nothing is built yet.
This stage exists to prevent bad early decisions.

---

### 2️⃣ Blueprint — *“Given these choices, what does the project look like?”*

Once decisions are made, Apollo:

* Freezes the chosen subsystems
* Produces a **single coherent system architecture**
* Shows how everything fits together
* Estimates cost and required skills
* Identifies risks and constraints

This is a **design document**, not a tutorial.

---

### 3️⃣ Build Guide — *“How do I actually build this?”* (later)

Only after the blueprint is finalized:

* Wiring and pin mappings
* Code structure
* Calibration steps
* Testing and validation
* Common failure points


## What Apollo Is (and Is Not)

### Apollo **IS**

* Decision-driven
* Engineering-first
* System-level
* Execution-focused

### Apollo **IS NOT**

* A chat bot
* A project idea generator
* A YouTube replacement
* A copy-paste code tool


## Current Project Scope

* Engineering projects only (IoT, embedded, systems)
* No pure CS or design projects yet
* Theory appears **only when it explains a real system**
* AI responses are **strictly structured JSON**
* UI polish is secondary to correctness



## System Architecture (Technical Overview)

```text
User (Frontend)
    |
    | enters project title
    v
Next.js Frontend
    |
    | POST /api/generate/decision-matrix
    v
Next.js Backend (API Route)
    |
    | 1. Check PostgreSQL cache
    | 2. If not found → call OpenAI
    | 3. Validate JSON output
    | 4. Save to cache
    v
Supabase (PostgreSQL)
```


## Why We Use Caching

* AI calls are expensive and rate-limited
* The same project title may be requested multiple times
* Cached results:

  * Reduce cost
  * Prevent rate-limit crashes
  * Speed up responses


## Data Models (Simplified)

### Decision Matrix (Current Focus)

Each project produces:

* Project concept
* Known engineering problems + mitigations
* Subsystems (based on abstract block diagram)
* Options per subsystem with tradeoffs
* Estimated cost and availability (local context)

This is stored as **JSON**, not text.


## Tech Stack

### Frontend

* Next.js (App Router)
* Tailwind CSS
* shadcn/ui
* JSON → UI component rendering

### Backend

* Next.js API Routes
* OpenAI Responses API
* Schema-locked prompts (JSON only)

### Database

* Supabase (PostgreSQL)
* Prisma ORM
* Used mainly as an AI response cache



## Current State of the Project

### What Works Now

* Decision Matrix schema finalized ( there's still room for improvement )
* AI generates structured JSON 
* Backend API route is functional
* Frontend can fetch and parse results
* Loading and error states exist
* Turning JSON into readable UI blocks
* Blueprint schema
* Option selection UI

### What Is Being Worked On

* Prisma + Supabase integration
* Stable caching logic
* Prompt refinement (simplicity > features)
* Saving results as PDF
* Homepage

### What Comes Next

* Build Guide generation
* Authentication & saved projects
* Make Block diagram diagramattic 

## How Teammates Can Contribute

### Backend

* User management system : signin, login, authenticate, prompt rate control
* Improve caching logic
* Handle Gemini rate limits gracefully
* Validate AI output against schema

### Frontend
* Improve Block diagram
* Improve loading and error UX

### Product

* Stress-test decision logic
* Identify missing subsystems
* Ensure outputs feels *engineering-realistic*



## Guiding Principle

> If Apollo ever starts behaving like ChatGPT, we’ve failed.

Everything must stay **structured, constrained, and decision-focused**.

