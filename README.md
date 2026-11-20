# 🌸 Bloomora - Full-Stack Enterprise Application

Bloomora is a full-stack TypeScript application architected for scale, performance, and clean maintainability.

- **Frontend**: Nuxt 3, Vue 3, TypeScript, Atomic Reusable Components.
- **Backend**: Node.js, Express, TypeScript, Layered Clean Architecture.
- **Remote Repository**: [https://github.com/naveenjangir4733/Bloomora.git](https://github.com/naveenjangir4733/Bloomora.git)

---

## 📁 Repository Structure

```
Bloomora/
├── .agents/
│   └── rules/
│       └── coding-standards.md     # Persistent coding standards for AI Agents
├── .husky/
│   ├── pre-commit                  # Runs lint & typecheck on Frontend & Backend
│   └── pre-push                    # Runs typecheck & build on Frontend & Backend
├── backend/                        # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/                 # Typed environment & configuration
│   │   ├── constants/              # HTTP Status & constants
│   │   ├── controllers/            # Request handlers (User, Health)
│   │   ├── middlewares/            # Centralized error, logger, validation
│   │   ├── routes/                 # Express routers (/api/v1)
│   │   ├── services/               # Pure business logic layer
│   │   ├── types/                  # Domain types, DTOs & response schemas
│   │   ├── utils/                  # Standard ApiResponse & custom AppError
│   │   ├── app.ts                  # Express application setup
│   │   └── server.ts               # Server entry point
│   ├── eslint.config.mjs
│   ├── package.json
│   └── tsconfig.json               # Strict TypeScript with '@/*' path alias
├── frontend/                       # Nuxt 3 + Vue 3 + TypeScript
│   ├── assets/                     # CSS design tokens & typography
│   ├── components/
│   │   └── common/                 # Reusable UI primitives (AppButton, AppCard, AppBadge, AppHeader)
│   ├── composables/                # Strongly typed API client composable (useApi)
│   ├── layouts/                    # Layout wrappers (default.vue)
│   ├── pages/                      # Nuxt pages (Dashboard with User management)
│   ├── types/                      # Frontend TypeScript models & contracts
│   ├── app.vue
│   ├── eslint.config.mjs
│   ├── nuxt.config.ts              # Strict TypeScript, aliases '@/*'
│   ├── package.json
│   └── tsconfig.json
├── AGENTS.md                       # Persistent workspace rules for AI Agents
├── GEMINI.md                       # Persistent workspace rules for Antigravity
├── sonar-project.properties        # SonarQube multi-module configuration
└── package.json                    # Workspace root orchestration & Husky
```

---

## 🏛️ Core Architectural Standards & Rules

### 1. Tightly Coupled TypeScript (Zero Tolerance for Loose Types)
- `strict: true` is enabled across both projects.
- Explicitly avoid `any`. All schemas and payloads are strongly typed.
- Explicit return types are declared for all functions, methods, composables, and controllers.
- Backend DTOs and parameters are validated using **Zod**.
- Frontend components use typed `defineProps<{ ... }>()` and `defineEmits<{ ... }>()`.

### 2. Mandatory Path Aliases (`@/*`)
- **Backend**: `@/*` maps to `backend/src/*` (e.g., `@/controllers/user.controller`, `@/utils/api-response.util`).
- **Frontend**: `@/*` maps to `frontend/*` (e.g., `@/components/common/AppButton.vue`, `@/types`).
- Relative directory traversal (`../../..`) is forbidden.

### 3. Clean, Modular, and Reusable Components (Frontend)
- Adheres to the Single Responsibility Principle.
- Reusable UI primitives located in `frontend/components/common/`.
- Scoped CSS prevents global style leaks.

### 4. Layered Clean Architecture (Backend)
- `routes/` -> defines endpoints and applies validation middlewares.
- `controllers/` -> handles HTTP request/response parsing and calls services.
- `services/` -> encapsulates domain logic independent of Express.
- `middlewares/` -> centralized error handling with custom `AppError`.
- Standard API response structure:
  - Success: `{ success: true, statusCode: 200, message: string, data: T, timestamp: string }`
  - Error: `{ success: false, statusCode: number, message: string, errorCode: string, details?: unknown, timestamp: string }`

### 5. Husky Git Hooks (Pre-Commit and Pre-Push)
- **Commit (`pre-commit`)**: Automatically runs linting and TypeScript checks across both `frontend` and `backend`.
- **Push (`pre-push`)**: Automatically runs typecheck and build validation across both `frontend` and `backend`.

### 6. SonarQube Ready
- `sonar-project.properties` is configured at the root for static analysis, cognitive complexity monitoring, duplication checks, and test coverage mapping.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# Root dependencies (Husky)
npm install

# Backend dependencies
npm install --prefix backend

# Frontend dependencies
npm install --prefix frontend
```

### 2. Run Development Servers
```bash
# Start backend (http://localhost:5000/api/v1)
npm run dev:backend

# Start frontend (http://localhost:3000)
npm run dev:frontend
```

### 3. Automated Quality Verification
```bash
# Run linting across both frontend and backend
npm run lint

# Run typecheck across both frontend and backend
npm run typecheck

# Run production build across both frontend and backend
npm run build
```

---

## 🔗 Remote Repository
```bash
git remote -v
# origin  https://github.com/naveenjangir4733/Bloomora.git (fetch)
# origin  https://github.com/naveenjangir4733/Bloomora.git (push)
```
