# AI Test REST Router - Project Overview

## Project Goal

Create a basic web application that demonstrates how to build a modern SPA using:
- React and React Router on the frontend
- Express on the backend

The client offers three pages accessible via the router using a side menu.

## Status: Fully Implemented ✅

### Frontend
- React 19.2 + Vite with hot module reload
- React Router v7 for navigation with protected routes
- TanStack React Query 5.90 for data fetching & caching
- Zod 4.3 for schema validation
- Three main pages: Home, About, Settings
- Login page with authentication
- Theme support (light/dark mode with system preference detection)
- Comprehensive test coverage with Vitest + Playwright

### Backend
- Express 5.2 on Node 24 with native TypeScript execution
- No build step required - `node --watch src/index.ts` for dev
- Authentication middleware with session management
- Config service for session timeout settings (1-1440 minutes)
- Session service for auth state management
- Full route protection
- Integration tests using supertest

### Shared
- Zod schemas for type-safe validation across client & server
- Shared types: User, Options, Login, ServerInfo

## Architecture

```
ai-test-rest-router/
├── client/                 # React SPA
│   ├── src/
│   │   ├── pages/         # Home, About, Settings, Login
│   │   ├── layouts/       # MainLayout with side menu
│   │   ├── components/    # ProtectedRoute, etc.
│   │   ├── contexts/      # AuthProvider, ThemeProvider
│   │   ├── hooks/         # Custom hooks (useTheme)
│   │   ├── shared/        # Client-side schemas
│   │   └── test/          # Test setup & wrappers
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # auth.routes, api.routes
│   │   ├── middleware/    # auth.middleware
│   │   ├── services/      # config.service, session.service
│   │   ├── shared/        # Server-side schemas
│   │   ├── app.ts         # Express app factory
│   │   ├── index.ts       # Entry point
│   │   └── *.test.ts      # Test files
│   ├── vitest.config.ts
│   ├── tsconfig.json
│   └── package.json
├── shared/                 # Shared schemas & types
│   └── schemas.ts
├── agent.md               # AI behavior configuration
├── .prettierrc             # Prettier config (tabs, single quotes)
└── package.json           # Root package (monorepo)
```

## Key Features Implemented

### Authentication & Authorization
- Login system with username/password
- Session-based authentication
- Protected routes that redirect to login
- Session timeout configuration (configurable 1-1440 minutes)
- Cookie-based session management

### Frontend Pages
1. **Login Page** - Authentication form with error handling
2. **Home Page** - Protected dashboard
3. **About Page** - Server info display (Node version, Express version, current user, timestamps)
4. **Settings Page** - Session timeout configuration with form validation

### State Management
- Native React hooks (useState, useContext)
- React Query for server data fetching & caching
- Custom auth context for user state
- Custom theme context for dark/light mode

### Theme System
- Light/dark mode toggle
- System preference detection
- LocalStorage persistence
- CSS-in-JS styling

### Testing
- **Frontend**: Vitest + @vitest/browser + Playwright
  - Unit tests for pages and layouts
  - Screenshot tests for visual regression
  - Integration tests for routing & auth flow
  - ~90% code coverage target
- **Backend**: Node native test runner + supertest
  - Auth flow tests
  - Route protection tests
  - Integration tests
  - Config & session service tests

## Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | React 19.2.0 |
| **Frontend Routing** | React Router DOM 7.13 |
| **Data Fetching** | TanStack React Query 5.90 |
| **Validation** | Zod 4.3 |
| **Backend Framework** | Express 5.2 |
| **Runtime** | Node.js 24.x (native TypeScript) |
| **Build Tool (Client)** | Vite 7.2 |
| **Testing Framework** | Vitest 2.1 + Node native test |
| **E2E/Visual Testing** | Playwright 1.58 |
| **HTTP Testing** | supertest 7.2 |
| **Linting** | ESLint 9.39 + typescript-eslint 8.54 |
| **Code Formatting** | Prettier 3.8 |
| **Security** | Helmet 8.1 |
| **Logging** | Morgan 1.10 |
| **Middleware** | CORS, Cookie Parser |

## Development Ports

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## Code Quality Standards

### TypeScript
- Strict null checks enforced
- No `any` types (use type guards & union types)
- Named exports preferred
- Semicolons required
- Async/await for async operations
- JSDoc comments for functions
- Target: ES2022
- Assume Prettier config: tabs, single quotes, bracket spacing false

### ESLint Configuration
- `@typescript-eslint/recommended-type-checked` + `stylistic-type-checked`
- `eslint-plugin-import-x` for import validation
- `eslint-plugin-jsdoc` for documentation
- `eslint-plugin-react` & `eslint-plugin-react-hooks` (client only)
- `eslint-plugin-regexp` for regex safety
- `eslint-plugin-unicorn` for code consistency
- `@vitest/eslint-plugin` for test linting

### Testing
- Target 90%+ code coverage
- Use `@vitest/coverage-v8` for coverage reports
- Browser tests with `@vitest/browser` (Playwright backend)
- Screenshot tests for visual regression

### Data Validation
- All external data must be validated with Zod
- Use shared schemas for client-server communication
- Type safety at runtime

### General Principles
- Semantic minimalism - eliminate non-essential tokens
- Concision over verbosity
- No polyfills or legacy CommonJS
- ESM by default
- No compilation/bundling for backend (native TypeScript execution)

## API Endpoints (Server)

### Authentication Routes
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout user

### API Routes
- `GET /api/server-info` - Get server info (Node version, Express version, current user, timestamps)
- `PUT /api/config` - Update configuration (session timeout)
- `GET /api/config` - Get current configuration

### Static Files
- Static middleware with SPA fallback for client routing

## Development Workflow

### Client Development
```bash
cd client
npm install
npm run dev      # Start Vite dev server on port 5173
npm run test     # Run tests with Vitest
npm run lint     # Type check & lint
npm run build    # Build for production
```

### Server Development
```bash
cd server
npm install
npm run dev      # Start with node --watch
npm run test     # Run tests with Node test runner
npm run lint     # Type check & lint
npm start        # Production start
```

### Shared Package
```bash
cd shared
npm install      # Install zod dependency
```

## Key Files & Locations

### Frontend Entry Points
- `client/src/main.tsx` - React app initialization
- `client/src/app.tsx` - Route definitions
- `client/src/pages/` - Page components

### Backend Entry Points
- `server/src/index.ts` - Server startup
- `server/src/app.ts` - Express app factory
- `server/src/routes/` - Route handlers

### Shared Schemas
- `shared/schemas.ts` - Zod schemas for validation

### Configuration Files
- `client/vite.config.ts` - Vite bundler config
- `server/vitest.config.ts` - Test runner config
- `**/tsconfig.json` - TypeScript configs
- `**/eslint.config.js` - ESLint rules
- `.prettierrc` - Code formatter (tabs, single quotes)

## Recent Implementation Details

### Settings Page Features
- Validates session timeout input (1-1440 minutes)
- Shows current theme preference
- Handles system theme change detection
- Persists settings to localStorage
- Integrates with server config API
- Error handling for failed updates
- Loading states for async operations

### Login Page Features
- Username/password form validation
- Error messaging for failed login attempts
- Redirect on successful authentication
- Handles non-Error objects in error catch blocks
- Session persistence in localStorage

### About Page Features
- Fetches and displays server info (Node version, Express version)
- Shows current user info (username, fullName, loginTimestamp)
- Server timestamps (startTimestamp, serverTime)
- Fallback UI when data unavailable

## Browser Compatibility
- Modern browsers (ES2022 target)
- React 19 requirement

## Deployment
- Static middleware with regex SPA fallback in Express
- Client built with Vite for production
- Server runs as Node.js process
- Recommended: PM2, Docker, or similar for process management

---

**This document serves as the complete project specification and context for AI-assisted development.**
