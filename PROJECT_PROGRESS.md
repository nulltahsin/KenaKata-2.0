# KenaKata Marketplace - AI Handoff and Progress Guide

Last updated: 2026-09-17
Workspace: `D:\KenaKata-Fresh`

This is the source-of-truth handoff document for the KenaKata marketplace. Give this file to another AI or developer before asking for bug fixes. It explains the repository structure, ownership of each feature, database/API contracts, completed work, known risks, validation status, and the safest files to inspect for future changes.

## 1. Project Identity

KenaKata is a local marketplace application with three user roles:

- Customer: browse products, use cart, wishlist, reservations, checkout, orders, reviews, and profile.
- Vendor: create a shop, manage products, view orders, and view reservations.
- Admin: manage platform-level users, vendors, orders, and operational data.

Technology:

- Frontend: React 19, Vite, React Router, Axios.
- Backend: Node.js, Express, PostgreSQL, `pg`.
- Authentication: JWT stored in browser `localStorage` under `token`.
- Authorization: backend JWT middleware plus role middleware.
- Frontend API base URL: `http://localhost:5000`.
- Backend port: `5000`.

## 2. Current Status at a Glance

| Area | Status | Notes |
| --- | --- | --- |
| React/Vite frontend | Working | Production build passes. |
| Express backend | Working when DB is available | Startup initializes required support tables. |
| PostgreSQL schema | Partially migrated/legacy-aware | Existing schema uses names such as `product_id`, `customer_id`, and `wishlist`; always inspect schema before adding SQL. |
| JWT auth | Implemented | JWT payload currently uses `user_id` and `role`. |
| Customer cart | Implemented | Active product holds last 60 minutes. |
| Customer wishlist | Implemented | Shared React context and database-backed toggle. |
| Customer reservations | Implemented | Product-only and store-only requests supported. |
| Vendor dashboard | Implemented | Shop setup, category tags, products, orders, reservations, analytics. |
| Admin dashboard | Present | Needs broader runtime testing. |
| Automated tests | Missing | Verification is currently build, syntax, diagnostics, and manual smoke testing. |
| Browser smoke testing | Pending | Requires a running backend, PostgreSQL, and authenticated browser session. |
| Deployment readiness | Pending | Production env, CORS, secrets, migrations, and database hosting are not finalized. |

## 3. Repository Map

### 3.1 Root files

- `README.md`: project introduction and basic setup information.
- `FULL_PROJECT_SUMMARY.md`: earlier broad project summary; may be less current than this file.
- `PROJECT_PROGRESS.md`: this living AI handoff document. Update after meaningful changes.
- `package.json`: root-level metadata; not the primary frontend/backend command location.
- `database.js`: root database-related file; inspect before changing database utilities.
- `index.js`: root-level legacy/utility entry file; the active backend server is `Backend/index.js`.
- `LICENSE`: repository license.
- `postman/`: Postman collections, environments, and globals for API testing.

### 3.2 Backend tree

`Backend/`

- `Backend/index.js`: active Express server entry point. Loads routes, middleware, and startup database initialization. Do not add unrelated business logic here.
- `Backend/package.json`: backend scripts and dependencies. Run backend commands from `Backend/`.
- `Backend/database.js`: backend database-related legacy/helper file.
- `Backend/src/config/db.js`: PostgreSQL pool and automatic support-table initialization. First file to inspect for database connection or missing-table errors.
- `Backend/src/config/schema.sql`: canonical relational schema definition. It documents original table names and constraints.
- `Backend/src/config/vendor_dashboard_migration.sql`: vendor dashboard migration history/changes.
- `Backend/src/seed.sql`: seed data for local development.

Backend middleware:

- `Backend/src/middleware/authMiddleware.js`: reads `Authorization: Bearer <token>`, verifies JWT, and sets `req.user`. Current JWT claims use `req.user.user_id` and `req.user.role`.
- `Backend/src/middleware/roleMiddleware.js`: restricts routes by role such as `CUSTOMER`, `VENDOR`, or `ADMIN`.
- `Backend/src/middleware/tokenBlacklist.js`: supports token revocation/logout behavior.

Backend routes:

- `authRoutes.js`: registration, login, logout, JWT issuance.
- `userRoutes.js`: user retrieval and user-level operations.
- `customerRoutes.js`: customer records and customer-specific operations.
- `vendorRoutes.js`: vendor account/business profile operations.
- `marketRoutes.js`: market listing and market creation.
- `storeRoutes.js`: store creation, vendor store retrieval, public store listing, update, delete.
- `categoryRoutes.js`: category listing and management.
- `productRoutes.js`: public product listing/detail, vendor product create/update/delete, category resolution, availability filtering.
- `cartRoutes.js`: customer cart holds, stock validation, hold expiry, add/remove/clear.
- `wishlistRoutes.js`: authenticated customer wishlist create/list/delete. Current feature-specific table is `wishlist`.
- `reservationRoutes.js`: customer product/store reservation creation/list/delete and vendor reservation listing/status operations.
- `orderRoutes.js`: customer orders, order creation, vendor order listing.
- `orderItemRoutes.js`: order-line operations.
- `paymentRoutes.js`: payment records and payment lookups.
- `reviewRoutes.js`: customer/product review operations.
- `adminRoutes.js`: admin-level marketplace operations.

### 3.3 Frontend tree

`Frontend/`

- `Frontend/package.json`: frontend scripts. Run `npm run dev`, `npm run build`, or `npm run lint` from this directory.
- `Frontend/vite.config.js`: Vite configuration.
- `Frontend/index.html`: Vite HTML entry.
- `Frontend/src/main.jsx`: React bootstrap.
- `Frontend/src/App.jsx`: providers and route definitions.
- `Frontend/src/styles/global.css`: global reset, typography, cursor/caret rules, common HTML styling.

Frontend contexts:

- `Frontend/src/context/AuthContext.jsx`: logged-in user, token, login, register, logout, profile updates.
- `Frontend/src/context/CartContext.jsx`: cart items, backend hold synchronization, add/remove/update/clear, totals.
- `Frontend/src/context/WishlistContext.jsx`: single source of truth for authenticated wishlist items and product IDs.

Frontend route guard:

- `Frontend/src/components/ProtectedRoute.jsx`: restricts routes by authentication and optional roles.

Frontend pages:

- `Home.jsx`: live market/category/product counts and featured market display.
- `Products.jsx`: public product catalog, search, category/store filtering, sorting, ProductCard rendering.
- `ProductDetails.jsx`: live product detail, add to cart, wishlist toggle, reserve button, related products.
- `Markets.jsx`: markets browse page.
- `Stores.jsx`: public stores browse page and StoreCard rendering.
- `Cart.jsx`: customer cart, totals, one-hour hold countdown, expiry cleanup.
- `Checkout.jsx`: checkout/payment/order workflow.
- `Orders.jsx`: customer order history.
- `Reservations.jsx`: customer reservation listing, product/store details, status, cancellation, success toast.
- `Wishlist.jsx`: shared wishlist listing, remove action, move-to-cart action.
- `Profile.jsx`: customer profile.
- `Login.jsx` and `Register.jsx`: authentication UI.
- `VendorDashboard.jsx`: vendor overview, shop details, products, orders, reservations, analytics.
- `AdminDashboard.jsx` / current import casing: admin operations. Check filename casing before Linux deployment.
- `AddProduct.jsx`: separate/legacy vendor product entry page.

Frontend components:

- `Navbar.jsx`: global navigation and role-aware links.
- `Footer.jsx`: global footer.
- `ProductCard.jsx`: public product card, shared wishlist heart, cart action, reservation action.
- `ProductManagement.jsx`: vendor inventory create/edit/delete UI.
- `StoreCard.jsx`: public store card and store reservation action.
- `BookingButton.jsx`: shared reserve button; must POST before navigating.
- `OrderCard.jsx`: order summary UI.
- `CategoryCard.jsx`: category display UI.
- `SearchBar.jsx`: search UI.
- `ShopOnboardingForm.jsx`: vendor shop setup/edit and comma-separated category parsing.
- `ProtectedRoute.jsx`: route protection.
- `Toast.jsx`: existing custom toast component. This project does not currently use `react-toastify`; use `Toast` rather than inventing `toast.error` calls.

Frontend services:

- `services/api.js`: Axios instance with `http://localhost:5000` base URL and automatic Bearer token header.
- `services/authService.js`: auth API functions.
- `services/productService.js`: product normalization, product CRUD, related products, wishlist product retrieval.
- `services/storeService.js`: public stores, markets, vendor store create/update/retrieval.
- `services/vendorService.js`: vendor order and reservation retrieval.
- `services/orderService.js`: order API functions.
- `services/reservationService.js`: customer reservation retrieval/create normalization.

## 4. Runtime and API Conventions

### 4.1 Starting the applications

Backend:

```powershell
Set-Location D:\KenaKata-Fresh\Backend
npm start
```

Frontend:

```powershell
Set-Location D:\KenaKata-Fresh\Frontend
npm run dev
```

Frontend validation:

```powershell
Set-Location D:\KenaKata-Fresh\Frontend
npm run build
npm run lint
```

Backend syntax validation:

```powershell
Set-Location D:\KenaKata-Fresh\Backend
node --check index.js
node --check src/config/db.js
node --check src/routes/<changed-route>.js
```

Backend prerequisites:

- PostgreSQL must be running.
- Backend `.env` must contain valid database values and `JWT_SECRET`.
- Backend startup calls support-table initialization before listening on port 5000.

### 4.2 Authentication contract

- Frontend stores JWT in `localStorage` key `token`.
- `Frontend/src/services/api.js` sends `Authorization: Bearer <token>` automatically.
- Backend middleware decodes JWT into `req.user`.
- Current auth route JWT payload uses `user_id` and `role`, not `id`.
- When adding a route, use `req.user.user_id || req.user.id` only if compatibility with another token format is required.
- Customer-only routes normally use `checkRole("CUSTOMER")`.
- Vendor-only routes normally use `checkRole("VENDOR")`.

### 4.3 Important API mounting

The active backend mounts `/api/auth`, `/api/products`, `/api/stores`, `/api/markets`, `/api/categories`, `/api/cart`, `/api/wishlist`, `/api/reservations`, `/api/orders`, `/api/order-items`, `/api/payments`, `/api/reviews`, `/api/customers`, `/api/vendors`, `/api/users`, and `/api/admin`.

Do not omit `/api` when using Axios. `api.get('/api/wishlist')` is correct; `api.get('/wishlist')` is not equivalent unless a proxy is configured.

## 5. Database Model and Naming Rules

The original schema is relational and uses these names:

- Users: `users.user_id`
- Customers: `customers.user_id` references `users.user_id`
- Vendors: `vendors.user_id` references `users.user_id`
- Markets: `markets.market_id`
- Stores: `stores.store_id`, `stores.vendor_id`, `stores.market_id`
- Products: `products.product_id`, `products.store_id`, `products.category_id`, `products.stock_qty`
- Categories: `categories.category_id`, `categories.category_name`
- Orders: `orders.order_id`
- Order lines: `order_items.order_item_id`
- Reservations: existing schema uses `reservation_id`, `customer_id`, `product_id`, `store_id`, `deadline`, `status`
- Original wishlist schema: `wishlists.wishlist_id`, `wishlists.customer_id`, `wishlists.product_id`
- Current feature wishlist table: `wishlist.id`, `wishlist.user_id`, `wishlist.product_id`, `wishlist.created_at`
- Cart holds: `product_holds.hold_id`, `customer_id`, `product_id`, `quantity`, `status`, `expires_at`

Important: generic task descriptions may use `id`, `user_id`, `reservation_date`, `p.name`, or `s.name`. Those names do not always match this repository. Always inspect `Backend/src/config/schema.sql` and the active route before writing SQL.

## 6. Completed Feature Work

### 6.1 Customer cart and inventory

Files: `Backend/src/routes/cartRoutes.js`, `Frontend/src/context/CartContext.jsx`, `Frontend/src/pages/Cart.jsx`, `Backend/src/routes/productRoutes.js`.

Implemented:

- Cart add checks product stock and active holds.
- Active product holds expire after 60 minutes.
- Cart UI displays remaining hold time from `expires_at`.
- Expired holds are released through backend cleanup.
- Public product query excludes products with no currently available inventory, including active holds.

Do not change these files for wishlist/reservation bugs unless the requested bug directly concerns cart behavior.

### 6.2 Wishlist

Files: `Frontend/src/context/WishlistContext.jsx`, `Frontend/src/components/ProductCard.jsx`, `Frontend/src/pages/ProductDetails.jsx`, `Frontend/src/pages/Products.jsx`, `Frontend/src/pages/Wishlist.jsx`, `Backend/src/routes/wishlistRoutes.js`.

Implemented:

- Wishlist state is shared through `WishlistContext`.
- Authenticated user changes trigger `GET /api/wishlist`.
- Heart is filled only when the product ID exists in the fetched database list.
- Empty heart sends `POST /api/wishlist` with `productId`.
- Filled heart sends `DELETE /api/wishlist/:productId`.
- Backend accepts both `product_id` and `productId`.
- Backend creates the feature-specific `wishlist` table if absent.
- Duplicate adds use `ON CONFLICT DO NOTHING`.
- Wishlist page removes items through the same context, so catalog/detail hearts update after navigation or shared state refresh.

Known behavior:

- Wishlist routes are customer-role protected.
- Existing legacy `wishlists` schema may still exist from the original schema. New feature code uses `wishlist`; do not silently mix both tables.
- The custom `Toast` component is used instead of a third-party toast library.

### 6.3 Reservations

Files: `Backend/src/routes/reservationRoutes.js`, `Frontend/src/components/BookingButton.jsx`, `Frontend/src/components/ProductCard.jsx`, `Frontend/src/components/StoreCard.jsx`, `Frontend/src/pages/ProductDetails.jsx`, `Frontend/src/pages/Reservations.jsx`, `Frontend/src/services/reservationService.js`.

Implemented:

- Product and store reserve buttons POST before navigating.
- Product reservation payload includes product/store IDs.
- Store-only reservation may send `product_id: null` and a valid store ID.
- Missing deadline is generated server-side.
- Backend derives a product's store when product ID is supplied without store ID.
- Customer reservations are retrieved with LEFT JOIN so missing related product/store data does not hide a reservation.
- Reservation page shows product/store name, image when available, price when available, location, date, status, and Cancel.
- Customer cancellation calls `DELETE /api/reservations/:id`.
- Success message is carried across navigation through `sessionStorage` key `reservation_toast`.

Known naming:

- Frontend can send camelCase or snake_case.
- Backend stores against the repository schema: `customer_id`, `product_id`, `store_id`, `deadline`, `status`.
- Do not replace the current schema with generic `user_id`/`reservation_date` SQL without a migration plan.

### 6.4 Vendor portal

Files: `Frontend/src/pages/VendorDashboard.jsx`, `Frontend/src/components/ShopOnboardingForm.jsx`, `Frontend/src/components/ProductManagement.jsx`, `Frontend/src/services/storeService.js`, `Frontend/src/services/vendorService.js`, `Backend/src/routes/storeRoutes.js`, `Backend/src/routes/productRoutes.js`, `Backend/src/routes/orderRoutes.js`, `Backend/src/routes/reservationRoutes.js`.

Implemented:

- Shop category input is split by commas, trimmed, deduplicated, and stored as a comma-separated store field.
- Product management exposes store categories as a multi-select.
- Product creation sends `category_names`, price, stock, description, image, and store ID.
- Newly created products appear immediately in inventory.
- Vendor dashboard normalizes create/update store response shapes.
- Vendor analytics show products, vendor order lines, active reservations, and shop categories.
- Canonical vendor order endpoint is `/api/orders/vendor`; `/api/orders/vendor/me` compatibility remains.

## 7. Known Risks and Incomplete Areas

High priority:

- PostgreSQL runtime smoke tests are not automated. Build and syntax checks do not prove SQL queries work against the actual database.
- The repository has legacy and feature-specific table names for wishlist. Keep `wishlistRoutes.js` consistent with the active table.
- `CREATE TABLE IF NOT EXISTS` does not alter an incompatible existing table.
- There is no meaningful automated backend integration test suite.

Medium priority:

- Frontend has large commented historical/mock implementations. Do not reactivate old blocks accidentally.
- `Reservations.jsx` and other pages have legacy comments above the active implementation; edit the active implementation near the bottom.
- Import casing for the admin page should be checked before Linux deployment.
- Root `index.js` and `Backend/index.js` both exist; the active API server is `Backend/index.js`.
- Frontend API base URL is hardcoded to localhost and needs environment-based configuration for deployment.

Low priority:

- UI styles need broader responsive/manual visual testing.
- Error/loading states are inconsistent across older pages.
- No formal migration runner is configured.

## 8. Bug-Fix Routing Guide

| Bug report | First file | Then inspect |
| --- | --- | --- |
| Add to cart fails or stock is wrong | `Backend/src/routes/cartRoutes.js` | `Frontend/src/context/CartContext.jsx`, `product_holds` schema |
| Cart timer is wrong | `Frontend/src/pages/Cart.jsx` | `cartRoutes.js` `expires_at` response |
| Product is visible despite no inventory | `Backend/src/routes/productRoutes.js` | `Products.jsx`, active `product_holds` query |
| Heart does nothing | `Frontend/src/context/WishlistContext.jsx` | `ProductCard.jsx`, `api.js`, `wishlistRoutes.js` |
| Heart is filled for an unsaved item | `WishlistContext.jsx` | `Products.jsx`, `ProductDetails.jsx`, browser token state |
| Wishlist remove does not sync | `Wishlist.jsx` | `WishlistContext.jsx`, `wishlistRoutes.js` |
| Reserve button only navigates | `BookingButton.jsx` | `reservationRoutes.js`, `api.js` |
| Reservation list is empty | `reservationRoutes.js` GET | `reservationService.js`, `Reservations.jsx`, database column names |
| Store-only reservation fails | `reservationRoutes.js` POST | nullable reservation columns and `BookingButton.jsx` |
| Vendor shop setup fails | `ShopOnboardingForm.jsx` | `storeRoutes.js`, market API |
| Vendor product category list is empty | `ProductManagement.jsx` | `VendorDashboard.jsx`, store category field |
| Vendor analytics are zero | `VendorDashboard.jsx` | `vendorService.js`, order/reservation vendor routes |
| Login/token issue | `AuthContext.jsx` | `authService.js`, `authMiddleware.js` |
| Homepage/featured market issue | `Home.jsx` | market/product/category routes |

## 9. Safe Change Rules for Future AIs

1. Read the active implementation, not only commented historical code.
2. Read the schema before changing SQL column or table names.
3. Preserve `req.user.user_id` unless auth is intentionally migrated.
4. Preserve Axios calls under `/api/...`; the Axios instance supplies the host and Bearer token.
5. Do not use local mock arrays to replace live API results.
6. Do not add a second state source for wishlist or cart.
7. Do not modify cart, auth, or homepage while fixing an unrelated wishlist/reservation issue.
8. After the first edit, run the narrowest relevant validation immediately.
9. For frontend edits, run `npm run build`; for backend edits, run `node --check` on touched routes.
10. For database changes, start the backend with PostgreSQL available and manually hit the affected endpoint.
11. Update this file after every meaningful feature or bug-fix pass.
12. Never claim a database/runtime feature is verified based only on a frontend build.

## 10. Verification History

Completed repeatedly during development:

- `Frontend`: `npm run build` passed after customer, vendor, wishlist, reservation, and catalog changes.
- `Backend`: `node --check` passed for edited route/config files.
- Editor diagnostics passed for touched React files.
- Backend previously reached `http://localhost:5000` when PostgreSQL configuration was available.

Still required for full confidence:

- Authenticated browser test: login as customer.
- Wishlist test: heart add, refresh, heart remove, visit Wishlist, remove item, return to Products.
- Reservation test: reserve from ProductCard, ProductDetails, and StoreCard; verify database row and Reservations page; cancel reservation.
- Cart regression test: add product, confirm one-hour countdown, confirm held product is hidden from public catalog.
- Vendor regression test: create shop, add multi-category product, verify analytics.

## 11. Current Next Actions

1. Start PostgreSQL and backend using the configured `.env`.
2. Run authenticated wishlist and reservation browser smoke tests.
3. Confirm the active database contains `wishlist` and `product_holds` with expected columns.
4. Add backend integration tests for wishlist and reservations.
5. Add a real migration strategy instead of relying only on startup DDL.
6. Replace hardcoded frontend API URL with a deployment environment variable.
7. Review import casing and remove obsolete commented mock implementations after behavior is stable.

## 12. Change Log Format

Every future entry should answer:

- Date:
- Feature/area:
- Bug or requirement:
- Root cause:
- Files changed:
- API/database changes:
- UI/state changes:
- Validation performed:
- Remaining risk:
- Next action:

## 13. Change Log

### 2026-09-17 - Project documentation overhaul

- Rebuilt this file as a complete AI handoff document.
- Added folder/file ownership map, API conventions, schema naming rules, bug routing table, completed work, risks, validation history, and pending work.
- No application behavior changed in this documentation-only update.

### 2026-09-17 - Wishlist and reservation bug isolation

- Added unified `WishlistContext` as the database-backed source of truth for wishlist product IDs.
- Connected ProductCard, Product Details, Products, and Wishlist to shared wishlist state.
- Added feature-specific `wishlist` table support, duplicate protection, camelCase/snake_case payload support, and product-ID removal.
- Reservation creation accepts product-only or store-only requests and derives missing values where possible.
- Reservation retrieval uses nullable related data and customer cancellation.
- Frontend build, backend syntax checks, and editor diagnostics passed.
- Cart, auth/login, and homepage were intentionally left untouched in this pass.

### 2026-09-17 - Wishlist/reservation null product ID fix

- Normalized product IDs with `id`, `product_id`, and `_id` fallbacks in product cards and product details.
- Wishlist POST now sends both `product_id` and `productId` as numbers through the shared wishlist context; backend rejects missing IDs instead of inserting null.
- Product listing responses now expose stable `id`, `product_id`, and `stock` aliases while preserving existing stock/active-hold filtering.
- Reservation POST now sends both product/store naming formats and a 48-hour deadline; backend auto-defaults the deadline and resolves a missing store from the product.
- Cart, one-hour holds, stock filtering behavior, homepage, and login/auth code were not modified.
- Validation: frontend production build, backend product/wishlist/reservation syntax checks, and editor diagnostics passed.

### 2026-09-17 - Reservations UI polish

- Reworked the active Reservations page markup into a structured header and reservation card layout.
- Added responsive product images/fallbacks, reservation number, status badge, price, store/location/date metadata, and styled cancel action.
- Added polished empty state and mobile single-column behavior.
- Validation: frontend production build passed.

### 2026-09-17 - Wishlist removal and store navigation fix

- Wishlist DELETE now accepts either the wishlist row ID or product ID for the authenticated user.
- Wishlist page normalizes saved products before sending them through CartContext, preserving product ID, stock, and image fields.
- Store cards no longer show Reserve or a separate View Products action; the entire card navigates to `/products?store=STORE_ID`.
- Products page now loads store names and filters products by numeric `store_id`, so store pages no longer incorrectly show an empty result.
- Cart hold duration, stock filtering, and login/authentication were not changed.
- Validation: frontend production build, wishlist backend syntax check, and editor diagnostics passed.

### 2026-09-17 - Cart, inventory, and reservation polish

- Increased active cart hold lifetime to 60 minutes.
- Filtered public products by currently available stock after active holds.
- Wired ProductCard and StoreCard reservation actions to live POST requests.
- Added reservation details and success feedback.
- Frontend build and backend route syntax checks passed.

### 2026-09-17 - Vendor portal implementation

- Normalized comma-separated shop categories.
- Added store-category-driven product multi-select.
- Added immediate vendor inventory updates after product creation.
- Added live vendor product/order/reservation analytics.
- Frontend build and backend syntax checks passed.

### Earlier work - Customer portal repair

- Connected homepage metrics/categories to live APIs.
- Added cart stock enforcement and expiry display.
- Added wishlist and reservation API wiring.
- Added support-table startup initialization for cart/reservation-related tables.

## 14. Handoff Summary

The project is not a blank starter. It has a working full-stack structure, role-based authentication, a PostgreSQL model, customer commerce flows, vendor management, and admin routes. The most important discipline for future work is to preserve existing database naming and API conventions, identify the active implementation below commented historical blocks, keep feature state centralized, and validate database-backed changes against a running PostgreSQL instance.
