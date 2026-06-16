"use client";

import React from "react";
import { User, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { doc, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

export function UserMenu() {
  const { user, setAuth } = useAuthStore();
  
  const handleRoleSwitch = async (newRole: string) => {
    if (!user) return;
    
    // Update local store
    setAuth({
        ...user,
        role: newRole
    });

    // Update Firestore
    try {
        const userRef = doc(getDb(), 'users', user.id, 'public', 'profile');
        await updateDoc(userRef, { role: newRole });
        console.log('Role updated to', newRole);
    } catch (e) {
        console.error('Failed to update role in DB', e);
    }
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 border p-2 rounded-full hover:bg-gray-50 focus:ring-2 focus:outline-none" aria-label="User menu">
        <User className="w-5 h-5 text-gray-700" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-xl hidden group-hover:block focus-within:block z-[100]">
        <div className="p-4 border-b">
          <p className="font-medium text-sm">{user?.username || 'User'}</p>
          <p className="text-xs text-gray-500">{user?.role || 'NO ROLE'}</p>
        </div>
        <div className="p-2 border-b">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Switch Role (Dev)</p>
            {['PATIENT', 'NURSE', 'DOCTOR', 'CAREGIVER', 'PHYSIOTHERAPIST', 'ADMIN'].map(role => (
                <button key={role} className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded" onClick={() => handleRoleSwitch(role)}>
                    {role}
                </button>
            ))}
        </div>
        <button className="flex w-full items-center gap-2 p-4 text-sm text-red-600 hover:bg-gray-50 cursor-pointer text-left focus:outline-none">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
