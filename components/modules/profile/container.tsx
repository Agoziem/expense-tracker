"use client";
import {
  Flame,
  ShieldIcon,
  User2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteSection from "./delete";
import ProfileInfoSection from "./profile-info";
import TwoFASection from "./twoFA";

const tabContents = [
  { value: "tab-1", label: "Personal Info", icon: User2, badge: "" },
  { value: "tab-2", label: "Security", icon: ShieldIcon, badge: "" },
  { value: "tab-3", label: "Danger", icon: Flame, badge: "" },
];

export default function ProfileContainer() {
  return (
    <Tabs defaultValue="tab-1" className="p-4 sm:p-6 py-2 space-y-3">
      <ScrollArea>
        <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 w-full justify-start">
          {tabContents.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm sm:text-base"
            >
              <tab.icon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              {tab.badge && (
                <Badge
                  className={`ms-1.5 ${
                    typeof tab.badge === "number"
                      ? "bg-primary/15 min-w-5 px-1"
                      : ""
                  }`}
                  variant={
                    typeof tab.badge === "number" ? "secondary" : "primary"
                  }
                >
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {tabContents.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.value === "tab-1" ? (
            <ProfileInfoSection />
          ) : tab.value === "tab-2" ? (
            <TwoFASection />
          ) : (
            <DeleteSection />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
