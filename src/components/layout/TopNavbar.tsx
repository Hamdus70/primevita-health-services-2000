import React from "react";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./NotificationBell";
import { MobileNav } from "./MobileNav";

export function TopNavbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <MobileNav />
        <h1 className="text-xl font-semibold hidden md:block">NovaCare EMR</h1>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
