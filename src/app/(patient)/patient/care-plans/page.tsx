"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function PatientCarePlansPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Active Care Plans</h1>
      
      <div className="grid gap-4">
        <Card className="hover:border-blue-200 transition-colors cursor-pointer">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-full mt-1 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Hypertension Management</h3>
              <p className="text-sm text-gray-500 mt-1">Prescribed by Dr. Smith on Oct 1, 2026</p>
              <div className="mt-4 flex gap-2 w-full max-w-md">
                <div className="h-2 bg-blue-600 rounded-full w-1/3" />
                <div className="h-2 bg-gray-200 rounded-full w-1/3" />
                <div className="h-2 bg-gray-200 rounded-full w-1/3" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Step 1 of 3 completed</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 self-center" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
