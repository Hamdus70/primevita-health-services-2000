"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function NursingReportModule() {
  const [report, setReport] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const handleSave = () => {
    setHistory([{ text: report, timestamp: new Date().toLocaleString() }, ...history]);
    setReport('');
  };

  return (
    <div className="space-y-4">
      <Textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="Enter nursing progress notes..." />
      <Button onClick={handleSave}>Add Note</Button>
      <div className="mt-4">
        {history.map((h, i) => (
          <div key={i} className="border-b p-2 text-sm">
            <span className="font-bold">{h.timestamp}</span>: {h.text}
          </div>
        ))}
      </div>
    </div>
  );
}
