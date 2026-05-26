"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";
import { Plus, Check } from "lucide-react";

export default function MedicationsPage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const canPrescribe = role === "DOCTOR";
  const canAdminister = role === "NURSE" || role === "DOCTOR";
  const [msg, setMsg] = useState("");

  const handleAdminister = () => {
    setMsg("Medication marked as administered.");
    setTimeout(() => setMsg(""), 3000);
  };

  const handlePrescribe = () => {
    setMsg("New prescription added.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Active Medications</h2>
        {canPrescribe && (
          <Button onClick={handlePrescribe}>
            <Plus className="w-4 h-4 mr-2" /> Prescribe New
          </Button>
        )}
      </div>
      
      <AuthSuccessAlert message={msg} />

      <div className="grid gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Paracetamol 500mg</h3>
              <p className="text-sm text-gray-500">PO q6h PRN for pain/fever</p>
              <p className="text-xs text-gray-400 mt-1">Prescribed by Dr. Smith</p>
            </div>
            <div>
              {canAdminister ? (
                <Button onClick={handleAdminister} className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" /> Administer Now
                </Button>
              ) : (
                <span className="text-sm text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded">View Only</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
