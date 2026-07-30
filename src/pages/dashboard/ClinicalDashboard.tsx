import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, getAuthClient } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth.store';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PanicButton } from '@/components/GlobalEmergencyAlert';

import { NurseDashboardView } from './components/NurseDashboardView';
import { DoctorDashboardView } from './components/DoctorDashboardView';
import { CaregiverDashboardView } from './components/CaregiverDashboardView';
import { PhysiotherapistDashboardView } from './components/PhysiotherapistDashboardView';

export function ClinicalDashboard() {
  const navigate = useNavigate();
  const storeUser = useAuthStore((state) => state.user);
  const activeUserId = getAuthClient().currentUser?.uid || storeUser?.id || 'demo-user';
  const defaultRole = storeUser?.role && ['nurse', 'doctor', 'caregiver', 'physiotherapist'].includes(storeUser.role) ? storeUser.role : 'nurse';

  const [role, setRole] = useState<string>(defaultRole);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeRole = storeUser?.role || 'nurse';
    if (activeRole === 'admin') {
      navigate('/dashboard/admin');
      return;
    } else if (activeRole === 'patient') {
      navigate('/portal');
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', activeUserId, 'public', 'profile'), (userDoc) => {
      if (userDoc.exists()) {
        const ud = userDoc.data();
        if (ud.role) {
          setRole(ud.role);
          if (ud.role === 'admin' || ud.role === 'patient') {
            navigate(ud.role === 'admin' ? '/dashboard/admin' : '/portal');
          }
        }
      } else {
        setRole(activeRole);
      }
      setLoading(false);
    }, (err) => {
      console.warn("ClinicalDashboard checkRole notice (using fallback role):", err);
      setRole(activeRole);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, activeUserId, storeUser?.role]);

  if (loading) return <div className="p-8 text-center mt-20">Loading Clinical Hub...</div>;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopBar />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6 pb-4 border-b">
           <div>
             <h1 className="text-3xl font-bold capitalize text-[#0e4e5e]">{role} Dashboard</h1>
             <p className="text-gray-500 mt-1">Logged in as {role}. All actions are securely logged for HIPAA/NDPR compliance.</p>
           </div>
           <PanicButton />
        </div>
        
        {role === 'nurse' && <NurseDashboardView role="nurse" />}
        {role === 'doctor' && <DoctorDashboardView />}
        {role === 'caregiver' && <CaregiverDashboardView />}
        {role === 'physiotherapist' && <PhysiotherapistDashboardView />}
        
        {/* Fallback if role is loaded but doesn't match the specific ones above (e.g. testing) */}
        {!['nurse', 'doctor', 'caregiver', 'physiotherapist'].includes(role || '') && role && (
            <div className="bg-yellow-50 text-yellow-800 p-6 rounded-xl border border-yellow-200">
               <h2 className="text-xl font-bold mb-2">Unrecognized Clinical Role: {role}</h2>
               <p>Your profile role is not recognized as a standard clinical user. Please contact administration.</p>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
