import React, { useState, useEffect } from 'react';
import { Settings2, Type, Contrast, Link as LinkIcon, Volume2, X } from 'lucide-react';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use lazy initialization for state based on localStorage
  const [largeText, setLargeText] = useState(() => localStorage.getItem('acc_largeText') === 'true');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('acc_highContrast') === 'true');
  const [highlightLinks, setHighlightLinks] = useState(() => localStorage.getItem('acc_highlightLinks') === 'true');
  const [ttsEnabled, setTtsEnabled] = useState(() => localStorage.getItem('acc_ttsEnabled') === 'true');

  useEffect(() => {
    localStorage.setItem('acc_largeText', largeText.toString());
    if (largeText) {
      document.body.classList.add('text-lg');
    } else {
      document.body.classList.remove('text-lg');
    }
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem('acc_highContrast', highContrast.toString());
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('acc_highlightLinks', highlightLinks.toString());
    if (highlightLinks) {
      document.body.classList.add('highlight-links');
    } else {
      document.body.classList.remove('highlight-links');
    }
  }, [highlightLinks]);

  useEffect(() => {
    localStorage.setItem('acc_ttsEnabled', ttsEnabled.toString());
    const handleMouseUp = () => {
      if (!ttsEnabled) return;
      const text = window.getSelection()?.toString();
      if (text && text.length > 0) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      window.speechSynthesis.cancel();
    };
  }, [ttsEnabled]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 bg-[#0e4e5e] hover:bg-[#10837f] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center group pointer-events-auto"
        aria-label="Accessibility Options"
      >
        <Settings2 className="w-6 h-6" />
        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Accessibility
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 pointer-events-auto notranslate" translate="no">
          <div className="bg-[#0e4e5e] text-white px-5 py-4 flex justify-between items-center">
            <h3 className="font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Accessibility
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-2">
            <button
              onClick={() => setLargeText(!largeText)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${largeText ? 'bg-[#10837f]/10 text-[#10837f]' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <div className="flex items-center gap-3">
                <Type className={`w-5 h-5 ${largeText ? 'text-[#10837f]' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">Larger Text</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${largeText ? 'bg-[#10837f]' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${largeText ? 'left-5.5' : 'left-0.5'}`} style={{ transform: largeText ? 'translateX(20px)' : 'translateX(0)' }}></div>
              </div>
            </button>
            
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${highContrast ? 'bg-[#10837f]/10 text-[#10837f]' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <div className="flex items-center gap-3">
                <Contrast className={`w-5 h-5 ${highContrast ? 'text-[#10837f]' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">High Contrast</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${highContrast ? 'bg-[#10837f]' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'left-5.5' : 'left-0.5'}`} style={{ transform: highContrast ? 'translateX(20px)' : 'translateX(0)' }}></div>
              </div>
            </button>

            <button
              onClick={() => setHighlightLinks(!highlightLinks)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${highlightLinks ? 'bg-[#10837f]/10 text-[#10837f]' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <div className="flex items-center gap-3">
                <LinkIcon className={`w-5 h-5 ${highlightLinks ? 'text-[#10837f]' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">Highlight Links</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${highlightLinks ? 'bg-[#10837f]' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${highlightLinks ? 'left-5.5' : 'left-0.5'}`} style={{ transform: highlightLinks ? 'translateX(20px)' : 'translateX(0)' }}></div>
              </div>
            </button>

            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${ttsEnabled ? 'bg-[#10837f]/10 text-[#10837f]' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <div className="flex items-center gap-3">
                <Volume2 className={`w-5 h-5 ${ttsEnabled ? 'text-[#10837f]' : 'text-gray-400'}`} />
                <div className="text-left">
                  <span className="font-medium text-sm block">Text Reader</span>
                  <span className="text-[10px] text-gray-500">Highlight text to read aloud</span>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${ttsEnabled ? 'bg-[#10837f]' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${ttsEnabled ? 'left-5.5' : 'left-0.5'}`} style={{ transform: ttsEnabled ? 'translateX(20px)' : 'translateX(0)' }}></div>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
