import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileWarning, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenAI, Type } from "@google/genai";
// import { useSession } from 'next-auth/react';

let aiPromise: GoogleGenAI | null = null;
try {
  aiPromise = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  // Graceful fallback if NO key
}

type AIInvestigatorTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  onSafeSubmit?: (text: string) => void;
  staffName?: string;
  role?: string;
};

export function AIInvestigatorTextarea({ onSafeSubmit, staffName = "Unknown Staff", role = "Unknown", className, ...props }: AIInvestigatorTextareaProps) {
  const [text, setText] = useState<string>(props.value as string || '');
  const [warnings, setWarnings] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = { id: 'demo-user' }; // Mocked user

  useEffect(() => {
    if (props.value !== undefined && props.value !== text) {
      setText(props.value as string);
    }
  }, [props.value]);

  useEffect(() => {
    if (!text || text.trim().length < 5) {
      setWarnings([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      analyzeText(text);
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timeoutId);
  }, [text]);

  const analyzeText = async (currentText: string) => {
    if (!aiPromise) return;

    setIsAnalyzing(true);
    try {
      const response = await aiPromise.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an AI Clinical Legal Compliance Investigator. Analyze the following caregiver/clinical note. 
Do NOT structure or clean up the note. Your ONLY job is to highlight inappropriate, subjective, legally risky, or negligent documentation.
Identify specific phrases that are "not good enough" or pose litigation risks (e.g. saying "I forgot", "I hit", "ignored", "annoying patient", etc).
Explain WHY it is not good enough, and back it up with a supporting law, constitution, or medical ethics principle (e.g. HIPAA, Medical Negligence, Battery, Non-maleficence).
If the text is fine, return an empty array.

NOTE TO ANALYZE:
"${currentText}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING, description: "The exact risky phrase or word from the text." },
                        law: { type: Type.STRING, description: "The specific law, constitutional right, or ethical principle violated." },
                        details: { type: Type.STRING, description: "Detailed explanation of why the input is not good enough." },
                        alertAdmin: { type: Type.BOOLEAN, description: "True if the risk is high enough to warrant admin notification." },
                    },
                    required: ["word", "law", "details", "alertAdmin"]
                }
            }
        }
      });

      if (response.text) {
          const parsed = JSON.parse(response.text);
          setWarnings(parsed);
          
          parsed.forEach((w: any) => {
              if (w.alertAdmin) logToAdmin(w, currentText);
          });
      }
    } catch (e) {
      console.error("AI Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const logToAdmin = async (warning: any, contextText: string) => {
    if (!user) return;
    // Prevent spamming
    const cacheKey = `ai_alert_${warning.word.replace(/\s+/g,'_')}_${user.id}`;
    if (sessionStorage.getItem(cacheKey)) return;
    
    try {
        await addDoc(collection(db, 'ai_reports'), {
          staffId: user.id,
          staffName,
          role,
          triggerWord: warning.word,
          violation: warning.law,
          context: contextText,
          timestamp: serverTimestamp(),
          status: 'UNREAD'
        });
        sessionStorage.setItem(cacheKey, 'true');
    } catch (e) {
      console.error("Failed to log AI report", e);
    }
  };

  return (
    <div className="relative flex flex-col gap-2" ref={containerRef}>
      <div className="relative">
        <Textarea 
          {...props} 
          value={text} 
          onChange={(e) => {
            setText(e.target.value);
            if (props.onChange) props.onChange(e);
          }}
          className={`w-full ${className || ''} ${warnings.length > 0 ? 'border-red-400 focus-visible:ring-red-400 bg-red-50/30' : ''}`}
        />
        {isAnalyzing && (
            <div className="absolute top-2 right-2 text-[#10837f]">
               <Loader2 className="w-5 h-5 animate-spin" />
            </div>
        )}
        {!isAnalyzing && warnings.length > 0 && (
          <div className="absolute top-2 right-2 text-red-500 animate-pulse">
            <AlertCircle className="w-5 h-5 pointer-events-none" />
          </div>
        )}
      </div>
      
      {warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
            <FileWarning className="w-5 h-5" />
            <span>AI Investigator Alert: Clinical Documentation Risk</span>
          </div>
          <div className="space-y-3">
            {warnings.map((w, idx) => (
              <div key={idx} className="text-sm bg-white p-3 rounded shadow-sm border border-red-100">
                <p className="text-red-900 leading-tight mb-2">
                  <span className="font-bold bg-red-100 text-red-800 px-1 rounded break-words">"{w.word}"</span> 
                  {' '}is not appropriate. 
                </p>
                <div className="space-y-1">
                    <p className="text-gray-700"><strong>Why:</strong> {w.details}</p>
                    <p className="text-sm text-red-700"><strong>Supporting Legal/Ethical Principle:</strong> {w.law}</p>
                </div>
                {w.alertAdmin && (
                   <p className="text-xs font-bold text-red-600 uppercase mt-2 border-t border-red-100 pt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3"/> Admin Notified due to severity
                   </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
