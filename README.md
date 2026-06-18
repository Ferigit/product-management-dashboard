# Product Management Dashboard

A modern, efficient product management system built with React, TypeScript, and React Query featuring optimistic updates, URL-based state persistence, and comprehensive validation.

## Features

- ✅ Paginated product listing with efficient rendering
- ✅ Debounced search with URL persistence
- ✅ Multi-criteria filtering (status, category)
- ✅ Create, edit, and delete operations with optimistic UI updates
- ✅ Comprehensive form validation (synchronous, asynchronous, and cross-field)
- ✅ Efficient cache management with React Query
- ✅ Shareable URLs with filter and pagination state
- ✅ Graceful loading and error states
- ✅ Rollback on failed mutations

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Install Dependencies

```bash
npm install

### Run Development Server
bash
npm run dev

The app will be available at `http://localhost:5173` (or the port shown in terminal).

### Build for Production
bash
npm run build

## Project Structure


src/
├── components/          # Reusable UI components
│   ├── ProductForm.tsx  # Product creation/editing form with validation
│   └── ConfirmModal.tsx # Confirmation dialog for destructive actions
├── features/
│   └── products/        # Product feature modules
│       ├── ProductList.tsx    # Main list view with filters
│       ├── ProductTable.tsx   # Product table component
│       ├── ProductDetail.tsx  # Individual product page
│       ├── CreateProduct.tsx  # Product creation page
│       └── EditProduct.tsx    # Product editing page
├── hooks/               # Custom React hooks
│   ├── useProducts.ts   # React Query hook for fetching products
│   ├── useFilters.ts    # URL-persisted filter state management
│   └── useDebounce.ts   # Debounce hook for search input
├── services/
│   └── api.ts           # API client with typed endpoints
├── lib/
│   └── queryClient.ts   # React Query configuration
├── types/
│   └── index.ts         # TypeScript type definitions
└── App.tsx              # Application router and providers

## Key Architectural Decisions

### 1. React Query for State Management
**Why**: React Query handles caching, background refetching, optimistic updates, and rollback logic automatically. This eliminates the need for complex state management libraries while providing superior UX.

**Implementation**:
- Global cache with 5-minute stale time
- Optimistic updates on edit/delete with automatic rollback on error
- Cache-specific updates instead of full refetch
- Query invalidation for data consistency

### 2. URL-Based Filter Persistence
**Why**: Makes the application state shareable and bookmarkable. Users can share filtered views, and browser back/forward buttons work intuitively.

**Implementation**:
- Custom `useFilters` hook manages URL search params
- All filters (search, status, category, page) stored in URL
- Automatic page reset when filters change

### 3. Debounced Search
**Why**: Reduces unnecessary API calls and improves performance during user typing.

**Implementation**:
- Custom `useDebounce` hook with 500ms delay
- Immediate empty search handling
- Local input state with debounced query execution

### 4. Cross-Field Validation
**Why**: Business rules often depend on multiple fields (e.g., Electronics must have weight).

**Implementation**:
- `validate()` function runs before submission
- Conditional requirements based on category
- Clear error messaging for cross-field violations

### 5. Asynchronous SKU Validation
**Why**: Ensures SKU uniqueness without database constraint violations.

**Implementation**:
- On-blur validation via mock API
- Visual feedback (checking/available states)
- Skip check in edit mode when SKU unchanged
- Server-side validation as final enforcement

### 6. Optimistic Updates with Rollback
**Why**: Instant user feedback improves perceived performance; rollback maintains data integrity.

**Implementation**:
- `onMutate`: Update cache immediately before API call
- `onError`: Restore previous state from context
- `onSettled`: Sync with server via invalidation
- Specific cache updates instead of full refetch

## Validation Strategy

### Standard Validation
- Required fields: SKU, name, description
- Numeric constraints: price > 0, stock >= 0
- Type safety via TypeScript

### Cross-Field Validation
- Electronics category requires weight > 0
- Implemented in `ProductForm.validate()`

### Asynchronous Validation
- SKU uniqueness check via `productsApi.checkSkuAvailability()`
- Triggered on blur with 1-second mock delay
- Visual feedback during check
- Error display if unavailable

## Cache Strategy

### Efficient Updates
Instead of refetching entire lists after mutations, we:
1. Update the specific item in all relevant query caches
2. Remove deleted items from list caches
3. Invalidate queries to sync with server
4. Use query keys for targeted updates: `["products", filters]`, `["product", id]`

### Optimistic Updates Flow

User action → Update cache immediately → API call → Success (keep update) or Error (rollback)

### Benefits
- Instant UI feedback
- Reduced network requests
- Maintained data consistency
- Graceful error recovery

## What I Would Improve With More Time

### Performance
- Virtual scrolling for large datasets (react-window/react-virtuoso)
- Infinite scroll as alternative to pagination
- Image lazy loading and optimization
- Request deduplication for concurrent requests

### Features
- Bulk operations (multi-select delete/edit)
- Export/import (CSV, Excel)
- Advanced filtering (price range, date range)
- Sorting by multiple columns
- Product duplication
- Audit history/change log

### UX Enhancements
- Keyboard shortcuts for power users
- Drag-and-drop image upload
- Auto-save drafts
- Undo/redo functionality
- Toast notifications instead of alerts
- Dark mode support

### Code Quality
- Unit tests (Vitest + Testing Library)
- E2E tests (Playwright/Cypress)
- Storybook for component documentation
- API mocking layer (MSW)
- Error boundary for graceful failure
- Accessibility audit and improvements

### Infrastructure
- Real backend integration
- Authentication and authorization
- Rate limiting and retry logic
- Analytics and monitoring
- CI/CD pipeline
- Deployment to Vercel/Netlify

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## License

MIT

---

Built with ❤️ for efficient product management


The implementation is now complete with:
1. URL-persisted filters and pagination
2. Debounced search
3. Cross-field validation (Electronics requires weight > 0)
4. Delete functionality with confirmation modal
5. Optimistic updates with rollback for edit and delete
6. Cache-specific updates instead of full refetch
7. Comprehensive README

All requirements from the technical task have been fulfilled.
```
