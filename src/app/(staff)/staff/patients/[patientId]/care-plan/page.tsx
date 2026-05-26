"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";
import { CheckCircle2 } from "lucide-react";

export default function CarePlanPage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const canEdit = role === "NURSE" || role === "CAREGIVER";
  const [msg, setMsg] = useState("");

  const markComplete = () => {
    setMsg("Task marked as complete.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Active Care Plan</h2>
      </div>
      
      <AuthSuccessAlert message={msg} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Hygiene & Ambulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div>
              <p className="font-medium">Morning ambulation (10 mins)</p>
              <p className="text-sm text-gray-500">Due: 09:00 AM</p>
            </div>
            {canEdit ? (
              <Button size="sm" onClick={markComplete} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
              </Button>
            ) : (
              <span className="text-sm font-semibold text-orange-600">Pending Update</span>
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div>
              <p className="font-medium">Assist with oral hygiene</p>
              <p className="text-sm text-gray-500">Due: 07:30 AM</p>
            </div>
            {canEdit ? (
              <Button size="sm" onClick={markComplete} variant="outline" className="text-green-700 border-green-200 hover:bg-green-50">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
              </Button>
            ) : (
              <span className="text-sm font-semibold text-green-700">Completed by Nurse A.</span>
            )}
          </div>
        </CardContent>
      </Card>
      
      <p className="text-xs text-gray-500 text-center">
        Note: Care plans are structured by the attending doctor. Only designated roles can update execution status.
      </p>
    </div>
  );
}
