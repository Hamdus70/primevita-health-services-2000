"use client";
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VitalSignsModule() {
  const [vitals, setVitals] = useState({ temp: '', bpSys: '', bpDias: '', pulse: '', resp: '', glucose: '' });
  const [history, setHistory] = useState<any[]>([]);

  const handleSave = () => {
    const entry = { ...vitals, timestamp: new Date().toLocaleString() };
    setHistory([entry, ...history]);
    setVitals({ temp: '', bpSys: '', bpDias: '', pulse: '', resp: '', glucose: '' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div><Label>Temperature (°C)</Label><Input value={vitals.temp} onChange={(e) => setVitals({...vitals, temp: e.target.value})} /></div>
        <div><Label>BP Systolic</Label><Input value={vitals.bpSys} onChange={(e) => setVitals({...vitals, bpSys: e.target.value})} /></div>
        <div><Label>BP Diastolic</Label><Input value={vitals.bpDias} onChange={(e) => setVitals({...vitals, bpDias: e.target.value})} /></div>
        <div><Label>Pulse (bpm)</Label><Input value={vitals.pulse} onChange={(e) => setVitals({...vitals, pulse: e.target.value})} /></div>
        <div><Label>Resp Rate</Label><Input value={vitals.resp} onChange={(e) => setVitals({...vitals, resp: e.target.value})} /></div>
        <div><Label>Glucose</Label><Input value={vitals.glucose} onChange={(e) => setVitals({...vitals, glucose: e.target.value})} /></div>
      </div>
      <Button onClick={handleSave}>Save Entry</Button>
      <div className="mt-4">
        <h3 className="font-bold">History</h3>
        {history.map((h, i) => (
          <div key={i} className="border-b p-2 text-sm">{h.timestamp} - T: {h.temp}°C, BP: {h.bpSys}/{h.bpDias}, Pulse: {h.pulse}, Resp: {h.resp}, Gluc: {h.glucose}</div>
        ))}
      </div>
    </div>
  );
}
