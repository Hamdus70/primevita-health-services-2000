"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ControlledInput } from "@/components/ui/controlled-input";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";

const profileSchema = z.object({
  phone: z.string().min(10, "Valid phone is required"),
  address: z.string().min(1, "Address is required"),
  language: z.string().min(1, "Language is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
});

export default function PatientProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: "+234 800 000 0000",
      address: "123 Main St, Lagos",
      language: "English",
      emergencyContact: "Jane Doe (+234 801 111 1111)"
    }
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    setSuccess("");
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 800));
    setSuccess("Profile updated successfully");
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-dashed bg-gray-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">MRN</p>
              <p className="font-semibold text-gray-900">MRN-102938</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Legal Name</p>
              <p className="font-semibold text-gray-900">John Doe</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="font-semibold text-gray-900">1990-01-01</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <AuthSuccessAlert message={success} />
                
                <div className="grid grid-cols-2 gap-4">
                  <ControlledInput name="phone" label="Phone Number" />
                  <ControlledInput name="language" label="Preferred Language" />
                </div>
                
                <ControlledInput name="address" label="Home Address" />
                <ControlledInput name="emergencyContact" label="Emergency Contact" />
                
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
