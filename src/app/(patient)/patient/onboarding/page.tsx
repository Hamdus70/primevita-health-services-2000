"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ControlledInput } from "@/components/ui/controlled-input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const registrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export default function PatientOnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<{username: string, password: string} | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { fullName: "", email: "", phone: "", dateOfBirth: ""}
  });

  const onSubmit = async (values: z.infer<typeof registrationSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed");

      setCredentials(result);
    } catch (e: any) {
      toast.error(e.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (credentials) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle>Your Credentials</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p>Please save these credentials to log in.</p>
            <div className="bg-gray-100 p-4 rounded space-y-2">
              <p>Username: <strong>{credentials.username}</strong></p>
              <p>Password: <strong>{credentials.password}</strong></p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="saved" onChange={(e) => setHasSaved(e.target.checked)} checked={hasSaved} />
              <label htmlFor="saved">I have saved my credentials</label>
            </div>
            <Button onClick={() => router.push("/login")} disabled={!hasSaved}>Go to Patient Portal</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Patient Registration</h1>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <ControlledInput name="fullName" label="Full Name" />
              <ControlledInput name="email" label="Email" />
              <ControlledInput name="phone" label="Phone" />
              <ControlledInput name="dateOfBirth" label="Date of Birth" type="date" />
              <Button type="submit" disabled={isLoading}>{isLoading ? "Submitting..." : "Complete Registration"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
