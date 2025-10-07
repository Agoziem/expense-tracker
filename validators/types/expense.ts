// ===============================================
// Expense Category Type
// ===============================================
export type ExpenseCategory = 
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Shopping"
  | "Bills"
  | "Healthcare"
  | "Education"
  | "Travel"
  | "Other";


// ===============================================
// Response Types
// ===============================================

export interface ExpenseResponseModel {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  expense_date: string; // ISO date string
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}

export interface ExpenseListResponseModel {
  expenses: ExpenseResponseModel[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CategorySpendingModel {
  category: ExpenseCategory;
  total_amount: number;
  expense_count: number;
}

export interface SpendingSummaryModel {
  total_spending: number;
  expense_count: number;
  category_breakdown: CategorySpendingModel[];
  start_date?: string; // ISO date string
  end_date?: string;   // ISO date string
}

export interface ExpenseStatisticsModel {
  period: string; // e.g., "2025-10", "2025-Q4", "2025"
  total_spending: number;
  average_expense: number;
  expense_count: number;
  top_category?: ExpenseCategory;
  top_category_amount?: number;
}

// ===============================================
// Chart/Visualization Types
// ===============================================

export interface ChartDataPointModel {
  period: string; // Period label (e.g., '2025-10', '2025', '2025-10-07')
  total_amount: number; // Total spending for this period
  expense_count: number; // Number of expenses in this period
}

export interface ChartVisualizationResponseModel {
  period_type: string; // Type of period aggregation (day, week, month, year)
  data_points: ChartDataPointModel[]; // List of data points for the chart
  total_periods: number; // Total number of periods returned
  total_spending: number; // Sum of all spending across all periods
  average_spending: number; // Average spending per period
}

export interface CategoryChartDataModel {
  category: ExpenseCategory; // Expense category
  total_amount: number; // Total spending in this category
  expense_count: number; // Number of expenses in this category
  percentage: number; // Percentage of total spending
}

export interface CategoryChartResponseModel {
  categories: CategoryChartDataModel[]; // List of categories with their data
  total_spending: number; // Total spending across all categories
  total_expenses: number; // Total number of expenses
}

// ===============================================
// Base Response Types
// ===============================================

export interface BaseResponse {
  message: string;
  status: string;
}

export interface ExpenseDeleteResponse extends BaseResponse {
  message: "Expense deleted successfully";
}

export interface ExpenseCreateResponse extends BaseResponse {
  message: "Expense created successfully";
  expense: ExpenseResponseModel;
}

export interface ExpenseUpdateResponse extends BaseResponse {
  message: "Expense updated successfully";
  expense: ExpenseResponseModel;
}

// ===============================================
// Query Parameter Types
// ===============================================

export interface ExpenseListQueryParams {
  page?: number;
  page_size?: number;
  category?: ExpenseCategory;
  start_date?: string;
  end_date?: string;
  search?: string; // Search in title and description
}

export interface ExpenseStatisticsQuery {
  start_date?: string;
  end_date?: string;
}


// ===============================================
// Utility Types
// ===============================================

export type ExpenseField = keyof ExpenseResponseModel;
export type SortableExpenseField = "expense_date" | "amount" | "created_at" | "title";
export type PeriodType = "day" | "week" | "month" | "quarter" | "year";
export type SortOrder = "asc" | "desc";


// ===============================================
// Filter Types
// ===============================================

export interface ExpenseFilters {
  categories?: ExpenseCategory[];
  amount_min?: number;
  amount_max?: number;
  date_from?: string;
  date_to?: string;
  search?: string; // Search in title and description
}

// All types are already exported above with their interface declarations
