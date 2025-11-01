# Expense Tracker - API Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [API Configuration](#api-configuration)
3. [Authentication APIs](#authentication-apis)
4. [User APIs](#user-apis)
5. [Expense APIs](#expense-apis)
6. [File Upload APIs](#file-upload-apis)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## Overview

This document provides detailed information about integrating with the backend API, including all available endpoints, request/response formats, and implementation examples using React Query.

### Base Configuration

```typescript
// data/instance.ts
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., https://api.example.com/api
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer <access_token>
```

Tokens are automatically added by the axios interceptor from HTTP-only cookies.

---

## API Configuration

### Interceptors

#### Request Interceptor

```typescript
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
```

#### Response Interceptor

```typescript
axiosInstance.interceptors.response.use(
  (response) => response.data, // Automatically unwrap data
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refresh_token');
        const response = await axios.post('/auth/refresh', { refreshToken });
        
        const { access_token } = response.data;
        Cookies.set('access_token', access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## Authentication APIs

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Request Body:**
```typescript
{
  first_name: string;      // Required
  last_name: string;       // Required
  email: string;           // Required, valid email
  password: string;        // Required, min 8 characters
}
```

**Response:**
```typescript
{
  success: true;
  message: "Registration successful. Please verify your email.";
  data: {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      email_verified: false;
    }
  }
}
```

**Implementation:**
```typescript
// data/endpoints/auth.ts
export const registerUser = async (data: UserRegisterType) => {
  return axiosInstance.post('/auth/register', data);
};

export const useRegisterUser = () => {
  return useMutation(registerUser, {
    onSuccess: (response) => {
      toast.success('Registration successful! Please check your email.');
      router.push('/verify-email');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Registration failed');
    },
  });
};
```

**Usage:**
```typescript
const { mutate: register, isLoading } = useRegisterUser();

const handleSubmit = (data: UserRegisterType) => {
  register(data);
};
```

### 2. Email Verification

**Endpoint:** `POST /auth/verify-email`

**Request Body:**
```typescript
{
  email: string;
  verification_code: string; // 6-digit OTP
}
```

**Response:**
```typescript
{
  success: true;
  message: "Email verified successfully";
  data: {
    email_verified: true;
  }
}
```

### 3. User Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Login successful";
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      profile_completed: boolean;
      two_factor_enabled: boolean;
    }
  }
}
```

**Implementation:**
```typescript
export const loginUser = async (data: UserLoginType) => {
  return axiosInstance.post('/auth/login', data);
};

export const useLoginUser = () => {
  return useMutation(loginUser, {
    onSuccess: (response) => {
      const { access_token, refresh_token, user } = response.data;
      
      // Store tokens in HTTP-only cookies (should be done by backend)
      Cookies.set('access_token', access_token, { 
        secure: true, 
        sameSite: 'strict' 
      });
      Cookies.set('refresh_token', refresh_token, { 
        secure: true, 
        sameSite: 'strict' 
      });
      
      // Redirect based on profile completion
      if (!user.profile_completed) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
      
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Login failed');
    },
  });
};
```

### 4. Two-Factor Authentication

**Send 2FA Code:**

**Endpoint:** `POST /auth/2fa/verify`

**Request Body:**
```typescript
{
  email: string;
  verification_code: string; // 6-digit code from authenticator app
}
```

**Enable 2FA:**

**Endpoint:** `POST /auth/2fa/enable`

**Response:**
```typescript
{
  success: true;
  data: {
    qr_code: string;        // Base64 QR code image
    secret: string;          // Secret key for manual entry
    backup_codes: string[];  // Array of backup codes
  }
}
```

**Disable 2FA:**

**Endpoint:** `POST /auth/2fa/disable`

**Request Body:**
```typescript
{
  verification_code: string;
}
```

### 5. Password Reset

**Request Reset:**

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```typescript
{
  email: string;
}
```

**Reset Password:**

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```typescript
{
  token: string;      // From email link
  password: string;
}
```

### 6. Logout

**Endpoint:** `POST /auth/logout`

**Response:**
```typescript
{
  success: true;
  message: "Logged out successfully";
}
```

**Implementation:**
```typescript
export const logoutUser = async () => {
  return axiosInstance.post('/auth/logout');
};

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(logoutUser, {
    onSuccess: () => {
      // Clear tokens
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      
      // Clear React Query cache
      queryClient.clear();
      
      // Redirect to login
      router.push('/login');
      toast.success('Logged out successfully');
    },
  });
};
```

---

## User APIs

### 1. Get User Profile

**Endpoint:** `GET /user/profile`

**Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    address: string | null;
    state: string | null;
    country: string | null;
    avatar: string | null;
    bio: string | null;
    gender: string | null;
    profile_completed: boolean;
    email_verified: boolean;
    two_factor_enabled: boolean;
    created_at: string;
    updated_at: string;
  }
}
```

**Implementation:**
```typescript
export const fetchUserProfile = async () => {
  return axiosInstance.get('/user/profile');
};

export const useGetUserProfile = () => {
  return useQuery(['user', 'profile'], fetchUserProfile, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};
```

**Usage:**
```typescript
const { data: userProfile, isLoading, error } = useGetUserProfile();

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage />;

return <div>{userProfile.first_name}</div>;
```

### 2. Update User Profile

**Endpoint:** `PUT /user/profile`

**Request Body:**
```typescript
{
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  state?: string;
  country?: string;
  avatar?: string;        // URL after upload
  bio?: string;
  gender?: string;
  profile_completed?: boolean;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Profile updated successfully";
  data: {
    // Updated user object
  }
}
```

**Implementation:**
```typescript
export const updateUserProfile = async (data: UserUpdateType) => {
  return axiosInstance.put('/user/profile', data);
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(updateUserProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user', 'profile']);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Update failed');
    },
  });
};
```

### 3. Get User Statistics

**Endpoint:** `GET /user/statistics`

**Query Parameters:**
```typescript
{
  month?: string;  // Format: YYYY-MM
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    total_expenses: number;
    total_transactions: number;
    highest_category: string;
    average_expense: number;
    month: string;
  }
}
```

### 4. Delete User Account

**Endpoint:** `DELETE /user/account`

**Request Body:**
```typescript
{
  confirmation: string;  // User must type "DELETE MY ACCOUNT"
  password: string;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Account deleted successfully";
}
```

---

## Expense APIs

### 1. Get Expenses List

**Endpoint:** `GET /expenses`

**Query Parameters:**
```typescript
{
  page?: number;              // Default: 1
  page_size?: number;         // Default: 10
  search?: string;            // Search in title and description
  category?: string;          // Filter by category
  start_date?: string;        // Format: YYYY-MM-DD
  end_date?: string;          // Format: YYYY-MM-DD
  sort_by?: string;           // e.g., "amount", "expense_date"
  sort_order?: "asc" | "desc"; // Default: "desc"
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    expenses: [
      {
        id: string;
        title: string;
        amount: number;
        category: string;
        expense_date: string;
        description: string;
        created_at: string;
        updated_at: string;
      }
    ];
    total: number;              // Total count
    page: number;               // Current page
    page_size: number;          // Items per page
    total_pages: number;        // Total pages
  }
}
```

**Implementation:**
```typescript
export const fetchExpenses = async (params?: ExpenseListQueryParams) => {
  return axiosInstance.get('/expenses', { params });
};

export const useGetExpenses = (params?: ExpenseListQueryParams) => {
  return useQuery(
    ['expenses', params],
    () => fetchExpenses(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true,   // For pagination
    }
  );
};
```

**Usage:**
```typescript
const [page, setPage] = useState(1);
const [search, setSearch] = useState('');
const [category, setCategory] = useState('');

const { data, isLoading } = useGetExpenses({
  page,
  page_size: 10,
  search,
  category,
});

// Access data
const expenses = data?.expenses || [];
const totalPages = data?.total_pages || 0;
```

### 2. Get Single Expense

**Endpoint:** `GET /expenses/:id`

**Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    title: string;
    amount: number;
    category: string;
    expense_date: string;
    description: string;
    created_at: string;
    updated_at: string;
  }
}
```

### 3. Create Expense

**Endpoint:** `POST /expenses`

**Request Body:**
```typescript
{
  title: string;              // Required
  amount: number;             // Required, positive
  category: string;           // Required, from predefined list
  expense_date: string;       // Required, format: YYYY-MM-DD
  description?: string;       // Optional
}
```

**Response:**
```typescript
{
  success: true;
  message: "Expense created successfully";
  data: {
    id: string;
    // ... other expense fields
  }
}
```

**Implementation:**
```typescript
export const createExpense = async (data: ExpenseCreateType) => {
  return axiosInstance.post('/expenses', data);
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation(createExpense, {
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(['expenses']);
      queryClient.invalidateQueries(['expenses', 'stats']);
      queryClient.invalidateQueries(['user', 'statistics']);
      
      toast.success('Expense created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create expense');
    },
  });
};
```

**Usage:**
```typescript
const { mutate: createExpense, isLoading } = useCreateExpense();

const handleSubmit = (formData: ExpenseCreateType) => {
  createExpense(formData, {
    onSuccess: () => {
      form.reset();
      onClose();
    },
  });
};
```

### 4. Update Expense

**Endpoint:** `PUT /expenses/:id`

**Request Body:**
```typescript
{
  title?: string;
  amount?: number;
  category?: string;
  expense_date?: string;
  description?: string;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Expense updated successfully";
  data: {
    // Updated expense object
  }
}
```

**Implementation:**
```typescript
export const updateExpense = async (id: string, data: ExpenseUpdateType) => {
  return axiosInstance.put(`/expenses/${id}`, data);
};

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
    }
  );
};
```

### 5. Delete Expense

**Endpoint:** `DELETE /expenses/:id`

**Response:**
```typescript
{
  success: true;
  message: "Expense deleted successfully";
}
```

**Implementation:**
```typescript
export const deleteExpense = async (id: string) => {
  return axiosInstance.delete(`/expenses/${id}`);
};

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

### 6. Get Expense Categories

**Endpoint:** `GET /expenses/categories`

**Response:**
```typescript
{
  success: true;
  data: {
    categories: [
      "Food",
      "Transport",
      "Rent",
      "Groceries",
      "Utilities",
      "Entertainment",
      "Healthcare",
      "Education",
      "Shopping",
      "Savings",
      "FoodStuff",
      "Travel",
      "Others"
    ]
  }
}
```

**Implementation:**
```typescript
export const fetchExpenseCategories = async () => {
  return axiosInstance.get('/expenses/categories');
};

export const useGetExpenseCategories = () => {
  return useQuery(['expenses', 'categories'], fetchExpenseCategories, {
    staleTime: Infinity, // Categories rarely change
    cacheTime: Infinity,
  });
};
```

### 7. Get Expense Statistics

**Endpoint:** `GET /expenses/statistics`

**Query Parameters:**
```typescript
{
  period?: "this_month" | "last_month" | "last_3_months" | "this_year";
  start_date?: string;
  end_date?: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    total_expenses: number;
    total_income: number;
    balance: number;
    expense_count: number;
    average_expense: number;
    highest_expense: {
      amount: number;
      title: string;
      date: string;
    };
    category_breakdown: {
      [category: string]: {
        total: number;
        percentage: number;
        count: number;
      };
    };
    trend_data: [
      {
        date: string;
        amount: number;
      }
    ];
  }
}
```

### 8. Bulk Delete Expenses

**Endpoint:** `POST /expenses/bulk-delete`

**Request Body:**
```typescript
{
  expense_ids: string[];  // Array of expense IDs
}
```

**Response:**
```typescript
{
  success: true;
  message: "X expenses deleted successfully";
  data: {
    deleted_count: number;
  }
}
```

---

## File Upload APIs

### 1. Upload File

**Endpoint:** `POST /upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
```typescript
FormData {
  file: File;
}
```

**Response:**
```typescript
{
  success: true;
  message: "File uploaded successfully";
  data: {
    url: string;           // Public URL of uploaded file
    filename: string;
    size: number;
    mime_type: string;
  }
}
```

**Implementation:**
```typescript
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
const handleFileUpload = async (file: File) => {
  try {
    const response = await uploadFile(file);
    const fileUrl = response.data.url;
    
    // Use fileUrl in your form
    form.setValue('avatar', fileUrl);
    toast.success('File uploaded successfully!');
  } catch (error) {
    toast.error('File upload failed');
  }
};
```

### 2. Delete File

**Endpoint:** `DELETE /upload/:filename`

**Response:**
```typescript
{
  success: true;
  message: "File deleted successfully";
}
```

---

## Error Handling

### Error Response Format

All API errors follow this format:

```typescript
{
  success: false;
  message: string;          // Human-readable error message
  errors?: {
    [field: string]: string[];  // Validation errors by field
  };
  code?: string;            // Error code for programmatic handling
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate email) |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Server temporarily unavailable |

### Error Handling Implementation

```typescript
// Global error handler in axios interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          toast.error(data.message || 'Invalid request');
          break;
        case 401:
          toast.error('Session expired. Please login again.');
          router.push('/login');
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 409:
          toast.error(data.message || 'Resource conflict');
          break;
        case 422:
          // Display validation errors
          if (data.errors) {
            Object.values(data.errors).forEach((messages: any) => {
              messages.forEach((msg: string) => toast.error(msg));
            });
          }
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error('Something went wrong');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);
```

### Handling Validation Errors

```typescript
// In mutation onError callback
onError: (error: any) => {
  if (error.response?.status === 422) {
    const validationErrors = error.response.data.errors;
    
    // Set form errors
    Object.keys(validationErrors).forEach((field) => {
      form.setError(field as any, {
        type: 'server',
        message: validationErrors[field][0],
      });
    });
  } else {
    toast.error(error.response?.data?.message || 'Operation failed');
  }
}
```

---

## Best Practices

### 1. Query Key Management

Organize query keys consistently:

```typescript
// Query key factory
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (params: ExpenseListQueryParams) => 
    [...expenseKeys.lists(), params] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  stats: () => [...expenseKeys.all, 'stats'] as const,
};

// Usage
useQuery(expenseKeys.list({ page: 1 }), fetchExpenses);
useQuery(expenseKeys.detail(expenseId), fetchExpenseById);
```

### 2. Optimistic Updates

Improve perceived performance:

```typescript
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation(updateExpense, {
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['expenses']);
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['expenses']);
      
      // Optimistically update
      queryClient.setQueryData(['expenses'], (old: any) => {
        return {
          ...old,
          expenses: old.expenses.map((expense: any) =>
            expense.id === id ? { ...expense, ...data } : expense
          ),
        };
      });
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['expenses'], context?.previous);
      toast.error('Update failed');
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries(['expenses']);
    },
  });
};
```

### 3. Request Cancellation

Cancel requests when components unmount:

```typescript
export const useGetExpenses = (params: ExpenseListQueryParams) => {
  return useQuery(
    ['expenses', params],
    ({ signal }) => 
      axiosInstance.get('/expenses', { params, signal }),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
};
```

### 4. Retry Logic

Configure retry behavior:

```typescript
useQuery(['expenses'], fetchExpenses, {
  retry: (failureCount, error: any) => {
    // Don't retry on 4xx errors
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return false;
    }
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

### 5. Pagination

Handle paginated data:

```typescript
const [page, setPage] = useState(1);

const { data, isLoading, isFetching } = useGetExpenses({
  page,
  page_size: 10,
}, {
  keepPreviousData: true, // Keep previous data while fetching
});

// Prefetch next page
useEffect(() => {
  if (data?.total_pages && page < data.total_pages) {
    queryClient.prefetchQuery(
      ['expenses', { page: page + 1 }],
      () => fetchExpenses({ page: page + 1 })
    );
  }
}, [page, data, queryClient]);
```

### 6. Debounced Search

Optimize search queries:

```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

const { data } = useGetExpenses({
  search: debouncedSearch,
});

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### 7. Loading States

Handle different loading states:

```typescript
const { data, isLoading, isFetching, isError } = useGetExpenses();

if (isLoading) {
  return <FullPageSkeleton />; // Initial load
}

if (isError) {
  return <ErrorState />;
}

return (
  <div>
    {isFetching && <LoadingOverlay />} {/* Background refetch */}
    <ExpenseList data={data} />
  </div>
);
```

### 8. Cache Time vs Stale Time

```typescript
// Cache Time: How long to keep unused data in cache
// Stale Time: How long data is considered fresh

// Static data (categories)
useQuery(['categories'], fetchCategories, {
  staleTime: Infinity,  // Never considered stale
  cacheTime: Infinity,  // Never garbage collected
});

// Frequently updated data (expenses)
useQuery(['expenses'], fetchExpenses, {
  staleTime: 1 * 60 * 1000,  // Fresh for 1 minute
  cacheTime: 5 * 60 * 1000,  // Keep in cache for 5 minutes
});

// Real-time data (current user)
useQuery(['user', 'profile'], fetchProfile, {
  staleTime: 0,              // Always stale, refetch on mount
  cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
});
```

---

## Conclusion

This API integration guide provides comprehensive documentation for all backend endpoints used in the Expense Tracker application. Follow the patterns and best practices outlined here for consistent and maintainable API integration.

For more details on component usage and application features, refer to:
- [Architecture Documentation](./ARCHITECTURE.md)
- [Usage Documentation](./USAGE.md)
