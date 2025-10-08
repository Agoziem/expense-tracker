"use client";
import React, { useState } from "react";
import { StatsCards } from "./stats-cards";
import TrendChart from "./trend-chart";
import CategoryChart from "./categorychart";
import Header from "./header";
import ExpenseTable from "@/components/custom/expenses-table";

const DashboardContainer = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  return (
    <div className="p-4 py-6 space-y-6">
      <Header month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <StatsCards month={month} year={year} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* <TrendChart /> */}
        <div className="md:col-span-7">
          <TrendChart />
        </div>
        <div className="md:col-span-5">
          <CategoryChart />
        </div>
      </div>
      <ExpenseTable />
    </div>
  );
};

export default DashboardContainer;
