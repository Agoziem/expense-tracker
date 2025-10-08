import {
  BarChart3,
  User,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", active: true, href: "/" },
  { icon: Settings, label: "Expenses", href: "/manage-expenses" },
  { icon: User, label: "Manage Profile", href: "/profile" }
];