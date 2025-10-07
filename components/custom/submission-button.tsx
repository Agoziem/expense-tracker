import React from "react";
import { Button } from "../ui/base-button";
import { LoaderCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SubmissionButton = ({
  isSubmitting,
  label,
  icon,
  className,
}: {
  isSubmitting: boolean;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Button type="submit" className={cn("w-full", className)} disabled={isSubmitting}>
      {isSubmitting ? (
        <LoaderCircleIcon className="animate-spin size-4" />
      ) : null}
      {isSubmitting ? (
        "Submitting..."
      ) : (
        <>
          {icon} {label}
        </>
      )}
    </Button>
  );
};

export default SubmissionButton;
