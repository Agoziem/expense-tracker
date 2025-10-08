import { z } from "zod";

// ===============================================
// Expense Category Enum
// ===============================================
export const ExpenseCategoryEnum = z.enum([
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
]);


export type ExpenseCategory = z.infer<typeof ExpenseCategoryEnum>;

// ===============================================
// Request Schemas
// ===============================================

// Schema for form data (when amount comes as string from forms)
export const ExpenseCreateSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number"
    }),
  category: ExpenseCategoryEnum,
  description: z.string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  expense_date: z.string()
    .min(1, "Date is required"),
});

export type ExpenseCreateType = z.infer<typeof ExpenseCreateSchema>;


export const ExpenseUpdateSchema = ExpenseCreateSchema.partial();

export type ExpenseUpdateType = z.infer<typeof ExpenseUpdateSchema>;
