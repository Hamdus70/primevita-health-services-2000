"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function StaffAssignmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Assignments</h1>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-gray-400" /> Current Shift Ward: Cardiology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-semibold text-gray-900">Bed 102 - John Doe</h4>
                  <p className="text-sm text-gray-500">Requires Vitals check every 4 hours.</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
