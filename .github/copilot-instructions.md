# KiosDarma Marketplace - Copilot Instructions

## Architecture Overview

**Tech Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Firebase (Auth + Realtime DB), tRPC, React Query

**Key Pattern**: Monolithic Next.js app with SSR/RSC, client-side Firebase auth, real-time DB for marketplace data.

### Data Flow
- **Authentication**: Firebase Auth + custom user roles stored in Realtime DB (`users/{uid}/role`)
- **Marketplace Data**: Reads from POS structure in Firebase (`users/{uid}/settings/business` for stores, `users/{uid}/products` for products)
- **API Layer**: tRPC marketplace router with procedures for store/product discovery and order creation
- **State Management**: AuthContext (global), CartContext (planned), React Query (tRPC)
- **Orders**: Created in `marketplace/orders` namespace, independent of POS transactions

### POS Integration (PPSI Marketplace Spec)
This marketplace is tightly integrated with PPSI POS app:
- **Stores**: Read from `users/{uid}/settings/business` where `marketplaceOptIn=true` and `status=active`
- **Products**: Read from `users/{uid}/products` where `marketplaceVisible=true` and `isActive=true`
- **Real-time streams**: Subscribe to live product updates via Firebase `onValue()` listeners
- **Orders**: Stored separately at `marketplace/orders` with WhatsApp-first workflow (no payment processing)

### Critical Services
- **Marketplace Service** [src/services/firebase/marketplace.ts](src/services/firebase/marketplace.ts): POS-integrated store/product discovery, order operations, realtime subscriptions
- **Firebase Client** [src/services/firebase/client.ts](src/services/firebase/client.ts): Singleton instances for auth, database, storage
- **AuthContext** [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx): Manages user state & role, persists auth session
- **Validation** [src/lib/validation.ts](src/lib/validation.ts): Zod schemas for marketplace orders—all Indonesian error messages

## Developer Workflows

### Start Development
```bash
pnpm install           # Install dependencies
cp .env.example .env.local  # Setup Firebase env vars (see ENV_SETUP.md)
pnpm dev               # Next.js dev server with Turbopack (http://localhost:3000)
```

### Build & Quality
```bash
pnpm build             # Production build
pnpm check             # Lint + typecheck (required before commit)
pnpm lint:fix          # Auto-fix linting issues
pnpm format:write      # Auto-format with Prettier + Tailwind plugin
pnpm test              # Unit tests with Vitest (80% coverage threshold)
pnpm test:e2e          # Playwright E2E tests
pnpm preview           # Build + start production server
```

### Key Points
- **TypeScript strict mode enabled** - all code must be type-safe
- **Consistent imports**: Type imports must use inline syntax (`import type { Foo } from 'bar'`)
- **Path alias**: Use `~/` for imports from src (configured in tsconfig.json)
- **Next.js version 15**: Use App Router syntax, Server Components by default, `"use client"` for interactive components

## Code Organization & Patterns

### Directory Roles
- `src/app/` - Next.js App Router pages & API routes
- `src/server/api/` - tRPC setup with marketplace router [src/server/api/routers/marketplace.ts](src/server/api/routers/marketplace.ts)
- `src/components/` - Reusable UI components grouped by domain (auth, landing, layout, pages, etc.)
- `src/services/firebase/` - Firebase-specific modules: `marketplace.ts` (POS integration), `client.ts` (singletons)
- `src/contexts/` - React Context providers (AuthContext, CartContext pattern)
- `src/lib/` - Utilities: `validation.ts` (Zod schemas), `format.ts` (currency/date), `whatsapp.ts` (order links), plus existing helpers
- `src/models/` - TypeScript interfaces including new POS types: `MarketplaceStore`, `MarketplaceProduct`, `MarketplaceOrder`

### Component Convention
1. **Server Components by default** - mark with `"use client"` only when needed (state, events, hooks)
2. **Structure**: `export default function ComponentName() { ... }`
3. **Props typing**: Define inline or extract to `types.ts` for complex props
4. **Styling**: Tailwind CSS with `prettier-plugin-tailwindcss` auto-sorting classes

### Firebase Integration (POS-Specific)
- **Marketplace stores**: Fetch from `users/{uid}/settings/business` with filter on `marketplaceOptIn=true`
- **Marketplace products**: Fetch from `users/{uid}/products` with filters on `marketplaceVisible=true` and `isActive=true`
- **Realtime listeners**: Use `onValue()` in useEffect with cleanup, e.g., `subscribeToStoreProducts(storeId, callback)`
- **Orders**: Write to `marketplace/orders`, never to POS `users/{uid}/transactions`
- **User role system**: Three roles—`"customer"` | `"merchant"` | `"admin"` stored at `users/{uid}/role`

**Key Files**:
- [src/services/firebase/marketplace.ts](src/services/firebase/marketplace.ts) - All marketplace read/write operations
- [src/models/marketplace.ts](src/models/marketplace.ts) - Data types matching POS schema

### Validation (Zod)
- All form inputs validated with Zod schemas in [src/lib/validation.ts](src/lib/validation.ts)
- **Error messages**: All in Indonesian (e.g., "Nama harus diisi", "Email tidak valid")
- **Marketplace schemas**: `getStoresInputSchema`, `marketplaceOrderItemSchema`, `createMarketplaceOrderSchema`, `updateOrderStatusSchema`
- Pattern: Define schema → export type with `z.infer<typeof schema>` → validate in handlers
- Example validation: [src/lib/validation.ts#L80-L120](src/lib/validation.ts#L80-L120)

### Utilities (New)
- **Formatting** [src/lib/format.ts](src/lib/format.ts): `formatCurrency()`, `formatDate()`, `formatPhoneNumber()`, `isValidWhatsappPhone()`
- **WhatsApp** [src/lib/whatsapp.ts](src/lib/whatsapp.ts): `generateOrderLink()`, `generateOrderMessage()`, `generateOrderStatusLink()`
- All functions output Indonesian text; currency always IDR, dates follow Indonesian locale

### tRPC Marketplace Router [src/server/api/routers/marketplace.ts](src/server/api/routers/marketplace.ts)
- **Procedures**:
  - `marketplace.getStores(input)` - Get all marketplace stores with optional category/tags filter
  - `marketplace.getStoreProducts(input)` - Get products from a store
  - `marketplace.createOrder(input)` - Create order (public, no auth required)
  - `marketplace.updateOrderStatus(input)` - Update order status
  - `marketplace.markWhatsappSent(input)` - Record WhatsApp sent timestamp
- All procedures public (`publicProcedure`) to allow unauthenticated customers to browse and order
- Zod validation with Indonesian error messages built-in

## External Dependencies & Integration Points

- **Firebase SDK v12+**: Client-side auth & database. Env vars must be public (`NEXT_PUBLIC_FIREBASE_*`)
- **Resend API** (optional): For support form emails; key in `RESEND_API_KEY`
- **React Query v5**: Integrated via `@trpc/react-query` for automatic caching with tRPC
- **Lucide React**: Icon library (optimized with `experimental.optimizePackageImports` in next.config.js)
- **PPSI POS Database**: Marketplace reads directly from `users/` namespace where stores opt-in

## Security & Performance

### Security Headers (Middleware)
- **CSP**: Allows Firebase, Resend, Vercel Live; blocks unsafe inline scripts (exceptions: nonce for Next.js)
- **HSTS, X-Frame-Options, CORS-Embedder-Policy**: Strict defaults in [src/middleware.ts](src/middleware.ts)
- **Firebase Rules**: Updated for public marketplace read access [firebase-rules.json](firebase-rules.json)

### Firebase Rules for Marketplace
- **Stores**: Public read from `users/{uid}/settings/business` if `marketplaceOptIn=true`
- **Products**: Public read from `users/{uid}/products` if `marketplaceVisible=true` and `isActive=true`
- **Orders**: Public write to `marketplace/orders` (no auth required), read restricted to order participants
- **Validation**: All orders must include required fields (`storeId`, `userId`, `items`, `subtotal`, `status`, `createdAt`, `expiresAt`)

### Performance Optimizations
- **Image optimization**: Remote patterns configured for all HTTPS domains; device-specific sizing
- **Turbopack**: Dev builds with `next dev --turbo` for faster feedback
- **SWC minification**: Production builds use SWC (faster than Terser)
- **Realtime caching**: Product lists cached with 5-min TTL; subscribe to realtime for stock updates on checkout

## How to Extend

### Adding a New tRPC Marketplace Procedure
1. Define Zod input schema in [src/lib/validation.ts](src/lib/validation.ts) with Indonesian error messages
2. Add procedure to `marketplaceRouter` in [src/server/api/routers/marketplace.ts](src/server/api/routers/marketplace.ts)
3. Use `publicProcedure` for customer-facing, optional auth for store operations
4. Call from client: `const { data } = trpc.marketplace.yourProcedure.useQuery(...)`

### Adding a New Marketplace Service Method
1. Add function to [src/services/firebase/marketplace.ts](src/services/firebase/marketplace.ts)
2. Read from `users/{uid}/settings/business` or `users/{uid}/products` as appropriate
3. Add realtime variant (e.g., `subscribeToX`) with `onValue()` for live updates
4. Use singleton Firebase instances: `getRealtimeDatabase()`, `getFirebaseAuth()`

### Adding a New Data Type
1. Define TypeScript interface in [src/models/marketplace.ts](src/models/marketplace.ts)
2. Use `MarketplaceStore`, `MarketplaceProduct`, `MarketplaceOrder` as templates
3. Add factory function to parse Firebase data, e.g., `MarketplaceStore.fromFirebase(uid, data)`

## Common Gotchas

- **Firebase env vars**: Must start with `NEXT_PUBLIC_` to be exposed to browser; verify in `.env.local`
- **Role-based access**: Always fetch `users/{uid}/role` from Realtime DB after sign-in; never trust client state alone
- **Store opt-in**: Stores must have `marketplaceOptIn=true` AND `status=active` to appear; default is false
- **Product visibility**: Both `marketplaceVisible=true` AND `isActive=true` required; default both are false
- **Realtime listeners**: Always unsubscribe in cleanup to avoid memory leaks; pattern: `useEffect(() => { const unsub = subscribeToX(cb); return () => unsub(); }, [])`
- **Phone formatting**: Always validate with `isValidWhatsappPhone()` before generating WhatsApp links
- **Order expiry**: Orders auto-expire after 7 days; use `expiresAt` timestamp for client-side filtering
- **Subtotal validation**: Always verify sum of items matches subtotal before creating order (prevents tampering)
- **Indonesian localization**: Error messages, validation text, WhatsApp messages in Indonesian; maintains consistency with POS app

## Testing

### Unit Tests
- Location: [src/__tests__/unit/](src/__tests__/unit/) (e.g., [src/__tests__/unit/marketplace.test.ts](src/__tests__/unit/marketplace.test.ts))
- Framework: Vitest with 80% coverage threshold
- Examples: Format/WhatsApp utilities, validation schemas
- Run: `pnpm test`

### Test Fixtures
- Location: [src/__tests__/fixtures/marketplace.ts](src/__tests__/fixtures/marketplace.ts)
- Includes: Mock stores, products, orders, Firebase data structure
- Usage: Import `mockStore1`, `mockProducts`, `mockOrderItems` in tests

### E2E Tests
- Location: [src/__tests__/e2e/](src/__tests__/e2e/)
- Framework: Playwright
- Run: `pnpm test:e2e`

## References

- [README.md](README.md) - Setup & feature overview
- [ENV_SETUP.md](ENV_SETUP.md) - Detailed Firebase configuration
- [docs/INTEGRATION_STATUS.md](docs/INTEGRATION_STATUS.md) - Feature checklist & known issues
- [firebase-rules.json](firebase-rules.json) - Realtime DB security rules (audit in [docs/firebase-security-audit.md](docs/firebase-security-audit.md))
- **POS Integration**: PPSI POS app uses same Firebase project; marketplace reads from `users/` paths where `marketplaceOptIn=true`

