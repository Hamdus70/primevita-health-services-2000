"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";
import { ControlledInput } from "@/components/ui/controlled-input";

export default function QuickAssessmentPage() {
  const [msg, setMsg] = useState("");
  const form = useForm({
    defaultValues: { consciousness: "Alert", respiration: "Normal", painLevel: "0", hydration: "Good" }
  });

  const onSubmit = (data: any) => {
    setMsg("Assessment saved successfully.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Clinical Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <AuthSuccessAlert message={msg} />
              
              <div className="grid grid-cols-2 gap-4">
                <ControlledInput name="consciousness" label="Level of Consciousness" />
                <ControlledInput name="respiration" label="Respiration Pattern" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <ControlledInput name="painLevel" label="Pain Level (0-10)" type="number" />
                <ControlledInput name="hydration" label="Hydration Status" />
              </div>
              
              <Button type="submit" className="w-full mt-4">Save Assessment</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
