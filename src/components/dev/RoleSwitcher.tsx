import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDb } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Settings, ShieldAlert, X } from 'lucide-react';
// import { useSession } from 'next-auth/react';

const ROLES = ['admin', 'patient', 'family', 'doctor', 'nurse', 'caregiver', 'physiotherapist'];

export function RoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  // const { data: session } = useSession();
  const user = { id: 'demo-user', role: 'admin' }; // Dummy user for development role switching
  const [loading, setLoading] = useState(false);
  const currentRole = user?.role || 'unauthenticated';

  const changeRole = async (newRole: string) => {
    setLoading(true);
    try {
      if (!user) {
        alert("Not logged in.");
        return;
      }
      // Note: This mocked role switching via Firestore might still be needed if 
      // the app uses Firestore to store the "active" role, but it should 
      // not rely on Firebase Auth UID.
      const docRef = doc(getDb(), 'users', user.id || 'mock-id', 'public', 'profile');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await setDoc(docRef, { role: newRole }, { merge: true });
      }

      // Auto-navigate to appropriate dashboard
      if (newRole === 'admin') navigate('/dashboard/admin');
      else if (newRole === 'patient') navigate('/portal');
      else if (newRole === 'family') navigate('/family-portal');
      else navigate('/dashboard/clinical');
      
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to change role:", err);
      alert("Error changing role. Check console.");
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
             Current Status: {user ? <span className="font-bold text-[#0e4e5e]">{currentRole}</span> : "Not logged in"}
          </div>

          {!user ? (
            <button onClick={() => { setIsOpen(false); navigate('/auth/login'); }} className="bg-[#10837f] text-white py-2 rounded text-sm font-bold">
               Go to Login
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
               {ROLES.map(r => (
                  <button 
                     key={r}
                     onClick={() => changeRole(r)}
                     disabled={loading || r === currentRole}
                     className={`py-1.5 px-3 rounded text-sm font-semibold capitalize transition-colors \${
                        r === currentRole 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : typeof r === 'string' && r === 'admin' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                     }`}
                  >
                     {r} {r === currentRole && '(Active)'}
                  </button>
               ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
