"use client";
import ExpenseTable from "@/components/custom/expenses-table";
import React from "react";

const ExpensesDashboard = () => {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="mb-1 text-lg sm:text-xl lg:text-2xl font-semibold dark:text-white">
          Manage Expenses
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
          View and manage all your recorded expenses here.
        </p>
      </div>
      <ExpenseTable />
    </div>
  );
};

export default ExpensesDashboard;
