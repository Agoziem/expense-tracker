# Expense Tracker - Architectural Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Core Modules](#core-modules)
6. [Data Flow](#data-flow)
7. [Authentication & Authorization](#authentication--authorization)
8. [State Management](#state-management)
9. [Routing & Navigation](#routing--navigation)
10. [Component Architecture](#component-architecture)
11. [API Integration](#api-integration)
12. [Styling & Theming](#styling--theming)
13. [Performance Optimizations](#performance-optimizations)
14. [Security Considerations](#security-considerations)

---

## Overview

The Expense Tracker is a full-stack web application built with **Next.js 15** and **React 19**, designed to help users track, manage, and analyze their personal expenses. The application follows modern web development best practices with a focus on:

- **Type Safety**: Full TypeScript implementation
- **Component Reusability**: Modular component architecture with ShadCN UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Data Validation**: Zod schemas for runtime type checking
- **Server-Side Rendering**: Next.js App Router for optimal performance
- **State Management**: React Query for server state management

### Key Features
- User authentication with email verification and 2FA
- Expense CRUD operations with categorization
- Real-time expense tracking and filtering
- Data visualization with charts and statistics
- Profile management with avatar upload
- Dark/Light theme support
- Responsive mobile and desktop layouts

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Component Library**: ShadCN UI (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts 2.15.4
- **Theme**: next-themes

### Data Management
- **Server State**: React Query (with Axios)
- **Form Validation**: Zod schemas
- **Client State**: React hooks (useState, useContext)
- **Data Tables**: TanStack Table 8.x

### UI/UX Libraries
- **Drag & Drop**: @dnd-kit
- **Date Picker**: react-day-picker
- **Phone Input**: react-phone-number-input
- **Notifications**: Sonner (toast)
- **OTP Input**: input-otp
- **Command Palette**: cmdk

### Development Tools
- **Package Manager**: pnpm
- **Linter**: ESLint
- **Build Tool**: Next.js Turbopack
- **Type Checking**: TypeScript

---

## Project Structure

```
expensetracker/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── verify-email/
│   │   ├── verify-2FA/
│   │   ├── onboarding/
│   │   └── layout.tsx
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── page.tsx              # Dashboard home
│   │   ├── manage-expenses/
│   │   ├── profile/
│   │   └── layout.tsx
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── custom/                   # Custom components
│   │   ├── avatar-upload.tsx
│   │   ├── custom-dialog.tsx
│   │   ├── custom-popover.tsx
│   │   ├── expenses-form.tsx
│   │   ├── expenses-table.tsx
│   │   ├── imageuploader.tsx
│   │   └── ...
│   ├── layouts/                  # Layout components
│   │   ├── sidebar/
│   │   │   ├── sidebar.tsx
│   │   │   └── sidebaritems.ts
│   │   └── navbar/
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Auth module
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── profile-form.tsx
│   │   │   └── ...
│   │   ├── dashboard/            # Dashboard module
│   │   │   ├── container.tsx
│   │   │   ├── stats-cards.tsx
│   │   │   ├── trend-chart.tsx
│   │   │   ├── categorychart.tsx
│   │   │   └── header.tsx
│   │   ├── profile/              # Profile module
│   │   │   ├── container.tsx
│   │   │   ├── profile-info.tsx
│   │   │   ├── profile-update-form.tsx
│   │   │   ├── twoFA.tsx
│   │   │   └── delete.tsx
│   │   └── manage-expenses/      # Expenses module
│   │       └── container.tsx
│   └── ui/                       # ShadCN UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── data-grid.tsx
│       ├── sidebar.tsx
│       └── ...
│
├── data/                         # API layer
│   ├── instance.ts               # Axios instance config
│   ├── constant.ts               # API constants
│   └── endpoints/                # API endpoints
│       ├── auth.ts
│       ├── expenses.ts
│       ├── user.ts
│       └── files.ts
│
├── validators/                   # Validation schemas
│   ├── schemas/                  # Zod schemas
│   │   ├── auth.ts
│   │   ├── expense.ts
│   │   ├── user.ts
│   │   └── custom-validation.ts
│   └── types/                    # TypeScript types
│       ├── auth.ts
│       ├── expense.ts
│       └── user.ts
│
├── providers/                    # Context providers
│   ├── index.tsx                 # Combined providers
│   ├── react-query/
│   │   └── index.tsx            # React Query provider
│   └── theme/
│       └── index.tsx            # Theme provider
│
├── hooks/                        # Custom React hooks
│   ├── use-file-upload.ts
│   └── ...
│
├── utils/                        # Utility functions
│   └── auth.ts
│
├── lib/                          # Library configurations
│   └── utils.ts                  # cn() utility
│
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── components.json               # ShadCN config
└── documentation/                # Project documentation
```

---

## Architecture Patterns

### 1. **Modular Architecture**
The application follows a feature-based modular architecture where each major feature (Auth, Dashboard, Profile, Expenses) is isolated into its own module with related components, logic, and styles.

**Benefits:**
- Easy to maintain and scale
- Clear separation of concerns
- Reusable components across modules
- Independent testing of modules

### 2. **Component-Driven Development**
Components are organized in three layers:

```
UI Components (ui/) → Custom Components (custom/) → Feature Modules (modules/)
     ↓                        ↓                            ↓
  Primitives           Composed Components          Business Logic
```

**Example Flow:**
```
Button (ui/) → CustomDialog (custom/) → DeleteExpense (modules/)
```

### 3. **Container/Presentational Pattern**
- **Containers**: Handle data fetching, state management, and business logic
- **Presentational**: Receive props and render UI

**Example:**
```tsx
// Container (modules/dashboard/container.tsx)
export default function DashboardContainer() {
  const { data, isLoading } = useGetExpenses();
  return <DashboardStats data={data} loading={isLoading} />;
}

// Presentational (modules/dashboard/stats-cards.tsx)
export function DashboardStats({ data, loading }) {
  return <div>{/* Render stats */}</div>;
}
```

### 4. **Repository Pattern for API**
All API calls are centralized in the `data/endpoints/` directory:

```typescript
// data/endpoints/expenses.ts
export const useGetExpenses = (params: ExpenseListQueryParams) => {
  return useQuery(['expenses', params], () => fetchExpenses(params));
};
```

### 5. **Schema-First Validation**
Zod schemas serve as the single source of truth for data validation:

```typescript
// validators/schemas/expense.ts
export const ExpenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  category: z.enum([...categories]),
});

// validators/types/expense.ts
export type ExpenseType = z.infer<typeof ExpenseSchema>;
```

---

## Core Modules

### 1. Authentication Module (`components/modules/auth/`)

**Purpose**: Handle user authentication, registration, and email verification

**Components:**
- `login-form.tsx` - User login with email/password
- `register-form.tsx` - User registration with validation
- `forgot-password-form.tsx` - Password reset request
- `reset-password.tsx` - Password reset with token
- `verify-email-form.tsx` - Email verification
- `twoFA-form.tsx` - Two-factor authentication
- `profile-form.tsx` - Initial profile setup (onboarding)
- `logout-modal.tsx` - Logout confirmation
- `auth-carousel.tsx` - Auth page carousel

**Key Features:**
- Email/password authentication
- Social authentication ready
- Two-factor authentication (2FA)
- Email verification workflow
- Password reset flow
- Profile completion (onboarding)

**Data Flow:**
```
User Input → Form Validation (Zod) → API Call (React Query) 
  → Token Storage (Cookies) → Redirect to Dashboard
```

### 2. Dashboard Module (`components/modules/dashboard/`)

**Purpose**: Display expense overview, statistics, and visualizations

**Components:**
- `container.tsx` - Dashboard layout container
- `header.tsx` - Dashboard header with greeting and date
- `stats-cards.tsx` - Expense statistics cards (Total, Income, etc.)
- `trend-chart.tsx` - Line/Area chart for expense trends
- `categorychart.tsx` - Pie chart for category distribution

**Key Features:**
- Real-time expense statistics
- Interactive charts (Recharts)
- Time-based filtering (This Month, Last Month, etc.)
- Category-wise breakdown
- Responsive grid layout

**Data Dependencies:**
- `useGetExpenses()` - Fetch expenses with filters
- `useGetExpenseStats()` - Fetch aggregated statistics

### 3. Expense Management Module (`components/modules/manage-expenses/`)

**Purpose**: CRUD operations for expenses with advanced filtering and bulk actions

**Components:**
- `container.tsx` - Expenses management container
- `expenses-table.tsx` (custom/) - Data table with sorting, filtering, pagination
- `expenses-form.tsx` (custom/) - Add/Edit expense form

**Key Features:**
- Full-text search
- Category filtering
- Date range filtering
- Bulk delete operations
- Inline editing
- Export capabilities
- Pagination and sorting

**Data Table Features:**
- Column sorting
- Column visibility toggle
- Column resizing
- Row selection
- Responsive mobile view with horizontal scroll

### 4. Profile Module (`components/modules/profile/`)

**Purpose**: User profile management and settings

**Components:**
- `container.tsx` - Profile tabs container
- `profile-info.tsx` - Display user information and statistics
- `profile-update-form.tsx` - Edit profile form
- `twoFA.tsx` - Two-factor authentication settings
- `delete.tsx` - Account deletion

**Key Features:**
- Avatar upload with preview
- Personal information editing
- Location selector (country/state)
- Phone number input with validation
- 2FA enable/disable
- Account deletion with confirmation
- Monthly expense statistics

---

## Data Flow

### Request Flow Architecture

```
Component
    ↓
Custom Hook (React Query)
    ↓
API Endpoint Function
    ↓
Axios Instance (with interceptors)
    ↓
Backend API
    ↓
Response Processing
    ↓
Cache Update (React Query)
    ↓
Component Re-render
```

### Example: Fetching Expenses

```typescript
// 1. Component
function ExpenseList() {
  const { data, isLoading } = useGetExpenses({ page: 1 });
  // ...
}

// 2. Custom Hook (data/endpoints/expenses.ts)
export const useGetExpenses = (params: ExpenseListQueryParams) => {
  return useQuery(
    ['expenses', params],
    () => axiosInstance.get('/expenses', { params }),
    { staleTime: 5 * 60 * 1000 }
  );
};

// 3. Axios Instance (data/instance.ts)
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 4. Interceptors (data/instance.ts)
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### State Management Layers

1. **Server State** (React Query)
   - API data caching
   - Background refetching
   - Optimistic updates
   - Cache invalidation

2. **Form State** (React Hook Form)
   - Form field values
   - Validation errors
   - Dirty/touched states
   - Submit handling

3. **UI State** (React useState)
   - Modal open/close
   - Dropdown selections
   - Theme preferences
   - Sidebar collapsed state

4. **Global Context** (React Context)
   - Theme provider
   - React Query provider
   - Sidebar provider

---

## Authentication & Authorization

### Authentication Flow

#### 1. Login Flow
```
User enters credentials
    ↓
Client-side validation (Zod)
    ↓
POST /auth/login
    ↓
Receive tokens (access_token, refresh_token)
    ↓
Store in HTTP-only cookies
    ↓
Decode token to get user info
    ↓
Redirect to dashboard or onboarding
```

#### 2. Protected Routes (middleware.ts)
```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Redirect authenticated users from auth pages
  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}
```

#### 3. Token Management
- **Access Token**: Short-lived (15-60 minutes), stored in HTTP-only cookie
- **Refresh Token**: Long-lived (7 days), used to refresh access token
- **Auto Refresh**: Axios interceptor handles token refresh on 401 errors

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        const newToken = await refreshAccessToken(refreshToken);
        // Retry original request
      }
    }
    return Promise.reject(error);
  }
);
```

### Authorization Levels

1. **Public Routes**: Login, Register, Forgot Password
2. **Authenticated Routes**: Dashboard, Expenses, Profile
3. **Conditional Routes**: Onboarding (for incomplete profiles)

---

## State Management

### React Query Configuration

```typescript
// providers/react-query/index.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Query Keys Convention

```typescript
// Single resource
['expense', expenseId]

// List with filters
['expenses', { page: 1, category: 'Food' }]

// User profile
['user', 'profile']

// Statistics
['expenses', 'stats', { month: 'current' }]
```

### Cache Invalidation Strategy

```typescript
// After creating expense
queryClient.invalidateQueries(['expenses']);
queryClient.invalidateQueries(['expenses', 'stats']);

// After updating profile
queryClient.invalidateQueries(['user', 'profile']);

// Optimistic updates
const mutation = useMutation(updateExpense, {
  onMutate: async (newExpense) => {
    await queryClient.cancelQueries(['expenses']);
    const previous = queryClient.getQueryData(['expenses']);
    queryClient.setQueryData(['expenses'], (old) => [...old, newExpense]);
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['expenses'], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['expenses']);
  },
});
```

---

## Routing & Navigation

### App Router Structure

```
app/
├── (auth)/                    # Route group (no URL segment)
│   ├── layout.tsx            # Auth-specific layout
│   ├── login/page.tsx        # /login
│   ├── register/page.tsx     # /register
│   └── ...
│
└── (dashboard)/               # Route group (no URL segment)
    ├── layout.tsx            # Dashboard layout with sidebar
    ├── page.tsx              # / (dashboard home)
    ├── manage-expenses/      # /manage-expenses
    │   └── page.tsx
    └── profile/              # /profile
        └── page.tsx
```

### Layout Composition

```typescript
// app/layout.tsx (Root Layout)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
}
```

### Navigation Patterns

1. **Sidebar Navigation** (`components/layouts/sidebar/`)
   - Dashboard
   - Manage Expenses
   - Profile
   - Logout

2. **Programmatic Navigation**
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
router.replace('/login');
router.back();
```

---

## Component Architecture

### Component Hierarchy

```
App
├── Providers (Theme, React Query)
│   └── Layout (Root)
│       ├── Auth Layout
│       │   └── Auth Pages (Login, Register, etc.)
│       └── Dashboard Layout
│           ├── Sidebar
│           └── Dashboard Pages
│               ├── Module Containers
│               │   ├── Custom Components
│               │   │   └── UI Components
```

### Component Types

#### 1. UI Components (Primitives)
**Location**: `components/ui/`

**Examples**: Button, Input, Card, Dialog, Select

**Characteristics:**
- No business logic
- Highly reusable
- Consistent styling
- Accessible (ARIA)
- Customizable via props

```typescript
// components/ui/button.tsx
export function Button({ variant, size, children, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size }))} {...props}>
      {children}
    </button>
  );
}
```

#### 2. Custom Components
**Location**: `components/custom/`

**Examples**: ExpensesTable, ExpensesForm, AvatarUploader

**Characteristics:**
- Composed from UI components
- Domain-specific logic
- Reusable across features
- May include API calls

```typescript
// components/custom/expenses-table.tsx
export default function ExpenseTable() {
  const { data, isLoading } = useGetExpenses();
  const table = useReactTable({...});
  
  return (
    <DataGrid table={table}>
      {/* Table implementation */}
    </DataGrid>
  );
}
```

#### 3. Module Components
**Location**: `components/modules/[module]/`

**Examples**: DashboardContainer, ProfileInfo, LoginForm

**Characteristics:**
- Feature-specific
- Business logic integration
- API data management
- State management

```typescript
// components/modules/dashboard/container.tsx
export default function DashboardContainer() {
  const { data: expenses } = useGetExpenses();
  const { data: stats } = useGetExpenseStats();
  
  return (
    <div>
      <DashboardHeader />
      <StatsCards stats={stats} />
      <TrendChart expenses={expenses} />
    </div>
  );
}
```

### Component Patterns

#### Compound Components
```typescript
// Card component with sub-components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>{/* Footer */}</CardFooter>
</Card>
```

#### Render Props
```typescript
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

#### Custom Hooks
```typescript
// hooks/use-file-upload.ts
export function useFileUpload(options) {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  
  const handleDrop = (e) => {
    // Drag & drop logic
  };
  
  return { files, errors, handleDrop };
}
```

---

## API Integration

### Axios Configuration

```typescript
// data/instance.ts
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Handle 401, token refresh, etc.
    return Promise.reject(error);
  }
);
```

### API Endpoints Organization

```typescript
// data/endpoints/expenses.ts
export const fetchExpenses = async (params: ExpenseListQueryParams) => {
  return axiosInstance.get('/expenses', { params });
};

export const createExpense = async (data: ExpenseCreateType) => {
  return axiosInstance.post('/expenses', data);
};

export const updateExpense = async (id: string, data: ExpenseUpdateType) => {
  return axiosInstance.put(`/expenses/${id}`, data);
};

export const deleteExpense = async (id: string) => {
  return axiosInstance.delete(`/expenses/${id}`);
};

// React Query hooks
export const useGetExpenses = (params: ExpenseListQueryParams) => {
  return useQuery(['expenses', params], () => fetchExpenses(params));
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation(createExpense, {
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      toast.success('Expense created successfully!');
    },
  });
};
```

### Error Handling

```typescript
// Global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error('Invalid request');
          break;
        case 401:
          toast.error('Session expired');
          router.push('/login');
          break;
        case 403:
          toast.error('Access denied');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error');
          break;
        default:
          toast.error('Something went wrong');
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Styling & Theming

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
};
```

### Theme Provider

```typescript
// providers/theme/index.tsx
export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

### CSS Variables

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    /* ... more variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    /* ... more variables */
  }
}
```

### Responsive Design Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large desktop

// Usage
<div className="text-xs sm:text-sm md:text-base lg:text-lg">
```

### Component Styling Patterns

```typescript
// Using cn() utility (lib/utils.ts)
import { cn } from '@/lib/utils';

export function Button({ className, variant, size }) {
  return (
    <button
      className={cn(
        'base-button-classes',
        variantStyles[variant],
        sizeStyles[size],
        className // User overrides
      )}
    />
  );
}

// Class Variance Authority
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border border-input',
    },
    size: {
      default: 'h-10 px-4',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
```

---

## Performance Optimizations

### 1. Code Splitting
- **Automatic** via Next.js App Router
- **Dynamic Imports** for heavy components
```typescript
const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

### 2. React Query Caching
```typescript
// Aggressive caching for static data
useQuery(['categories'], fetchCategories, {
  staleTime: Infinity,
  cacheTime: Infinity,
});

// Moderate caching for frequently updated data
useQuery(['expenses'], fetchExpenses, {
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 3. Memoization
```typescript
// useMemo for expensive calculations
const sortedExpenses = useMemo(
  () => expenses.sort((a, b) => b.amount - a.amount),
  [expenses]
);

// useCallback for event handlers
const handleDelete = useCallback(
  (id: string) => deleteExpense(id),
  [deleteExpense]
);
```

### 4. Virtual Scrolling
```typescript
// TanStack Table with virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: table.getRowModel().rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

### 5. Image Optimization
```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src={avatar}
  alt="Avatar"
  width={100}
  height={100}
  loading="lazy"
  placeholder="blur"
/>
```

### 6. Debouncing Search
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    fetchExpenses({ search: debouncedSearch });
  }
}, [debouncedSearch]);
```

---

## Security Considerations

### 1. XSS Prevention
- All user input sanitized
- React's default escaping
- No `dangerouslySetInnerHTML` usage

### 2. CSRF Protection
```typescript
// Axios sends CSRF token
axiosInstance.defaults.headers.common['X-CSRF-Token'] = csrfToken;
```

### 3. Secure Token Storage
- HTTP-only cookies for tokens
- SameSite=Strict attribute
- Secure flag in production

### 4. Input Validation
```typescript
// Client-side validation (Zod)
const schema = z.object({
  email: z.string().email(),
  amount: z.number().positive().max(1000000),
});

// Server-side validation (mirrored schemas)
```

### 5. Authorization Checks
```typescript
// Middleware protection
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return redirect('/login');
  }
}
```

### 6. Rate Limiting
```typescript
// Implemented on backend
// Client-side: Disable submit button during requests
const [isSubmitting, setIsSubmitting] = useState(false);
```

### 7. Sensitive Data Handling
- No passwords stored in state
- Masked credit card inputs
- Secure file upload validation

---

## Conclusion

This architecture documentation provides a comprehensive overview of the Expense Tracker application's structure, patterns, and best practices. The application is designed with scalability, maintainability, and performance in mind, following modern React and Next.js conventions.

For implementation details and usage instructions, refer to the [Usage Documentation](./USAGE.md).
