import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Activity, Dumbbell, FileText, Table2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { AIInvestigatorTextarea } from './AIInvestigatorTextarea';

export function PhysiotherapistDashboardView() {
  const [clockedIn, setClockedIn] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-[#34a853]">
         <div>
             <h2 className="text-xl font-bold text-[#0e4e5e]">Physiotherapy Station</h2>
             <p className="text-sm text-gray-500">Mobility assessments, exercise regimens, and procedure vitals.</p>
         </div>
         <Button 
            className={`${clockedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-[#34a853] hover:bg-[#2b8a44]'} text-white shadow-md transition-all rounded-full px-6`}
            onClick={() => setClockedIn(!clockedIn)}
         >
             <MapPin className="w-4 h-4 mr-2" />
             {clockedIn ? 'Clock Out (Geofenced)' : 'Clock In to Session'}
         </Button>
      </div>

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto md:h-12 bg-white border shadow-sm rounded-xl p-1 gap-1 mb-6">
          <TabsTrigger value="vitals" className="rounded-lg data-[state=active]:bg-[#34a853] data-[state=active]:text-white">Pre/Post Vitals</TabsTrigger>
          <TabsTrigger value="assessment" className="rounded-lg data-[state=active]:bg-[#34a853] data-[state=active]:text-white">Mobility Assessment</TabsTrigger>
          <TabsTrigger value="regimen" className="rounded-lg data-[state=active]:bg-[#34a853] data-[state=active]:text-white">Exercise Builder</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-[#34a853] data-[state=active]:text-white">Session Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <Card className="border-0 shadow-sm ring-1 ring-gray-100">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-[#34a853]/10 p-1.5 rounded-lg"><Table2 className="w-5 h-5 text-[#34a853]" /></div> 
                  Procedure Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pre-Procedure */}
                <div className="space-y-4 p-4 border border-blue-100 bg-blue-50/30 rounded-xl">
                    <h3 className="font-bold text-[#0e4e5e] text-center border-b pb-2">BEFORE PROCEDURE</h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">Blood Pressure</Label>
                           <Input placeholder="120/80" className="bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">Heart Rate</Label>
                           <Input placeholder="72 bpm" className="bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">SpO2</Label>
                           <Input placeholder="98%" className="bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">Resp. Rate</Label>
                           <Input placeholder="16 cpm" className="bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">Temperature</Label>
                           <Input placeholder="36.5 °C" className="bg-white" />
                        </div>
                        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success('Pre-vitals saved')}>Save Pre-Vitals</Button>
                    </div>
                </div>

                {/* Post-Procedure */}
                <div className="space-y-4 p-4 border border-green-100 bg-green-50/30 rounded-xl">
                    <h3 className="font-bold text-green-800 text-center border-b border-green-200 pb-2">AFTER PROCEDURE</h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">Blood Pressure</Label>
                           <Input placeholder="120/80" className="bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">Heart Rate</Label>
                           <Input placeholder="72 bpm" className="bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">SpO2</Label>
                           <Input placeholder="98%" className="bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">Resp. Rate</Label>
                           <Input placeholder="16 cpm" className="bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Label className="self-center">Temperature</Label>
                           <Input placeholder="36.5 °C" className="bg-white" />
                        </div>
                        <Button className="w-full mt-4 bg-[#34a853] hover:bg-[#2b8a44] text-white" onClick={() => toast.success('Post-vitals saved')}>Save Post-Vitals</Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card className="border-0 shadow-sm ring-1 ring-gray-100">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-[#34a853]" /> Mobility Assessment</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                   <Label>Range of Motion (ROM) Observations</Label>
                   <Textarea placeholder="Document joint ROM limitations..." className="h-24" />
                </div>
                <div className="space-y-2">
                   <Label>Gait & Balance Assessment</Label>
                   <Textarea placeholder="e.g. Needs single point cane, steady gait." className="h-24" />
                </div>
                <div className="space-y-2">
                   <Label>Pain Scale (0-10) & Description</Label>
                   <Input placeholder="e.g. 4/10 upon knee flexion" />
                </div>
                <Button className="bg-[#34a853] hover:bg-[#2b8a44]" onClick={() => toast.success('Assessment logged')}>Log Assessment</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regimen">
          <Card className="border-0 shadow-sm ring-1 ring-gray-100">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Dumbbell className="w-5 h-5 text-[#34a853]" /> Exercise Regimen Builder</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Exercise Name</Label>
                        <Input placeholder="e.g. Seated Leg Extensions" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sets</Label>
                        <Input type="number" placeholder="3" />
                    </div>
                    <div className="space-y-2">
                        <Label>Reps/Duration</Label>
                        <Input placeholder="10 reps" />
                    </div>
                </div>
                <Button variant="outline" className="border-[#34a853] text-[#34a853] mb-6" onClick={() => toast.success('Exercise added')}>Add Exercise</Button>
                
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left font-medium text-sm text-gray-500">Exercise</th>
                                <th className="p-3 text-left font-medium text-sm text-gray-500">Target</th>
                                <th className="p-3 text-left font-medium text-sm text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3">Ankle Pumps</td>
                                <td className="p-3">3 sets x 15 reps</td>
                                <td className="p-3"><Button size="sm" variant="ghost" className="text-red-500" onClick={() => toast.success('Exercise removed')}>Remove</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="border-0 shadow-sm ring-1 ring-gray-100">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-[#34a853]" /> Session Notes & Follow-up</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
               <div className="space-y-2">
                   <Label>General Treatment Note</Label>
                   <AIInvestigatorTextarea 
                       placeholder="Patient tolerated session well..." 
                       className="h-40"
                       role="Physiotherapist"
                       staffName="Physiotherapist Team" 
                    />
               </div>
               
               <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Next Appointment / Reassessment Date</Label>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#34a853]" />
                            <Input type="date" className="h-9 text-sm font-medium focus-visible:ring-[#34a853]" />
                        </div>
                    </div>
               </div>

               <Button className="bg-[#34a853] hover:bg-[#2b8a44]" onClick={() => toast.success('Session note saved')}>Save Session Note</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
