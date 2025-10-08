import React, { useEffect } from "react";
import {
  useCreateExpense,
  useGetExpenseCategories,
  useUpdateExpense,
} from "@/data/endpoints/expenses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "../ui/form";
import { useForm } from "react-hook-form";
import {
  ExpenseCreateSchema,
  ExpenseCreateType,
} from "@/validators/schemas/expense";
import { ExpenseResponseModel } from "@/validators/types/expense";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/base-button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import NumberInput from "./number-input";
import DatePicker from "./datepicker";
import { Spinner } from "../ui/spinner";

interface ExpensesFormProps {
  currentExpense?: ExpenseResponseModel;
  onSuccess?: () => void;
}

const ExpensesForm = ({ currentExpense, onSuccess }: ExpensesFormProps) => {
  const { data: categoriesData } = useGetExpenseCategories();
  const { mutateAsync: createExpense, isLoading: isCreating } =
    useCreateExpense();
  const { mutateAsync: updateExpense, isLoading: isUpdating } =
    useUpdateExpense();

  const isEditMode = !!currentExpense;

  const form = useForm<ExpenseCreateType>({
    resolver: zodResolver(ExpenseCreateSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: undefined,
      description: "",
      expense_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (isEditMode && currentExpense) {
      form.reset({
        title: currentExpense?.title || "",
        amount: currentExpense?.amount?.toString() || "",
        category: (currentExpense?.category as any) || undefined,
        description: currentExpense?.description || "",
        expense_date: currentExpense?.expense_date
          ? new Date(currentExpense.expense_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [isEditMode, form]);

  const onSubmit = async (data: ExpenseCreateType) => {
    try {
      if (isEditMode) {
        // For update, send the raw string values (schema will transform them)
        await updateExpense({
          id: currentExpense.id,
          data,
        });
        toast.success("Expense updated successfully");
      } else {
        // For create, the schema handles transformation
        await createExpense(data);
        toast.success("Expense created successfully");
        form.reset();
      }
      onSuccess?.();
    } catch (error) {
      toast.error(
        isEditMode ? "Failed to update expense" : "Failed to create expense"
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter expense title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount & Category Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Amount Field */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  key={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[300px] z-[100]">
                    {categoriesData?.categories.map((category: string) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date Field */}
        <FormField
          control={form.control}
          name="expense_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                  onChange={(date) => {
                    if (date) {
                      // Use local date methods to avoid timezone issues
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      field.onChange(`${year}-${month}-${day}`);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add notes about this expense..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="submit"
            disabled={isCreating || isUpdating}
            className="min-w-24"
          >
            {isCreating || isUpdating ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : isEditMode ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpensesForm;
