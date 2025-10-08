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
    <div className="p-4 space-y-4 sm:space-y-6">
      <Header month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <StatsCards month={month} year={year} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* <TrendChart /> */}
        <div className="lg:col-span-7">
          <TrendChart />
        </div>
        <div className="lg:col-span-5">
          <CategoryChart />
        </div>
      </div>

      <ExpenseTable />
    </div>
  );
};

export default DashboardContainer;
