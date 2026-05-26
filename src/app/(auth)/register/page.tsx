import React from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-screen">
          <AuthCard
            title="Join NovaCare"
            description="Create an account to get started"
          >
            <RegisterForm />
          </AuthCard>
        </div>
      );
}
