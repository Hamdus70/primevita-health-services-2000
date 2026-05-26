"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireApproval?: boolean;
}

const MOCK_SESSION = { user: { id: 'demo-user', linkedUserType: 'STAFF', role: 'ADMIN' } };

export function RouteGuard({ children, allowedRoles, requireApproval = false }: RouteGuardProps) {
  // const { data: session, status } = useSession();
  const status = "authenticated";
  const session = MOCK_SESSION;
  const router = useRouter();
  const pathname = usePathname();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // Mock authentication
    const user = session.user as any;
    setAuth({
        id: user.id || "",
        username: user.username || "",
        role: user.role || "",
        linkedUserType: user.linkedUserType || "NONE",
    });

    if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
        return;
    }
  }, [session, router, pathname, allowedRoles, setAuth]);

  // Always return children while mocking for build
  return <>{children}</>;
}
