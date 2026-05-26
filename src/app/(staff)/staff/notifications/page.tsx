"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function StaffNotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      
      <div className="grid gap-4">
        <Card>
          <CardContent className="p-4 flex gap-4 items-start bg-blue-50/20 border-blue-100">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Dr. Adams assigned you a new patient.</h4>
              <p className="text-sm text-gray-600 mt-1">Please review the chart for Robert Johnson (MRN-102940).</p>
              <p className="text-xs text-gray-400 mt-2">Just now</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
