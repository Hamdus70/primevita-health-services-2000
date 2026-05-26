import { Search, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export function TopBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate(`/search`);
    }
  };

  return (
    <div className="bg-[#004e82] text-white text-[11px] font-bold tracking-wide">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center h-10 w-full pl-6 pr-0 max-w-none">
        
        {/* Left Side */}
        <div className="flex items-center gap-6 h-full shrink-0">
            <Link to="/" className="flex items-center gap-2 uppercase hover:text-[#d8a846] transition-colors">
                <Home className="w-4 h-4" />
                PRIMEVITA HOMECARE AGENCY
            </Link>
            
            <form onSubmit={handleSearch} className="relative">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SEARCH SITE..." 
                    className="bg-[#003b64] text-white px-4 py-1.5 rounded-full outline-none placeholder:text-white/70 w-36 text-[10px] focus:ring-1 focus:ring-white/20 transition-all border border-transparent focus:border-white/20"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors">
                  <Search className="w-3.5 h-3.5" />
                </button>
            </form>
        </div>

        {/* Right Side Marquee */}
        <div className="flex-1 overflow-hidden h-full flex items-center ml-8 relative border-l border-white/20 pl-4">
            <div className="animate-marquee whitespace-nowrap flex gap-12 font-medium text-[12px]">
                <span><span className="text-[#d8a846] mr-2">OUR MISSION:</span> To deliver high-quality, personalized home healthcare with compassion, professionalism, and respect for every client and family we serve.</span>
                <span><span className="text-[#d8a846] mr-2">OUR VISION:</span> To become a trusted leader in home healthcare, recognized for excellence, reliability, and a genuine commitment to improving quality of life.</span>
                
                {/* Duplicate for infinite loop */}
                <span><span className="text-[#d8a846] mr-2">OUR MISSION:</span> To deliver high-quality, personalized home healthcare with compassion, professionalism, and respect for every client and family we serve.</span>
                <span><span className="text-[#d8a846] mr-2">OUR VISION:</span> To become a trusted leader in home healthcare, recognized for excellence, reliability, and a genuine commitment to improving quality of life.</span>
            </div>
        </div>
      </div>
    </div>
  );
}
