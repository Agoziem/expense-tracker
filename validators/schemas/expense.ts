import { z } from "zod";

// ===============================================
// Expense Category Enum
// ===============================================
export const ExpenseCategoryEnum = z.enum([
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Healthcare",
  "Education",
  "Travel",
  "Other"
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
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Amount must be a positive number"
    }),
  category: ExpenseCategoryEnum,
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  expense_date: z.string()
    .optional()
    .transform((val) => val ? new Date(val) : new Date())
});

export type ExpenseCreateType = z.infer<typeof ExpenseCreateSchema>;

export const ExpenseUpdateSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less")
    .optional(),
  amount: z.string()
    .optional()
    .transform((val) => val ? parseFloat(val) : undefined)
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
      message: "Amount must be a positive number"
    }),
  category: ExpenseCategoryEnum.optional(),
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  expense_date: z.string()
    .optional()
    .transform((val) => val ? new Date(val) : undefined)
});

export type ExpenseUpdateType = z.infer<typeof ExpenseUpdateSchema>;
