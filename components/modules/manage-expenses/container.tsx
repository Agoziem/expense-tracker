"use client";
import ExpenseTable from "@/components/custom/expenses-table";
import React from "react";

const ExpensesDashboard = () => {
  return (
    <div className="p-4 py-6 space-y-6">
      <div>
        <h1 className="mb-1 text-xl font-semibold lg:text-2xl dark:text-white">
          Manage Expenses
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          View and manage all your recorded expenses here.
        </p>
      </div>
      <ExpenseTable />
    </div>
  );
};

export default ExpensesDashboard;
