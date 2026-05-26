import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full bg-[#1e615e] text-primary-foreground border-t-[8px] border-[#0e4e5e]">
      {/* Banner Section */}
      <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#eaf4f4] to-white py-10 border-b-[6px] border-[#10837f]">
         {/* Background Ornaments */}
         <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #10837f 1px, transparent 1px), radial-gradient(circle at 90% 80%, #10837f 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-[1400px]">
             
             {/* Left: Logo Area */}
             <div className="flex-shrink-0 flex items-center justify-center">
                 <img src="https://www.image2url.com/r2/default/images/1778073229664-4aa07c71-2ec8-4eb8-895d-24201a8b1c3d.jpg" alt="PrimeVita" className="w-[300px] object-contain drop-shadow-xl mix-blend-multiply" />
             </div>

             {/* Middle: Text Area */}
             <div className="flex-1 flex flex-col items-center text-center">
                 <h2 className="text-5xl md:text-6xl font-black text-[#003b64] font-heading tracking-tight mb-2 drop-shadow-sm">
                     PRIME<span className="text-[#10837f]">VITA</span>
                 </h2>
                 <p className="text-xl md:text-2xl font-bold text-[#b58b35] tracking-[0.25em] uppercase mb-4 opacity-90">
                     HEALTH SERVICES
                 </p>
                 <div className="w-full max-w-3xl flex items-center gap-4 mb-4">
                     <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#10837f]"></div>
                     <p className="text-[#0e4e5e] font-semibold text-lg md:text-2xl tracking-wide shrink-0">
                         Compassionate • Professional • Reliable Home
                     </p>
                     <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#10837f]"></div>
                 </div>
                 <p className="text-[#003b64] font-bold text-lg md:text-xl mb-4 tracking-wider">
                     Elderly Care <span className="text-[#10837f] px-2">|</span> Home Nursing <span className="text-[#10837f] px-2">|</span> Post-Hospital Recovery
                 </p>
                 <div className="flex items-center gap-3">
                     <span className="text-red-600 text-3xl animate-pulse">❤️</span>
                     <p className="text-[#1e615e] font-bold italic text-3xl font-serif">
                         We Care Like Family
                     </p>
                 </div>
             </div>

             {/* Right: Heart Symbol */}
             <div className="flex-shrink-0 hidden lg:flex items-center justify-center pr-8 lg:w-[250px]">
                 <div className="relative drop-shadow-[0_15px_25px_rgba(16,131,127,0.3)] hover:scale-105 transition-transform duration-500">
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48 text-[#10837f]">
                         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center pb-2">
                         <svg viewBox="0 0 24 24" fill="white" className="w-24 h-24">
                             <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/>
                         </svg>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 grid md:grid-cols-4 gap-12 text-sm text-gray-200">
        <div>
          <h4 className="text-2xl font-bold text-white mb-4">PrimeVita</h4>
          <p>9, Alaka off Bammeke,<br/>Alimosho, Lagos State,<br/>Nigeria.</p>
          <p className="mt-4 text-[#d8a846] font-semibold text-lg">+(234) 701-291-8331</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li><a href="/" className="hover:text-white hover:underline transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-white hover:underline transition-colors">About Us</a></li>
            <li><a href="/services" className="hover:text-white hover:underline transition-colors">Services</a></li>
            <li><a href="/contact" className="hover:text-white hover:underline transition-colors">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Information</h4>
          <ul className="space-y-3">
            <li><a href="/brochure" target="_blank" className="hover:text-white hover:underline transition-colors text-[#d8a846] font-medium flex items-center gap-1">Company Profile (PDF) <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></a></li>
            <li><a href="/auth/login" className="hover:text-white hover:underline transition-colors">Patient & Staff Portal</a></li>
            <li><a href="/careers" className="hover:text-white hover:underline transition-colors">Careers</a></li>
            {/* Updated License linking to the attached view or any custom file path. For now I'm displaying a local route to it. */}
            <li>
                 <a href="/license" className="hover:text-white hover:underline transition-colors">Government License</a>
            </li>
          </ul>
        </div>
        <div>
           <h4 className="text-lg font-semibold text-white mb-4">Our Commitment</h4>
           <p className="mb-6 opacity-80 leading-relaxed font-light">
             We pledge to deliver unparalleled, culturally sensitive care to every patient, treating them with the same compassion and respect as our own family.
           </p>
           <div className="flex gap-2 mb-6">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-[#10837f] text-white p-2 rounded-full cursor-pointer hover:bg-[#0c6b68] hover:-translate-y-1 transition-all"><Facebook className="w-4 h-4" /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-[#10837f] text-white p-2 rounded-full cursor-pointer hover:bg-[#0c6b68] hover:-translate-y-1 transition-all"><Instagram className="w-4 h-4" /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-[#10837f] text-white p-2 rounded-full cursor-pointer hover:bg-[#0c6b68] hover:-translate-y-1 transition-all"><Linkedin className="w-4 h-4" /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-[#10837f] text-white p-2 rounded-full cursor-pointer hover:bg-[#0c6b68] hover:-translate-y-1 transition-all"><Twitter className="w-4 h-4" /></a>
                <a href="https://youtube.com/@primevitahealthservices?si=uRreFq1yi5aBYGay" target="_blank" rel="noopener noreferrer" className="bg-[#10837f] text-white p-2 rounded-full cursor-pointer hover:bg-[#0c6b68] hover:-translate-y-1 transition-all"><Youtube className="w-4 h-4" /></a>
                <a href="https://www.tiktok.com/@primevitahealthse?_r=1&_t=ZS-96BOtR12umq" target="_blank" rel="noopener noreferrer" className="bg-[#10837f] text-white p-2 rounded-full cursor-pointer hover:bg-[#0c6b68] hover:-translate-y-1 transition-all"><TikTokIcon className="w-4 h-4" /></a>
           </div>
           <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} PrimeVita Health Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
