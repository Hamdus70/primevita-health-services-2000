"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu className="w-6 h-6" />
      </button>
      
      {open && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white w-64 h-full p-4 flex flex-col">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="self-end mb-4">
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-4">
              <a href="/">Dashboard</a>
              <a href="/patients">Patients</a>
              <a href="/settings">Settings</a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
