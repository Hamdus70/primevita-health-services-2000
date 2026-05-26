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
// import { signIn } from "next-auth/react"; // Removed: next-auth removal

const schema = z.object({
  temporaryPassword: z.string().min(1, "Temporary password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

function TemporaryPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { temporaryPassword: "", newPassword: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("newPassword");

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!username) {
      setError("Username is missing. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: IMPLEMENT FIREBASE PASSWORD UPDATE FLOW HERE
      // 1. Re-authenticate user with temporaryPassword
      // 2. updatePassword(...)
      // 3. router.push("/dashboard")
      
      console.log("Submit password update", values);
      setSuccess("Password updated. (Implementation needed: Firebase Password Reset)");
      
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Update Password"
      description="You must change your temporary password before continuing."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthErrorAlert message={error} />
          <AuthSuccessAlert message={success} />
          
          <PasswordField name="temporaryPassword" label="Temporary Password" />
          
          <PasswordField name="newPassword" label="New Password" />
          <PasswordStrengthMeter password={passwordValue} />

          <PasswordField name="confirmPassword" label="Confirm New Password" />
          
          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password & Continue"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}

export default function TemporaryPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <TemporaryPasswordContent />
      </Suspense>
    </div>
  );
}
