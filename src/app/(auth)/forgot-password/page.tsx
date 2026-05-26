"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/controlled-input";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthErrorAlert } from "@/components/auth/AuthErrorAlert";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiClient.post<any>("/api/auth/reset-password", { email: values.email });
      setSuccess("If an account with that email exists, an OTP has been sent.");
      form.reset();
      
      setTimeout(() => {
        router.push(`/verify-reset?email=${encodeURIComponent(values.email)}&token=${res.trackingToken || ""}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to request password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <AuthCard
        title="Reset Password"
        description="Enter your email to receive a secure OTP."
        footer={
          <div className="text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to login
            </Link>
          </div>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AuthErrorAlert message={error} />
            <AuthSuccessAlert message={success} />
            
            <ControlledInput name="email" label="Email Address" type="email" placeholder="john@example.com" />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
}
