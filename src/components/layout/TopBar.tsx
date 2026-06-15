import { Search, Home, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export function TopBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#004e82] text-white text-[11px] font-bold tracking-wide">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center h-10 w-full pl-6 pr-6 max-w-none">
        
        {/* Left Side */}
        <div className="flex items-center gap-6 h-full shrink-0">
            <Link to="/" className="flex items-center gap-2 uppercase hover:text-[#d8a846] transition-colors">
                <Home className="w-4 h-4" />
                PRIMEVITA HOMECARE AGENCY
            </Link>
            
            <button 
                onClick={() => navigate('/search')}
                className="text-white hover:text-[#d8a846] transition-colors p-2 rounded-full border border-white/20 hover:border-[#d8a846]/50"
            >
                <Search className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
}
