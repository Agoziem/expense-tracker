import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  AxiosInstanceWithToken,
} from "@/data/instance";
import {
  ExpenseCreateType,
  ExpenseUpdateType,
} from "@/validators/schemas/expense";
import {
    ExpenseResponseModel,
    ExpenseListResponseModel,
    CategorySpendingModel,
    SpendingSummaryModel,
    ExpenseStatisticsModel,
    ChartVisualizationResponseModel,
    ChartDataPointModel,
    ExpenseCategory,
    CategoryChartDataModel,
    CategoryChartResponseModel,
    ExpenseDeleteResponse,
    ExpenseCreateResponse,
    ExpenseUpdateResponse,
    ExpenseListQueryParams,
    ExpenseStatisticsQuery,
    TrendChartQuery,
    ExpenseCategoriesResponse
} from "@/validators/types/expense";

// POST /api/v1/expenses/ - Create a new expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ExpenseCreateResponse, Error, ExpenseCreateType>({
    mutationFn: async (data: ExpenseCreateType) => {
      const response = await AxiosInstanceWithToken.post("/api/v1/expenses/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      queryClient.invalidateQueries(["expense-analytics"]);
    },
  });
};

// GET /api/v1/expenses/ - Get all expenses with filters
export const useGetExpenses = (params?: ExpenseListQueryParams) => {
  return useQuery<ExpenseListResponseModel, Error>({
    queryKey: ["expenses", params],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/expenses/", { params });
      return response.data;
    },
  });
};

// GET /api/v1/expenses/{expense_id} - Get a specific expense
export const useGetExpense = (expenseId: string, enabled = true) => {
  return useQuery<ExpenseResponseModel, Error>({
    queryKey: ["expense", expenseId],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get(`/api/v1/expenses/${expenseId}`);
      return response.data;
    },
    enabled: enabled && !!expenseId,
  });
};

// PATCH /api/v1/expenses/{expense_id} - Update an expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ExpenseUpdateResponse, Error, { id: string; data: ExpenseUpdateType }>({
    mutationFn: async ({ id, data }) => {
      const response = await AxiosInstanceWithToken.patch(`/api/v1/expenses/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["expenses"]);
      queryClient.invalidateQueries(["expense", variables.id]);
      queryClient.invalidateQueries(["expense-analytics"]);
    },
  });
};

// DELETE /api/v1/expenses/{expense_id} - Delete an expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ExpenseDeleteResponse, Error, string>({
    mutationFn: async (expenseId: string) => {
      const response = await AxiosInstanceWithToken.delete(`/api/v1/expenses/${expenseId}`);
      return response.data;
    },
    onSuccess: (data, expenseId) => {
      queryClient.invalidateQueries(["expenses"]);
      queryClient.removeQueries(["expense", expenseId]);
      queryClient.invalidateQueries(["expense-analytics"]);
    },
  });
};

// GET /api/v1/expenses/analytics/by-category - Get spending by category
export const useGetSpendingByCategory = (params?: ExpenseStatisticsQuery) => {
  return useQuery<CategorySpendingModel[], Error>({
    queryKey: ["expense-analytics", "by-category", params],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/expenses/analytics/by-category", { params });
      return response.data;
    },
  });
};

// GET /api/v1/expenses/analytics/summary - Get spending summary
export const useGetSpendingSummary = (params?: ExpenseStatisticsQuery) => {
  return useQuery<SpendingSummaryModel, Error>({
    queryKey: ["expense-analytics", "summary", params],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/expenses/analytics/summary", { params });
      return response.data;
    },
  });
};

// GET /api/v1/expenses/analytics/monthly/{year}/{month} - Get monthly statistics
export const useGetMonthlyStatistics = (year: number, month: number, enabled = true) => {
  return useQuery<ExpenseStatisticsModel, Error>({
    queryKey: ["expense-analytics", "monthly", year, month],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get(`/api/v1/expenses/analytics/monthly/${year}/${month}`);
      return response.data;
    },
    enabled: enabled && !!year && !!month,
  });
};

// GET /api/v1/expenses/analytics/visualization - Get data for time-series visualization/charts
export const useGetVisualizationData = (params?: TrendChartQuery) => {
  return useQuery<ChartVisualizationResponseModel, Error>({
    queryKey: ["expense-analytics", "visualization", params],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/expenses/analytics/visualization", { params });
      return response.data;
    },
  });
};

// GET /api/v1/expenses/analytics/category-chart - Get data for category-based visualization/charts
export const useGetCategoryChartData = (params?: ExpenseStatisticsQuery) => {
  return useQuery<CategoryChartResponseModel, Error>({
    queryKey: ["expense-analytics", "category-chart", params],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/expenses/analytics/category-chart", { params });
      return response.data;
    },
  });
};

// GET /api/v1/expenses/categories/list - Get all available categories
export const useGetExpenseCategories = () => {
  return useQuery<ExpenseCategoriesResponse, Error>({
    queryKey: ["expense-categories"],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/expenses/categories/list");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
  });
};

