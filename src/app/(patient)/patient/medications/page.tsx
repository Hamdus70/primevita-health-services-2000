"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CopyPlus, Clock } from "lucide-react";

export default function PatientMedicationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Medications</h1>
      
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Lisinopril 10mg</CardTitle>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold uppercase">Active</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-2">
                <CopyPlus className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Dosage</p>
                  <p className="text-sm">1 tablet by mouth daily</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Schedule</p>
                  <p className="text-sm">Morning (with food)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
