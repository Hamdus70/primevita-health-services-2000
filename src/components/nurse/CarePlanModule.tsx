"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CarePlanModule() {
  const [plans, setPlans] = useState<any[]>([]);
  const [newPlan, setNewPlan] = useState({ diagnosis: '', goals: '', interventions: '', evaluation: '' });

  const handleSave = () => {
    setPlans([...plans, newPlan]);
    setNewPlan({ diagnosis: '', goals: '', interventions: '', evaluation: '' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Diagnosis" value={newPlan.diagnosis} onChange={(e) => setNewPlan({...newPlan, diagnosis: e.target.value})}/>
        <Input placeholder="Goals" value={newPlan.goals} onChange={(e) => setNewPlan({...newPlan, goals: e.target.value})}/>
        <Input placeholder="Interventions" value={newPlan.interventions} onChange={(e) => setNewPlan({...newPlan, interventions: e.target.value})}/>
        <Input placeholder="Evaluation" value={newPlan.evaluation} onChange={(e) => setNewPlan({...newPlan, evaluation: e.target.value})}/>
      </div>
      <Button onClick={handleSave}>Add to Care Plan</Button>
      <Table>
        <TableHeader><TableRow><TableHead>Diagnosis</TableHead><TableHead>Goals</TableHead><TableHead>Interventions</TableHead><TableHead>Evaluation</TableHead></TableRow></TableHeader>
        <TableBody>
          {plans.map((p, i) => <TableRow key={i}><TableCell>{p.diagnosis}</TableCell><TableCell>{p.goals}</TableCell><TableCell>{p.interventions}</TableCell><TableCell>{p.evaluation}</TableCell></TableRow>)}
        </TableBody>
      </Table>
    </div>
  );
}
