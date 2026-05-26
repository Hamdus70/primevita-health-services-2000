"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function StaffSchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Schedule</h1>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" /> Upcoming Shifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2 text-sm">
              <div className="flex justify-between items-center p-3 border rounded bg-gray-50 border-gray-200">
                <span className="font-semibold">Monday, Oct 12</span>
                <span className="text-gray-600">08:00 AM - 04:00 PM (Cardiology)</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded bg-gray-50 border-gray-200">
                <span className="font-semibold">Wednesday, Oct 14</span>
                <span className="text-gray-600">12:00 PM - 08:00 PM (Emergency)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
