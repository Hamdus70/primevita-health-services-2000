"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthErrorAlert } from "@/components/auth/AuthErrorAlert";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";
import { PasswordField } from "@/components/auth/PasswordField";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("password");

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!token) {
      setError("Missing tracking token. Please restart the password reset process.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.post<any>("/api/auth/complete-reset", { token, newPassword: values.password });
      setSuccess("Password changed successfully!");
      form.reset();
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create New Password"
      description="Your new password must be strong and unique."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthErrorAlert message={error} />
          <AuthSuccessAlert message={success} />
          
          <PasswordField name="password" label="New Password" />
          <PasswordStrengthMeter password={passwordValue} />

          <PasswordField name="confirmPassword" label="Confirm New Password" />
          
          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Saving..." : "Change Password"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}

export default function ChangePasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <ChangePasswordContent />
      </Suspense>
    </div>
  );
}
