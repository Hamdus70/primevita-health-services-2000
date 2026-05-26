"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { Plus } from "lucide-react";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";

export default function VitalsPage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const canEdit = role === "DOCTOR" || role === "NURSE";
  const [msg, setMsg] = useState("");

  const dummyVitals = [
    { date: "Current", temp: "98.6 °F", bp: "120/80", hr: "72 bpm" },
    { date: "2 hrs ago", temp: "99.1 °F", bp: "125/82", hr: "78 bpm" },
  ];

  const handleAddVitals = () => {
    setMsg("Vitals logged successfully.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Vitals Dashboard</h2>
        {canEdit && (
          <Button onClick={handleAddVitals}>
            <Plus className="w-4 h-4 mr-2" /> Record Vitals
          </Button>
        )}
      </div>
      
      <AuthSuccessAlert message={msg} />

      <div className="grid gap-4 md:grid-cols-3">
        {dummyVitals.map((v, i) => (
          <Card key={i} className={i === 0 ? "border-blue-200 bg-blue-50/20" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{v.date}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Blood Pressure</span>
                <span className="font-semibold">{v.bp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Heart Rate</span>
                <span className="font-semibold">{v.hr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Temperature</span>
                <span className="font-semibold">{v.temp}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
