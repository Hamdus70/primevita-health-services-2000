"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PatientVitalsPage() {
  const dummyVitals = [
    { date: "2026-10-10 09:00", type: "Blood Pressure", value: "120/80 mmHg", status: "Normal" },
    { date: "2026-10-10 09:00", type: "Heart Rate", value: "72 bpm", status: "Normal" },
    { date: "2026-10-10 09:00", type: "Temperature", value: "98.6 °F", status: "Normal" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vitals Timeline</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
            {dummyVitals.map((vital, i) => (
              <div key={i} className="pl-6 relative">
                <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-1.5 top-1.5 ring-4 ring-white" />
                <div className="text-sm text-gray-500">{vital.date}</div>
                <div className="font-medium mt-1">{vital.type}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold">{vital.value}</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">{vital.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
