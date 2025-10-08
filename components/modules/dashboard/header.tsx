import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserProfile } from "@/data/endpoints/user";

const Header = ({
  month,
  setMonth,
  year,
  setYear,
}: {
  month: number;
  setMonth: (month: number) => void;
  year: number;
  setYear: (year: number) => void;
}) => {
  const { data: userProfile } = useGetUserProfile();

  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="mb-1 text-lg sm:text-xl lg:text-2xl font-semibold dark:text-white">
          Welcome, {userProfile?.first_name || "User"}
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
          Here&apos;s a summary of your recent financial activities.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Select
          value={month.toString()}
          onValueChange={(value: any) => setMonth(parseInt(value))}
        >
          <SelectTrigger className="w-[100px] sm:w-[120px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                {new Date(0, i).toLocaleString("en-US", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={year.toString()}
          onValueChange={(value: any) => setYear(parseInt(value))}
        >
          <SelectTrigger className="w-[100px] sm:w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {Array.from({ length: 5 }, (_, i) => (
              <SelectItem key={i} value={(year - i).toString()}>
                {year - i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Header;
