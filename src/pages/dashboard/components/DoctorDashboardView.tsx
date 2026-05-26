import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AIInvestigatorTextarea } from './AIInvestigatorTextarea';
import { SecurePatientChat } from './SecurePatientChat';
import { MapPin, Users, HeartPulse, FileSignature, Stethoscope, AlertCircle, FileText, Send, User, UserCheck, Calendar, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function DoctorDashboardView() {
  const [clockedIn, setClockedIn] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  // const { data: session } = useSession();
  const session = { user: { id: 'doctor-mock' } };
  const user = session?.user;

  // Form states for e-Rx
  const [rxDrugName, setRxDrugName] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxFreq, setRxFreq] = useState('');
  const [rxDuration, setRxDuration] = useState('');
  const [rxNotes, setRxNotes] = useState('');

  // Form states for Clinical Notes
  const [soapNote, setSoapNote] = useState('');

  const handleSendRx = async () => {
      if (!selectedPatient || !user) return;
      if (!rxDrugName || !rxDosage || !rxFreq) {
          toast.error("Please fill required prescription fields");
          return;
      }
      try {
          await addDoc(collection(db, 'prescriptions'), {
              patientId: selectedPatient,
              doctorId: user.id || 'doctor-mock',
              medicationName: rxDrugName,
              dosage: rxDosage,
              frequency: rxFreq,
              route: 'Oral',
              remarks: rxNotes,
              status: 'active',
              createdAt: serverTimestamp()
          });
          toast.success('Prescription Sent to Pharmacy');
          setRxDrugName('');
          setRxDosage('');
          setRxFreq('');
          setRxDuration('');
          setRxNotes('');
      } catch (e: any) {
          toast.error("Failed to send: " + e.message);
      }
  };

  const handleSignEncounterNote = async () => {
      if (!selectedPatient || !user) return;
      if (!soapNote) {
          toast.error("Please add clinical notes");
          return;
      }
      try {
          await addDoc(collection(db, 'clinicalNotes'), {
              patientId: selectedPatient,
              authorId: user.id || 'doctor-mock',
              visitId: 'visit-mock',
              noteType: 'soap',
              subjective: soapNote,
              objective: 'N/A',
              assessment: 'N/A',
              plan: 'N/A',
              intakeOutputDetails: 'N/A',
              createdAt: serverTimestamp()
          });
          toast.success('Consultation note saved');
          setSoapNote('');
      } catch (e: any) {
          toast.error("Failed to save note: " + e.message);
      }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-[#0e4e5e]">
         <div>
             <h2 className="text-xl font-bold text-[#0e4e5e]">Physician Portal</h2>
             <p className="text-sm text-gray-500">Heads-up display & Unified Patient Timeline.</p>
         </div>
         <Button 
            className={`${clockedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-[#0e4e5e] hover:bg-[#093540]'} text-white shadow-md transition-all rounded-full px-6`}
            onClick={() => setClockedIn(!clockedIn)}
         >
             <MapPin className="w-4 h-4 mr-2" />
             {clockedIn ? 'Clock Out (Geofenced)' : 'Clock In to Clinic'}
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Queue */}
          <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col h-[700px]">
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold flex items-center gap-2 text-[#0e4e5e]"><Users className="w-4 h-4" /> Active Roster</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">2 WAITING</span>
                  </div>
                  <div className="p-2 space-y-1 overflow-y-auto">
                      <div 
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedPatient === 'CL-JD-0001' ? 'bg-[#10837f]/10 border border-[#10837f]/20' : 'hover:bg-gray-50 border border-transparent'}`}
                          onClick={() => setSelectedPatient('CL-JD-0001')}
                      >
                          <div className="flex justify-between items-start">
                              <span className="font-bold text-sm text-gray-900">Jane Doe</span>
                              <span className="text-xs text-gray-400">10:00 AM</span>
                          </div>
                          <p className="text-xs text-gray-500">Routine checkup, BP monitor</p>
                      </div>
                      <div 
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedPatient === 'CL-MS-0002' ? 'bg-[#10837f]/10 border border-[#10837f]/20' : 'hover:bg-gray-50 border border-transparent'}`}
                          onClick={() => setSelectedPatient('CL-MS-0002')}
                      >
                          <div className="flex justify-between items-start">
                              <span className="font-bold text-sm text-gray-900">Mark Smith</span>
                              <span className="text-xs text-red-400 font-bold">10:30 AM</span>
                          </div>
                          <p className="text-xs text-gray-500">AI Triage: Chest pain reported</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Unified Patient Timeline & Tools */}
          <div className="lg:col-span-8">
              {selectedPatient ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
                      {/* Patient Context Header */}
                      <div className="bg-gradient-to-r from-[#0e4e5e] to-[#10837f] p-6 text-white shrink-0">
                          <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0 border-2 border-white/30">
                                  <User className="w-8 h-8 opacity-80" />
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                      <div>
                                        <h2 className="text-2xl font-bold">{selectedPatient === 'CL-JD-0001' ? 'Jane Doe' : 'Mark Smith'}</h2>
                                        <p className="text-sm text-emerald-100 flex gap-4 mt-1">
                                            <span>{selectedPatient === 'CL-JD-0001' ? 'Female' : 'Male'}, {selectedPatient === 'CL-JD-0001' ? '34' : '52'} yrs</span>
                                            <span>Allergies: {selectedPatient === 'CL-JD-0001' ? 'Penicillin' : 'None'}</span>
                                        </p>
                                      </div>
                                      <div className="text-right flex flex-col items-end">
                                          <p className="text-xs font-bold uppercase tracking-widest text-[#d8a846] bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">{selectedPatient}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <Tabs defaultValue="timeline" className="flex flex-col flex-1 overflow-hidden">
                        <div className="px-6 py-2 border-b bg-gray-50 flex items-center justify-between shrink-0">
                            <TabsList className="bg-white border rounded-lg h-9">
                              <TabsTrigger value="timeline" className="text-xs data-[state=active]:bg-[#0e4e5e] data-[state=active]:text-white">Timeline</TabsTrigger>
                              <TabsTrigger value="rx" className="text-xs data-[state=active]:bg-[#0e4e5e] data-[state=active]:text-white">Prescribe (e-Rx)</TabsTrigger>
                              <TabsTrigger value="notes" className="text-xs data-[state=active]:bg-[#0e4e5e] data-[state=active]:text-white">Clinical Notes</TabsTrigger>
                              <TabsTrigger value="chat" className="text-xs data-[state=active]:bg-[#0e4e5e] data-[state=active]:text-white">Secure Chat</TabsTrigger>
                            </TabsList>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
                            <TabsContent value="timeline" className="m-0 p-6 h-full border-0">
                              <div className="absolute left-10 top-16 bottom-0 w-px bg-slate-200 z-0 hidden md:block"></div>
                              <div className="space-y-6 relative z-10">
                                  {/* New Action Input */}
                                  <div className="md:ml-16 bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-8">
                                      <Input placeholder="Quick add note, diagnosis, or command (e.g. /rx Amoxicillin)" className="border-0 bg-slate-50 mb-3 focus-visible:ring-0 shadow-inner" />
                                      <div className="flex gap-2 justify-end">
                                          <Button size="sm" variant="outline" className="text-xs h-8"><Stethoscope className="w-3 h-3 mr-1" /> Vitals</Button>
                                          <Button size="sm" variant="outline" className="text-xs h-8"><FileSignature className="w-3 h-3 mr-1" /> Rx</Button>
                                          <Button size="sm" className="text-xs h-8 bg-[#10837f] hover:bg-[#0c6b68]" onClick={() => toast.success("Timeline updated.")}><Send className="w-3 h-3 mr-1" /> Post</Button>
                                      </div>
                                  </div>

                                  {selectedPatient === 'CL-MS-0002' ? (
                                      <>
                                         {/* Mock Timeline for Mark */}
                                         <div className="flex flex-col md:flex-row gap-4 relative">
                                             <div className="hidden md:flex w-10 h-10 rounded-full bg-red-100 border-2 border-white shadow items-center justify-center shrink-0 z-10">
                                                <AlertCircle className="w-5 h-5 text-red-600" />
                                             </div>
                                             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                                                 <div className="flex justify-between items-center mb-2">
                                                     <span className="font-bold text-sm text-slate-800 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600 md:hidden" /> AI Triage Alert</span>
                                                     <span className="text-xs text-slate-400">Today, 9:45 AM</span>
                                                 </div>
                                                 <p className="text-sm text-slate-600 border-l-2 border-red-500 pl-3">Patient reported acute chest pain radiating to left arm. Priority elevated.</p>
                                             </div>
                                         </div>
                                      </>
                                  ) : (
                                      <>
                                          {/* Mock Timeline for Jane */}
                                          <div className="flex flex-col md:flex-row gap-4 relative">
                                             <div className="hidden md:flex w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow items-center justify-center shrink-0 z-10">
                                                <HeartPulse className="w-5 h-5 text-emerald-600" />
                                             </div>
                                             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                                                 <div className="flex justify-between items-center mb-2">
                                                     <span className="font-bold text-sm text-slate-800 flex items-center gap-2"><HeartPulse className="w-4 h-4 text-emerald-600 md:hidden" /> Vitals Recorded</span>
                                                     <span className="text-xs text-slate-400">Today, 9:50 AM</span>
                                                 </div>
                                                 <div className="grid grid-cols-3 gap-2 mt-2">
                                                     <div className="bg-slate-50 p-2 rounded text-center border">
                                                         <div className="text-[10px] uppercase text-slate-500 font-bold">BP</div>
                                                         <div className="text-sm font-semibold text-slate-800">120/80</div>
                                                     </div>
                                                     <div className="bg-slate-50 p-2 rounded text-center border">
                                                         <div className="text-[10px] uppercase text-slate-500 font-bold">HR</div>
                                                         <div className="text-sm font-semibold text-slate-800">72 bpm</div>
                                                     </div>
                                                     <div className="bg-slate-50 p-2 rounded text-center border shadow-inner">
                                                         <div className="text-[10px] uppercase text-slate-500 font-bold">Temp</div>
                                                         <div className="text-sm font-semibold text-orange-600">101.2°F <span className="text-[10px] text-red-500">(HIGH)</span></div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>

                                         <div className="flex flex-col md:flex-row gap-4 relative">
                                             <div className="hidden md:flex w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow items-center justify-center shrink-0 z-10">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                             </div>
                                             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                                                 <div className="flex justify-between items-center mb-2">
                                                     <span className="font-bold text-sm text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600 md:hidden" /> Lab Test Uploaded</span>
                                                     <span className="text-xs text-slate-400">Oct 12, 2026</span>
                                                 </div>
                                                 <p className="text-sm text-slate-600 mb-3">CBC Panel results attached. All parameters within normal ranges.</p>
                                                 <Button variant="outline" size="sm" className="text-xs h-7 text-[#0e4e5e] border-gray-200 hover:bg-gray-50">View Report (PDF)</Button>
                                             </div>
                                         </div>
                                      </>
                                  )}
                              </div>
                            </TabsContent>

                            <TabsContent value="rx" className="m-0 p-6 h-full border-0">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Drug Search</Label>
                                            <Input placeholder="Type medication name..." value={rxDrugName} onChange={e => setRxDrugName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Dosage</Label>
                                            <Input placeholder="e.g. 500mg" value={rxDosage} onChange={e => setRxDosage(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Frequency</Label>
                                            <select value={rxFreq} onChange={e => setRxFreq(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                                <option value="" disabled>Select Frequency</option>
                                                <option value="Once Daily">Once Daily</option>
                                                <option value="Twice Daily">Twice Daily</option>
                                                <option value="Every 8 Hours">Every 8 Hours</option>
                                                <option value="As Needed">As Needed</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Duration (Days)</Label>
                                            <Input type="number" placeholder="7" value={rxDuration} onChange={e => setRxDuration(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Additional Rx Notes</Label>
                                        <Textarea placeholder="Take with food..." className="h-20" value={rxNotes} onChange={e => setRxNotes(e.target.value)} />
                                    </div>
                                    <Button className="bg-[#0e4e5e] hover:bg-[#10837f] w-full md:w-auto" onClick={handleSendRx}><Send className="w-4 h-4 mr-2"/> Sign & Send Rx</Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="notes" className="m-0 p-6 h-full border-0">
                                   <div className="space-y-4">
                                       <div className="space-y-2">
                                           <Label>SOAP Note (Subjective, Objective, Assessment, Plan)</Label>
                                           <Textarea 
                                                placeholder="S: Patient reports...&#10;O: Vitals are...&#10;A: Diagnosis is...&#10;P: Prescribing..." 
                                                className="min-h-[250px] leading-relaxed border-gray-200 shadow-inner" 
                                                value={soapNote}
                                                onChange={e => setSoapNote(e.target.value)}
                                            />
                                       </div>
                                       
                                       <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Next Appointment / Reassessment Date</Label>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-[#0e4e5e]" />
                                                    <Input type="date" className="h-9 text-sm font-medium focus-visible:ring-[#0e4e5e]" />
                                                </div>
                                            </div>
                                       </div>

                                       <Button className="bg-[#0e4e5e] hover:bg-[#10837f]" onClick={handleSignEncounterNote}><FileSignature className="w-4 h-4 mr-2" /> Sign Encouter Note</Button>
                                   </div>
                            </TabsContent>

                            <TabsContent value="chat" className="m-0 p-6 h-full border-0">
                                <SecurePatientChat patientId={selectedPatient} />
                            </TabsContent>
                        </div>
                      </Tabs>
                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
                      <Users className="w-12 h-12 mb-4 opacity-20" />
                      <p>Select a patient from the queue to view timeline</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}

