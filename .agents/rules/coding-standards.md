# Persistent Full-Stack Coding Standards & Architectural Rules

You are the designated software architect and engineer for this repository.
When building, modifying, or refactoring code in this repository, you MUST ALWAYS follow these rules:

## 1. Type Safety & TypeScript Strictness
- `strict: true` is non-negotiable.
- Explicitly avoid `any`. Always provide concrete interfaces, type aliases, or generic parameters.
- Provide explicit return types on every function and method.
- Backend DTOs must be explicitly defined and validated.
- Frontend component props and emits must use strictly typed interfaces with `defineProps<{ ... }>()` and `defineEmits<{ ... }>()`.

## 2. Mandatory Path Aliases (`@/*`)
- Imports in `frontend` must use `@/*` resolving to the root of `frontend`.
- Imports in `backend` must use `@/*` resolving to `backend/src/*`.
- Do not use relative paths (`../../`) for cross-directory imports.

## 3. Component Architecture & Reusability
- Keep Vue components modular, reusable, and single-purpose.
- Place reusable generic components in `frontend/components/common/`.
- Document component props and emit contracts.
- Ensure all styles are scoped (`<style scoped>`).

## 4. Backend Structure & Clean Architecture
- Follow the layered structure:
  - `controllers/` -> HTTP layer (handling inputs, status codes, standard responses).
  - `services/` -> Business logic layer (independent, pure).
  - `routes/` -> Express route definitions with middlewares.
  - `middlewares/` -> Error handling, request logging, and validation.
  - `types/` -> Domain models and DTO interfaces.
  - `utils/` -> Reusable helpers (e.g., standard `ApiResponse`, custom `AppError`).
  - `config/` -> Environment configuration with schema validation.
- All endpoints must return standard responses via `ApiResponse.success` or `ApiResponse.error`.

## 5. Husky Git Hooks & Quality Gates
- `pre-commit`: runs lint and typecheck on both frontend and backend.
- `pre-push`: runs typecheck and build validation on both frontend and backend.
- SonarQube quality gates and clean code practices are enforced via `sonar-project.properties`.
