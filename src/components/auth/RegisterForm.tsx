"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is available based on previous context

const formSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number required"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  type: z.enum(["PATIENT", "DOCTOR", "NURSE", "STAFF", "ADMIN"]),
});

export function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { type: "PATIENT" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            toast.success("Registration successful!");
            router.push(values.type === 'PATIENT' ? "/dashboard" : "/login");
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="fullName" render={({field}) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({field}) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="password" render={({field}) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="phone" render={({field}) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="dateOfBirth" render={({field}) => (
                    <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="type" render={({field}) => (
                    <FormItem>
                        <FormLabel>Apply As</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="PATIENT">Patient</SelectItem>
                                <SelectItem value="NURSE">Nurse</SelectItem>
                                <SelectItem value="DOCTOR">Doctor</SelectItem>
                                <SelectItem value="STAFF">Staff</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit Application"}</Button>
            </form>
        </Form>
    );
}
