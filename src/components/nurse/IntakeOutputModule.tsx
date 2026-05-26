"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function IntakeOutputModule() {
  const [data, setData] = useState<any[]>([]);
  const [entry, setEntry] = useState({ type: '', volume: '', kind: 'Intake' }); // kind = "Intake" | "Output"

  const handleSave = () => {
    setData([...data, { ...entry, time: new Date().toLocaleTimeString() }]);
    setEntry({ type: '', volume: '', kind: 'Intake' });
  };

  const totalIntake = data.filter(d => d.kind === 'Intake').reduce((sum, d) => sum + Number(d.volume), 0);
  const totalOutput = data.filter(d => d.kind === 'Output').reduce((sum, d) => sum + Number(d.volume), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Type (e.g., Oral)" value={entry.type} onChange={(e) => setEntry({...entry, type: e.target.value})}/>
        <Input placeholder="Volume (ml)" value={entry.volume} type="number" onChange={(e) => setEntry({...entry, volume: e.target.value})}/>
        <Button onClick={() => setEntry({...entry, kind: 'Intake'})} variant={entry.kind === 'Intake' ? 'default' : 'outline'}>Set Intake</Button>
        <Button onClick={() => setEntry({...entry, kind: 'Output'})} variant={entry.kind === 'Output' ? 'default' : 'outline'}>Set Output</Button>
      </div>
      <Button onClick={handleSave}>Add {entry.kind}</Button>
      <div className="font-bold">Summary: Total Intake: {totalIntake}ml | Total Output: {totalOutput}ml</div>
      <Table>
        <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Kind</TableHead><TableHead>Volume</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
        <TableBody>
          {data.map((d, i) => <TableRow key={i}><TableCell>{d.type}</TableCell><TableCell>{d.kind}</TableCell><TableCell>{d.volume}</TableCell><TableCell>{d.time}</TableCell></TableRow>)}
        </TableBody>
      </Table>
    </div>
  );
}
