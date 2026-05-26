"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BrainCircuit, AlertTriangle } from "lucide-react";

export default function PatientAiInsightsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Health Insights</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <p><strong>Disclaimer:</strong> AI-generated information. Your clinician makes final decisions. Do not use this as a substitute for professional medical advice.</p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 border-b pb-4">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Recent Lab Analysis</CardTitle>
            <p className="text-sm text-gray-500">Based on your Oct 10 results</p>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <p className="text-gray-700 leading-relaxed text-sm">
            Your latest lipid panel shows a slight elevation in LDL cholesterol, though HDL remains in a healthy range. Your blood glucose is stable. To support cardiovascular health, consider increasing integration of fiber-rich foods in your diet.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Suggested talking points for your next visit:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Are there specific dietary changes recommended for LDL reduction?</li>
              <li>Should we schedule a follow-up test in 3 or 6 months?</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
