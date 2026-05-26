"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BrainCircuit, AlertTriangle } from "lucide-react";

export default function AIInvestigatorPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">AI Clinical Investigator</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <p><strong>Disclaimer:</strong> AI assistance only. Clinical judgement required. Do not use this as the sole basis for clinical decisions.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
          <div className="bg-purple-100 p-2 rounded-full text-purple-600">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Risk Factor Analysis</CardTitle>
            <p className="text-sm text-gray-500">Based on recent CBC and Vitals</p>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-sm">
          <p className="text-gray-700 leading-relaxed">
            The patient's recent vital signs show a trend of mild tachycardia in the evenings. Correlating this with the medication schedule suggests a potential interaction or wearing off of the beta-blocker prior to the next scheduled dose.
          </p>
          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="font-semibold mb-1">Suggested Areas for Clinical Review:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Consider reviewing the timing of the morning dose.</li>
              <li>Monitor evening blood pressure concurrently with heart rate.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
