"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/base-scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { CustomPopover } from "@/components/custom/custom-popover";
import {
  ConfirmDialog,
  StandardDialog,
} from "@/components/custom/custom-dialog";
import ExpensesForm from "@/components/custom/expenses-form";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  useGetExpenses,
  useDeleteExpense,
  useGetExpenseCategories,
} from "@/data/endpoints/expenses";
import {
  ExpenseResponseModel,
  ExpenseCategory,
  ExpenseListQueryParams,
} from "@/validators/types/expense";
import {
  MoreVertical,
  Edit,
  Trash2,
  Receipt,
  Search,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

export default function ExpenseTable() {
  const [queryParams, setQueryParams] = useState<ExpenseListQueryParams>({
    page: 1,
    page_size: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [deletingMultiple, setDeletingMultiple] = useState(false);
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<
    ExpenseResponseModel | undefined
  >(undefined);
  const { data: categoriesData } = useGetExpenseCategories();
  const { data: expensesData, isLoading: expensesLoading, refetch: refetchExpenses } =
    useGetExpenses(queryParams);
  const { mutateAsync: deleteExpense, isLoading: isDeleting } =
    useDeleteExpense();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "expense_date", desc: true },
  ]);

  const expenses = expensesData?.expenses || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    const colors: Record<ExpenseCategory, string> = {
      Food: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400",
      Transport:
        "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
      Rent: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-400",
      Groceries:
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-400",
      Utilities:
        "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400",
      Entertainment:
        "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400",
      Healthcare: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
      Education:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400",

      Shopping: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-400",
      Savings:
        "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400",
      FoodStuff:
        "bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-400",
      Travel:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
      Others: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400",
    };
    return colors[category] || colors.Others;
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setQueryParams((prev) => ({
      ...prev,
      search: value || undefined,
      page: 1,
    }));
  };

  const handleCategoryFilter = (value: unknown) => {
    const categoryValue = value as string;
    setSelectedCategory(categoryValue);
    setQueryParams((prev) => ({
      ...prev,
      category:
        categoryValue === "all"
          ? undefined
          : (categoryValue as ExpenseCategory),
      page: 1,
    }));
  };

  const handleDeleteSingle = async () => {
    if (!expenseToDelete) return;

    try {
      await deleteExpense(expenseToDelete);
      toast.success("Expense deleted successfully");
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleDeleteMultiple = async () => {
    const selectedIds = Object.keys(rowSelection);

    try {
      await Promise.all(selectedIds.map((id) => deleteExpense(id)));
      toast.success(`${selectedIds.length} expense(s) deleted successfully`);
      setDeleteDialogOpen(false);
      setRowSelection({});
      setDeletingMultiple(false);
    } catch (error: any) {
      toast.error("Failed to delete some expenses");
    }
  };

  const openEditDialog = (expense: ExpenseResponseModel) => {
    setEditingExpense(expense);
    setAddExpenseDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingExpense(undefined);
    setAddExpenseDialogOpen(true);
  };

  const closeExpenseDialog = () => {
    setAddExpenseDialogOpen(false);
    setEditingExpense(undefined);
  };

  const handleFormSuccess = () => {
    closeExpenseDialog();
    refetchExpenses();
  };

  const openDeleteDialog = (id: string) => {
    setExpenseToDelete(id);
    setDeletingMultiple(false);
    setDeleteDialogOpen(true);
  };

  const openDeleteMultipleDialog = () => {
    setDeletingMultiple(true);
    setDeleteDialogOpen(true);
  };

  const columns = useMemo<ColumnDef<ExpenseResponseModel>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        id: "title",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Title"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                {row.original.title}
              </div>
              {row.original.description && (
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {row.original.description}
                </div>
              )}
            </div>
          );
        },
        meta: {
          skeleton: (
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ),
        },
        size: 200,
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: "amount",
        id: "amount",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Amount"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="font-semibold text-foreground">
            {formatCurrency(row.original.amount)}
          </div>
        ),
        meta: {
          skeleton: <Skeleton className="w-20 h-6" />,
        },
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "category",
        id: "category",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Category"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <Badge className={getCategoryColor(row.original.category)}>
              {row.original.category}
            </Badge>
          );
        },
        meta: {
          skeleton: <Skeleton className="w-20 h-6 rounded-full" />,
        },
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: false,
      },
      {
        accessorKey: "expense_date",
        id: "expense_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Date"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatDate(row.original.expense_date)}
          </div>
        ),
        meta: {
          skeleton: <Skeleton className="w-24 h-5" />,
        },
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const expense = row.original;
          return (
            <CustomPopover
              trigger={
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
              contentClassName="w-48 p-1"
            >
              <div className="space-y-1">
                <button
                  onClick={() => openEditDialog(expense)}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteDialog(expense.id)}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </button>
              </div>
            </CustomPopover>
          );
        },
        meta: {
          skeleton: <Skeleton className="w-8 h-8" />,
        },
        size: 80,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    []
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const table = useReactTable({
    columns,
    data: expenses,
    pageCount: expensesData?.total_pages || 0,
    getRowId: (row: ExpenseResponseModel) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    enableRowSelection: true,
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <>
      <DataGrid
        table={table}
        recordCount={expensesData?.total || 0}
        isLoading={expensesLoading}
        tableClassNames={{
          edgeCell: "px-5",
        }}
        tableLayout={{
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
        }}
      >
        <Card>
          <CardHeader className="py-3.5">
            <CardTitle>Expenses</CardTitle>
            <CardToolbar className="flex items-center gap-2 flex-wrap">
              {/* Add Expense Button - Only show when there are expenses */}
              {expenses.length > 0 && (
                <Button size="sm" onClick={openAddDialog} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
              )}

              {/* Search Input */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 pr-9 h-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryFilter}
              >
                <SelectTrigger className="w-[160px] h-10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData?.categories.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Delete Selected Button */}
              {selectedCount > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={openDeleteMultipleDialog}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedCount})
                </Button>
              )}
            </CardToolbar>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              {!expensesLoading && expenses.length === 0 ? (
                <Empty className="my-12">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Receipt className="h-6 w-6" />
                    </EmptyMedia>
                    <EmptyTitle>No Expenses Found</EmptyTitle>
                    <EmptyDescription>
                      {searchQuery || selectedCategory !== "all"
                        ? "Try adjusting your search or filters"
                        : "Start tracking your expenses by adding your first expense"}
                    </EmptyDescription>
                    <EmptyContent>
                      <Button
                        size="md"
                        onClick={openAddDialog}
                        className="gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Add Expense
                      </Button>
                    </EmptyContent>
                  </EmptyHeader>
                </Empty>
              ) : (
                <DataGridTable />
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={deletingMultiple ? "Delete Multiple Expenses" : "Delete Expense"}
        description={
          deletingMultiple
            ? `Are you sure you want to delete ${selectedCount} expense(s)? This action cannot be undone.`
            : "Are you sure you want to delete this expense? This action cannot be undone."
        }
        onConfirm={deletingMultiple ? handleDeleteMultiple : handleDeleteSingle}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setExpenseToDelete(null);
          setDeletingMultiple(false);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />

      {/* Create and Edit Expense Dialog */}
      <StandardDialog
        open={addExpenseDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeExpenseDialog();
          }
        }}
        title={editingExpense ? "Edit Expense" : "Add New Expense"}
        description={
          editingExpense
            ? "Update the expense details below."
            : "Fill in the details to create a new expense."
        }
        size="lg"
      >
        <ExpensesForm
          currentExpense={editingExpense}
          onSuccess={handleFormSuccess}
        />
      </StandardDialog>
    </>
  );
}
