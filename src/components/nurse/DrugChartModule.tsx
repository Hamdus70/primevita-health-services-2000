"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DrugChartModule() {
  const [meds, setMeds] = useState<any[]>([]);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', route: '', frequency: '' });

  const handleSave = () => {
    setMeds([...meds, newMed]);
    setNewMed({ name: '', dosage: '', route: '', frequency: '' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Drug Name" value={newMed.name} onChange={(e) => setNewMed({...newMed, name: e.target.value})}/>
        <Input placeholder="Dosage" value={newMed.dosage} onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}/>
        <Input placeholder="Route" value={newMed.route} onChange={(e) => setNewMed({...newMed, route: e.target.value})}/>
        <Select onValueChange={(val) => setNewMed({...newMed, frequency: val})}>
          <SelectTrigger><SelectValue placeholder="Frequency" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="BD">BD (Morning, Night)</SelectItem>
            <SelectItem value="TDS">TDS (Morning, Afternoon, Night)</SelectItem>
            <SelectItem value="QDS">QDS (00:00, 06:00, 12:00, 18:00)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSave}>Add Medication</Button>
      <Table>
        <TableHeader><TableRow><TableHead>Drug</TableHead><TableHead>Dosage</TableHead><TableHead>Route</TableHead><TableHead>Frequency</TableHead></TableRow></TableHeader>
        <TableBody>
          {meds.map((m, i) => <TableRow key={i}><TableCell>{m.name}</TableCell><TableCell>{m.dosage}</TableCell><TableCell>{m.route}</TableCell><TableCell>{m.frequency}</TableCell></TableRow>)}
        </TableBody>
      </Table>
    </div>
  );
}
