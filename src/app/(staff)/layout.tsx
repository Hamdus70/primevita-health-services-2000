"use client";

import React from "react";
import { RouteGuard } from "@/components/layout/RouteGuard";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { useAuthStore } from "@/stores/auth.store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  
  return (
    <RouteGuard allowedRoles={["ADMIN", "DOCTOR", "NURSE", "CAREGIVER", "STAFF"]}>
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar role={role || "STAFF"} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
