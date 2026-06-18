# Product Management Dashboard

A modern, efficient product management system built with React, TypeScript, and React Query featuring optimistic updates, URL-based state persistence, and comprehensive validation.

## Features

- ✅ Paginated product listing with configurable page size (5, 10, 20, 50)
- ✅ Debounced search with URL persistence
- ✅ Multi-criteria filtering (status, category)
- ✅ Create, edit, and delete operations with optimistic UI updates
- ✅ Comprehensive form validation (synchronous, asynchronous, and cross-field)
- ✅ Efficient cache management with React Query
- ✅ Shareable URLs with filter, pagination, and page size state
- ✅ Responsive design: card layout on mobile, table on desktop
- ✅ Reusable form input components (`TextField`, `NumberField`, `SelectField`, etc.)
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
├── assets/                   # Static assets (images, fonts, etc.)
├── components/
│   ├── form/                 # Reusable form input components
│   │   ├── TextField.tsx
│   │   ├── TextAreaField.tsx
│   │   ├── NumberField.tsx
│   │   ├── SelectField.tsx
│   │   └── SKUField.tsx
│   ├── ConfirmModal.tsx      # Confirmation dialog for destructive actions
│   ├── PaginationControls.tsx # Pagination with page size selector
│   ├── ProductFilters.tsx    # Search and filter inputs
│   ├── ProductForm.tsx       # Product creation/editing form
│   └── ProductTable.tsx      # Responsive product table (cards on mobile)
├── constants/
│   └── product.ts            # Product categories and statuses constants
├── features/
│   └── products/             # Product feature modules
│       ├── CreateProduct.tsx # Product creation page
│       ├── EditProduct.tsx   # Product editing page
│       ├── ProductDetail.tsx # Individual product page
│       └── ProductList.tsx   # Main list view with filters and pagination
├── hooks/
│   ├── useDebounce.ts        # Debounce hook for search input
│   └── useProducts.ts        # React Query hook for fetching products
├── lib/
│   └── queryClient.ts        # React Query configuration
├── mocks/                    # Mock API (MSW)
│   ├── browser.ts            # Browser worker setup
│   ├── data.ts               # Mock product data generator
│   └── handlers.ts           # API request handlers
├── services/
│   └── api.ts                # API client with typed endpoints
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   └── productUtils.ts       # Shared utility functions (e.g., getStatusColor)
├── App.tsx                   # Application router and providers
├── main.tsx                  # Application entry point
└── index.css                 # Global styles (Tailwind)

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
- useSearchParams from React Router manages URL query parameters
- All filters (search, status, category, page, pageSize) stored in URL
- Automatic page reset when filters change
- Debounced search updates URL after typing stops


### 3. Responsive Design
**Why**: Provides optimal viewing experience across devices.

**Implementation**:
- Card layout on small screens (sm and below) to avoid horizontal scrolling
- Table layout on larger screens with column visibility adjustments
- Tailwind CSS responsive classes (block sm:hidden, hidden sm:block)
- Skeleton loaders for both layouts


### 4. Reusable Form Components
**Why**: Reduces duplication and ensures consistent styling and behavior across all forms.

**Implementation**:
- TextField, TextAreaField, NumberField, SelectField, SKUField
- Each component handles label, error display, and required indicator
- ProductForm composes these components for the full product form

### 5. Cross-Field Validation
**Why**: Business rules often depend on multiple fields (e.g., Electronics must have weight).

**Implementation**:
- `validate()` function runs before submission
- Conditional requirements based on category
- Clear error messaging for cross-field violations

### 6. Asynchronous SKU Validation
**Why**: Ensures SKU uniqueness without database constraint violations.

**Implementation**:
- On-blur validation via mock API
- Visual feedback (checking/available states)
- Skip check in edit mode when SKU unchanged
- Server-side validation as final enforcement

### 7. Optimistic Updates with Rollback
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
