"use client";

import { BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/base-badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationBtn() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  // Simulate fetching notification count from an API
  useEffect(() => {
    // Replace this with actual API call
    const fetchNotificationCount = () => {
      // Simulated count
      setCount(5);
    };

    fetchNotificationCount();
  }, []);

  const handleClick = () => {
    setCount(0);
    // router.push("/notifications");
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={handleClick}
      aria-label="Notifications"
    >
      <BellIcon size={16} aria-hidden="true" />
      {count > 0 && (
        <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </Button>
  );
}
