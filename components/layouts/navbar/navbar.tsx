"use client";

import React, { useState, useEffect } from "react";
import { Menu, BarChart3, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import SearchInputComponent from "./search-input";
import ThemeSwitcherComponent from "./theme-switcher";
import AvatarDropdownComponent from "./avatar-dropdown";
import NotificationBtn from "./notification-btn";
import { Skeleton } from "@/components/ui/skeleton";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar } = useSidebar();
  
  useEffect(() => setMounted(true), []);
  if (!mounted) return (
    <div className="flex h-16 items-center gap-4 bg-card px-4 lg:px-6 border-b border-border">
      <Skeleton className="h-8 w-8 md:h-9 md:w-9" />
      <div className="max-w-sm flex-1">
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );

  return (
    <header className="flex h-16 items-center gap-4 bg-card px-4 lg:px-6 border-b border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8 md:h-9 md:w-9"
      >
        <Menu className="h-4 w-4 md:h-5 md:w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      <div className="max-w-sm flex-1">
        <SearchInputComponent />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* <ThemeSwitcherComponent /> */}
        <NotificationBtn />
        <AvatarDropdownComponent />
      </div>
    </header>
  );
};

export default Navbar;
