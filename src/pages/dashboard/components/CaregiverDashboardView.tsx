import { useAuth } from '@/components/auth/AuthProvider';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AIInvestigatorTextarea } from './AIInvestigatorTextarea';
import { SecurePatientChat } from './SecurePatientChat';
import { MapPin, Clock, Stethoscope, Table2, FileText, Pill, Users, ArrowLeft, Activity, Droplets, User, Calendar, Plus, History, Camera, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, serverTimestamp, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
// import { useSession } from 'next-auth/react';

export function CaregiverDashboardView() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Profile State
  const [profile, setProfile] = useState<any>({
    isComplete: false,
  });

  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const profSnap = await getDoc(doc(db, `users/${user.uid}/public/profile`));
      if (profSnap.exists()) {
        const d = profSnap.data();
        setProfile({
            ...d,
            fullName: d.firstName && d.lastName ? `${d.firstName} ${d.lastName}` : d.fullName || '',
            isComplete: !!d.firstName && !!d.lastName,
            email: user.email,
            staffId: `HSP-CG-${user.uid.substring(0, 4).toUpperCase()}`,
            department: 'Home Care Division',
            status: 'On Shift',
            age: d.age || '',
            photoUrl: d.photoUrl || ''
        });
      }
    };
    
    // Fetch patients
    const fetchPatients = async () => {
       try {
           const patSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'patient')));
           const pats: any[] = [];
           for (const p of patSnap.docs) {
               const pData = p.data();
               const medSnap = await getDoc(doc(db, `patients/${p.id}`));
               pats.push({
                   id: p.id,
                   name: `${pData.firstName} ${pData.lastName}`,
                   age: pData.age || 72,
                   condition: medSnap.exists() ? (medSnap.data().conditions?.[0] || 'Under Care') : 'Under Care',
                   location: medSnap.exists() ? medSnap.data().address : 'Unknown Location',
                   dob: medSnap.exists() ? medSnap.data().dateOfBirth : 'Unknown',
                   gender: medSnap.exists() ? medSnap.data().gender : 'Unknown',
                   status: 'Active',
                   ward: 'Home Visit'
               });
           }
           setPatients(pats);
       } catch (err: any) {
           console.log("Error fetching patients", err);
       } finally {
           setLoading(false);
       }
    };

    fetchProfile().then(fetchPatients);
  }, []);

  const calculateProgress = () => {
    let completed = 0;
    const requiredFields = ['fullName', 'email', 'age'];
    requiredFields.forEach(field => {
      if (profile[field as keyof typeof profile]) completed++;
    });
    return Math.round((completed / requiredFields.length) * 100);
  };

  const progress = calculateProgress();

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (progress === 100) {
      try {
        const names = profile.fullName.split(' ');
        await setDoc(doc(db, `users/${user.uid}/public/profile`), {
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || '',
            age: profile.age,
            photoUrl: profile.photoUrl || '',
        }, { merge: true });
        
        setProfile({ ...profile, isComplete: true });
        setEditMode(false);
        toast.success("Profile saved successfully.");
      } catch (err: any) {
          toast.error("Failed to save profile: " + err.message);
      }
    } else {
       toast.error("Please complete all required fields (Full Name, Age) to proceed.");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile({ ...profile, photoUrl: url });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Caregiver Dashboard...</div>;

  if (!profile.isComplete || editMode) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0e4e5e] mb-2">
                {editMode ? 'Update Caregiver Profile' : 'Complete Your Caregiver Profile'}
            </h2>
            <p className="text-gray-600">
                {editMode ? 'Update your biodata details.' : 'Per hospital policy, all caregiving staff must verify their biodata before accessing patient records.'}
            </p>
        </div>

        <Card className="border-0 shadow-md ring-1 ring-gray-100 overflow-hidden">
            <div className="h-2 bg-gray-100 w-full">
                <div 
                    className="h-full transition-all duration-500" 
                    style={{ 
                        width: `${progress}%`,
                        backgroundColor: progress === 100 ? '#10837f' : '#d8a846'
                    }} 
                />
            </div>
            <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        {progress === 100 ? (
                            <CheckCircle2 className="w-6 h-6 text-[#10837f]" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-[#d8a846]" />
                        )}
                        <span className="font-semibold text-gray-700">Profile Completion: {progress}%</span>
                    </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center relative">
                                {profile.photoUrl ? (
                                    <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-gray-300" />
                                )}
                                <div 
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Upload Passport Photo</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Full Name</Label>
                            <Input 
                                value={profile.fullName}
                                onChange={e => setProfile({...profile, fullName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Email Address (Read-only)</Label>
                            <Input 
                                type="email"
                                value={profile.email}
                                disabled
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Age</Label>
                            <Input 
                                type="number"
                                value={profile.age}
                                onChange={e => setProfile({...profile, age: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number (Optional)</Label>
                            <Input 
                                value={profile.phone}
                                onChange={e => setProfile({...profile, phone: e.target.value})}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>Staff ID</Label>
                            <Input value={profile.staffId} disabled className="bg-gray-50" />
                        </div>
                         <div className="space-y-2">
                            <Label>Department</Label>
                            <Input value={profile.department} disabled className="bg-gray-50" />
                        </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end gap-4 mt-8">
                        {editMode && profile.isComplete && (
                            <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                        )}
                        <Button type="submit" className="bg-[#10837f] hover:bg-[#0c6b68] px-8" disabled={progress !== 100}>
                            {editMode ? 'Save Changes' : 'Complete Profile & Continue'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
      </div>
    );
  }

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  if (selectedPatient) {
    return <PatientFileView patient={selectedPatient} onBack={() => setSelectedPatientId(null)} caregiver={profile} userId={user?.id} />;
  }

  return (
    <div className="space-y-8">
      {/* Profile Summary Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="flex items-center gap-6">
                 {/* Profile Photo */}
                 <div className="w-20 h-20 rounded-full border-2 border-gray-100 overflow-hidden shrink-0">
                     {profile.photoUrl ? (
                         <img src={profile.photoUrl} alt="Caregiver Profile" className="w-full h-full object-cover" />
                     ) : (
                         <div className="w-full h-full bg-gray-100 flex items-center justify-center"><User className="text-gray-400 w-8 h-8"/></div>
                     )}
                 </div>
                 
                 <div>
                     <div className="flex items-center gap-3 mb-1">
                         <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
                         <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                             {profile.status}
                         </div>
                     </div>
                     <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><strong className="text-gray-900">ID:</strong> {profile.staffId}</span>
                        <span className="flex items-center gap-1"><strong className="text-gray-900">Email:</strong> {profile.email}</span>
                        <span className="flex items-center gap-1"><strong className="text-gray-900">Age:</strong> {profile.age} yrs</span>
                        <span className="flex items-center gap-1"><strong className="text-gray-900">Dept:</strong> {profile.department}</span>
                     </div>
                 </div>
             </div>
             
             <Button variant="outline" className="border-[#10837f] text-[#10837f] hover:bg-emerald-50 shrink-0" onClick={() => setEditMode(true)}>
                 Edit Profile
             </Button>
         </div>
      </div>

      {/* Assigned Patients Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <span>My Assigned Patients</span>
            <span className="bg-[#10837f]/10 text-[#10837f] px-3 py-1 rounded-full text-sm">{patients.length} Patients Active</span>
        </h3>
        
        {patients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
                No patients found in the system.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map(patient => (
                    <Card key={patient.id} className="border-0 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-all hover:border-[#10837f]/30 cursor-pointer bg-white group" onClick={() => setSelectedPatientId(patient.id)}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-[#10837f]/5 p-3 rounded-full group-hover:bg-[#10837f] group-hover:text-white transition-colors text-[#10837f]">
                                    <Users className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wide">
                                    {patient.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{patient.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 font-mono">ID: CL-{patient.id.substring(0,4)}</p>
                            
                            <div className="space-y-2 text-sm text-gray-600 mb-6 border-t border-gray-50 pt-4">
                                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {patient.location}</p>
                                <p className="flex items-center gap-2"><Activity className="w-4 h-4 text-gray-400" /> {patient.condition}</p>
                            </div>
                            <Button 
                                className="w-full bg-[#10837f]/10 text-[#10837f] border border-[#10837f]/20 hover:bg-[#10837f] hover:text-white transition-colors shadow-sm"
                                onClick={() => setSelectedPatientId(patient.id)}
                            >
                                Open Record
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

function PatientFileView({ patient, onBack, caregiver, userId }: { patient: any, onBack: () => void, caregiver: any, userId?: string }) {
    // Live Historical Data State
    const [vitalsLog, setVitalsLog] = useState<any[]>([]);
    const [ioLog, setIoLog] = useState<any[]>([]);
    const [notesLog, setNotesLog] = useState<any[]>([]);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);

    useEffect(() => {
       if (!userId) return;
       
       // Real-time listener for vitals
       const vUnsub = onSnapshot(query(collection(db, 'vitalSigns'), where('patientId', '==', patient.id)), (snap) => {
           const v: any[] = [];
           snap.forEach(d => {
               const dta = d.data();
               v.push({
                   ...dta,
                   time: dta.createdAt?.toDate?.()?.toLocaleString() || new Date().toLocaleString()
               });
           });
           v.sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());
           setVitalsLog(v);
       }, (error) => {
           console.error("Error fetching vitals:", error);
       });

       const nUnsub = onSnapshot(query(collection(db, 'caregiverLogs'), where('patientId', '==', patient.id)), (snap) => {
           const v: any[] = [];
           snap.forEach(d => {
               const dta = d.data();
               v.push({
                   ...dta,
                   time: dta.createdAt?.toDate?.()?.toLocaleString() || new Date().toLocaleString(),
                   text: dta.notes || ''
               });
           });
           v.sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());
           setNotesLog(v);
       }, (error) => {
           console.error("Error fetching caregiver logs:", error);
       });

       const ioUnsub = onSnapshot(query(collection(db, 'clinicalNotes'), where('patientId', '==', patient.id)), (snap) => {
           const io: any[] = [];
           snap.forEach(d => {
               const dta = d.data();
               if (dta.noteType === 'intake_output' && dta.intakeOutputDetails) {
                   try {
                       const parsed = JSON.parse(dta.intakeOutputDetails);
                       io.push({
                           ...parsed,
                           time: dta.createdAt?.toDate?.()?.toLocaleString() || new Date().toLocaleString()
                       });
                   } catch (e) {}
               }
           });
           io.sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());
           setIoLog(io);
       }, (error) => {
           console.error("Error fetching clinical notes logs:", error);
       });

       const rxUnsub = onSnapshot(query(collection(db, 'prescriptions'), where('patientId', '==', patient.id)), (snap) => {
           const v: any[] = [];
           snap.forEach(d => {
               v.push({ id: d.id, ...d.data() });
           });
           setPrescriptions(v);
       }, (error) => {
           console.error("Error fetching prescriptions:", error);
       });

       return () => { vUnsub(); nUnsub(); ioUnsub(); rxUnsub(); };
    }, [patient.id]);

    const calculateDailyIO = () => ioLog.reduce((acc, curr) => acc + curr.vol, 0);

    // Form inputs
    const [vitalsForm, setVitalsForm] = useState({ temp: '', tempUnit: 'C', bp: '', hr: '', rr: '', bg: '', spo2: '' });
    const [noteText, setNoteText] = useState('');
    const [feeding, setFeeding] = useState('independent');
    const [bathing, setBathing] = useState('independent');
    const [mobility, setMobility] = useState('independent');

    const [ioIntakeType, setIoIntakeType] = useState('Oral (Water, Juice, Soup)');
    const [ioIntakeVol, setIoIntakeVol] = useState('');
    const [ioOutputType, setIoOutputType] = useState('Urine (Voided)');
    const [ioOutputVol, setIoOutputVol] = useState('');

    const saveIO = async (isOutput: boolean) => {
        try {
            const vol = isOutput ? -Number(ioOutputVol) : Number(ioIntakeVol);
            if(Number.isNaN(vol) || vol === 0) {
                toast.error("Please enter a valid volume.");
                return;
            }
            await addDoc(collection(db, 'clinicalNotes'), {
                patientId: patient.id,
                authorId: userId,
                noteType: 'intake_output',
                intakeOutputDetails: JSON.stringify({
                    type: isOutput ? ioOutputType : ioIntakeType,
                    vol: vol,
                    isOutput
                }),
                createdAt: serverTimestamp()
            });
            toast.success(`Fluid ${isOutput ? 'output' : 'intake'} recorded successfully!`);
            if (isOutput) {
                setIoOutputVol('');
            } else {
                setIoIntakeVol('');
            }
        } catch(err: any) {
            toast.error("Failed to save IO: " + err.message);
        }
    };

    const saveVitals = async () => {
       try {
           await addDoc(collection(db, 'vitalSigns'), {
               patientId: patient.id,
               clinicianId: userId,
               temperature: vitalsForm.temp,
               bloodPressure: vitalsForm.bp,
               heartRate: vitalsForm.hr,
               respiratoryRate: vitalsForm.rr,
               bloodGlucose: vitalsForm.bg,
               spO2: vitalsForm.spo2,
               createdAt: serverTimestamp()
           });
           toast.success("Vitals saved successfully!");
           setVitalsForm({ temp: '', tempUnit: 'C', bp: '', hr: '', rr: '', bg: '', spo2: '' });
       } catch (err: any) {
           toast.error("Failed to save vitals: " + err.message);
       }
    };

    const saveNote = async () => {
       try {
           if (!noteText.trim()) {
               toast.error("Please insert a note.");
               return;
           }
           await addDoc(collection(db, 'caregiverLogs'), {
               patientId: patient.id,
               caregiverId: userId,
               notes: noteText,
               feeding,
               bathing,
               mobility,
               createdAt: serverTimestamp()
           });
           toast.success("Caregiver note saved successfully!");
           setNoteText('');
           setFeeding('independent');
           setBathing('independent');
           setMobility('independent');
       } catch (err: any) {
           toast.error("Failed to save note: " + err.message);
       }
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-900 bg-white shadow-sm border border-gray-100" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
            </div>

            {/* A. Patient Header Section */}
            <Card className="border-0 shadow-sm ring-1 ring-[#10837f]/30 bg-gradient-to-r from-[#f8fcfc] to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 border-b border-l bg-white rounded-bl-xl border-gray-100 shadow-sm text-xs text-gray-500 flex items-center gap-2">
                    <User className="w-3 h-3" /> Assigned Caregiver: <strong className="text-[#10837f]">{caregiver.fullName}</strong>
                </div>
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-[#0e4e5e]">{patient.name}</h2>
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">{patient.status}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-8 text-sm text-gray-600 mt-4">
                                <span className="flex items-center gap-2"><strong className="text-gray-900 font-medium w-16">ID:</strong> CL-{patient.id.substring(0,4)}</span>
                                <span className="flex items-center gap-2"><strong className="text-gray-900 font-medium w-16">DOB:</strong> {patient.dob} ({patient.age}y)</span>
                                <span className="flex items-center gap-2"><strong className="text-gray-900 font-medium w-16">Gender:</strong> {patient.gender}</span>
                                <span className="flex items-center gap-2"><strong className="text-gray-900 font-medium w-16">Ward:</strong> {patient.ward}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* B. Clinical Modules (Tabbed Layout) WITHOUT Care Plan */}
            <Tabs defaultValue="vitals" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto md:h-14 bg-white border shadow-sm rounded-xl p-1 gap-1 mb-6 text-sm font-medium">
                    <TabsTrigger value="vitals" className="rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Vital Signs</TabsTrigger>
                    <TabsTrigger value="meds" className="rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Drug Chart</TabsTrigger>
                    <TabsTrigger value="io" className="rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Intake / Output</TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Caregiver Report</TabsTrigger>
                    <TabsTrigger value="chat" className="rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Chat</TabsTrigger>
                </TabsList>

                {/* 1. Vital Signs Module */}
                <TabsContent value="vitals">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="border-0 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
                            <CardHeader className="bg-gray-50/50 border-b pb-4">
                                <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-[#10837f]" /> New Vitals Entry</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Temperature</Label>
                                        <div className="flex gap-2">
                                           <Input type="number" step="0.1" placeholder="e.g. 36.5" value={vitalsForm.temp} onChange={e => setVitalsForm({...vitalsForm, temp: e.target.value})} className="flex-1" />
                                           <select className="bg-white border text-sm rounded px-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#10837f]" value={vitalsForm.tempUnit} onChange={e => setVitalsForm({...vitalsForm, tempUnit: e.target.value})}>
                                              <option value="C">°C</option>
                                              <option value="F">°F</option>
                                           </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Blood Pressure (mmHg)</Label>
                                        <Input list="common-bps" placeholder="e.g. 120/80" value={vitalsForm.bp} onChange={e => setVitalsForm({...vitalsForm, bp: e.target.value})} />
                                        <datalist id="common-bps">
                                            <option value="110/70" />
                                            <option value="120/80" />
                                            <option value="130/80" />
                                            <option value="140/90" />
                                        </datalist>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Pulse Rate (bpm)</Label>
                                        <Input type="number" placeholder="e.g. 72" value={vitalsForm.hr} onChange={e => setVitalsForm({...vitalsForm, hr: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Respiratory Rate (cpm)</Label>
                                        <Input type="number" placeholder="e.g. 16" value={vitalsForm.rr} onChange={e => setVitalsForm({...vitalsForm, rr: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Blood Glucose (mg/dL)</Label>
                                        <div className="flex gap-2">
                                            <Input type="number" placeholder="e.g. 90" value={vitalsForm.bg} onChange={e => setVitalsForm({...vitalsForm, bg: e.target.value})} className="flex-1" />
                                        </div>
                                    </div>
                                      <div className="space-y-2">
                                        <Label>SpO2 (%) - Optional</Label>
                                        <Input type="number" placeholder="e.g. 98" value={vitalsForm.spo2} onChange={e => setVitalsForm({...vitalsForm, spo2: e.target.value})} />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <Button className="bg-[#10837f] hover:bg-[#0c6b68]" onClick={saveVitals}><Plus className="w-4 h-4 mr-2"/> Save Vitals</Button>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-0 shadow-sm ring-1 ring-gray-100 max-h-[500px] flex flex-col">
                            <CardHeader className="bg-gray-50/50 border-b pb-4 shrink-0">
                                <CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5 text-gray-500" /> Vitals History</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 overflow-y-auto overflow-x-auto p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Time</th>
                                            <th className="px-4 py-3">BP</th>
                                            <th className="px-4 py-3">HR</th>
                                            <th className="px-4 py-3">Temp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {vitalsLog.map((log: any, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium whitespace-nowrap">{log.time}</td>
                                                <td className="px-4 py-3">{log.bloodPressure || '-'}</td>
                                                <td className="px-4 py-3">{log.heartRate || '-'}</td>
                                                <td className="px-4 py-3">{log.temperature || '-'}</td>
                                            </tr>
                                        ))}
                                        {vitalsLog.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No vitals recorded yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 3. Drug Chart Module */}
                <TabsContent value="meds">
                    <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                        <CardHeader className="bg-gray-50/50 border-b pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Pill className="w-5 h-5 text-[#d8a846]" /> Medication Record System
                            </CardTitle>
                            <CardDescription>Structured MAR (Medication Administration Record) based on active prescriptions.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 p-0 md:p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-xs uppercase tracking-wider text-gray-600">
                                            <th className="p-3 border-b border-t font-semibold">Drug Name</th>
                                            <th className="p-3 border-b border-t font-semibold">Dosage</th>
                                            <th className="p-3 border-b border-t font-semibold">Route</th>
                                            <th className="p-3 border-b border-t font-semibold">Frequency</th>
                                            <th className="p-3 border-b border-t font-semibold">Date prescribed</th>
                                            <th className="p-3 border-b border-t font-semibold text-center bg-gray-50">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {prescriptions.map(rx => (
                                            <tr key={rx.id} className="border-b hover:bg-gray-50/30 transition-colors">
                                                <td className="p-3 font-semibold text-gray-900">{rx.medicationName}</td>
                                                <td className="p-3">{rx.dosage}</td>
                                                <td className="p-3">{rx.route}</td>
                                                <td className="p-3"><span className="text-[#10837f] bg-[#10837f]/10 font-bold px-1.5 py-0.5 rounded uppercase">{rx.frequency}</span></td>
                                                <td className="p-3 text-xs">{rx.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</td>
                                                <td className="p-3 text-center border-l bg-emerald-50/10">
                                                    <Button size="sm" className="bg-[#10837f] hover:bg-[#0c6b68]" onClick={async () => {
                                                        try {
                                                            await addDoc(collection(db, 'medicationsAdministered'), {
                                                                patientId: patient.id,
                                                                nurseId: userId,
                                                                prescriptionId: rx.id,
                                                                remarks: `${rx.medicationName} ${rx.dosage} administered`,
                                                                administeredAt: serverTimestamp()
                                                            });
                                                            toast.success('Drug administration recorded');
                                                        } catch (err: any) {
                                                            toast.error(err.message);
                                                        }
                                                    }}>Administer</Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {prescriptions.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No active prescriptions.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. Intake & Output Module (Skipped Backend Integration for Brevity here, but structure remains) */}
                <TabsContent value="io">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                            <CardHeader className="bg-gray-50/50 border-b pb-4">
                                <CardTitle className="text-lg flex items-center gap-2"><Droplets className="w-5 h-5 text-blue-500" /> Record Fluid Balance</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Tabs defaultValue="intake" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="intake">Add Intake</TabsTrigger>
                                        <TabsTrigger value="output">Add Output</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="intake" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Intake Type</Label>
                                            <select value={ioIntakeType} onChange={(e) => setIoIntakeType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10837f] focus-visible:ring-offset-2">
                                                <option>Oral (Water, Juice, Soup)</option>
                                                <option>Intravenous (IV Fluids)</option>
                                                <option>Enteral Feeding (NG Tube)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Volume (mL)</Label>
                                            <Input type="number" placeholder="Enter amount in mL" value={ioIntakeVol} onChange={(e) => setIoIntakeVol(e.target.value)} />
                                        </div>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => saveIO(false)}>Record Intake</Button>
                                    </TabsContent>
                                    <TabsContent value="output" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Output Type</Label>
                                            <select value={ioOutputType} onChange={(e) => setIoOutputType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10837f] focus-visible:ring-offset-2">
                                                <option>Urine (Voided)</option>
                                                <option>Urine (Catheter)</option>
                                                <option>Emesis (Vomit)</option>
                                                <option>Drainage / Wound</option>
                                                <option>Liquid Bowel Movement</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Volume (mL)</Label>
                                            <Input type="number" placeholder="Enter amount in mL (use estimate if needed)" value={ioOutputVol} onChange={(e) => setIoOutputVol(e.target.value)} />
                                        </div>
                                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={() => saveIO(true)}>Record Output</Button>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                       </Card>

                       <Card className="border-0 shadow-sm ring-1 ring-gray-100 flex flex-col">
                            <CardHeader className="bg-gray-50/50 border-b pb-4 shrink-0 flex flex-row justify-between items-center">
                                <CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5 text-gray-500" /> Daily I/O Log</CardTitle>
                                <span className={`font-bold px-3 py-1 rounded text-sm ${calculateDailyIO() >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    Total: {calculateDailyIO() > 0 ? '+' : ''}{calculateDailyIO()} mL
                                </span>
                            </CardHeader>
                            <CardContent className="pt-0 p-0 overflow-y-auto flex-1">
                                <div className="divide-y relative">
                                    {ioLog.map((log: any, i) => (
                                        <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm text-gray-900">{log.type}</span>
                                                <span className="text-xs text-gray-500">{log.time}</span>
                                            </div>
                                            <span className={`font-mono font-medium ${log.vol > 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                                {log.vol > 0 ? '+' : ''}{log.vol} mL
                                            </span>
                                        </div>
                                    ))}
                                    {ioLog.length === 0 && <div className="p-8 text-center text-gray-500">No I/O records found.</div>}
                                </div>
                            </CardContent>
                       </Card>
                    </div>
                </TabsContent>

                {/* 5. Caregiver Report Module */}
                <TabsContent value="notes">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                            <CardHeader className="bg-[#f8fcfc] border-b border-[#10837f]/10 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-[#0e4e5e]"><FileText className="w-5 h-5" /> New Progress Note</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[#10837f]/10">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Feeding</Label>
                                            <select value={feeding} onChange={(e) => setFeeding(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10837f] focus-visible:ring-offset-2">
                                                <option value="independent">Independent</option>
                                                <option value="needs_assistance">Needs Assistance</option>
                                                <option value="dependent">Dependent</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bathing</Label>
                                            <select value={bathing} onChange={(e) => setBathing(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10837f] focus-visible:ring-offset-2">
                                                <option value="independent">Independent</option>
                                                <option value="needs_assistance">Needs Assistance</option>
                                                <option value="dependent">Dependent</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mobility</Label>
                                            <select value={mobility} onChange={(e) => setMobility(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10837f] focus-visible:ring-offset-2">
                                                <option value="independent">Independent</option>
                                                <option value="needs_assistance">Needs Assistance</option>
                                                <option value="dependent">Dependent</option>
                                            </select>
                                        </div>
                                    </div>
                                    <AIInvestigatorTextarea 
                                        className="min-h-[200px] p-4 text-sm leading-relaxed border-gray-200 focus-visible:ring-[#10837f] shadow-inner bg-gray-50/50" 
                                        placeholder="Document chronologically: Assessment, interventions performed, patient response, and any significant events during shift..."
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        staffName={caregiver?.fullName || caregiver?.firstName || "Caregiver"}
                                        role="Caregiver"
                                    />
                                    
                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Next Appointment / Reassessment Date</Label>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-emerald-600" />
                                                <Input type="date" className="h-9 text-sm font-medium focus-visible:ring-[#10837f]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" /> {new Date().toLocaleDateString()}
                                        </div>
                                        <Button className="bg-[#10837f] hover:bg-[#0c6b68]" onClick={saveNote}>Sign & Save Note</Button>
                                    </div>
                                </div>
                            </CardContent>
                       </Card>

                       <Card className="border-0 shadow-sm ring-1 ring-gray-100 max-h-[600px] flex flex-col">
                            <CardHeader className="bg-gray-50/50 border-b pb-4 shrink-0">
                                <CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5 text-gray-500" /> Caregiver Record History</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 overflow-y-auto">
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {notesLog.map((log: any, i) => (
                                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-[#10837f] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-3 md:left-1/2" />
                                            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-10 md:ml-0 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-[#0e4e5e] text-sm">{caregiver.fullName}</span>
                                                    <time className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">{log.time}</time>
                                                </div>
                                                <div className="mb-2 flex gap-2 flex-wrap text-[10px] uppercase font-bold tracking-wider text-[#10837f] opacity-80">
                                                    <span className="bg-[#10837f]/10 pb-0.5 pt-1 px-2 rounded">Feed: {log.feeding || 'independent'}</span>
                                                    <span className="bg-[#10837f]/10 pb-0.5 pt-1 px-2 rounded">Bath: {log.bathing || 'independent'}</span>
                                                    <span className="bg-[#10837f]/10 pb-0.5 pt-1 px-2 rounded">Mob: {log.mobility || 'independent'}</span>
                                                </div>
                                                <div className="text-sm text-gray-600 leading-relaxed">{log.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {notesLog.length === 0 && <div className="text-center py-8 text-gray-500">No notes recorded yet.</div>}
                                </div>
                            </CardContent>
                       </Card>
                   </div>
                </TabsContent>

                <TabsContent value="chat">
                    <SecurePatientChat patientId={patient.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
