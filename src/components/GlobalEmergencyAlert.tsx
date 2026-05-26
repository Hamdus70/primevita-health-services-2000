import React, { useState, useEffect } from 'react';
import { BellRing, Siren } from 'lucide-react';
import { toast } from 'sonner';
import { getDb, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, limit, doc, updateDoc, getDoc } from 'firebase/firestore';

export function PanicButton() {
  const user = { id: 'demo-user', email: 'demo@example.com' }; 

  const triggerAlarm = async () => {
    if (!user) {
        toast.error("You must be logged in to trigger an alarm.");
        return;
    }
    try {
      let senderName = 'Unknown';
      let senderRole = 'Unknown Role';
      let senderPhone = '';
      
      const userRef = doc(getDb(), 'users', user.id, 'public', 'profile');
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            senderName = data.name || senderName;
            senderRole = data.role || senderRole;
            senderPhone = data.phone || senderPhone;
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.id}/public/profile`);
      }

      await addDoc(collection(getDb(), 'emergencies'), {
        senderId: user.id,
        senderEmail: user.email || 'Guest',
        senderName,
        senderRole,
        senderPhone,
        message: 'Medical / Security Emergency Reported!',
        timestamp: serverTimestamp(),
        status: 'ACTIVE'
      });
      toast.success("Emergency alarm triggered. Admin notified immediately.");
    } catch (e) {
      console.error(e);
      toast.error('Failed to trigger alarm');
      handleFirestoreError(e, OperationType.CREATE, 'emergencies');
    }
  };

  if (!user) return null;

  return (
    <button 
        onClick={triggerAlarm} 
        className="flex items-center gap-1.5 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-full transition-colors text-[10px] font-bold shadow-sm animate-pulse"
    >
        <BellRing className="w-3.5 h-3.5" />
        PANIC / ALARM
    </button>
  );
}

export function AdminEmergencyAlerts() {
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const isAuthenticated = true; 

  // Listen for emergency alerts
  useEffect(() => {
    if (!isAuthenticated) {
        setActiveAlerts([]);
        return;
    }
    const q = query(
      collection(getDb(), 'emergencies'), 
      where('status', '==', 'ACTIVE'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActiveAlerts(data);
      } else {
        setActiveAlerts([]);
      }
    }, (err) => {
        console.error("Emergency Alert Error:", err);
        handleFirestoreError(err, OperationType.LIST, 'emergencies');
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const resolveAlert = async (id: string) => {
    // Optimistic UI update
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
    try {
        await updateDoc(doc(getDb(), 'emergencies', id), {
            status: 'RESOLVED',
            updatedAt: serverTimestamp()
        });
        toast.success("Emergency marked as resolved.");
    } catch(e) {
        toast.error("Failed to resolve emergency.");
        console.error(e);
    }
  };

  const dismissLocal = (id: string) => {
      setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (activeAlerts.length === 0) return null;

  return (
    <>
      {activeAlerts.map(alert => (
        <div key={alert.id} className="fixed bottom-4 right-4 z-[9999] bg-white border-2 border-red-500 p-4 rounded-xl shadow-2xl flex flex-col gap-2 animate-in slide-in-from-bottom-5 w-80 max-w-[90vw] cursor-pointer" onClick={() => dismissLocal(alert.id)}>
            <div className="flex items-center gap-3 border-b border-red-100 pb-2 mb-2 relative">
                <div className="bg-red-100 p-2 rounded-full h-fit flex-shrink-0">
                    <Siren className="w-5 h-5 animate-ping text-red-600" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-red-600 uppercase tracking-wider">Active Emergency</h4>
                    <p className="text-xs font-semibold text-gray-800">{alert.senderName || alert.senderEmail}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{alert.senderRole || 'Unknown Role'}</p>
                </div>
            </div>
            {alert.senderPhone && <p className="text-xs text-gray-600 mb-1">📞 {alert.senderPhone}</p>}
            <div className="flex justify-between items-end pt-1 border-t border-red-50 mt-1">
                <p className="text-sm font-semibold text-gray-800">{alert.message}</p>
                <div onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => resolveAlert(alert.id)} className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md font-bold transition-colors">
                        Resolve
                    </button>
                </div>
            </div>
        </div>
      ))}
    </>
  );
}
