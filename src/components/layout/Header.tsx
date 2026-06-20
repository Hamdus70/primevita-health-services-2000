import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageSquareText, FileText, CheckCircle, UserPlus, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CustomLanguageTranslator } from './CustomLanguageTranslator';


export function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);

  // Initialize Google Translate
  useEffect(() => {
    // Define the global callback
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        const attemptInit = () => {
          const el = document.getElementById('google_translate_element');
          if (el) {
            // Guard against double rendering / collision on routing or faster loading contexts
            if (el.querySelector('.goog-te-combo')) {
              return;
            }
            try {
              el.innerHTML = "";
              new (window as any).google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,yo,ig,ha,fr,es,ar',
                autoDisplay: false,
              }, 'google_translate_element');
            } catch (err) {
              console.warn("Exception during TranslateElement initialization:", err);
            }
          } else {
            setTimeout(attemptInit, 150);
          }
        };
        attemptInit();
      }
    };

    const loadGoogleTranslate = () => {
      const el = document.getElementById('google_translate_element');
      if (el && el.querySelector('.goog-te-combo')) {
        return;
      }
      if ((window as any).google && (window as any).google.translate) {
        try {
          (window as any).googleTranslateElementInit();
        } catch (err) {
          console.warn("Error calling googleTranslateElementInit:", err);
        }
      } else {
        const existingScript = document.querySelector('script[src*="element.js?cb=googleTranslateElementInit"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          document.body.appendChild(script);
        } else {
          if (typeof (window as any).googleTranslateElementInit === 'function') {
            try {
              (window as any).googleTranslateElementInit();
            } catch (e) {}
          }
        }
      }
    };

    const timer = setTimeout(loadGoogleTranslate, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="w-full bg-white relative z-50">
      <div className="container mx-auto px-4 py-1 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img 
            src="https://www.image2url.com/r2/default/images/1778073229664-4aa07c71-2ec8-4eb8-895d-24201a8b1c3d.jpg" 
            alt="PrimeVita Health Services Logo" 
            className="w-28 md:w-36 h-auto object-contain mix-blend-multiply" 
          />
        </Link>

        
        {/* Right Content */}
        <div className="flex items-center gap-4">
            {/* Elegant, prominent language drop-down with custom Google icon */}
            <div className="flex items-center z-50">
                <CustomLanguageTranslator />
                {/* Keep Google Translate API container hidden in DOM */}
                <div id="google_translate_element" className="hidden"></div>
            </div>
            <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold tracking-wide text-[#0e4e5e] uppercase">
                <Link to="/about" className="hover:text-[#10837f] transition-colors">ABOUT US</Link>
                
                <div className="relative group h-full items-center">
                  <div className="flex items-center h-full py-4 cursor-pointer">
                      <Link to="/services" className="hover:text-[#10837f] transition-colors flex items-center gap-1">
                          SERVICES <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
                      </Link>
                  </div>
                  <div className="absolute left-0 top-[calc(100%-0.5rem)] w-60 bg-white shadow-xl border border-[#10837f]/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-xl overflow-hidden pt-2">
                       <Link to="/services" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-bold text-[11px] border-b border-gray-50">All Services</Link>
                       <Link to="/services/home-nursing" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[10px] border-b border-gray-50">Home Nursing</Link>
                       <Link to="/services/elderly-care" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[10px] border-b border-gray-50">Elderly Care</Link>
                       <Link to="/services/post-hospital-recovery" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[10px] border-b border-gray-50">Post-Hospital Recovery</Link>
                       <Link to="/services/dementia-care" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[10px] border-b border-gray-50">Dementia Care</Link>
                       <Link to="/services/physiotherapy" className="block px-5 py-3 hover:bg-[#10837f]/10 hover:text-[#10837f] transition-colors font-semibold text-[10px]">Physiotherapy</Link>
                  </div>
                </div>

                <Link to="/faqs" className="hover:text-[#10837f] transition-colors py-4">FAQs</Link>
                <Link to="/testimonials" className="hover:text-[#10837f] transition-colors py-4">TESTIMONIALS</Link>
                
                <Link to="/refer-patient" className="hidden lg:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-2 rounded-full transition-colors text-[10px] font-bold">
                    <UserPlus className="w-3.5 h-3.5" />
                    REFER PATIENT
                </Link>
                <Link to="/apply" className="hidden lg:flex items-center gap-1.5 bg-[#10837f] text-white hover:bg-[#0c6b68] px-3 py-2 rounded-full transition-colors text-[10px]">
                    <FileText className="w-3.5 h-3.5" />
                    JOIN NETWORK
                </Link>
                <a href="https://drive.google.com/file/d/1ofsvGJycBn-JpVeUn9NNW4o1KR0JeIjl/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center gap-1.5 bg-[#0e4e5e] text-white hover:bg-[#093540] px-3 py-2 rounded-full transition-colors text-[10px]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    GOVERNMENT LICENSE
                </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex gap-1 md:gap-1.5 items-center">
              <Link to="/dashboard" className="bg-[#d8a846] text-white px-2 py-1 rounded-full flex items-center gap-1 hover:bg-[#b58b35] active:scale-95 transition-all duration-200 shadow-[0_3px_8px_rgba(216,168,70,0.2)] text-[9px] md:text-[10px] font-bold shrink-0">
                  MY PORTAL
              </Link>
              <Link to="/contact" className="bg-[#10837f] text-white p-2 md:p-2.5 rounded-full flex items-center justify-center hover:bg-[#0c6b68] active:scale-95 transition-all duration-200 shadow-[0_3px_8px_rgba(16,131,127,0.2)] shrink-0">
                  <MessageSquareText className="w-4 h-4 md:w-4.5 md:h-4.5" />
              </Link>
              
              {/* Menu Button for small screens */}
              <button className="p-2 text-[#0e4e5e]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 p-4 shadow-lg lg:hidden z-50">
             <div className="flex flex-col gap-4 text-sm font-bold text-[#0e4e5e]">
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>ABOUT US</Link>
                
                <div className="flex flex-col gap-3">
                    <button onClick={() => setIsServicesExpanded(!isServicesExpanded)} className="flex items-center justify-between">
                         SERVICES <ChevronDown className={`w-4 h-4 transition-transform ${isServicesExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isServicesExpanded && (
                        <div className="flex flex-col gap-2 pl-4 text-xs font-normal text-gray-600">
                             <Link to="/services" onClick={() => setIsMenuOpen(false)}>All Services</Link>
                             <Link to="/services/home-nursing" onClick={() => setIsMenuOpen(false)}>Home Nursing</Link>
                             <Link to="/services/elderly-care" onClick={() => setIsMenuOpen(false)}>Elderly Care</Link>
                             <Link to="/services/post-hospital-recovery" onClick={() => setIsMenuOpen(false)}>Post-Hospital Recovery</Link>
                             <Link to="/services/dementia-care" onClick={() => setIsMenuOpen(false)}>Dementia Care</Link>
                             <Link to="/services/physiotherapy" onClick={() => setIsMenuOpen(false)}>Physiotherapy</Link>
                        </div>
                    )}
                </div>

                <Link to="/faqs" onClick={() => setIsMenuOpen(false)}>FAQs</Link>
                <Link to="/testimonials" onClick={() => setIsMenuOpen(false)}>TESTIMONIALS</Link>
                <Link to="/refer-patient" onClick={() => setIsMenuOpen(false)}>REFER PATIENT</Link>
                <Link to="/apply" onClick={() => setIsMenuOpen(false)}>JOIN NETWORK</Link>
                <a href="https://drive.google.com/file/d/1ofsvGJycBn-JpVeUn9NNW4o1KR0JeIjl/view?usp=sharing" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>GOVERNMENT LICENSE</a>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>MY PORTAL</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>CONTACT US</Link>
             </div>
          </div>
        )}
      </div>
    </header>
  );
}
