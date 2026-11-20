# Project Guidelines & Strict Rules

This repository is a full-stack TypeScript project structured into two distinct sub-projects:
- `frontend`: Nuxt 3 application with Vue 3 and TypeScript.
- `backend`: Node.js + Express application with strict TypeScript.

Whenever any instruction, modification, bugfix, or new feature is requested by the user, **YOU MUST STRICTLY FOLLOW THESE RULES AT ALL TIMES**:

---

## 1. Tightly Coupled TypeScript (Zero Tolerance for Loose Types)
- **Strict Mode Always**: `strict: true` is enabled across both frontend and backend.
- **Never Use `any`**: Explicitly forbid `any` or loose types (`unknown` may be used only with strict type guards).
- **Explicit Interfaces & Types**:
  - Backend: All Request body, query params, URL route params, response bodies, and domain models MUST have strongly typed interfaces or DTO types.
  - Frontend: All props, emits, component models, API response types, and composables MUST be strongly typed using TypeScript interfaces/types.
- **Strict Return Types**: All functions, methods, composables, controllers, and service methods MUST declare explicit return types.
- **Exhaustive Type Checks**: Use exhaustive checks for enums and union types.

---

## 2. Path Aliases (`@/*`) - Mandatory
- **Frontend**: ALWAYS use `@/...` (resolves to the `frontend/` root) for importing components, composables, types, assets, and layouts.
  - Example: `import type { User } from '@/types/user.types'`
  - Example: `import AppButton from '@/components/common/AppButton.vue'`
- **Backend**: ALWAYS use `@/...` (resolves to `backend/src/*`) for importing controllers, services, middlewares, types, utils, and config.
  - Example: `import { UserService } from '@/services/user.service'`
  - Example: `import type { ApiResponse } from '@/types/common.types'`
- **NO relative path traversal**: Avoid `../../..` relative import spaghetti.

---

## 3. Clean, Modular, and Reusable Components (Frontend)
- **Single Responsibility Principle**: Each component must do one thing well.
- **Composition API `<script setup lang="ts">`**: Always use `<script setup lang="ts">`.
- **Typed `defineProps` and `defineEmits`**: Use runtime-compiled TypeScript generic signatures (`defineProps<{ ... }>()`, `defineEmits<{ ... }>()`).
- **Atomic & Modular Structure**:
  - `components/common/`: Generic, reusable primitive UI components (buttons, badges, cards, inputs, modals).
  - `components/features/`: Domain-specific components composed of common primitives.
- **Scoped Styles / Consistent CSS**: Never leak styles globally; use scoped CSS or standard utility classes.

---

## 4. Well-Structured Code & Clean Architecture (Backend)
- **Layered Architecture**:
  - `src/config/`: Strongly typed configuration and environment variable loading with validation.
  - `src/controllers/`: HTTP boundary (parses input, invokes services, formats standard API responses).
  - `src/services/`: Pure business logic (framework-agnostic, decoupled from Express request/response objects).
  - `src/routes/`: Router registration with validation and error-handling middlewares.
  - `src/middlewares/`: Error handling, request logging, input validation, and security.
  - `src/types/`: Dedicated TypeScript interfaces, DTOs, and type definitions.
  - `src/utils/`: Standardized response wrappers (`ApiResponse`), custom `AppError` classes, and helpers.
- **Standardized API Responses**:
  - Success: `{ success: true, data: T, message?: string, timestamp: string }`
  - Error: `{ success: false, error: { message: string, code?: string, details?: unknown }, timestamp: string }`
- **Centralized Error Handling**: Never send raw error stacks or unhandled rejections to clients. Throw typed `AppError` instances caught by the global error middleware.

---

## 5. Husky Git Hooks (Pre-Commit and Pre-Push)
- **Pre-Commit**:
  - Must run linting and typecheck verification on both `frontend` and `backend`.
  - Commits that fail lint or type checks will be blocked.
- **Pre-Push**:
  - Must run full typecheck and build validation on both `frontend` and `backend`.
  - Pushes with broken builds or failing checks will be blocked.

---

## 6. Linting & SonarQube Clean Code Standards
- **ESLint**: Zero lint warnings or errors. Follow recommended TypeScript and Vue rules.
- **SonarQube**:
  - Keep cognitive complexity low.
  - Prevent code duplication.
  - Ensure zero security vulnerabilities and zero code smells.
  - Configuration defined in root `sonar-project.properties`.

---

## 7. Persistent Rule Enforcement
- Whenever the user asks to add or change functionality:
  1. Adhere strictly to these conventions.
  2. Maintain TypeScript strict typing.
  3. Keep components clean, reusable, and typed.
  4. Use `@/*` aliases exclusively.
  5. Verify that linting and type-checking pass before concluding.
