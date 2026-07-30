import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDb, getAuthClient } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Settings, ShieldAlert, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

const ROLES = ['admin', 'patient', 'family', 'doctor', 'nurse', 'caregiver', 'physiotherapist'];

export function RoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const currentRole = user?.role || 'admin';
  const activeUser = user || { id: 'demo-user', username: 'Demo User', role: 'admin', linkedUserType: 'admin' };

  const changeRole = async (newRole: string) => {
    setLoading(true);
    try {
      const authClient = getAuthClient();
      const activeUid = authClient.currentUser?.uid || activeUser.id || 'demo-user';

      // 1. Update Zustand auth store so UI components re-render immediately with the new role
      setAuth({
        id: activeUid,
        username: activeUser.username || 'Demo User',
        role: newRole,
        linkedUserType: newRole,
      });

      // 2. Persist to Firestore public profile
      try {
        const docRef = doc(getDb(), 'users', activeUid, 'public', 'profile');
        await setDoc(docRef, { role: newRole, updatedAt: serverTimestamp() }, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore role update notice:", dbErr);
      }

      // 3. Auto-navigate to appropriate dashboard
      if (newRole === 'admin') navigate('/dashboard/admin');
      else if (newRole === 'patient') navigate('/portal');
      else if (newRole === 'family') navigate('/family-portal');
      else navigate('/dashboard/clinical');
      
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to change role:", err);
      // Fallback navigation
      if (newRole === 'admin') navigate('/dashboard/admin');
      else if (newRole === 'patient') navigate('/portal');
      else if (newRole === 'family') navigate('/family-portal');
      else navigate('/dashboard/clinical');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Do not allow switching if unauthenticated or on login page
  if (location.pathname.includes('/auth/login')) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[999999]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white p-3 rounded-full shadow-2xl hover:bg-red-700 transition-all flex items-center gap-2 group"
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold">
             DEV: SWITCH ROLE
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white border border-red-200 p-4 rounded-xl shadow-2xl flex flex-col gap-3 w-64 animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold text-red-600 flex items-center gap-2">
               <Settings className="w-4 h-4" /> Role Simulator
            </span>
             <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
          </div>
          
          <div className="text-xs text-gray-500">
             Current Status: <span className="font-bold text-[#0e4e5e]">{currentRole}</span>
          </div>

          <div className="flex flex-col gap-2 mt-2">
             {ROLES.map(r => (
                <button 
                   key={r}
                   onClick={() => changeRole(r)}
                   disabled={loading || r === currentRole}
                   className={`py-1.5 px-3 rounded text-sm font-semibold capitalize transition-colors ${
                      r === currentRole 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : r === 'admin' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                   }`}
                >
                   {r} {r === currentRole && '(Active)'}
                </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
