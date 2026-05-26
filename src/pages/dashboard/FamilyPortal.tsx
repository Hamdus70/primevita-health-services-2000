import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Activity, Clock, LogOut, MapPin, CheckCircle2, User, HeartPulse, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface TimelineEvent {
  id: string;
  type: string;
  time: Date;
  title: string;
  desc: string;
  icon: any;
  color: string;
  img?: string;
}

export function FamilyPortal() {
  const navigate = useNavigate();
  // const { data: session, status } = useSession();
  const session = { user: { id: 'demo-user' } };
  const status = 'authenticated';
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [patientMedical, setPatientMedical] = useState<any>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  const [timelineVitals, setTimelineVitals] = useState<TimelineEvent[]>([]);
  const [timelineVisits, setTimelineVisits] = useState<TimelineEvent[]>([]);
  const [timelineMeds, setTimelineMeds] = useState<TimelineEvent[]>([]);
  const [timelineLogs, setTimelineLogs] = useState<TimelineEvent[]>([]);

  useEffect(() => {
     const allEvents = [...timelineVitals, ...timelineVisits, ...timelineMeds, ...timelineLogs];
     allEvents.sort((a, b) => b.time.getTime() - a.time.getTime());
     setTimeline(allEvents);
  }, [timelineVitals, timelineVisits, timelineMeds, timelineLogs]);

  const unsubsRef = React.useRef<(() => void)[]>([]);

  useEffect(() => {
    if (session?.user) {
        fetchProfileAndSetupListeners(session.user.id);
    } else {
        navigate('/auth/login');
    }
    return () => {
        unsubsRef.current.forEach(u => u());
    };
  }, [session, status, navigate]);

  const fetchProfileAndSetupListeners = async (uid: string) => {
    try {
      setLoading(true);
      const profRef = doc(db, `users/${uid}/public/profile`);
      const profSnap = await getDoc(profRef);
      if (!profSnap.exists()) return;
      const profData = profSnap.data();
      setProfile(profData);

      const linkedPatientId = profData.linkedPatientId;
      if (!linkedPatientId) {
          setLoading(false);
          return;
      }

      const patProfSnap = await getDoc(doc(db, `users/${linkedPatientId}/public/profile`));
      if (patProfSnap.exists()) setPatientProfile(patProfSnap.data());

      const patMedSnap = await getDoc(doc(db, `patients/${linkedPatientId}`));
      if (patMedSnap.exists()) setPatientMedical(patMedSnap.data());

      // 3. Setup real-time listeners
      unsubsRef.current.forEach(u => u()); // Clean up old listeners
      unsubsRef.current = [];

      const visitsQ = query(collection(db, 'visits'), where('patientId', '==', linkedPatientId));
      unsubsRef.current.push(onSnapshot(visitsQ, (snap) => {
          const evs: TimelineEvent[] = [];
          snap.forEach(d => {
              const v = d.data();
              if (v.clockInTime) {
                 const dt = v.clockInTime?.toDate?.() || new Date(v.clockInTime);
                 evs.push({ id: `in-${d.id}`, type: 'visit_in', time: dt, title: 'Nurse Check-in', desc: 'Caregiver arrived.', icon: MapPin, color: 'text-blue-500' });
              }
              if (v.clockOutTime) {
                 const dt = v.clockOutTime?.toDate?.() || new Date(v.clockOutTime);
                 evs.push({ id: `out-${d.id}`, type: 'visit_out', time: dt, title: 'Nurse Check-out', desc: 'Visit completed.', icon: LogOut, color: 'text-gray-500' });
              }
          });
          setTimelineVisits(evs);
      }, (error) => {
          console.error("Error fetching visits:", error);
      }));

      const vitalsQ = query(collection(db, 'vitalSigns'), where('patientId', '==', linkedPatientId));
      unsubsRef.current.push(onSnapshot(vitalsQ, (snap) => {
          const evs: TimelineEvent[] = [];
          snap.forEach(d => {
              const v = d.data();
              const dt = v.createdAt?.toDate?.() || new Date();
              const desc = [];
              if (v.bloodPressure) desc.push(`BP: ${v.bloodPressure}`);
              if (v.temperature) desc.push(`Temp: ${v.temperature}`);
              if (v.heartRate) desc.push(`HR: ${v.heartRate}`);
              evs.push({ id: `vit-${d.id}`, type: 'vitals', time: dt, title: 'Vitals Recorded', desc: desc.join(', '), icon: Activity, color: 'text-emerald-500' });
          });
          setTimelineVitals(evs);
      }, (error) => {
          console.error("Error fetching vitals:", error);
      }));

      const medsAdminQ = query(collection(db, 'medicationsAdministered'), where('patientId', '==', linkedPatientId));
      unsubsRef.current.push(onSnapshot(medsAdminQ, (snap) => {
          const evs: TimelineEvent[] = [];
          snap.forEach(d => {
              const v = d.data();
              const dt = v.administeredAt?.toDate?.() || new Date();
              evs.push({ id: `med-${d.id}`, type: 'meds', time: dt, title: 'Medication Administered', desc: v.remarks || 'Medication chart updated.', icon: CheckCircle2, color: 'text-emerald-500' });
          });
          setTimelineMeds(evs);
      }, (error) => {
          console.error("Error fetching meds config:", error);
      }));

      const logsQ = query(collection(db, 'caregiverLogs'), where('patientId', '==', linkedPatientId));
      unsubsRef.current.push(onSnapshot(logsQ, (snap) => {
          const evs: TimelineEvent[] = [];
          snap.forEach(d => {
              const v = d.data();
              const dt = v.createdAt?.toDate?.() || new Date();
              evs.push({ id: `log-${d.id}`, type: 'mood', time: dt, title: 'Care & Mood Update', desc: v.notes || 'Routine check completed.', icon: Camera, color: 'text-purple-500', img: v.photoUrl });
          });
          setTimelineLogs(evs);
      }, (error) => {
          console.error("Error fetching caregiver logs:", error);
      }));

    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const setupMockData = async () => {
      try {
          if (!session?.user?.id) return;
          setLoading(true);
          
          const patientId = 'demo-patient-1';
          
          // Set mock patient
          await setDoc(doc(db, `users/${patientId}/public/profile`), {
              role: 'patient', firstName: 'Folashade', lastName: 'Adebayo', createdAt: serverTimestamp()
          });
          
          await setDoc(doc(db, `patients/${patientId}`), {
              patientId, dateOfBirth: '1952-06-15', gender: 'Female', updatedAt: serverTimestamp()
          });

          // Link family to it
          await setDoc(doc(db, `users/${session.user.id}/public/profile`), {
              linkedPatientId: patientId
          }, { merge: true });

          // Seed events matching original static UI roughly
          const now = new Date();
          await setDoc(doc(collection(db, 'visits')), {
              patientId, status: 'completed',
              clockInTime: new Date(now.getTime() - 120 * 60000), // 2 hr ago
              clockOutTime: new Date(now.getTime() - 30 * 60000), // 30 min ago
              createdAt: serverTimestamp()
          });
          
          await setDoc(doc(collection(db, 'vitalSigns')), {
              patientId, bloodPressure: '120/80', temperature: '36.8°C', heartRate: '74 bpm',
              createdAt: new Date(now.getTime() - 105 * 60000)
          });
          
          await setDoc(doc(collection(db, 'medicationsAdministered')), {
              patientId, remarks: 'Amlodipine 5mg taken orally.',
              administeredAt: new Date(now.getTime() - 90 * 60000)
          });

          await setDoc(doc(collection(db, 'caregiverLogs')), {
              patientId, notes: 'Resting comfortably. Enjoyed breakfast. Patient is stable and in good spirits.',
              photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=150&fit=crop',
              createdAt: new Date(now.getTime() - 60 * 60000)
          });

          toast.success("Demonstration data generated!");
          fetchProfileAndSetupListeners(session.user.id);
      } catch (err: any) {
          toast.error(err.message);
          setLoading(false);
      }
  };

  if (loading) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
              <RefreshCw className="w-8 h-8 text-[#10837f] animate-spin" />
          </div>
      );
  }

  const lovedOneName = patientProfile ? `${patientProfile.firstName} ${patientProfile.lastName}` : 'Loved One';

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopBar />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-1 text-[#05445E]">Family Connection Hub</h1>
              <p className="text-gray-500">Live care updates for {lovedOneName}</p>
            </div>
            <div className="flex gap-4 items-center self-start sm:self-center">
                <Button variant="outline" className="text-gray-600 bg-white" onClick={async () => {
                    navigate('/auth/login');
                }}>
                    <LogOut className="w-4 h-4 mr-2"/> Log Out
                </Button>
            </div>
        </div>

        {!profile?.linkedPatientId ? (
             <Card className="text-center py-12">
                 <CardHeader>
                     <CardTitle>Welcome to the Family Portal</CardTitle>
                     <CardDescription>Your account is not currently linked to a patient profile.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <Button onClick={setupMockData} className="bg-[#10837f] hover:bg-[#0c6b68]">Generate Demo Patient Linked Data</Button>
                 </CardContent>
             </Card>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Timeline Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 min-h-[400px]">
                        <CardHeader className="bg-white border-b pb-4">
                            <CardTitle className="text-xl text-[#05445E] flex items-center gap-2">
                               <Clock className="w-5 h-5 text-[#10837f]" /> Care Timeline (Today)
                            </CardTitle>
                            <CardDescription>Live updates from the care team</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {timeline.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No care events found today.
                                </div>
                            ) : (
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200">
                                    {timeline.map((event, i) => (
                                        <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 z-10">
                                                <event.icon className={`w-5 h-5 ${event.color}`} />
                                            </div>
                                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] ml-12 md:ml-0 p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900 text-sm">{event.title}</span>
                                                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded" title={event.time.toLocaleString()}>{event.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{event.desc}</p>
                                                {event.img && (
                                                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-100">
                                                        <img src={event.img} alt="Update" className="w-full h-32 object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Overview */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200">
                        <CardHeader className="bg-[#10837f] text-white rounded-t-xl">
                            <CardTitle className="text-lg">Loved One's Status</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500 overflow-hidden">
                                     {patientMedical?.gender === 'Female' ? (
                                         <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                                      ) : (
                                         <User className="w-8 h-8 text-emerald-600" />
                                      )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{lovedOneName}</h3>
                                    <p className="text-sm text-gray-500">{patientMedical?.dateOfBirth || 'Unknown'} • {patientMedical?.gender || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Latest BP</p>
                                        <p className="font-bold text-gray-900">
                                            {timeline.find(t => t.type === 'vitals' && t.desc.includes('BP'))?.desc.split('BP: ')[1]?.split(',')[0] || '--'}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                    <HeartPulse className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Heart Rate</p>
                                        <p className="font-bold text-gray-900">
                                             {timeline.find(t => t.type === 'vitals' && t.desc.includes('HR'))?.desc.split('HR: ')[1]?.split(',')[0] || '--'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm ring-1 ring-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="text-lg text-gray-900">Care Team</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">SJ</div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Dr. Sarah Jenkins</p>
                                    <p className="text-xs text-gray-500">Primary Physician</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">NS</div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Nurse Sarah O.</p>
                                    <p className="text-xs text-gray-500">Home Visit Nurse</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
