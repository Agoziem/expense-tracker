"use client";

import { useGetCategoryChartData } from "@/data/endpoints/expenses";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { PieChartIcon, TrendingUp } from "lucide-react";
import { DateRange } from "react-day-picker";
import DateRangePicker from "../../custom/date-range";

const CategoryChart = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const {
    data: categoryAnalytics,
    isLoading,
    error,
  } = useGetCategoryChartData(
    startDate && endDate
      ? { start_date: startDate, end_date: endDate }
      : undefined
  );

  // Category colors matching expense categories
  const categoryColors: Record<string, string> = {
    Food: "var(--chart-2)",
    Transport: "var(--chart-1)",
    Entertainment: "var(--chart-3)",
    Shopping: "var(--chart-4)",
    Bills: "var(--chart-5)",
    Healthcare: "hsl(12 76% 61%)",
    Education: "hsl(197 37% 24%)",
    Travel: "hsl(43 74% 66%)",
    Other: "hsl(0 0% 60%)",
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center py-3">
          <Skeleton className="h-5 sm:h-6 w-[140px] sm:w-[180px]" />
          <Skeleton className="h-3 sm:h-4 w-[180px] sm:w-[240px] mt-2" />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] rounded-full" />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm py-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PieChartIcon className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Failed to Load Chart</EmptyTitle>
              <EmptyDescription>
                We couldn&apos;t load your category breakdown. Please try again
                later.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  if (
    !categoryAnalytics?.categories ||
    categoryAnalytics.categories.length === 0
  ) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center pb-0 justify-between gap-2 py-3">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Spending by Category</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Breakdown of your expenses</CardDescription>
          </div>
          <DateRangePicker
            date={
              startDate && endDate
                ? { from: new Date(startDate), to: new Date(endDate) }
                : undefined
            }
            setDate={(date) => {
              setStartDate(date?.from ? date.from.toISOString() : null);
              setEndDate(date?.to ? date.to.toISOString() : null);
            }}
            showLabel={false}
          />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PieChartIcon className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No Category Data</EmptyTitle>
              <EmptyDescription>
                Start adding expenses to see your spending breakdown by
                category.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data and config
  const chartData = categoryAnalytics.categories.map((cat, index) => ({
    category: cat.category,
    amount: cat.total_amount,
    fill:
      categoryColors[cat.category] || `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  const chartConfig = categoryAnalytics.categories.reduce((acc, cat, index) => {
    acc[cat.category] = {
      label: cat.category,
      color: categoryColors[cat.category] || `var(--chart-${(index % 5) + 1})`,
    };
    return acc;
  }, {} as ChartConfig);

  const totalSpending = categoryAnalytics.total_spending;
  const topCategory = categoryAnalytics.categories[0];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 justify-between gap-2 py-3">
        <CardTitle className="text-base sm:text-lg">Spending by Category</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-center">
          {formatCurrency(totalSpending)} across{" "}
          {categoryAnalytics.categories.length} categories
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] sm:max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              outerRadius={88}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl sm:text-2xl font-bold"
                        >
                          {formatCurrency(totalSpending)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-muted-foreground text-[10px] sm:text-xs"
                        >
                          Total Spending
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-xs sm:text-sm py-3">
        <div className="flex items-center gap-2 font-medium leading-none">
          Top category: {topCategory?.category}{" "}
          <span className="text-muted-foreground">
            ({topCategory?.percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="leading-none text-muted-foreground">
          {formatCurrency(topCategory?.total_amount || 0)} spent on{" "}
          {topCategory?.category}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CategoryChart;
