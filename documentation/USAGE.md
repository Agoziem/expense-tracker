# Expense Tracker - Usage Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Installation & Setup](#installation--setup)
3. [Environment Configuration](#environment-configuration)
4. [Development Workflow](#development-workflow)
5. [User Features Guide](#user-features-guide)
6. [Component Usage](#component-usage)
7. [API Integration](#api-integration)
8. [Form Management](#form-management)
9. [Data Tables](#data-tables)
10. [File Uploads](#file-uploads)
11. [Theme Customization](#theme-customization)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18.17.0 or higher
- **pnpm**: v8.0.0 or higher (recommended) or npm/yarn
- **Git**: For version control

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd expensetracker

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Run development server
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

---

## Installation & Setup

### 1. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install
```

### 2. Project Structure Setup

The project follows a modular structure. Key directories:

```
├── app/              # Next.js pages (App Router)
├── components/       # React components
│   ├── ui/          # Base UI components (ShadCN)
│   ├── custom/      # Custom reusable components
│   ├── modules/     # Feature-specific modules
│   └── layouts/     # Layout components
├── data/            # API layer
├── validators/      # Zod schemas and types
├── providers/       # React context providers
├── hooks/           # Custom React hooks
└── utils/           # Utility functions
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-url.com/api

# Optional: Analytics, Error Tracking, etc.
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Environment-Specific Configurations

**Development**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Staging**:
```bash
NEXT_PUBLIC_API_URL=https://staging-api.yourapp.com/api
```

**Production**:
```bash
NEXT_PUBLIC_API_URL=https://api.yourapp.com/api
```

---

## Development Workflow

### Available Scripts

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type checking
npx tsc --noEmit
```

### Development Server

```bash
pnpm dev
```

**Features:**
- Fast Refresh (Hot Module Replacement)
- Turbopack for faster builds
- Runs on http://localhost:3000
- Auto-opens browser

### Building for Production

```bash
# Create optimized production build
pnpm build

# Test production build locally
pnpm start
```

### Code Quality Checks

```bash
# ESLint
pnpm lint

# TypeScript type checking
npx tsc --noEmit

# Format code (if Prettier is configured)
pnpm format
```

---

## User Features Guide

### 1. User Authentication

#### Registration Flow

1. **Navigate to Registration**
   - Go to `/register`
   - Or click "Sign Up" from login page

2. **Fill Registration Form**
   ```
   - First Name (required)
   - Last Name (required)
   - Email (required, valid email)
   - Password (required, min 8 characters)
   - Confirm Password (must match)
   ```

3. **Submit Form**
   - Validation occurs on blur and submit
   - Success → Redirects to email verification

4. **Email Verification**
   - Check email for verification code
   - Enter 6-digit OTP
   - Success → Redirects to onboarding

5. **Profile Completion (Onboarding)**
   - Upload profile photo (optional)
   - Add phone number
   - Select location (country/state)
   - Add bio and gender
   - Success → Redirects to dashboard

#### Login Flow

1. **Navigate to Login**: `/login`

2. **Enter Credentials**
   ```
   - Email
   - Password
   ```

3. **Optional: Enable 2FA**
   - If 2FA is enabled, enter verification code

4. **Success**: Redirects to dashboard

#### Password Reset

1. **Forgot Password**: Click "Forgot Password?" on login page
2. **Enter Email**: Registered email address
3. **Check Email**: Receive reset link
4. **Reset Password**: Enter new password
5. **Confirm**: Return to login with new password

#### Two-Factor Authentication (2FA)

**Enable 2FA:**
1. Go to Profile → Two-Factor Authentication
2. Click "Enable 2FA"
3. Scan QR code with authenticator app (Google Authenticator, Authy)
4. Enter verification code to confirm
5. Save backup codes (important!)

**Disable 2FA:**
1. Go to Profile → Two-Factor Authentication
2. Click "Disable 2FA"
3. Enter verification code to confirm

### 2. Dashboard Overview

#### Main Dashboard Features

**Statistics Cards:**
- **Total Expenses**: Sum of all expenses
- **Total Income**: Sum of all income (if tracked)
- **Balance**: Income - Expenses
- **This Month**: Current month's expenses

**Trend Chart:**
- Line/Area chart showing expense trends over time
- Filter by: This Month, Last Month, Last 3 Months, This Year
- Interactive tooltips on hover

**Category Chart:**
- Pie chart showing expense distribution by category
- Percentage breakdown
- Click legend to toggle categories

**Quick Actions:**
- Add New Expense (+ button)
- Filter by date range
- Switch views

### 3. Expense Management

#### Adding an Expense

1. **Open Form**
   - Click "+ Add Expense" button
   - Or click "Add" in manage expenses page

2. **Fill Form Fields**
   ```typescript
   {
     title: string,           // e.g., "Grocery Shopping"
     amount: number,          // e.g., 150.00
     category: enum,          // Food, Transport, Rent, etc.
     expense_date: date,      // Date of expense
     description: string,     // Optional details
   }
   ```

3. **Submit**
   - Validation occurs automatically
   - Success message appears
   - Table updates automatically

#### Editing an Expense

1. **Open Actions Menu**
   - Click three-dot menu (⋮) on expense row

2. **Click "Edit"**
   - Form pre-fills with existing data

3. **Modify Fields**
   - Change any field as needed

4. **Save Changes**
   - Updates reflect immediately in table

#### Deleting Expenses

**Single Delete:**
1. Click three-dot menu (⋮)
2. Click "Delete"
3. Confirm deletion in dialog
4. Success message appears

**Bulk Delete:**
1. Select checkboxes for multiple expenses
2. Click "Delete (X)" button in toolbar
3. Confirm deletion
4. All selected expenses removed

#### Searching and Filtering

**Search:**
```
Type in search box → Searches title and description in real-time
```

**Category Filter:**
```
Select category dropdown → Shows only expenses from that category
```

**Date Range Filter:**
```
Select date range → Shows expenses within that period
```

**Clear Filters:**
```
Click X in search box or select "All Categories"
```

#### Table Features

**Sorting:**
- Click column headers to sort
- Click again to reverse sort order
- Supports: Title, Amount, Category, Date

**Pagination:**
- Shows 10 expenses per page (configurable)
- Navigate with Previous/Next buttons
- Jump to specific page

**Column Visibility:**
- Click column visibility icon
- Toggle columns on/off
- Settings persist in session

**Mobile View:**
- Table scrolls horizontally
- Touch-friendly interactions
- Optimized for small screens

### 4. Profile Management

#### Viewing Profile

Navigate to **Profile** from sidebar:

**Information Displayed:**
- Profile photo
- Full name
- Email address
- Phone number
- Location (Country, State)
- Bio
- Account creation date
- Monthly statistics:
  - Total expenses this month
  - Highest expense category
  - Number of transactions

#### Updating Profile

1. **Go to Profile Page**
2. **Click Edit Profile Tab**
3. **Modify Fields:**
   ```
   - Profile Photo (click to upload)
   - First Name
   - Last Name
   - Phone Number
   - Country & State
   - Address
   - Bio
   - Gender
   ```
4. **Save Changes**
   - Click "Update Profile" button
   - Success message appears

#### Avatar Upload

1. **Click on Avatar Circle**
   - Or drag & drop image

2. **File Requirements:**
   - Format: PNG, JPG, JPEG
   - Max Size: 2MB
   - Recommended: Square images (e.g., 400x400)

3. **Preview:**
   - Image previews immediately
   - Click X to remove

4. **Save:**
   - Avatar uploads on form submission

#### Account Deletion

⚠️ **Warning: This action is irreversible!**

1. **Go to Profile → Delete Account Tab**
2. **Read Warning Message**
3. **Type Confirmation**
   - Enter exact text as shown
4. **Click "Delete My Account"**
5. **Confirm in Final Dialog**
6. **Account and All Data Deleted**

### 5. Theme Toggle

**Switch Between Light/Dark Mode:**

1. **Desktop:**
   - Click theme toggle in navbar (sun/moon icon)

2. **System Theme:**
   - Automatically uses OS preference
   - Updates when OS theme changes

3. **Theme Persistence:**
   - Selection saved in localStorage
   - Persists across sessions

---

## Component Usage

### Using UI Components (ShadCN)

#### Button Component

```tsx
import { Button } from "@/components/ui/button";

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// With sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <PlusIcon />
</Button>

// With icons
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Add Expense
</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

#### Input Component

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Basic input
<Input type="text" placeholder="Enter text..." />

// With label
<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>

// With error state
<Input className="border-destructive" />

// Disabled
<Input disabled value="Read only" />

// With prefix/suffix
<div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
  <Input className="pl-7" type="number" placeholder="0.00" />
</div>
```

#### Card Component

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Dialog Component

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description text
      </DialogDescription>
    </DialogHeader>
    <div>Dialog content here</div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Using Custom Components

#### CustomDialog (Variants)

```tsx
import { StandardDialog, ConfirmDialog } from "@/components/custom/custom-dialog";

// Standard Dialog
<StandardDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Add Expense"
  description="Fill in the details below"
  size="lg"
>
  <ExpensesForm onSuccess={() => setIsOpen(false)} />
</StandardDialog>

// Confirm Dialog
<ConfirmDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="Delete Expense"
  description="Are you sure? This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
  loading={isDeleting}
/>
```

#### CustomPopover

```tsx
import { CustomPopover } from "@/components/custom/custom-popover";

<CustomPopover
  trigger={
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  }
  contentClassName="w-48"
>
  <div className="space-y-1">
    <button onClick={handleEdit} className="menu-item">
      Edit
    </button>
    <button onClick={handleDelete} className="menu-item-danger">
      Delete
    </button>
  </div>
</CustomPopover>
```

#### AvatarUploader

```tsx
import AvatarUploader from "@/components/custom/avatar-upload";

<FormField
  control={form.control}
  name="avatar"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <AvatarUploader
          value={field.value}
          onChange={field.onChange}
          maxSize={2 * 1024 * 1024} // 2MB
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### LocationSelector

```tsx
import LocationSelector from "@/components/custom/location-select";

<LocationSelector
  defaultCountry={form.watch("country")}
  defaultState={form.watch("state")}
  onCountryChange={(country) => {
    form.setValue("country", country?.name || "");
  }}
  onStateChange={(state) => {
    form.setValue("state", state?.name || "");
  }}
/>
```

---

## API Integration

### Setting Up API Calls

#### 1. Configure Axios Instance

The axios instance is pre-configured in `data/instance.ts`:

```typescript
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor (adds auth token)
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handles errors)
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

#### 2. Create API Endpoints

Create endpoint functions in `data/endpoints/`:

```typescript
// data/endpoints/expenses.ts
import axiosInstance from '../instance';
import { ExpenseCreateType, ExpenseUpdateType } from '@/validators/types/expense';

// Fetch expenses
export const fetchExpenses = async (params?: ExpenseListQueryParams) => {
  return axiosInstance.get('/expenses', { params });
};

// Create expense
export const createExpense = async (data: ExpenseCreateType) => {
  return axiosInstance.post('/expenses', data);
};

// Update expense
export const updateExpense = async (id: string, data: ExpenseUpdateType) => {
  return axiosInstance.put(`/expenses/${id}`, data);
};

// Delete expense
export const deleteExpense = async (id: string) => {
  return axiosInstance.delete(`/expenses/${id}`);
};
```

#### 3. Create React Query Hooks

```typescript
// data/endpoints/expenses.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

// GET - Fetch expenses
export const useGetExpenses = (params?: ExpenseListQueryParams) => {
  return useQuery(
    ['expenses', params],
    () => fetchExpenses(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    }
  );
};

// POST - Create expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation(createExpense, {
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      queryClient.invalidateQueries(['expenses', 'stats']);
      toast.success('Expense created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create expense');
    },
  });
};

// PUT - Update expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: ExpenseUpdateType }) => 
      updateExpense(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['expenses']);
        toast.success('Expense updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update expense');
      },
    }
  );
};

// DELETE - Delete expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation(deleteExpense, {
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      queryClient.invalidateQueries(['expenses', 'stats']);
      toast.success('Expense deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete expense');
    },
  });
};
```

#### 4. Use in Components

```tsx
import { useGetExpenses, useCreateExpense, useDeleteExpense } from '@/data/endpoints/expenses';

export default function ExpenseList() {
  // Fetch expenses
  const { data, isLoading, error } = useGetExpenses({ page: 1, page_size: 10 });
  
  // Create mutation
  const { mutate: createExpense, isLoading: isCreating } = useCreateExpense();
  
  // Delete mutation
  const { mutate: deleteExpense, isLoading: isDeleting } = useDeleteExpense();
  
  const handleCreate = (formData) => {
    createExpense(formData);
  };
  
  const handleDelete = (id: string) => {
    deleteExpense(id);
  };
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {/* Render expenses */}
    </div>
  );
}
```

### API Response Structure

Expected API response formats:

```typescript
// Success Response
{
  success: true,
  data: {
    expenses: [...],
    total: 100,
    page: 1,
    total_pages: 10
  }
}

// Error Response
{
  success: false,
  message: "Error description",
  errors: {
    field: ["Validation error message"]
  }
}
```

---

## Form Management

### Using React Hook Form with Zod

#### 1. Define Zod Schema

```typescript
// validators/schemas/expense.ts
import { z } from 'zod';

export const ExpenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.enum(['Food', 'Transport', 'Rent', 'Utilities', 'Other']),
  expense_date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
});

export type ExpenseType = z.infer<typeof ExpenseSchema>;
```

#### 2. Create Form Component

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseSchema, ExpenseType } from '@/validators/schemas/expense';

export default function ExpenseForm() {
  const form = useForm<ExpenseType>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      title: '',
      amount: 0,
      category: 'Food',
      expense_date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });
  
  const onSubmit = async (data: ExpenseType) => {
    console.log(data);
    // Call API
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

#### 3. Add Form Fields

```tsx
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Title</FormLabel>
      <FormControl>
        <Input placeholder="Grocery shopping" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="amount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Amount</FormLabel>
      <FormControl>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          {...field}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="Food">Food</SelectItem>
          <SelectItem value="Transport">Transport</SelectItem>
          <SelectItem value="Rent">Rent</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### 4. Form Submission

```tsx
const { mutate: createExpense, isLoading } = useCreateExpense();

const onSubmit = async (data: ExpenseType) => {
  createExpense(data, {
    onSuccess: () => {
      form.reset(); // Reset form after success
      onClose?.(); // Close dialog if applicable
    },
  });
};

return (
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Form fields */}
    <Button type="submit" disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create Expense'}
    </Button>
  </form>
);
```

### Form Validation Examples

```typescript
// Required field
z.string().min(1, 'This field is required')

// Email validation
z.string().email('Invalid email address')

// Password validation
z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[0-9]/, 'Must contain a number')

// Number validation
z.number()
  .positive('Must be positive')
  .max(1000000, 'Amount too large')

// Date validation
z.string().refine((date) => !isNaN(Date.parse(date)), {
  message: 'Invalid date format',
})

// Conditional validation
z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Optional with default
z.string().optional().default('')
```

---

## Data Tables

### Using TanStack Table

#### 1. Define Columns

```typescript
import { ColumnDef } from '@tanstack/react-table';
import { ExpenseResponseModel } from '@/validators/types/expense';

const columns: ColumnDef<ExpenseResponseModel>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div>{row.original.title}</div>,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="font-semibold">
        ${row.original.amount.toFixed(2)}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div>
        <Button onClick={() => handleEdit(row.original)}>Edit</Button>
        <Button onClick={() => handleDelete(row.original.id)}>Delete</Button>
      </div>
    ),
  },
];
```

#### 2. Initialize Table

```typescript
const [sorting, setSorting] = useState<SortingState>([]);
const [rowSelection, setRowSelection] = useState({});
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
});

const table = useReactTable({
  data: expenses,
  columns,
  state: {
    sorting,
    rowSelection,
    pagination,
  },
  onSortingChange: setSorting,
  onRowSelectionChange: setRowSelection,
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  manualPagination: true,
  pageCount: totalPages,
});
```

#### 3. Render Table

```tsx
<DataGrid table={table} recordCount={total} isLoading={isLoading}>
  <Card>
    <CardHeader>
      <CardTitle>Expenses</CardTitle>
      <CardToolbar>
        {/* Filters, search, actions */}
      </CardToolbar>
    </CardHeader>
    <CardTable>
      <ScrollArea>
        <DataGridTable />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CardTable>
    <CardFooter>
      <DataGridPagination />
    </CardFooter>
  </Card>
</DataGrid>
```

### Table Features

**Sorting:**
```typescript
// Enable sorting on column
{
  accessorKey: 'amount',
  header: ({ column }) => (
    <DataGridColumnHeader column={column} title="Amount" />
  ),
  enableSorting: true,
}
```

**Filtering:**
```typescript
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

const table = useReactTable({
  state: {
    columnFilters,
  },
  onColumnFiltersChange: setColumnFilters,
  getFilteredRowModel: getFilteredRowModel(),
});
```

**Row Selection:**
```typescript
// Get selected rows
const selectedRows = table.getFilteredSelectedRowModel().rows;
const selectedIds = selectedRows.map(row => row.original.id);

// Bulk actions
const handleBulkDelete = () => {
  selectedIds.forEach(id => deleteExpense(id));
};
```

---

## File Uploads

### Using AvatarUploader

```tsx
import AvatarUploader from "@/components/custom/avatar-upload";

function ProfileForm() {
  const form = useForm({
    defaultValues: {
      avatar: "",
    },
  });
  
  return (
    <FormField
      control={form.control}
      name="avatar"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <AvatarUploader
              value={field.value}
              onChange={field.onChange}
              maxSize={2 * 1024 * 1024} // 2MB limit
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### Using ImageUploader

```tsx
import ImageUploader from "@/components/custom/imageuploader";

function ReceiptUpload() {
  const [receipt, setReceipt] = useState<File | string | null>(null);
  
  return (
    <ImageUploader
      value={receipt}
      onChange={setReceipt}
    />
  );
}
```

### Uploading Files to Server

```typescript
// data/endpoints/files.ts
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axiosInstance.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Usage in component
const handleSubmit = async (data: FormData) => {
  if (data.avatar instanceof File) {
    const response = await uploadFile(data.avatar);
    data.avatar = response.url; // Replace File with uploaded URL
  }
  
  await updateProfile(data);
};
```

### File Validation

```typescript
// Custom validation in AvatarUploader
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    toast.error("Invalid file type. Only image files are allowed.");
    return;
  }

  // Validate file size
  if (file.size > maxSize) {
    toast.error(`File size exceeds ${formatBytes(maxSize)}.`);
    return;
  }

  onChange(file);
};
```

---

## Theme Customization

### Changing Theme Colors

Edit CSS variables in `app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    
    /* Add more colors */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    /* Dark mode colors */
  }
}
```

### Adding Custom Colors

```css
/* Add to :root */
--success: 142 71% 45%;
--success-foreground: 144 61% 20%;

--warning: 38 92% 50%;
--warning-foreground: 48 96% 89%;
```

```typescript
// Use in tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
      },
    },
  },
};
```

### Theme Toggle Component

```tsx
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

---

## Deployment

### Vercel Deployment (Recommended)

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your Git repository

3. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically detects Next.js
   - Deployment completes in ~2 minutes

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Build Locally

```bash
# Create production build
pnpm build

# Test production build
pnpm start

# Build output in .next/ directory
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build Docker image
docker build -t expensetracker .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com expensetracker
```

---

## Troubleshooting

### Common Issues

#### 1. Module Not Found Error

**Error:**
```
Module not found: Can't resolve '@/components/...'
```

**Solution:**
- Check `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
- Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

#### 2. API CORS Error

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
- Ensure backend has CORS enabled for your domain
- Check `withCredentials: true` in axios config
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

#### 3. Authentication Token Not Sent

**Error:**
```
401 Unauthorized
```

**Solution:**
- Check cookies are set with `httpOnly` and `sameSite`
- Verify axios interceptor adds token:
```typescript
config.headers.Authorization = `Bearer ${token}`;
```
- Clear cookies and re-login

#### 4. Build Errors

**Error:**
```
Type error: ...
```

**Solution:**
```bash
# Delete build cache
rm -rf .next

# Delete node_modules
rm -rf node_modules

# Reinstall
pnpm install

# Rebuild
pnpm build
```

#### 5. Hydration Errors

**Error:**
```
Hydration failed because the initial UI does not match...
```

**Solution:**
- Don't use `Date.now()` or `Math.random()` in render
- Use `useEffect` for client-only code
- Add `suppressHydrationWarning` if intentional

#### 6. Theme Not Persisting

**Problem:** Theme resets on page refresh

**Solution:**
- Check ThemeProvider is in root layout
- Verify localStorage is accessible
- Use `enableSystem={false}` if issues persist

#### 7. React Query Not Caching

**Problem:** API called on every render

**Solution:**
- Check query keys are stable:
```typescript
// Bad: new object on every render
useQuery(['expenses', { page }]);

// Good: stable reference
const params = useMemo(() => ({ page }), [page]);
useQuery(['expenses', params]);
```

### Getting Help

**Resources:**
- Next.js Docs: https://nextjs.org/docs
- React Query Docs: https://tanstack.com/query/latest
- ShadCN UI: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com

**Debugging Tips:**
1. Check browser console for errors
2. Use React DevTools for component inspection
3. Use Network tab to debug API calls
4. Enable verbose logging in development
5. Check TypeScript errors with `npx tsc --noEmit`

---

## Conclusion

This usage documentation covers all aspects of using and developing with the Expense Tracker application. For architectural details and design patterns, refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

For additional support, please contact the development team or open an issue in the repository.
