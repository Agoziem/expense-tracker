import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetUserProfile } from "@/data/endpoints/user";
import {
  Mail,
  MapPin,
  PencilIcon,
  Phone,
  User,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Trophy,
  UserX,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/base-button";
import { Separator } from "@/components/ui/separator";
import { useGetMonthlyStatistics } from "@/data/endpoints/expenses";
import { CustomDialog } from "@/components/custom/custom-dialog";
import ProfileForm from "../auth/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileUpdateForm from "./profile-update-form";

const ProfileInfoSection = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { data: MonthStats, isLoading: isMonthStatsLoading } =
    useGetMonthlyStatistics(
      new Date().getFullYear(),
      new Date().getMonth() + 1
    );
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserProfile();

  const userDisplayData = useMemo(() => {
    if (!user) return { fullName: "Guest User" };
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return { fullName: `${firstName} ${lastName}`.trim() };
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isUserLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-10 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information Skeleton */}
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Statistics Skeleton */}
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 text-center space-y-2">
                    <Skeleton className="h-8 w-8 mx-auto rounded-full" />
                    <Skeleton className="h-8 w-16 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userError || !user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <UserX className="h-6 w-6 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No User Data</EmptyTitle>
              <EmptyDescription>
                We couldn&apos;t find any user information. Please try again later.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                className="mt-4 w-54"
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div>
          <h2 className="text-xl font-bold">Account Settings</h2>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        <CustomDialog
          open={showModal}
          onOpenChange={setShowModal}
          trigger={
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowModal(true)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          }
        >
          <ProfileUpdateForm />
        </CustomDialog>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <User className="h-4 w-4 text-primary" />
                <span>Full Name</span>
              </div>
              <p className="text-muted-foreground pl-6">
                {userDisplayData.fullName}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-primary" />
                <span>Email</span>
              </div>
              <p className="text-muted-foreground pl-6">
                {user.email || "Not available"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <User className="h-4 w-4 text-primary" />
                <span>Gender</span>
              </div>
              <p className="text-muted-foreground pl-6">
                {user.gender || "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Phone className="h-4 w-4 text-primary" />
                <span>Phone Number</span>
              </div>
              <p className="text-muted-foreground pl-6">
                {user.phone || "Not provided"}
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Address</span>
              </div>
              <p className="text-muted-foreground pl-6">
                {user.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Expense Statistics */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">
            Monthly Expense Statistics
          </h3>
          {isMonthStatsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 text-center space-y-2">
                    <Skeleton className="h-8 w-8 mx-auto rounded-full" />
                    <Skeleton className="h-8 w-16 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !MonthStats ? (
            <Empty>
              <EmptyMedia>
                <div className="flex items-center justify-center w-full h-24">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle className="text-base">
                  No Statistics Available
                </EmptyTitle>
                <EmptyDescription className="text-sm">
                  Start adding expenses to see your monthly statistics
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(MonthStats.total_spending)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Spending
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-600/20 hover:border-green-600/40 transition-colors">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(MonthStats.average_expense)}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg. Expense</p>
                </CardContent>
              </Card>

              <Card className="border-blue-600/20 hover:border-blue-600/40 transition-colors">
                <CardContent className="p-4 text-center">
                  <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">
                    {MonthStats.expense_count}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Expenses
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-600/20 hover:border-purple-600/40 transition-colors">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600 truncate">
                    {MonthStats.top_category || "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">Top Category</p>
                  {MonthStats.top_category_amount && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(MonthStats.top_category_amount)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoSection;
