"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function PatientAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-blue-50/50">
              <div className="font-semibold">General Checkup</div>
              <div className="text-sm text-gray-600 mt-1">Dr. Smith • Oct 24, 2026 at 10:00 AM</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Past Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState title="No past appointments" description="You haven't had any appointments yet." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
