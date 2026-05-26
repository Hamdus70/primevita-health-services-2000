import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageSquareText, FileText, CheckCircle, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t, i18n } = useTranslation();

  // Initialize Google Translate
  useEffect(() => {
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
            new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,yo,ig,ha,fr,es,ar',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            }, 'google_translate_element');
        }
      };
      addScript();
    }
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
        <nav className="flex items-center gap-6 text-[12px] font-bold tracking-wide text-[#0e4e5e] uppercase relative">
            <Link to="/about" className="hover:text-[#10837f] transition-colors hidden md:block">ABOUT US</Link>
            
            <div className="relative group hidden lg:flex h-full items-center">
              <div className="flex items-center h-full py-4 cursor-pointer">
                  <Link to="/services" className="hover:text-[#10837f] transition-colors flex items-center gap-1">
                      SERVICES <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                  </Link>
              </div>
              <div className="absolute left-0 top-[calc(100%-0.5rem)] w-60 bg-white shadow-xl border border-[#10837f]/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-xl overflow-hidden pt-2">
                  <Link to="/services" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-bold text-[12px] border-b border-gray-50">All Services</Link>
                  <Link to="/services/home-nursing" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[11px] border-b border-gray-50">Home Nursing</Link>
                  <Link to="/services/elderly-care" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[11px] border-b border-gray-50">Elderly Care</Link>
                  <Link to="/services/post-hospital-recovery" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[11px] border-b border-gray-50">Post-Hospital Recovery</Link>
                  <Link to="/services/dementia-care" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[11px] border-b border-gray-50">Dementia Care</Link>
                  <Link to="/services/physiotherapy" className="block px-5 py-3 hover:bg-emerald-50 hover:text-[#10837f] transition-colors font-semibold text-[11px]">Physiotherapy</Link>
              </div>
            </div>

            <Link to="/faqs" className="hover:text-[#10837f] transition-colors hidden md:block py-4">FAQs</Link>
            
            <div className="hidden md:flex items-center gap-2" tabIndex={0}>
                <div id="google_translate_element"></div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 mr-2">
                <Link to="/refer-patient" className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-2 rounded-full transition-colors text-[10px] font-bold">
                    <UserPlus className="w-3.5 h-3.5" />
                    REFER PATIENT
                </Link>
                <Link to="/apply" className="flex items-center gap-1.5 bg-[#10837f] text-white hover:bg-[#0c6b68] px-3 py-2 rounded-full transition-colors text-[10px]">
                    <FileText className="w-3.5 h-3.5" />
                    JOIN NETWORK
                </Link>
                <a href="https://drive.google.com/file/d/1ofsvGJycBn-JpVeUn9NNW4o1KR0JeIjl/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#0e4e5e] text-white hover:bg-[#093540] px-3 py-2 rounded-full transition-colors text-[10px]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    GOVERNMENT LICENSE
                </a>
            </div>

            <Link to="/dashboard" className="bg-[#d8a846] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#b58b35] transition-colors shadow-[0_4px_10px_rgba(216,168,70,0.3)]">
                MY PORTAL
            </Link>
            <Link to="/contact" className="bg-[#10837f] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#0c6b68] transition-colors shadow-[0_4px_10px_rgba(16,131,127,0.3)]">
                <MessageSquareText className="w-4 h-4" />
                <span className="hidden sm:inline">CONTACT US</span>
            </Link>
        </nav>

      </div>
    </header>
  );
}
