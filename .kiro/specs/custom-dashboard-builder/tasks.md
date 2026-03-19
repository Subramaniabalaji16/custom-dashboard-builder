# Implementation Plan: Custom Dashboard Builder

## Overview

Full-stack implementation using React 18 + TypeScript + Vite (frontend) and Node.js + Express + MongoDB/Mongoose (backend). The frontend communicates with the backend via Axios. Dashboard configs and orders are persisted in MongoDB Atlas instead of localStorage.

## Tasks

- [x] 1. Project scaffolding and shared types
  - Scaffold frontend with `npm create vite@latest` (React + TypeScript template)
  - Scaffold backend as `server/` directory with Express + TypeScript
  - Install all dependencies: react-router-dom, zustand, react-grid-layout, recharts, react-hook-form, tailwindcss, axios (frontend); express, mongoose, cors, dotenv, uuid (backend)
  - Create `src/types/index.ts` with all shared TypeScript interfaces: `CustomerOrder`, `WidgetType`, `BaseWidgetConfig`, `KPIConfig`, `AxisChartConfig`, `PieChartConfig`, `TableConfig`, `FilterCondition`, `GridItem`, `DashboardLayout`, `DashboardState`, `DateFilterOption`, `WidgetConfig`
  - Configure TailwindCSS (`tailwind.config.ts`, `postcss.config.js`, import in `index.css`)
  - Configure path aliases in `vite.config.ts` and `tsconfig.json`
  - _Requirements: all_

- [x] 2. Backend — Express server setup and MongoDB connection
  - [x] 2.1 Create `server/src/index.ts` with Express app, CORS, JSON body parser, and dotenv config
    - Listen on `PORT` from env (default 4000)
    - Mount `/api/orders` and `/api/dashboard` routers
    - _Requirements: 12.1, 6.2_
  - [x] 2.2 Create `server/src/db.ts` — Mongoose connection to `MONGODB_URI` from env
    - Log connection success/failure
    - _Requirements: 12.1_
  - [x] 2.3 Create `server/src/models/Order.ts` — Mongoose schema matching `CustomerOrder` interface
    - Use `uuid` for `id` and `orderId` defaults; `orderDate` defaults to `Date.now`
    - _Requirements: 14.1, 14.2_
  - [x] 2.4 Create `server/src/models/DashboardConfig.ts` — Mongoose schema for `DashboardState`
    - Single-document pattern (upsert by a fixed key `"default"`)
    - _Requirements: 6.2, 6.3_

- [x] 3. Backend — Orders API (`/api/orders`)
  - [x] 3.1 Implement `GET /api/orders` — return all orders sorted by `orderDate` desc
    - _Requirements: 12.1, 13.1_
  - [x] 3.2 Implement `POST /api/orders` — validate required fields, compute `totalAmount`, insert document
    - Return 400 with field-level errors if validation fails
    - _Requirements: 14.3, 14.4_
  - [x] 3.3 Implement `PUT /api/orders/:id` — update order by `id`, recompute `totalAmount`
    - Return 404 if not found
    - _Requirements: 15.3_
  - [x] 3.4 Implement `DELETE /api/orders/:id` — delete order by `id`
    - Return 404 if not found
    - _Requirements: 15.5_
  - [ ]* 3.5 Write unit tests for Orders API route handlers
    - Test each route: success path, validation errors, 404 cases
    - Use in-memory MongoDB (`mongodb-memory-server`) for isolation
    - _Requirements: 14.3, 14.4, 15.3, 15.5_

- [x] 4. Backend — Dashboard Config API (`/api/dashboard`)
  - [x] 4.1 Implement `GET /api/dashboard` — return saved `DashboardState` or empty state `{ layout: {lg:[],md:[],sm:[]}, widgets: {}, savedAt: null }`
    - _Requirements: 1.1, 6.3_
  - [x] 4.2 Implement `PUT /api/dashboard` — upsert the full `DashboardState` document
    - Set `savedAt` to current ISO timestamp on save
    - _Requirements: 6.2_
  - [ ]* 4.3 Write unit tests for Dashboard Config API
    - Test GET returns empty state when no doc exists; PUT upserts correctly
    - _Requirements: 6.2, 6.3_

- [x] 5. Frontend — API client layer
  - [x] 5.1 Create `src/api/ordersApi.ts` with Axios functions: `fetchOrders`, `createOrder`, `updateOrder`, `deleteOrder`
    - Base URL from `VITE_API_URL` env variable
    - _Requirements: 12.1, 14.4, 15.3, 15.5_
  - [x] 5.2 Create `src/api/dashboardApi.ts` with Axios functions: `fetchDashboard`, `saveDashboard`
    - _Requirements: 6.2, 6.3_

- [x] 6. Frontend — Zustand stores
  - [x] 6.1 Create `src/store/ordersStore.ts` — Zustand store with `orders` state and async actions `loadOrders`, `addOrder`, `updateOrder`, `deleteOrder` that call the API layer
    - _Requirements: 12.1, 12.2, 14.4, 15.3, 15.5_
  - [x] 6.2 Create `src/store/dashboardStore.ts` — Zustand store with `layout`, `widgets`, `savedAt`, `activeWidgetId`, `dateFilter` state and actions: `loadDashboard`, `addWidget`, `removeWidget`, `updateWidgetConfig`, `updateLayout`, `saveConfiguration`, `setActiveWidget`, `setDateFilter`
    - `saveConfiguration` calls `saveDashboard` API; `loadDashboard` calls `fetchDashboard` API
    - _Requirements: 1.1, 2.2, 4.4, 5.1, 5.2, 5.3, 6.2, 6.3, 7.2_
  - [ ]* 6.3 Write property test for widget addition grows layout (Property 1)
    - **Property 1: Widget addition grows the layout**
    - **Validates: Requirements 2.2**
  - [ ]* 6.4 Write property test for widget deletion removes widget (Property 2)
    - **Property 2: Widget deletion removes the widget**
    - **Validates: Requirements 4.4**
  - [ ]* 6.5 Write property test for widget resize updates grid dimensions (Property 3)
    - **Property 3: Widget resize updates grid dimensions**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  - [ ]* 6.6 Write property test for layout persistence round-trip (Property 4)
    - **Property 4: Layout persistence round-trip**
    - **Validates: Requirements 6.2, 6.3**
  - [ ]* 6.7 Write property test for order store mutation reflected in widget data (Property 14)
    - **Property 14: Order store mutation is reflected in widget data**
    - **Validates: Requirements 12.2**

- [ ] 7. Checkpoint — Ensure all backend tests pass and API layer is wired to stores
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Frontend — Pure utility functions
  - [x] 8.1 Create `src/utils/filterOrders.ts` — implement `filterOrdersByDate`
    - _Requirements: 7.2_
  - [ ]* 8.2 Write property test for date filter excludes out-of-range orders (Property 5)
    - **Property 5: Date filter excludes out-of-range orders**
    - **Validates: Requirements 7.2**
  - [x] 8.3 Create `src/utils/aggregateKPI.ts` — implement `aggregateKPI`
    - _Requirements: 8.2, 8.3_
  - [ ]* 8.4 Write property test for non-numeric metric forces Count aggregation (Property 6)
    - **Property 6: Non-numeric metric forces Count aggregation**
    - **Validates: Requirements 8.2**
  - [ ]* 8.5 Write property test for KPI aggregation and formatting correctness (Property 7)
    - **Property 7: KPI aggregation and formatting correctness**
    - **Validates: Requirements 8.3, 8.4**
  - [x] 8.6 Create `src/utils/tableUtils.ts` — implement `applyFilters`, table sort helper, pagination slice helper
    - _Requirements: 11.4, 11.5, 11.6_
  - [ ]* 8.7 Write property test for table filter excludes non-matching records (Property 13)
    - **Property 13: Table filter excludes non-matching records**
    - **Validates: Requirements 11.6**
  - [ ]* 8.8 Write property test for table sort produces ordered rows (Property 11)
    - **Property 11: Table sort produces ordered rows**
    - **Validates: Requirements 11.4**
  - [ ]* 8.9 Write property test for table pagination limits rows per page (Property 12)
    - **Property 12: Table pagination limits rows per page**
    - **Validates: Requirements 11.5**
  - [x] 8.10 Create `src/utils/chartUtils.ts` — implement `groupByField` for pie chart data
    - _Requirements: 10.2_
  - [ ]* 8.11 Write property test for pie chart groups by distinct values (Property 9)
    - **Property 9: Pie chart groups by distinct values**
    - **Validates: Requirements 10.2, 10.3**
  - [ ]* 8.12 Write unit tests for all utility functions
    - Cover `filterOrdersByDate` (each option + empty array), `aggregateKPI` (Sum/Average/Count + empty), `applyFilters` (each operator, AND logic, empty conditions), `groupByField` (repeated values, all-unique), KPI formatting (Currency prefix, decimal precision)
    - _Requirements: 7.2, 8.2, 8.3, 8.4, 10.2, 11.4, 11.5, 11.6_

- [x] 9. Frontend — Application shell and routing
  - [x] 9.1 Create `src/App.tsx` with React Router v6 `BrowserRouter`, root layout (Sidebar + `<Outlet>`), and routes: `/` → redirect to `/dashboard`, `/dashboard`, `/dashboard/builder`, `/orders`
    - _Requirements: 1.1, 13.1_
  - [x] 9.2 Create `src/components/layout/Sidebar.tsx` with nav links to Dashboard and Customer Orders
    - _Requirements: 1.1, 13.1_

- [x] 10. Frontend — Orders page and Order Form
  - [x] 10.1 Create `src/pages/OrdersPage.tsx` — calls `loadOrders` on mount, renders `OrdersTable` or empty state, includes "Create Order" button
    - _Requirements: 13.1, 13.2_
  - [x] 10.2 Create `src/components/orders/OrdersTable.tsx` — renders rows with context menu (Edit/Delete), `StatusBadge`, and pagination controls
    - _Requirements: 15.1_
  - [x] 10.3 Create `src/components/orders/OrderForm.tsx` using React Hook Form
    - Fields: all `CustomerOrder` fields per Req 14.1; `totalAmount` computed as `quantity * unitPrice` via `watch`; validation: required on all mandatory fields with "Please fill the field" error message
    - On submit: calls `addOrder` or `updateOrder` store action; closes modal on success
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 15.2, 15.3_
  - [x] 10.4 Wire delete confirmation prompt in `OrdersTable` — calls `deleteOrder` store action on confirm
    - _Requirements: 15.4, 15.5_
  - [ ]* 10.5 Write property test for total amount equals quantity × unit price (Property 15)
    - **Property 15: Total amount equals quantity × unit price**
    - **Validates: Requirements 14.2**
  - [ ]* 10.6 Write property test for order form rejects empty mandatory fields (Property 16)
    - **Property 16: Order form rejects submissions with empty mandatory fields**
    - **Validates: Requirements 14.3**
  - [ ]* 10.7 Write property test for order creation round-trip (Property 17)
    - **Property 17: Order creation round-trip**
    - **Validates: Requirements 14.4**
  - [ ]* 10.8 Write property test for edit form pre-population (Property 18)
    - **Property 18: Edit form pre-population**
    - **Validates: Requirements 15.2**
  - [ ]* 10.9 Write property test for order update round-trip (Property 19)
    - **Property 19: Order update round-trip**
    - **Validates: Requirements 15.3**
  - [ ]* 10.10 Write property test for order deletion removes the record (Property 20)
    - **Property 20: Order deletion removes the record**
    - **Validates: Requirements 15.5**

- [ ] 11. Checkpoint — Ensure Orders page is fully functional end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Frontend — Dashboard page
  - [x] 12.1 Create `src/pages/DashboardPage.tsx` — calls `loadDashboard` and `loadOrders` on mount; renders empty state with "Configure Dashboard" button when no layout saved, otherwise renders `WidgetGrid`
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 12.2 Create `src/components/dashboard/DateFilter.tsx` — dropdown with options All time / Today / Last 7 Days / Last 30 Days / Last 90 Days; calls `setDateFilter` on change
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 12.3 Create `src/components/dashboard/WidgetGrid.tsx` — `react-grid-layout` `<Responsive>` in read-only mode (`isDraggable={false}`, `isResizable={false}`); breakpoints `{lg:1024, md:768, sm:0}`, cols `{lg:12, md:8, sm:4}`; renders `WidgetRenderer` per widget
    - _Requirements: 3.1, 3.2, 3.3, 16.1, 16.2, 16.3, 16.4_
  - [ ]* 12.4 Write property test for tablet reflow — no widget exceeds available columns (Property 21)
    - **Property 21: Tablet reflow — no widget exceeds available columns**
    - **Validates: Requirements 3.4, 16.2**
  - [ ]* 12.5 Write property test for mobile layout stacks all widgets (Property 22)
    - **Property 22: Mobile layout stacks all widgets**
    - **Validates: Requirements 3.5, 16.3**

- [x] 13. Frontend — Widget renderer components
  - [x] 13.1 Create `src/components/widgets/KPICard.tsx` — reads `KPIConfig`, calls `aggregateKPI` on filtered orders, formats with Currency prefix and decimal precision
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 13.2 Create `src/components/widgets/ChartWidget.tsx` — renders Bar/Line/Area/Scatter using Recharts `<ResponsiveContainer>`; applies `xAxis`, `yAxis`, `color`, `showDataLabel` from `AxisChartConfig`
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [ ]* 13.3 Write property test for axis chart config applied to rendered data (Property 8)
    - **Property 8: Axis chart config is applied to rendered data**
    - **Validates: Requirements 9.2, 9.3, 9.4**
  - [x] 13.4 Create `src/components/widgets/PieChartWidget.tsx` — calls `groupByField`, renders Recharts `<PieChart>`; shows legend if `showLegend`
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 13.5 Create `src/components/widgets/TableWidget.tsx` — applies `applyFilters`, sort, pagination; renders selected columns only; uses `fontSize` and `headerBackground` from `TableConfig`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  - [ ]* 13.6 Write property test for table column selection filters columns (Property 10)
    - **Property 10: Table column selection filters columns**
    - **Validates: Requirements 11.3**
  - [x] 13.7 Create `src/components/widgets/WidgetRenderer.tsx` — switch on `WidgetConfig.type` to render the correct widget component; passes filtered orders from `filterOrdersByDate`
    - _Requirements: 7.2, 12.1, 12.2, 12.3_

- [x] 14. Frontend — Builder page
  - [x] 14.1 Create `src/pages/BuilderPage.tsx` — layout: `WidgetPanel` (200px left) + `CanvasGrid` (flex-1) + `SettingsPanel` (320px right, conditional); header with Back button and "Save Configuration" button that calls `saveConfiguration`
    - _Requirements: 6.1, 6.2_
  - [x] 14.2 Create `src/components/builder/WidgetPanel.tsx` — categorized list (Charts / Tables / KPIs) of draggable widget type tiles using `react-grid-layout` drag source
    - _Requirements: 2.1_
  - [x] 14.3 Create `src/components/builder/CanvasGrid.tsx` — `react-grid-layout` `<Responsive>` in edit mode (`isDraggable`, `isResizable`); `onDrop` calls `addWidget`; `onLayoutChange` calls `updateLayout`; renders `WidgetRenderer` with hover controls overlay
    - _Requirements: 2.2, 2.3, 3.1–3.7, 4.1, 5.1, 5.2, 5.3_
  - [x] 14.4 Create `src/components/builder/HoverControls.tsx` — Settings icon (calls `setActiveWidget`) and Delete icon (shows confirmation, then calls `removeWidget`) shown on widget hover
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 15. Frontend — Settings panels
  - [x] 15.1 Create `src/components/settings/KPISettingsForm.tsx` — React Hook Form form for `KPIConfig` fields; disables Sum/Average when non-numeric metric selected; calls `updateWidgetConfig` on save
    - _Requirements: 8.1, 8.2_
  - [x] 15.2 Create `src/components/settings/ChartSettingsForm.tsx` — React Hook Form form for `AxisChartConfig` fields (Bar/Line/Area/Scatter); color picker + hex input; calls `updateWidgetConfig` on save
    - _Requirements: 9.1_
  - [x] 15.3 Create `src/components/settings/PieSettingsForm.tsx` — React Hook Form form for `PieChartConfig` fields; calls `updateWidgetConfig` on save
    - _Requirements: 10.1_
  - [x] 15.4 Create `src/components/settings/TableSettingsForm.tsx` — React Hook Form form for `TableConfig` fields; conditional filter condition builder when `applyFilter` checked; calls `updateWidgetConfig` on save
    - _Requirements: 11.1, 11.2_
  - [x] 15.5 Create `src/components/settings/SettingsPanel.tsx` — slide-in panel that renders the correct settings form based on `activeWidgetId`'s widget type
    - _Requirements: 4.2, 8.1, 9.1, 10.1, 11.1_

- [x] 16. Frontend — Responsive layout derivation on save
  - Implement `sm` layout derivation in `saveConfiguration`: map all `lg` grid items to `{ x: 0, w: 4 }` stacked vertically (sorted by `y` then `x`)
  - Implement `md` layout derivation: clamp each item's `x + w` to 8 columns, reflow overflowing items to next row
  - _Requirements: 3.4, 3.5, 16.2, 16.3_

- [x] 17. Final checkpoint — Full integration and all tests passing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with `{ numRuns: 100 }` and are tagged `// Feature: custom-dashboard-builder, Property N: <text>`
- The backend replaces all localStorage persistence from the original design; `VITE_API_URL` and `MONGODB_URI` must be set in `.env` files
- `mongodb-memory-server` is recommended for backend unit tests to avoid needing a live Atlas connection in CI
