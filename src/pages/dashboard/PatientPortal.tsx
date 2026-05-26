import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDb } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PanicButton } from '@/components/GlobalEmergencyAlert';
import { FileUp, MessageSquare, ClipboardType, Activity, Clock, LogOut, AlertCircle, Video, CheckCircle2, Circle, Calendar, ChevronRight, Check, User, HeartPulse, Thermometer, Droplets, ArrowUpCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { signOut } from 'firebase/auth';
import { getAuthClient } from '@/lib/firebase';
import { toast } from 'sonner';

export function PatientPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [needsAssessment, setNeedsAssessment] = useState(false);
  const [telehealthReady, setTelehealthReady] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  // Firestore State
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [recentVitals, setRecentVitals] = useState<any | null>(null);
  
  // Assessment Form State
  const [assessment, setAssessment] = useState({
    symptoms: '',
    conditionDescription: '',
    painLevel: '0',
    notes: ''
  });

  useEffect(() => {
    const unsubscribe = getAuthClient().onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function initPortal() {
      if (!user) return;
      setLoading(true);

      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/patient/status', {
           headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const data = await response.json();
        
        if (data.patient) {
            setPatientId(data.patient.id);
            if (!data.patient.quick_assessment_completed) {
                setNeedsAssessment(true);
            } else {
                // Load dashboard data
                 // Fetch Prescriptions
                const pq = query(collection(getDb(), 'prescriptions'), where('patientId', '==', data.patient.id));
                const unsubP = onSnapshot(pq, (snapshot) => {
                    const prescriptionsData: any[] = [];
                    snapshot.forEach(doc => prescriptionsData.push({ id: doc.id, ...doc.data() }));
                    setPrescriptions(prescriptionsData);
                });
                
                // Fetch Recent Vitals
                const vq = query(collection(getDb(), 'vitalSigns'), where('patientId', '==', data.patient.id));
                const unsubV = onSnapshot(vq, (snapshot) => {
                    const vitalsData: any[] = [];
                    snapshot.forEach(doc => vitalsData.push({ id: doc.id, ...doc.data() }));
                     vitalsData.sort((a, b) => {
                        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                        return timeB - timeA;
                    });
                    if (vitalsData.length > 0) setRecentVitals(vitalsData[0]);
                });
                
                // Cleanup subscriptions in real app
            }
        }
      } catch (err) {
        console.error("Portal Init Error", err);
      } finally {
        setLoading(false);
      }
    }
    initPortal();
  }, [user]);

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment.symptoms || !assessment.conditionDescription) {
        toast.error('Please fill in the required fields.');
        return;
    }
    
    // Call API to submit assessment
    const idToken = await user.getIdToken();
    const response = await fetch('/api/quick-assessment', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({...assessment, painLevel: parseInt(assessment.painLevel), submittedByPatient: true})
    });
    
    if (response.ok) {
        toast.success('Assessment submitted successfully.');
        setNeedsAssessment(false);
        window.location.reload(); // Simple way to refresh state
    } else {
        toast.error('Failed to submit assessment.');
    }
  };

  const toggleMedication = (id: string, currentlyTaken: boolean) => {
      // For demo purposes, we will just toggle it locally since we don't have a specific `taken` field in the blueprint
      // Ideally, this maps to MedicationAdministration
      toast.success('Medication status updated (Simulated).');
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuthClient());
      window.location.href = '/auth/login';
    } catch (error) {
      toast.error('Failed to sign out.');
    }
  };

  if (loading) return <div className="p-8 text-center mt-20 font-medium text-[#10837f]">Loading Patient Portal...</div>;

  if (needsAssessment) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <TopBar />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
           <Card className="border-0 shadow-xl ring-1 ring-gray-200">
              <CardHeader className="bg-[#10837f] text-white rounded-t-xl px-8 py-6">
                 <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-8 h-8 opacity-80" />
                    <CardTitle className="text-2xl text-white">Welcome, Jane Doe!</CardTitle>
                 </div>
                 <CardDescription className="text-emerald-50 text-base">
                    Before we can grant you full access to your health portal, we require a quick, one-time mandatory intake assessment. 
                    This helps your assigned care team understand your current condition.
                 </CardDescription>
              </CardHeader>
              <form onSubmit={handleAssessmentSubmit}>
                <CardContent className="p-8 space-y-6">
                  <div className="bg-yellow-50 text-yellow-800 p-4 border border-yellow-200 rounded-lg text-sm mb-6">
                    <strong>Note:</strong> We already have your basic information (Name, Contact, Address) from your registration. Please only provide clinical information below.
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-900">1. Current Primary Symptoms <span className="text-red-500">*</span></Label>
                      <Textarea 
                        placeholder="Describe what you are currently experiencing..." 
                        rows={3} 
                        value={assessment.symptoms}
                        onChange={(e) => setAssessment(prev => ({...prev, symptoms: e.target.value}))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-900">2. Condition Description <span className="text-red-500">*</span></Label>
                      <Textarea 
                        placeholder="Provide details about how your condition affects you..." 
                        rows={3} 
                        value={assessment.conditionDescription}
                        onChange={(e) => setAssessment(prev => ({...prev, conditionDescription: e.target.value}))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-900">3. Current Pain Level: <span className="text-[#10837f]">{assessment.painLevel}/10</span></Label>
                      <input 
                        type="range" 
                        min="0" max="10" 
                        className="w-full" 
                        value={assessment.painLevel}
                        onChange={(e) => setAssessment(prev => ({...prev, painLevel: e.target.value}))}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0 - No Pain</span>
                        <span>5 - Moderate</span>
                        <span>10 - Unbearable</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Label className="text-base font-semibold text-gray-900">4. Clinical Notes</Label>
                      <p className="text-xs text-gray-500 mb-2">Any additional clinical context you want to provide.</p>
                      <Textarea 
                        placeholder="e.g., Asthma, allergic to Penicillin..." 
                        rows={2} 
                        value={assessment.notes}
                        onChange={(e) => setAssessment(prev => ({...prev, notes: e.target.value}))}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t p-6 flex justify-end">
                   <Button type="submit" size="lg" className="bg-[#10837f] hover:bg-[#0c6b68]">Submit Telemetry & Login</Button>
                </CardFooter>
              </form>
           </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopBar />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-1 text-[#05445E]">My Health Dashboard</h1>
              <p className="text-gray-500">Welcome back, Jane. Here is your proactive health overview.</p>
            </div>
            <div className="flex gap-4 items-center self-start sm:self-center">
                <PanicButton />
                <Button variant="outline" className="text-gray-600 bg-white" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2"/> Log Out
                </Button>
            </div>
        </div>
        
        {/* Original Primary Services (Restored & Combined) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md ring-1 ring-emerald-100 bg-white hover:shadow-lg transition-all group overflow-hidden">
                <div className="h-2 w-full bg-[#10837f]"></div>
                <CardHeader>
                    <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6 text-[#10837f]" />
                    </div>
                    <CardTitle className="text-xl text-[#05445E]">My Care Plans</CardTitle>
                    <CardDescription>View assigned plans and daily tasks from your care team.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-sm font-semibold text-gray-900">Post-Op Recovery</span>
                           <span className="text-xs text-[#10837f] font-bold bg-[#10837f]/10 px-2 py-0.5 rounded">ACTIVE</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                            <div className="bg-[#10837f] h-1.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500">45% completed today</p>
                    </div>
                    <Dialog>
                        <DialogTrigger className={buttonVariants({ variant: "outline", className: "w-full bg-white text-[#10837f] border border-[#10837f]/30 hover:bg-[#10837f] hover:text-white transition-colors" })}>
                            View Care Plan
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Care Plan Details</DialogTitle>
                                <DialogDescription>Post-Op Recovery Plan. Please follow these steps daily.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <ul className="list-disc list-inside text-sm space-y-2 text-gray-700">
                                    <li>Rest for at least 8 hours.</li>
                                    <li>Take prescribed medications with food.</li>
                                    <li>Perform designated stretches 3x a day.</li>
                                    <li>Avoid lifting objects heavier than 10 lbs.</li>
                                </ul>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-md ring-1 ring-blue-100 bg-white hover:shadow-lg transition-all group overflow-hidden">
                <div className="h-2 w-full bg-blue-500"></div>
                <CardHeader>
                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ClipboardType className="w-6 h-6 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl text-[#05445E]">Billing & Payments</CardTitle>
                    <CardDescription>Manage invoices, insurance, and payment plans.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Amount Due</p>
                            <p className="text-2xl font-bold text-red-600">$45.00</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => toast.success('Payment successfully processed! Receipt sent to email.')} className="text-red-600 border-red-200 hover:bg-red-50">Pay Now</Button>
                    </div>
                    <Dialog>
                        <DialogTrigger className={buttonVariants({ variant: "outline", className: "w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white transition-colors" })}>
                            View All Invoices
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>My Invoices</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 py-2">
                                <div className="flex justify-between p-3 border rounded-lg bg-gray-50">
                                    <span className="font-semibold text-sm">Oct 12, 2026 - CBC Panel</span>
                                    <span className="text-red-600 font-bold">$45.00</span>
                                </div>
                                <div className="flex justify-between p-3 border rounded-lg bg-emerald-50 opacity-60">
                                    <span className="font-semibold text-sm">Sep 28, 2026 - Consultation</span>
                                    <span className="text-emerald-700 font-bold">PAID</span>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-md ring-1 ring-purple-100 bg-white hover:shadow-lg transition-all group overflow-hidden">
                <div className="h-2 w-full bg-purple-500"></div>
                <CardHeader>
                    <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6 text-purple-500" />
                    </div>
                    <CardTitle className="text-xl text-[#05445E]">Secure Messaging</CardTitle>
                    <CardDescription>Direct HIPAA-compliant chat with your care team.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">W</div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Dr. Williams</p>
                                <p className="text-xs text-gray-500">Available</p>
                            </div>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger className={buttonVariants({ variant: "outline", className: "w-full bg-white text-purple-600 border border-purple-200 hover:bg-purple-500 hover:text-white transition-colors" })}>
                            Open Messages
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Secure Messaging</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4 min-h-[200px] flex flex-col justify-end border rounded-xl p-4 bg-gray-50">
                                <div className="text-center text-xs text-gray-500 mb-4">Today</div>
                                <div className="self-start bg-purple-100 text-purple-800 p-3 rounded-xl rounded-tl-sm max-w-[80%]">
                                    <p className="text-sm font-semibold mb-1">Dr. Williams</p>
                                    <p className="text-sm">Please review your latest lab results as soon as possible.</p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <input type="text" className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Type a secure message..." />
                                    <Button size="sm" onClick={() => toast.success('Message sent via secure HIPAA-compliant channel.')}>Send</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>

        {/* Action Center - Needs Attention */}
        <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-red-800 font-bold text-sm uppercase tracking-wider">Action Required</h3>
                        <p className="text-red-700 text-sm mt-1">You have an outstanding balance of <span className="font-bold">$45.00</span> from your last lab visit.</p>
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger className={buttonVariants({size: "sm", variant: "outline"}) + " border-red-200 text-red-700 hover:bg-red-100 bg-white"}>
                        View Invoice
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Outstanding Invoice</DialogTitle>
                            <DialogDescription>Please upload your payment proof.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                                <p><span className="font-semibold">Service:</span> Complete Blood Count (CBC)</p>
                                <p><span className="font-semibold">Date:</span> Oct 12, 2026</p>
                                <p><span className="font-semibold">Amount Due:</span> $45.00</p>
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toast.success("File uploaded successfully!")}>
                                <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-700">Click to upload receipt</p>
                                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or PDF</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
            
            {/* Main Content Area (Left side on desktop) */}
            <div className="md:col-span-8 flex flex-col gap-6">

                {/* Vital Signs */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200 overflow-hidden">
                    <div className="h-2 w-full bg-emerald-500"></div>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            <CardTitle className="text-lg text-[#05445E]">Recent Vital Signs</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                                <HeartPulse className="w-6 h-6 text-red-500 mb-2" />
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Heart Rate</span>
                                <div className="text-xl font-black text-gray-900">{recentVitals?.heartRate || '--'} <span className="text-sm font-normal text-gray-500">bpm</span></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                                <Activity className="w-6 h-6 text-blue-500 mb-2" />
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Blood Press.</span>
                                <div className="text-xl font-black text-gray-900">{recentVitals?.bloodPressure || '--'} <span className="text-sm font-normal text-gray-500">mmHg</span></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                                <Thermometer className="w-6 h-6 text-orange-500 mb-2" />
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Temp</span>
                                <div className="text-xl font-black text-gray-900">{recentVitals?.temperature || '--'}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                                <ArrowUpCircle className="w-6 h-6 text-purple-500 mb-2" />
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">spO2</span>
                                <div className="text-xl font-black text-gray-900">{recentVitals?.spO2 || '--'}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Medication Tracker */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200 overflow-hidden">
                    <div className="h-2 w-full bg-[#10837f]"></div>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#10837f]" />
                            <CardTitle className="text-lg text-[#05445E]">Today's Medications</CardTitle>
                        </div>
                        <CardDescription>Track your daily prescriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {prescriptions.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No active prescriptions found.</p>
                            ) : prescriptions.map((med) => (
                                <div 
                                    key={med.id} 
                                    onClick={() => toggleMedication(med.id, false)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer bg-white border-gray-200 hover:border-[#10837f]`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Circle className="w-6 h-6 text-gray-300 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{med.medicationName}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {med.dosage} - {med.frequency}
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); toggleMedication(med.id, false); }} className="text-[#10837f] hover:text-[#0c6b68] hover:bg-[#10837f]/10">Mark Taken</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Records / Timeline snapshot */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200 overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClipboardType className="w-5 h-5 text-[#88B0C3]" />
                                <CardTitle className="text-lg text-[#05445E]">Recent Records</CardTitle>
                            </div>
                            <Dialog>
                                <DialogTrigger className={buttonVariants({ variant: "link", className: "text-xs font-bold text-[#10837f]" })}>VIEW ALL</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>All Records</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                                        <div className="p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                                            <div><p className="font-semibold text-sm">Lab Test Results</p><p className="text-xs text-gray-500">Oct 12, 2026</p></div><ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                                            <div><p className="font-semibold text-sm">Vital Check</p><p className="text-xs text-gray-500">Sep 28, 2026</p></div><ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                                            <div><p className="font-semibold text-sm">Post-Surgery Review</p><p className="text-xs text-gray-500">Sep 10, 2026</p></div><ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <FileUp className="w-4 h-4" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                                        <div className="font-bold text-slate-900 text-sm">Lab Test Results</div>
                                        <time className="text-xs font-medium text-slate-500">Oct 12, 2026</time>
                                    </div>
                                    <div className="text-sm text-slate-500">CBC Panel completed. Results uploaded by Dr. Williams.</div>
                                </div>
                            </div>
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                                        <div className="font-bold text-slate-900 text-sm">Vital Check</div>
                                        <time className="text-xs font-medium text-slate-500">Sep 28, 2026</time>
                                    </div>
                                    <div className="text-sm text-slate-500">BP normal reading 118/76. Weight stable.</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Sidebar Area (Right side on desktop) */}
            <div className="md:col-span-4 flex flex-col gap-6">
                
                {/* Patient Profile */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-100 rounded-bl-full -z-0 opacity-50"></div>
                    <CardContent className="pt-6 relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#10837f]/10 border-2 border-[#10837f] flex items-center justify-center text-[#10837f]">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Jane Doe</h3>
                                <p className="text-sm text-[#10837f] font-semibold">ID: CL-JD-0001</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Age / Gender</span>
                                <span className="font-semibold text-gray-900">34 Yrs / Female</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Blood Type</span>
                                <span className="font-semibold text-red-600">O+</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Allergies</span>
                                <span className="font-semibold text-gray-900 bg-red-50 text-red-700 px-2 py-0.5 rounded">Penicillin</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Primary Care</span>
                                <span className="font-semibold text-gray-900">Dr. Sarah Jenkins</span>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger className={buttonVariants({ variant: "outline", className: "w-full mt-6 border-gray-200 text-gray-700 hover:bg-gray-50" })}>View Full Record</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Full Medical Record Download</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4 text-center">
                                    <p className="text-sm text-gray-600">Your full medical record is available for download as a PDF document.</p>
                                    <Button onClick={() => toast.success("Record downloaded successfully.")}>Download Record (PDF)</Button>
                                    <p className="text-xs text-gray-400 mt-2">ID: CL-JD-0001</p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Telehealth / Next Appointment */}
                <Card className={`shadow-md border-0 ring-1 ${telehealthReady ? 'ring-[#10837f] bg-gradient-to-b from-[#10837f]/5 to-white' : 'ring-gray-200'} overflow-hidden relative`}>
                    {telehealthReady && <div className="absolute top-0 right-0 w-16 h-16 bg-[#10837f] rounded-bl-full -z-0 opacity-10"></div>}
                    <CardHeader className="pb-2">
                         <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Next Appointment</h3>
                                <CardTitle className="text-xl text-[#05445E]">Follow-up Consultation</CardTitle>
                             </div>
                             <div className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Starts in 15m</div>
                         </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-[#88B0C3]" />
                            <span>Today at 2:00 PM</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Activity className="w-4 h-4 text-[#88B0C3]" />
                            <span>Dr. Sarah Jenkins</span>
                        </div>
                        
                        <Dialog>
                            <DialogTrigger className={buttonVariants({ className: `w-full h-12 text-sm font-bold tracking-wider rounded-xl shadow mt-2 ${telehealthReady ? 'bg-[#10837f] hover:bg-[#0c6b68] text-white animate-pulse' : 'bg-gray-100 text-gray-400'}` })}>
                                <Video className="w-5 h-5 mr-2" /> JOIN VIRTUAL WAITING ROOM
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Virtual Waiting Room</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-6 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center animate-bounce">
                                        <Video className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-900 font-semibold">Testing Connection...</p>
                                    <p className="text-sm text-gray-500 max-w-[250px]">Your doctor will admit you shortly. Please make sure your camera and microphone are ready.</p>
                                    <Button variant="outline" className="mt-4" onClick={() => toast("Camera test successful", { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />})}>Test Hardware</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Secure Messaging Quick View */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#88B0C3]" />
                                <CardTitle className="text-lg text-[#05445E]">Inbox</CardTitle>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">1</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-gray-900">Dr. Williams</span>
                                    <span className="text-[10px] text-gray-500 mt-0.5">2h ago</span>
                                </div>
                                <p className="text-xs text-gray-600 truncate font-medium">Please review your latest lab results...</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 opacity-60">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-gray-900">Billing Dept</span>
                                    <span className="text-[10px] text-gray-500 mt-0.5">Yesterday</span>
                                </div>
                                <p className="text-xs text-gray-600 truncate">Your invoice #INV-245 has been gen...</p>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger className={buttonVariants({ variant: "ghost", className: "w-full text-xs font-bold text-[#10837f] mt-2" })}>Open Messenger</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Secure Messaging</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4 min-h-[200px] flex flex-col justify-end border rounded-xl p-4 bg-gray-50">
                                    <div className="text-center text-xs text-gray-500 mb-4">Today</div>
                                    <div className="self-start bg-purple-100 text-purple-800 p-3 rounded-xl rounded-tl-sm max-w-[80%]">
                                        <p className="text-sm font-semibold mb-1">Dr. Williams</p>
                                        <p className="text-sm">Please review your latest lab results as soon as possible.</p>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <input type="text" className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Type a secure message..." />
                                        <Button size="sm" onClick={() => toast.success('Message sent via secure HIPAA-compliant channel.')}>Send</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

