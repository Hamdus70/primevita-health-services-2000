"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginContent() {
  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your NovaCare account"
      footer={
        <div className="text-center text-sm space-y-2">
          <Link href="/forgot-password" className="text-blue-600 hover:underline block">
            Forgot your password?
          </Link>
          <Link href="/register" className="text-blue-600 hover:underline block">
            Don't have an account? Register here
          </Link>
        </div>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
