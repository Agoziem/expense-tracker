"use client";

import { useGetVisualizationData } from "@/data/endpoints/expenses";
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
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

const TrendChart = () => {
  const [period_type, setPeriodType] = useState<
    "day" | "week" | "month" | "year"
  >("week");
  const [limit, setLimit] = useState<number>(5);

  const {
    data: trendData,
    isLoading,
    error,
  } = useGetVisualizationData({
    period_type,
    limit,
  });

  const chartConfig = {
    total_amount: {
      label: "Spending",
      color: "var(--chart-1)",
    },
    expense_count: {
      label: "Expenses",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPeriodLabel = (period: string, type: string) => {
    if (type === "month") {
      const [year, month] = period.split("-");
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );
    }
    return period;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="items-center py-3 space-y-2">
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 sm:h-6 w-[140px] sm:w-[180px]" />
            <Skeleton className="h-3 sm:h-4 w-[180px] sm:w-[240px]" />
          </div>
          <Skeleton className="h-9 sm:h-10 w-[100px] sm:w-[120px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] sm:h-[250px] w-full" />
        </CardContent>
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
                <BarChart3 className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Failed to Load Chart</EmptyTitle>
              <EmptyDescription>
                We couldn&apos;t load your spending trends. Please try again later.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  if (!trendData?.data_points || trendData.data_points.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Spending Trends</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Track your spending over time</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={limit.toString()}
              onValueChange={(value: any) => setLimit(parseInt(value))}
            >
              <SelectTrigger className="w-[100px] sm:w-[110px]">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 periods</SelectItem>
                <SelectItem value="10">10 periods</SelectItem>
                <SelectItem value="15">15 periods</SelectItem>
                <SelectItem value="20">20 periods</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={period_type}
              onValueChange={(value: any) => setPeriodType(value)}
            >
              <SelectTrigger className="w-[100px] sm:w-[120px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrendingUp className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No Spending Data</EmptyTitle>
              <EmptyDescription>
                Start tracking your expenses to see spending trends over time.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  const chartData = trendData.data_points.map((point) => ({
    period: formatPeriodLabel(point.period, period_type),
    total_amount: point.total_amount,
    expense_count: point.expense_count,
  }));

  return (
    <Card>
      <CardHeader className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg">Spending Trends</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Total: {formatCurrency(trendData.total_spending)} across{" "}
            {trendData.total_periods} {period_type}(s)
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={limit.toString()}
            onValueChange={(value: any) => setLimit(parseInt(value))}
          >
            <SelectTrigger className="w-[100px] sm:w-[110px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={period_type}
            onValueChange={(value: any) => setPeriodType(value)}
          >
            <SelectTrigger className="w-[100px] sm:w-[120px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillSpending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total_amount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total_amount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Area
              dataKey="total_amount"
              type="monotone"
              fill="url(#fillSpending)"
              fillOpacity={0.4}
              stroke="var(--color-total_amount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
