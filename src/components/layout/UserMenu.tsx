"use client";

import React from "react";
import { User, LogOut } from "lucide-react";

export function UserMenu() {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 border p-2 rounded-full hover:bg-gray-50 focus:ring-2 focus:outline-none" aria-label="User menu">
        <User className="w-5 h-5 text-gray-700" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block focus-within:block">
        <div className="p-4 border-b">
          <p className="font-medium text-sm">John Doe</p>
          <p className="text-xs text-gray-500">DOCTOR</p>
        </div>
        <button className="flex w-full items-center gap-2 p-4 text-sm text-red-600 hover:bg-gray-50 cursor-pointer text-left focus:outline-none">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
