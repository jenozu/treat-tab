# Treat Tab — Developer Guide

Mobile-first POS (point-of-sale) register for a small candy business. Built with React 19, TypeScript, Tailwind CSS 4, and optional Supabase persistence.

## Commands

```bash
npm run dev      # Vite dev server on port 3000
npm run build    # Production build → dist/
npm run lint     # TypeScript type-check (tsc --noEmit)
npm test         # Vitest unit tests (run once)
npm run test:watch  # Vitest in watch mode
```

## Architecture

```
src/
  context/
    AppContext.tsx     # Core state: customers, products, sales, payments, modals
    AuthContext.tsx    # Supabase auth: session, signIn/signUp/signOut
  components/
    Header.tsx         # Top bar with DB status + settings gear icon
    BottomNav.tsx      # Sticky 4-tab nav (dashboard/sales/customers/products)
    DashboardTab.tsx   # KPI cards + break-even progress bar
    SalesTab.tsx       # Sales ledger, chart, profit estimator
    CustomersTab.tsx   # Customer list + tab debt management
    ProductsTab.tsx    # Product catalog + stock adjustment
    LoginScreen.tsx    # Email/password auth gate (Supabase only)
    ErrorBoundary.tsx  # Class component: catches render errors per-tab
  modals/
    AddSaleModal.tsx         # Cart builder → record sale
    LogPaymentModal.tsx      # Record debt payment
    AddCustomerModal.tsx     # Register new customer
    AddProductModal.tsx      # Register new product
    EditCustomerModal.tsx    # Edit/delete customer
    EditProductModal.tsx     # Edit/delete product
    OutstandingBalancesModal.tsx  # View all outstanding tabs
    ResetModal.tsx           # Confirm data reset
    SettingsModal.tsx        # Weekly goal + sign out
  hooks/
    useEscapeKey.ts    # Closes modals on Escape key
  utils/
    validation.ts      # Pure validation functions (all forms use these)
  __tests__/
    validation.test.ts # 46 unit tests for validation utils
  supabase.ts          # Supabase client (null when not configured)
  supabaseService.ts   # DB operations with localStorage fallback
  constants.ts         # TabType, ModalType, PRODUCT_CATEGORIES
  types.ts             # Customer, Product, Sale, Payment interfaces
  sampleData.ts        # Initial seed data
```

## Key Design Decisions

**State management**: Single `AppContext` provides all shared state. No external state library — React's `useState` + `useMemo` is sufficient at this scale.

**Persistence**: `supabaseService.ts` wraps all DB calls. When `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set, data goes to Supabase. Otherwise, localStorage is the sole store. Both paths always write localStorage as a cache.

**Race-condition-free mutations**: All state mutations compute the full next state synchronously from the current snapshot before calling any `setState`. No side effects inside setState callbacks.

**Auth gating**: `AuthProvider` mounts first. `AppProvider` only mounts after auth resolves (session exists, or Supabase is not configured). This means `AppContext` never loads data for an unauthenticated user when Supabase is active.

**Validation**: All form validation lives in `src/utils/validation.ts` as pure functions. Modals import and call these; the same functions are exercised by the Vitest test suite.

## Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without these, the app runs in "Sandbox (Offline)" mode using localStorage only. Auth is bypassed entirely in this mode.

## Enabling Row Level Security (Supabase)

Run the SQL in `supabase-rls-migration.sql` once in the Supabase SQL editor after creating your account. This adds `user_id` columns (defaulting to `auth.uid()`), enables RLS on all five tables, and creates per-user policies. Afterwards, uncomment and run the `UPDATE` block to claim any existing rows.

## Design System

Neo-Brutalist: black borders, flat shadows (`shadow-[Xpx_Ypx_0px_#000000]`), high-contrast accent colours.

| Token | Value |
|-------|-------|
| Cyan accent | `#9BE9FB` |
| Pink accent | `#FFD8E8` |
| Border/shadow | `#000000` |
| Base bg | `#FFD8E8` (app shell) |

All modals are bottom-sheet drawers with `role="dialog"` + `aria-modal="true"` + `aria-labelledby`. Error messages use `role="alert"`. Success banners use `role="status"` + `aria-live="polite"`. Modals close on Escape via `useEscapeKey`.
