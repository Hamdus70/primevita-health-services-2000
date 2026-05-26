"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/auth.store";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";
import { Plus } from "lucide-react";

export default function DoctorNotesPage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const canEdit = role === "DOCTOR";
  const [msg, setMsg] = useState("");
  const form = useForm();

  const onSubmit = () => {
    setMsg("Note saved successfully.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Clinical Notes (SOAP)</h2>
      </div>
      
      <AuthSuccessAlert message={msg} />

      {canEdit && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Add New Progress Note</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Subjective</label>
                  <textarea className="w-full border rounded-md p-2 text-sm" rows={2} placeholder="Patient reports..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Objective</label>
                  <textarea className="w-full border rounded-md p-2 text-sm" rows={2} placeholder="Vitals stable..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Assessment</label>
                  <textarea className="w-full border rounded-md p-2 text-sm" rows={2} placeholder="Improving..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Plan</label>
                  <textarea className="w-full border rounded-md p-2 text-sm" rows={2} placeholder="Continue current meds..." />
                </div>
                <Button type="submit"><Plus className="w-4 h-4 mr-2"/> Save Note</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-700">Previous Notes</h3>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Dr. Smith • Oct 10, 2026</CardTitle>
              <span className="text-xs text-gray-500">10:00 AM</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><span className="font-bold text-gray-700">S:</span> Patient denies pain. States "I feel much better today."</div>
            <div><span className="font-bold text-gray-700">O:</span> Temp 98.6. Lungs clear to auscultation bilaterally.</div>
            <div><span className="font-bold text-gray-700">A:</span> Resolving pneumonia.</div>
            <div><span className="font-bold text-gray-700">P:</span> Transition to oral antibiotics. Prepare for discharge tomorrow.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
