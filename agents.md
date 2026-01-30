# AI Development Guidelines - Test REST Router

## 🛠 Build, Lint, & Test Commands

### Root Workspace
- **Lint All**: `npm run lint` (in `client` and `server`)
- **Type Check**: `npm run lint` (runs `tsc` or `tsc -b`)

### Frontend (client/)
- **Dev Server**: `cd client && npm run dev`
- **Build**: `cd client && npm run build`
- **Test (All)**: `cd client && npm run test`
- **Test (Single File)**: `cd client && npx vitest run src/pages/login-page.test.tsx`
- **Lint**: `cd client && npm run lint`

### Backend (server/)
- **Dev (Watch)**: `cd server && npm run dev`
- **Start**: `cd server && npm run start`
- **Test (All)**: `cd server && npm run test`
- **Test (Single File)**: `cd server && node --test src/auth.test.ts`
- **Lint**: `cd server && npm run lint`

---

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
- **Types vs Interfaces**: Prefer `type` for unions/aliases, `interface` for object structures (consistent with existing `AuthProviderProps`, `LoginData`).
- **Null Safety**: Use strict null checks. Prefer `null` over `undefined` for state.
- **Type Assertions (`as`)**:
  - **Restrict Usage**: Avoid `as` assertions. Never use them for API responses, `JSON.parse`, or external data.
  - **Zod Validation**: Use `zod` schemas to parse and validate dynamic data instead of asserting types.
  - **Mandatory Comments**: If `as` is unavoidable (e.g., DOM elements in tests, library type narrowing), add a comment explaining why it is absolutely needed.
    - Example: `// WHY: Testing-library returns HTMLElement; narrowing to HTMLInputElement for .value access.`

### 3. Imports
- Use named exports.
- Import types using `import type { ... }`.
- Follow local directory structure: `../../shared/schemas.ts` or local paths.

### 4. Error Handling
- **Throw Early**: Throw on all error conditions.
- **Catching**: Use `unknown` in catch blocks and type guard (e.g., `error instanceof Error`).
- **Hooks**: In React, use `onError` in TanStack Query or standard try/catch in effects.

### 5. Frontend (React 19)
- **Data Fetching**: Use `@tanstack/react-query`.
- **State**: Use Context API for global state (Auth, Theme).
- **Styling**: Inline styles or CSS-in-JS (mimic `main-layout.tsx`).

### 6. Backend (Express 5.2 / Node 24)
- **Runtime**: Native TypeScript execution via Node 24 (no transpiler).
- **Testing**: Use Node's native test runner (`node --test`) with `supertest`.
- **Middleware**: Use `helmet`, `cors`, `cookie-parser`, and `morgan`.

---

## 🔍 Validation Protocol
1. **Ambiguity**: Stop and ask if requirements are unclear.
2. **Docs**: Only ISO, RFC, W3C, ECMA, and official vendor docs are authoritative.
3. **Quality**: Ensure at least 90% test coverage for new features.
