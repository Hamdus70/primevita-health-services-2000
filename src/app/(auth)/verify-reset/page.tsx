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
import { OtpInput } from "@/components/auth/OtpInput";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  code: z.string().length(6, "OTP must be exactly 6 characters"),
});

function VerifyResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!token) {
      setError("Missing tracking token. Please restart the forgot password process.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiClient.post<any>("/api/auth/verify-otp", { token, code: values.code });
      setSuccess("OTP verified successfully!");
      form.reset();
      
      // Based on the response, direct to temp password or change password
      setTimeout(() => {
        router.push(`/change-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email || "")}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Verify OTP"
      description={`Enter the 6-digit code sent to ${email || "your email"}.`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthErrorAlert message={error} />
          <AuthSuccessAlert message={success} />
          
          <OtpInput name="code" label="OTP Code" />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}

export default function VerifyResetPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyResetContent />
      </Suspense>
    </div>
  );
}
