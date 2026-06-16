import React from "react";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./NotificationBell";
import { MobileNav } from "./MobileNav";
import { useAuthStore } from "@/stores/auth.store";

export function TopNavbar() {
  const { user } = useAuthStore();
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <MobileNav />
        <h1 className="text-xl font-semibold hidden md:block">NovaCare EMR</h1>
      </div>
      <div className="flex items-center gap-4">
        {user?.role && (
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">
                {user.role}
            </span>
        )}
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
