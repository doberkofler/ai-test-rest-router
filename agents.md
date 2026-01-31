# AI Development Guidelines - Test REST Router

Always keep this file updated when the project changes.

## 🛠 Build, Lint, & Test Commands

### Root Workspace (NPM Workspaces)
- **Install All**: `npm install`
- **CI**: `npm run ci` (lint, format:check, test, build, test:e2e)
- **Lint All**: `npm run lint` (runs `eslint .` from root)
- **Format Check**: `npm run format:check` (runs `prettier --check .`)
- **Build All**: `npm run build` (builds all workspaces)
- **Test All**: `npm run test` (runs tests in all workspaces)
- **E2E Tests**: `npm run test:e2e`

### Frontend (client/)
- **Dev Server**: `npm run dev -w client`
- **Build**: `npm run build -w client`
- **Test**: `npm run test -w client`
- **Single Test**: `cd client && npx vitest run src/pages/login-page.test.tsx`

### Backend (server/)
- **Dev**: `npm run dev -w server`
- **Start**: `npm run start -w server`
- **Test**: `npm run test -w server`
- **Single Test**: `cd server && node --test src/auth.test.ts`

### Shared (@shared/logic)
- **Lint**: handled by root lint.
- **Tests**: `npm run test -w shared` (placeholder)

## 📐 Code Style & Conventions

### 1. General Principles
- **Conciseness**: Avoid verbosity. Use semantic minimalism.
- **Strict Typing**: No `any`. Use `zod` for all external data validation.
- **Tabs**: Use tabs for indentation (as per `.prettierrc`).
- **Quotes**: Use single quotes.
- **Semicolons**: Always use semicolons.
- **Prettier Settings**:
	- `printWidth`: 160
	- `useTabs`: true
	- `singleQuote`: true
	- `bracketSpacing`: false
	- `embeddedLanguageFormatting`: "off"

### 2. TypeScript & Naming
- **Naming**: 
  - Components/Classes: `PascalCase`
  - Variables/Functions/Files: `kebab-case` for files, `camelCase` for logic.
  - Constants: `SCREAMING_SNAKE_CASE` for global constants.
- **Types vs Interfaces**: Prefer `type` for unions/aliases, `interface` for object structures.
- **Null Safety**: Use strict null checks. Prefer `null` over `undefined` for state.
- **Type Assertions (`as`)**:
  - **Restrict Usage**: Avoid `as` assertions. Never use them for API responses, `JSON.parse`, or external data.
  - **Zod Validation**: Use `zod` schemas to parse and validate dynamic data.
  - **Mandatory Comments**: If `as` is unavoidable, add a comment explaining why (e.g., `// WHY: Testing-library narrowing`).

### 3. Imports & Workspaces
- **Shared Code**: Import from `@shared/logic`.
- **Relative Paths**: Avoid deeply nested relative paths (e.g., `../../../`). Use workspace packages.
- **Type Imports**: Use `import type { ... }`.

### 4. Error Handling
- **Centralized Backend**: Use the global error middleware in `server/src/app.ts`.
- **Frontend resilience**: Use the `ErrorBoundary` component.
- **Throw Early**: Throw on all error conditions.
- **API Communication**: Use the centralized `apiClient` in `client/src/services/api-client.ts`.

### 5. Frontend (React 19 + MUI)
- **Styling**: Use MUI components and `sx` props. Avoid raw CSS/SCSS where possible.
- **Data Fetching**: Use `@tanstack/react-query` with `apiClient`.
- **Theme**: Use `ThemeContext` and MUI's `ThemeProvider`.

### 6. Backend (Express 5.2 / Node 24)
- **Runtime**: Native TypeScript execution.
- **Middleware**: `helmet`, `cors`, `cookie-parser`, `morgan`.
- **Session**: Memory-based `SessionService` with background cleanup.

### 7. Testing
- **Unit/Integration**: Vitest 4 (client), Node Native Runner (server).
- **Browser Mode**: Client tests use `@vitest/browser-playwright` and run headless by default.
- **E2E**: Playwright (in `e2e/` directory).
- **Quality**: Ensure at least 90% test coverage for new features.

### 8. Infrastructure & Proxy
- **Vite Proxy**: In development, Vite is configured to proxy `/api` requests to the backend server (port 3000). This bypasses CORS issues during local development.
- **Server CORS**: The backend maintains a generalized CORS configuration as a fallback for non-proxied or cross-origin requests.

---

## 🔍 Validation Protocol
1. **Ambiguity**: Stop and ask if requirements are unclear.
2. **Docs**: Only ISO, RFC, W3C, ECMA, and official vendor docs are authoritative.
