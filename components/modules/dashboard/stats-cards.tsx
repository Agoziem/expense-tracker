"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMonthlyStatistics } from "@/data/endpoints/expenses";
import { DollarSign, TrendingUp, Receipt, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards({
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
}: {
  month?: number;
  year?: number;
}) {
  const { data: MonthStats, isLoading } = useGetMonthlyStatistics(year, month);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-none">
              <Skeleton className="h-4 w-[80px] sm:w-[100px]" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <Skeleton className="h-6 sm:h-8 w-[80px] sm:w-[120px] mb-1" />
              <Skeleton className="h-3 w-[60px] sm:w-[80px]" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Spending",
      value: formatCurrency(MonthStats?.total_spending || 0),
      icon: DollarSign,
      description: `For ${new Date(year, month - 1).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
      )}`,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Average Expense",
      value: formatCurrency(MonthStats?.average_expense || 0),
      icon: TrendingUp,
      description: "Per transaction",
      iconColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Total Expenses",
      value: MonthStats?.expense_count || 0,
      icon: Receipt,
      description: "Expenses this month",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-950",
    },
    {
      title: "Top Category",
      value: formatCurrency(MonthStats?.top_category_amount || 0),
      icon: Target,
      description: MonthStats?.top_category
        ? `${MonthStats.top_category} spending`
        : "No category",
      iconColor: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-950",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-md transition-shadow py-2"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-none pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-md ${stat.iconBg}`}>
                <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{stat.value}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
                {stat.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
