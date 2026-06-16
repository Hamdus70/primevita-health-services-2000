import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuthClient } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth.store';

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuthClient(), (u) => {
      setUser(u);
      if (u) {
        // Here you might want to fetch the user role from Firestore and populate auth store
        // For now, setting basic user info.
        setAuth({
            id: u.uid,
            username: u.email || "",
            role: "PATIENT", // Default - will need to be updated from Firestore
            linkedUserType: "PATIENT", // Default
        });
      } else {
        clearAuth();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setAuth, clearAuth]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
