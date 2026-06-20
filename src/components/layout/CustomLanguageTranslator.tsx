import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES_LIST: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
];

export function CustomLanguageTranslator() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Retrieve current active language from googleTranslate cookie
  const getSelectedLanguage = (): string => {
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // Fallback to the hidden select element value if available
    const selectEl = document.querySelector('#google_translate_element select.goog-te-combo') as HTMLSelectElement | null;
    if (selectEl && selectEl.value) {
      return selectEl.value;
    }
    return 'en';
  };

  useEffect(() => {
    // Initial load
    setCurrentLang(getSelectedLanguage());

    // Sync state periodically in case Google Translate API makes updates
    const interval = setInterval(() => {
      const activeLang = getSelectedLanguage();
      if (activeLang !== currentLang) {
        setCurrentLang(activeLang);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [currentLang]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    // Write to Google Translate cookie directly
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;

    // Try triggering the combobox change event
    const selectEl = document.querySelector('#google_translate_element select.goog-te-combo') as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // Lazy search fallback
      setTimeout(() => {
        const retrySelectEl = document.querySelector('#google_translate_element select.goog-te-combo') as HTMLSelectElement | null;
        if (retrySelectEl) {
          retrySelectEl.value = langCode;
          retrySelectEl.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          // If scripts are still loading but user clicks, we reload to apply the cookie-based translation
          window.location.reload();
        }
      }, 100);
    }
  };

  const activeLanguage = LANGUAGES_LIST.find(l => l.code === currentLang) || LANGUAGES_LIST[0];

  return (
    <div id="custom-language-container" className="relative inline-block" ref={containerRef}>
      {/* Beautiful G-Translate Style Custom Button */}
      <button
        id="translate-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-[#10837f]/5 hover:bg-[#10837f]/10 active:scale-95 border border-[#10837f]/20 hover:border-[#10837f]/40 transition-all duration-200 px-2.5 py-1 rounded-full shadow-sm text-[#10837f] font-bold text-[11px] select-none cursor-pointer h-8 shrink-0 outline-none"
        aria-label="Select Language"
        title="Translate Website"
      >
        {/* Authentic Multi-Color Google Icon Logo */}
        <svg id="google-logo-svg" className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 hover:rotate-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22c-.22-.6-.35-1.3-.35-2.6z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335"/>
        </svg>

        <span id="active-flag-span" className="text-xs">{activeLanguage.flag}</span>
        <span id="active-lang-name" className="uppercase tracking-wider hidden xs:inline-block text-[10px]">{activeLanguage.name}</span>
        <ChevronDown id="active-chevron-down" className={`w-3 h-3 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Prominent, drop-down style language menu */}
      {isOpen && (
        <div
          id="custom-language-menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-[#10837f]/15 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150"
        >
          <div className="bg-[#10837f]/5 px-4 py-2.5 border-b border-[#10837f]/10">
            <span className="font-bold text-[10px] text-[#0e4e5e] uppercase tracking-wider block">Translate Website</span>
          </div>
          
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 py-1">
            {LANGUAGES_LIST.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  id={`lang-option-${lang.code}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer select-none outline-none ${
                    isSelected 
                      ? 'bg-emerald-50 text-[#10837f] font-bold' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#10837f]'
                  }`}
                  style={{ minHeight: '44px' }} // Highly finger-friendly target size for all devices
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold leading-none">{lang.name}</span>
                      <span className="text-[10px] text-gray-400 font-medium leading-none mt-1">{lang.nativeName}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#10837f] shrink-0" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
