# Apollo 🚀 - Engineering Project Planning Platform

<p align="center">
  <strong>From Idea to Buildable Blueprint</strong>
</p>

<p align="center">
  Apollo is an AI-powered engineering project planning system that transforms raw project ideas into detailed, actionable build guides through structured decision-making.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a>
</p>

---

## 🎯 Problem Statement

Engineering students often struggle with project planning:
- Randomly selecting components without considering compatibility
- Discovering cost or availability issues too late in the process
- Ending up with incomplete demos and shallow understanding
- Wasting time on incompatible parts and redesigns

**Apollo solves this by enforcing structured engineering decisions before any building begins.**

---

## ✨ Features

### 🧠 Three-Stage Workflow

Apollo guides users through a rigorous engineering process:

#### 1. **Decision Matrix** - *"What systems does this project need?"*
- Breaks projects into logical subsystems (sensing, control, power, communication)
- Lists realistic component options for each subsystem
- Explains tradeoffs (cost, complexity, availability, power draw)
- Identifies known engineering problems and mitigations

#### 2. **Blueprint** - *"Given these choices, what does the system look like?"*
- Generates unified architecture from selected options
- Creates block diagrams showing system interconnections
- Estimates total cost and required skills
- Documents risks, constraints, and failure modes

#### 3. **Build Guide** - *"How do I actually build this?"*
- Detailed wiring instructions and pin mappings
- Firmware code structure and libraries
- Calibration and testing procedures
- Common failure points and debugging tips

### 🔧 Additional Features

- **PDF Export** - Generate professional project documentation
- **Persistent Storage** - Projects saved to database with user accounts
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark Mode Support** - Comfortable viewing in any lighting
- **Caching System** - Reduces AI API costs and improves response times

---

## 🏗️ How It Works

```
┌─────────────────┐
│   User Input    │  Project title, goals, constraints
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  1. Decision Matrix     │  AI analyzes and suggests subsystems
│     Generation          │  & component options with tradeoffs
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  2. Option Selection    │  User chooses preferred components
│     & Decisions         │  for each subsystem
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  3. Blueprint           │  AI generates unified system design
│     Generation          │  architecture, block diagrams, costs
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  4. Build Guide         │  AI creates detailed implementation
│     Generation          │  instructions and testing procedures
└─────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kdb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/apollo"
   GEMINI_API_KEY="your-gemini-api-key"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💻 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI component library
- **Hugeicons** - Beautiful icon system

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Google Gemini AI** - AI model for content generation
- **NextAuth.js** - Authentication and session management

### Database
- **PostgreSQL** - Primary database
- **Prisma ORM** - Type-safe database access
- **Supabase** - Managed PostgreSQL (production)

### DevOps
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🏛️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │   Next.js   │  │  React/TSX   │  │  Tailwind CSS  │ │
│  │  Frontend   │  │  Components  │  │    Styling     │ │
│  └──────┬──────┘  └──────────────┘  └────────────────┘ │
└─────────┼───────────────────────────────────────────────┘
          │
          │ HTTP/REST
          ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  API Routes  │  │   AI Calls   │  │  Auth/Session│  │
│  │  (3 Stages)  │  │   (Gemini)   │  │  (NextAuth)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘  │
└─────────┼─────────────────┼────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────┐  ┌──────────────────┐
│   PostgreSQL    │  │  Google Gemini   │
│   (Prisma ORM)  │  │    AI API        │
└─────────────────┘  └──────────────────┘
```

### Key Design Decisions

1. **Caching Strategy** - AI responses cached in PostgreSQL to reduce API costs and improve performance
2. **Type Safety** - Full TypeScript coverage with strict mode enabled
3. **Component Structure** - Atomic design principles with reusable UI components
4. **Error Handling** - Comprehensive error boundaries and user-friendly error messages
5. **Accessibility** - WCAG 2.1 AA compliant components and navigation

---

## 📊 Project Structure

```
app/
├── api/                    # API routes
│   ├── generate/          # AI generation endpoints
│   └── projects/          # Project management
├── app/                   # Main application pages
│   ├── decision-matrix/   # Stage 1: Decision making
│   ├── blueprint/         # Stage 2: System design
│   └── build-guide/       # Stage 3: Implementation
├── auth/                  # Authentication pages
├── getting-started/       # Documentation page
└── page.tsx              # Landing page

components/               # Reusable UI components
├── ui/                  # shadcn/ui components
├── decision-matrix/     # Decision matrix components
├── blueprint/          # Blueprint components
└── error/              # Error handling components

lib/                     # Utility functions and types
├── definitions.ts      # TypeScript type definitions
├── prisma.ts          # Database client
└── pdfGenerator.ts    # PDF export functionality

schema/                  # Dummy data and schemas
├── decision-matrix-dummy.ts
├── air-quality-result.ts
└── build-guide-dummy.ts

prisma/                  # Database schema
└── schema.prisma       # Prisma schema definition
```

---

## 🧪 Development

### Running Tests

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build
```

### Environment Modes

- **Development** (`npm run dev`) - Hot reload, debug logging
- **Production** (`npm run build && npm start`) - Optimized build

### Dummy Data Mode

For development without AI API costs, enable dummy data mode:

1. Visit `/app`
2. Toggle "Use Demo Data" switch
3. View sample decision matrix, blueprint, and build guide

---

## 🎓 Best Practices

When using Apollo for your projects:

1. **Be Specific** - Clear project titles yield better subsystem suggestions
2. **State Constraints Early** - Budget, timeline, and availability matter
3. **Review Tradeoffs** - Cheaper parts may lack features; powerful parts may exceed power budgets
4. **Don't Skip Stages** - Each stage builds on the previous
5. **Iterate** - Refine decisions based on blueprint feedback

---

## 🚧 Current Status

### ✅ Implemented
- ✅ Three-stage workflow (Decision Matrix → Blueprint → Build Guide)
- ✅ AI-powered content generation with Gemini
- ✅ User authentication and project persistence
- ✅ PDF export functionality
- ✅ Responsive UI with dark mode
- ✅ Error handling and loading states
- ✅ Database caching for AI responses

### 🔄 In Progress
- 🔄 Enhanced error recovery mechanisms
- 🔄 Rate limiting improvements
- 🔄 UI/UX polish

### 📋 Roadmap
- 📋 Component library expansion
- 📋 Team collaboration features
- 📋 Advanced analytics dashboard
- 📋 Mobile app

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Passes TypeScript type checking
- Follows the existing code style
- Includes appropriate error handling
- Updates documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** - AI model powering content generation
- **shadcn/ui** - Beautiful, accessible UI components
- **Next.js Team** - Amazing React framework
- **Vercel** - Deployment and hosting platform

---

## 📧 Contact

For questions or support:
- Open an issue on GitHub
- Email: [your-email@example.com]

---

<p align="center">
  Built with ❤️ for engineering students
</p>
