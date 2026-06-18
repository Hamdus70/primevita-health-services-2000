import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, MessageSquare, Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Keyboard, RefreshCw, AlertTriangle, ShieldCheck, Activity, CheckCircle, Clock } from 'lucide-react';
import Draggable from 'react-draggable';
const DraggableComponent = Draggable as any;
import { motion, AnimatePresence } from 'motion/react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

type CallState =
  | 'idle'
  | 'ringing'
  | 'opening'
  | 'intent_routing'
  | 'assess_continuity'
  | 'chief_complaint'
  | 'symptom_onset'
  | 'symptom_desc'
  | 'symptom_severity'
  | 'symptom_triggers'
  | 'symptom_assoc'
  | 'history_conditions'
  | 'history_meds'
  | 'history_allergies'
  | 'history_social'
  | 'red_flags_chest_pain'
  | 'red_flags_breathing'
  | 'red_flags_weakness'
  | 'red_flags_bleeding'
  | 'clinical_analysis'
  | 'follow_up_phone'
  | 'completed'
  | 'emergency_escalated';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'hotline'>('chat');

  // Text Chat State
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello! How can I assist you with your health needs today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Call Centre Flow State
  const [callState, setCallState] = useState<CallState>('idle');
  const [serviceType, setServiceType] = useState< 'none' | 'clinical' | 'reception' | 'support' >('none');
  const [callDuration, setCallDuration] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micStateEnabled, setMicStateEnabled] = useState(true);
  const [hotlineInput, setHotlineInput] = useState('');
  const [liveCaptions, setLiveCaptions] = useState<string>('Press Connect below to place a telehealth triage call.');
  const [userTranscript, setUserTranscript] = useState<string>('');

  // Patient Accumulated Demographics/EMR state
  const [patientData, setPatientData] = useState({
    name: '',
    isReturning: false,
    lastCondition: '',
    continuityStatus: '',
    chiefComplaint: '',
    onset: '',
    description: '',
    severity: '',
    triggers: '',
    otherSymptoms: '',
    medicalConditions: '',
    medications: '',
    allergies: '',
    socialHistory: '',
    hasChestPain: false,
    hasDiffBreathing: false,
    hasWeaknessConfusion: false,
    hasHeavyBleeding: false,
    possibleDiagnoses: '',
    suggestedMeds: '',
    homeCareAdvice: '',
    investigations: '',
    riskLevel: 'Low',
    phoneNumber: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const draggableRef = useRef<HTMLButtonElement>(null);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastToggleTimeRef = useRef<number>(0);

  const safeToggle = () => {
    const now = Date.now();
    if (now - lastToggleTimeRef.current > 300) {
      setIsOpen(prev => !prev);
      lastToggleTimeRef.current = now;
    }
  };

  const handleDragStart = (e: any) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    startPosRef.current = { x: clientX, y: clientY };
  };

  const handleStop = (e: any) => {
    const clientX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.changedTouches?.[0]?.clientY ?? 0;
    
    if (clientX === 0 && clientY === 0) {
      safeToggle();
      return;
    }

    const dx = clientX - startPosRef.current.x;
    const dy = clientY - startPosRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If user dragged less than 8 pixels, count as an intentional open/close tap
    if (distance < 8) {
      safeToggle();
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    safeToggle();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Handle Call Timer
  useEffect(() => {
    if (callState !== 'idle' && callState !== 'ringing') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callState]);

  // Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        // Start a silence timer
        silenceTimerRef.current = setTimeout(() => {
          // If we are still listening, timeout!
          recognitionRef.current?.stop();
          speak("I'm sorry, I didn't quite catch that. Are you still there?", () => {
             if (micStateEnabled) toggleListening();
          });
        }, 12000); // 12 seconds silence
      };

      recognitionRef.current.onresult = (event: any) => {
        clearTimeout(silenceTimerRef.current!);
        const transcript = event.results[0][0].transcript;
        if (callState === 'idle') {
          setInput(transcript);
          setIsListening(false);
        } else {
          setUserTranscript(transcript);
          handleHotlineInputSubmit(transcript);
        }
      };

      recognitionRef.current.onerror = () => {
        clearTimeout(silenceTimerRef.current!);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        clearTimeout(silenceTimerRef.current!);
        setIsListening(false);
      };
    }
  }, [callState]);

  // Text-To-Speech Functionality
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text: string, onEnd?: () => void) => {
    if (!voiceEnabled) {
      if (onEnd) setTimeout(onEnd, 1000); 
      return;
    }
    
    // Resume speech if paused
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
    }
    
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Simplified voice finding logic
        const voices = window.speechSynthesis.getVoices();
        // Try to find a good voice, but don't strictly require a specific one
        const preferredVoice = voices.find(v => v.lang === 'en-NG') || 
                               voices.find(v => v.lang.startsWith('en-US')) || 
                               voices.find(v => v.lang.startsWith('en')) || 
                               null;
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        // Ensure some reasonable defaults if voice still not found by engine
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        let ended = false;
        const triggerEnd = () => {
            if (!ended) {
                ended = true;
                if (onEnd) onEnd();
            }
        };

        utterance.onend = triggerEnd;
        utterance.onerror = triggerEnd;
        
        window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!micStateEnabled) {
        toast.error("Microphone is currently muted.");
        return;
      }
      try {
        // Attempt to stop just in case it's in a weird state
        recognitionRef.current?.stop();
        setTimeout(() => {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (err) {
                console.error("Speech Recognition start error:", err);
            }
        }, 100);
      } catch (err) {
        // If stop fails (likely because it's already stopped), proceed to start
        try {
            recognitionRef.current?.start();
            setIsListening(true);
        } catch (err2) {
            console.error("Speech Recognition start error:", err2);
        }
      }
    }
  };

  // Dial Telehealth Hotline
  const initiateHotlineCall = () => {
    setCallState('ringing');
    setLiveCaptions("Dialing PrimeVita Telehealth Hotline...");

    // Reset Call Session Data
    setPatientData({
      name: '',
      isReturning: false,
      lastCondition: '',
      continuityStatus: '',
      chiefComplaint: '',
      onset: '',
      description: '',
      severity: '',
      triggers: '',
      otherSymptoms: '',
      medicalConditions: '',
      medications: '',
      allergies: '',
      socialHistory: '',
      hasChestPain: false,
      hasDiffBreathing: false,
      hasWeaknessConfusion: false,
      hasHeavyBleeding: false,
      possibleDiagnoses: '',
      suggestedMeds: '',
      homeCareAdvice: '',
      investigations: '',
      riskLevel: 'Low',
      phoneNumber: '',
    });
    setUserTranscript('');

    // Connect Call after ring animation delay
    setTimeout(() => {
      connectHotlineCall();
    }, 800);
  };

  const connectHotlineCall = () => {
    setCallState('opening');
    const introSpeech = "Welcome to PrimeVita. I am your virtual health support assistant. To ensure I direct you to the right department, may I have your full name, please?";
    setLiveCaptions(introSpeech);
    
    // Speak mandatory intro and then open mic
    speak(introSpeech, () => {
      if (micStateEnabled) {
        // Small delay to ensure synthesis is clearly done and mic is ready
        setTimeout(toggleListening, 500);
      }
    });
  };

  const endHotlineCall = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    setCallState('idle');
    setLiveCaptions("Press Connect below to place a telehealth triage call.");
    setUserTranscript('');
    toast.error("Call Disconnected.");
  };

  // Main flow step-by-step handler
  const handleHotlineInputSubmit = async (text: string) => {
    if (!text.trim()) return;
    setUserTranscript(text);
    setHotlineInput('');
    setIsListening(false); // Stop listening ASAP

    switch (callState) {
      case 'opening': {
        const parsedName = text.trim();
        // NAME VALIDATION: If looks like non-name, re-ask with positive reinforcement
        if (parsedName.length < 3 || ['yes', 'no', 'hi', 'hello', 'ya', 'yeah', 'okay'].includes(parsedName.toLowerCase())) {
          const reAsk = "Thank you for that. To get your file open, may I have your full name, please?";
          setLiveCaptions(reAsk);
          speak(reAsk, () => { if (micStateEnabled) toggleListening(); });
          return;
        }

        const nameLower = parsedName.toLowerCase();
        
        // Continuity Memory Triage Lookups
        let returning = false;
        let prevCondition = '';

        if (nameLower.includes('jane')) {
          returning = true;
          prevCondition = 'mild hypertension and chronic ankle swelling';
        } else if (nameLower.includes('mark')) {
          returning = true;
          prevCondition = 'acute indigestion and chest pressure';
        }

        // Programmatic Firestore Search for Return Calls
        try {
          const q = query(
            collection(db, 'clinicalNotes'),
            where('patientName', '==', parsedName),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            returning = true;
            const d = snap.docs[0].data();
            prevCondition = d.subjective || d.plan || prevCondition || 'previous health symptoms';
          }
        } catch (e) {
          console.warn("Continuity Firestore check failed:", e);
        }

        setPatientData(prev => ({
          ...prev,
          name: parsedName,
          isReturning: returning,
          lastCondition: prevCondition,
        }));

        if (returning) {
          // Returning Patient Script
          setCallState('assess_continuity');
          const scriptStr = `Welcome back ${parsedName}. Last time you reported having ${prevCondition}. How has it been since then? Have you noticed any improvement or worsening?`;
          setLiveCaptions(scriptStr);
          speak(scriptStr, () => {
            if (micStateEnabled) toggleListening();
          });
        } else {
          // New Patient/Intent Routing
          setPatientData(prev => ({
            ...prev,
            name: parsedName,
            isReturning: returning,
            lastCondition: prevCondition,
          }));

          // Routing to Intent
          setCallState('intent_routing');
          const scriptStr = returning 
            ? `Welcome back ${parsedName}. It is good to see you again. Before we discuss your previous health concerns, how can I assist you today? Are you seeking clinical triage, general enquiries, or receptionist support?`
            : `Thank you, ${parsedName}. How can I assist you today? Are you seeking clinical triage, general enquiries, or receptionist support?`;
          setLiveCaptions(scriptStr);
          speak(scriptStr, () => {
            if (micStateEnabled) toggleListening();
          });
        }
        break;
      }
      
      case 'intent_routing': {
         const intent = text.toLowerCase();
         if (intent.includes('clinical') || intent.includes('triage') || intent.includes('medical') || intent.includes('symptom')) {
             setServiceType('clinical');
             if (patientData.isReturning) {
                setCallState('assess_continuity');
                const scriptStr = `Understood. Proceeding with clinical triage. Last time you reported having ${patientData.lastCondition}. How has it been since then?`;
                setLiveCaptions(scriptStr);
                speak(scriptStr, () => { if (micStateEnabled) toggleListening(); });
             } else {
                setCallState('chief_complaint');
                const scriptStr = `I understand. Let's proceed with clinical triage. Please tell me what is bothering you today?`;
                setLiveCaptions(scriptStr);
                speak(scriptStr, () => { if (micStateEnabled) toggleListening(); });
             }
         } else if (intent.includes('reception') || intent.includes('schedule') || intent.includes('appointment')) {
             setServiceType('reception');
             setCallState('ended');
             const scriptStr = `I understand. I am transferring you to our receptionist support line. Please hold while I connect you.`;
             setLiveCaptions(scriptStr);
             speak(scriptStr);
         } else {
             setServiceType('support');
             setCallState('ended');
             const scriptStr = `I understand you have an enquiry. I am transferring you to a support specialist. Please hold while I connect you.`;
             setLiveCaptions(scriptStr);
             speak(scriptStr);
         }
         break;
      }

      case 'assess_continuity': {
        const continuityAns = text.trim();
        setPatientData(prev => ({ ...prev, continuityStatus: continuityAns }));

        setCallState('chief_complaint');
        const scriptStr = `Thank you. I have logged that update. Let's do a complete symptom check-up today. Please tell me: what is the chief complaint bothering you today?`;
        setLiveCaptions(scriptStr);
        speak(scriptStr, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'chief_complaint': {
        const input = text.trim();
        // Validation: Ensure input isn't too short or just a simple interjection
        if (input.length < 5 || ['yes', 'no', 'hi', 'hello'].includes(input.toLowerCase())) {
          const reAsk = "Could you please tell me a bit more about what symptoms you are experiencing?";
          setLiveCaptions(reAsk);
          speak(reAsk, () => { if (micStateEnabled) toggleListening(); });
          return;
        }
        
        setPatientData(prev => ({ ...prev, chiefComplaint: input }));
        setCallState('symptom_onset');
        const nextQ = "At what time or date did these symptoms first manifest?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'symptom_onset': {
        setPatientData(prev => ({ ...prev, onset: text.trim() }));
        setCallState('symptom_desc');
        const nextQ = "Got it. How would you describe the symptom?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'symptom_desc': {
        setPatientData(prev => ({ ...prev, description: text.trim() }));
        setCallState('symptom_severity');
        const nextQ = "On a scale of 1 to 10, how severe is it?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'symptom_severity': {
        setPatientData(prev => ({ ...prev, severity: text.trim() }));
        setCallState('symptom_triggers');
        const nextQ = "Is there anything that makes it better or worse?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'symptom_triggers': {
        setPatientData(prev => ({ ...prev, triggers: text.trim() }));
        setCallState('symptom_assoc');
        const nextQ = "Are you having any other symptoms?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'symptom_assoc': {
        setPatientData(prev => ({ ...prev, otherSymptoms: text.trim() }));
        setCallState('history_conditions');
        const nextQ = "Got it. Let's look at your medical history. Do you have any chronic medical conditions?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'history_conditions': {
        setPatientData(prev => ({ ...prev, medicalConditions: text.trim() }));
        setCallState('history_meds');
        const nextQ = "Are you taking any medications?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'history_meds': {
        setPatientData(prev => ({ ...prev, medications: text.trim() }));
        setCallState('history_allergies');
        const nextQ = "Do you have any drug allergies?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'history_allergies': {
        setPatientData(prev => ({ ...prev, allergies: text.trim() }));
        setCallState('history_social');
        const nextQ = "Do you smoke or drink alcohol?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'history_social': {
        setPatientData(prev => ({ ...prev, socialHistory: text.trim() }));
        // Move into sequential Red Flag Screenings
        setCallState('red_flags_chest_pain');
        const nextQ = "Understood. Important safety screening: Are you experiencing any chest pain?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'red_flags_chest_pain': {
        const rawAns = text.toLowerCase();
        const positive = rawAns.includes('yes') || rawAns.includes('yeah') || rawAns.includes('have') || rawAns.includes('radiat') || rawAns.includes('pressure') || rawAns.includes('hurt');
        setPatientData(prev => ({ ...prev, hasChestPain: positive }));

        if (positive) {
          handleEmergencyTrigger("Chest pain reported");
        } else {
          setCallState('red_flags_breathing');
          const nextQ = "Okay. Are you having any difficulty breathing?";
          setLiveCaptions(nextQ);
          speak(nextQ, () => {
            if (micStateEnabled) toggleListening();
          });
        }
        break;
      }

      case 'red_flags_breathing': {
        const rawAns = text.toLowerCase();
        const positive = rawAns.includes('yes') || rawAns.includes('yeah') || rawAns.includes('have') || rawAns.includes('short') || rawAns.includes('breath') || rawAns.includes('difficult');
        setPatientData(prev => ({ ...prev, hasDiffBreathing: positive }));

        if (positive) {
          handleEmergencyTrigger("Difficulty breathing reported");
        } else {
          setCallState('red_flags_weakness');
          const nextQ = "Understood. Any severe weakness or sudden confusion?";
          setLiveCaptions(nextQ);
          speak(nextQ, () => {
            if (micStateEnabled) toggleListening();
          });
        }
        break;
      }

      case 'red_flags_weakness': {
        const rawAns = text.toLowerCase();
        const positive = rawAns.includes('yes') || rawAns.includes('yeah') || rawAns.includes('weak') || rawAns.includes('confus') || rawAns.includes('dizzy');
        setPatientData(prev => ({ ...prev, hasWeaknessConfusion: positive }));

        if (positive) {
          handleEmergencyTrigger("Severe weakness or confusion reported");
        } else {
          setCallState('red_flags_bleeding');
          const nextQ = "And lastly, do you have any heavy bleeding?";
          setLiveCaptions(nextQ);
          speak(nextQ, () => {
            if (micStateEnabled) toggleListening();
          });
        }
        break;
      }

      case 'red_flags_bleeding': {
        const rawAns = text.toLowerCase();
        const positive = rawAns.includes('yes') || rawAns.includes('yeah') || rawAns.includes('heavy') || rawAns.includes('bleed') || rawAns.includes('hemorrhage');
        setPatientData(prev => ({ ...prev, hasHeavyBleeding: positive }));

        if (positive) {
          handleEmergencyTrigger("Heavy bleeding reported");
        } else {
          // If they pass all Red Flags, proceed to Clinical Analysis State
          setCallState('clinical_analysis');
          generateClinicalAnalysis(text);
        }
        break;
      }

      case 'clinical_analysis': {
        // Move to Follow-up phase
        setCallState('follow_up_phone');
        const nextQ = "Can I have your phone number so we can follow up on your condition?";
        setLiveCaptions(nextQ);
        speak(nextQ, () => {
          if (micStateEnabled) toggleListening();
        });
        break;
      }

      case 'follow_up_phone': {
        const phone = text.replace(/[^0-9+() -]/g, '').trim();
        setPatientData(prev => ({ ...prev, phoneNumber: phone }));
        setCallState('completed');
        
        // Final speech
        const finalAdvice = `Thank you for your cooperation. I have stored your clinical telehealth report in your EMR files. Your home care team has been notified. If your condition gets worse, please visit a hospital. Have a wonderful day!`;
        setLiveCaptions(finalAdvice);
        
        // Save to Firestore!
        await saveCallSessionToFirestore({
          ...patientData,
          phoneNumber: phone,
          riskLevel: 'Low-Moderate'
        });

        speak(finalAdvice);
        break;
      }

      default:
        break;
    }
  };

  // Helper to handle emergency escalation instantly
  const handleEmergencyTrigger = async (cause: string) => {
    setCallState('emergency_escalated');
    const emergencySpeech = "This may be a serious condition. Please go to the nearest hospital immediately or call emergency services.";
    setLiveCaptions(emergencySpeech);
    
    // Auto save critical telemetry to EMR + adminAlerts
    await saveCallSessionToFirestore({
      ...patientData,
      riskLevel: 'HIGH (CRITICAL)',
      possibleDiagnoses: `Potential emergency cardiac or respiratory vascular issue (${cause})`,
      homeCareAdvice: "Emergency hospital transfer instructed immediately. Do not stay home.",
      phoneNumber: patientData.phoneNumber || 'Urgent Triage Contact Needed',
    });

    speak(emergencySpeech);
  };

  // Live generation of clinical analysis
  const generateClinicalAnalysis = (lastText: string) => {
    // Generate intelligent spoken medical overview
    let possibleCauses = "mild gastrointestinal upset or musculoskeletal tension";
    let homeCare = "rest in comfortable Fowler's posture, drink structured warm fluids, and restrict excessive sodium";
    let legalOTC = "standard tablets of acetaminophen (paracetamol)";

    const comp = patientData.chiefComplaint.toLowerCase();
    
    if (comp.includes('cough') || comp.includes('flu') || comp.includes('cold') || comp.includes('fever')) {
      possibleCauses = "viral bronchitis or upper respiratory rhinitis";
      homeCare = "stay fully hydrated with fluids, use steam vaporizers, and monitor deep cough congestion levels";
      legalOTC = "over-the-counter paracetamol for fever reduction and throat lozenges with strict dosage monitoring";
    } else if (comp.includes('stomach') || comp.includes('belly') || comp.includes('nausea') || comp.includes('vomit')) {
      possibleCauses = "mild gastroenteritis, dyspepsia, or dietary allergy indigestion";
      homeCare = "strictly keep a bland diet (toast, rice), sip clear electrolytes, and avoid heavy milk or oils";
      legalOTC = "oral rehydration salts (ORS) or antacids carefully following packaging rules";
    } else if (comp.includes('head') || comp.includes('migraine')) {
      possibleCauses = "tension-type vascular headache or dehydration migraine";
      homeCare = "rest in an entirely dark, quiet room, apply a cool compress to your forehead, and stay hydrated";
      legalOTC = "ibuprofen or acetaminophen under general packaging dosage restrictions";
    } else if (comp.includes('back') || comp.includes('shoulder') || comp.includes('joint') || comp.includes('muscl')) {
      possibleCauses = "musculoskeletal strain or local myofascial joint inflammation";
      homeCare = "reduce physical exertion, use safe warm compresses or general cold packs, and sleep flat";
      legalOTC = "over-the-counter non-steroidal anti-inflammatory or paracetamol cautiously";
    }

    const diagnosisSentence = `Based on what you've told me, this could be related to conditions such as ${possibleCauses}. Your triage risk level appears to be safe and manageable.`;
    const medicationSentence = `For home care: I suggest you ${homeCare}. For discomfort, safe over-the-counter medication options include ${legalOTC}, used strictly with package guidelines. Please avoid medication if you are unsure or allergic.`;
    const scanAdvice = "You may need to do some tests such as blood tests or a scan to confirm this.";

    const fullAnalysis = `${diagnosisSentence} ${medicationSentence} ${scanAdvice}`;
    setLiveCaptions(fullAnalysis);

    setPatientData(prev => ({
      ...prev,
      possibleDiagnoses: possibleCauses,
      suggestedMeds: legalOTC,
      homeCareAdvice: homeCare,
      investigations: 'Blood test or scan as clinically recommended by physician',
      riskLevel: 'Moderate'
    }));

    speak(fullAnalysis, () => {
      // Re-trigger mic to ask for phone number next on state advancement
      setTimeout(() => {
        setCallState('follow_up_phone');
        const phoneQ = "Can I have your phone number so we can follow up on your condition?";
        setLiveCaptions(phoneQ);
        speak(phoneQ, () => {
          if (micStateEnabled) toggleListening();
        });
      }, 1000);
    });
  };

  // Save Call Session to EMR Firestore database
  const saveCallSessionToFirestore = async (finalData: typeof patientData) => {
    try {
      // Match active rosters
      let assignedPatientId = 'CL-JD-0001'; // Default
      const finalName = finalData.name.toLowerCase();
      if (finalName.includes('mark') || finalName.includes('smith')) {
        assignedPatientId = 'CL-MS-0002';
      }

      // Add to clinicalNotes
      const noteDoc = {
        patientId: assignedPatientId,
        patientName: finalData.name || "Telehealth Anonymous",
        authorId: 'Voice AI Triage Nurse',
        noteType: 'telehealth_call',
        subjective: `Telehealth Call Intake. Name: ${finalData.name}. Chief Complaint: ${finalData.chiefComplaint || 'N/A'}. Onset: ${finalData.onset || 'N/A'}. Description: ${finalData.description || 'N/A'}. Severity: ${finalData.severity || 'N/A'}. Triggers: ${finalData.triggers || 'N/A'}. Associated: ${finalData.otherSymptoms || 'N/A'}. Continuity Status: ${finalData.continuityStatus || 'N/A'}`,
        objective: `Vital red flag screening: Chest Pain: ${finalData.hasChestPain ? 'YES' : 'NO'}, Breath Difficulty: ${finalData.hasDiffBreathing ? 'YES' : 'NO'}, Weakness: ${finalData.hasWeaknessConfusion ? 'YES' : 'NO'}, Bleeding: ${finalData.hasHeavyBleeding ? 'YES' : 'NO'}. Severity level input: ${finalData.severity || 'N/A'}. Risk grading: ${finalData.riskLevel}. Phone: ${finalData.phoneNumber || 'N/A'}`,
        assessment: `Symptom exploration suggestions: ${finalData.possibleDiagnoses || 'N/A'}. Clinical history profile: conditions: [${finalData.medicalConditions || 'None'}], medications: [${finalData.medications || 'None'}], allergies: [${finalData.allergies || 'None'}], lifestyle: [${finalData.socialHistory || 'None'}].`,
        plan: `Management guidelines suggested: Home advice: [${finalData.homeCareAdvice || 'N/A'}]. OTC Suggestion: [${finalData.suggestedMeds || 'N/A'}]. Investigations details: [${finalData.investigations || 'N/A'}]. Follow-up telephone: ${finalData.phoneNumber || 'N/A'}. Status: Review Required by Shift Nurse.`,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'clinicalNotes'), noteDoc);

      // Add to dedicated telehealthCalls collection for persistent memory querying
      await addDoc(collection(db, 'telehealthCalls'), {
        ...finalData,
        patientId: assignedPatientId,
        createdAt: serverTimestamp()
      });

      // Trigger high-risk admin alert logic if emergency detected
      if (finalData.riskLevel.includes('HIGH') || finalData.hasChestPain || finalData.hasDiffBreathing) {
        await addDoc(collection(db, 'adminAlerts'), {
          patientName: finalData.name,
          patientId: assignedPatientId,
          summary: `Telehealth Emergency: ${finalData.chiefComplaint || 'Severe Red Flag Symptom Detected'}`,
          severity: 'CRITICAL_HIGH',
          immediateActionRequired: "Call emergency responders / redirect physical home care ambulance.",
          createdAt: serverTimestamp()
        });
        toast.error("HIGH-RISK ALERT SENT: Care team notified immediately!");
      } else {
        toast.success("Telehealth call successfully archived in Patient EMR.");
      }
    } catch (e: any) {
      console.error("Failed to archive clinical call session:", e);
    }
  };

  // Traditional Chatbot message sender
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error('Server Error');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      if (!reader) {
        throw new Error("No reader");
      }

      let assistantResponse = "";
      setMessages(prev => [...prev, { role: 'assistant', text: '' }]);
      setIsLoading(false);

      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              continue;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                assistantResponse = parsed.error;
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                    updated[updated.length - 1] = { role: 'assistant', text: assistantResponse };
                  }
                  return updated;
                });
              } else if (parsed.chunk) {
                assistantResponse += parsed.chunk;
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                    updated[updated.length - 1] = { role: 'assistant', text: assistantResponse };
                  }
                  return updated;
                });
              }
            } catch (e) {
              console.warn("JSON parse error in stream branch:", e, trimmed);
            }
          }
        }
      }

      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          if (dataStr !== '[DONE]') {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.chunk) {
                assistantResponse += parsed.chunk;
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                    updated[updated.length - 1] = { role: 'assistant', text: assistantResponse };
                  }
                  return updated;
                });
              }
            } catch (e) {}
          }
        }
      }

      speak(assistantResponse);

    } catch (error: any) {
      console.error('Chatbot error:', error);
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant' && !updated[updated.length - 1].text) {
          updated[updated.length - 1] = { 
            role: 'assistant', 
            text: "I'm sorry, I seem to be having trouble reaching the medical support team right now. Please try again in a few moments." 
          };
        } else if (updated.length > 0 && updated[updated.length - 1].role === 'user') {
          updated.push({
            role: 'assistant',
            text: "I'm sorry, I seem to be having trouble reaching the medical support team right now. Please try again in a few moments."
          });
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formattedCallDuration = () => {
    const min = Math.floor(callDuration / 60);
    const sec = callDuration % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <>
        <div className="fixed bottom-6 left-6 z-[1000] cursor-move">
          <DraggableComponent 
            nodeRef={draggableRef}
            onStart={handleDragStart}
            onStop={handleStop}
          >
            <button 
              ref={draggableRef as React.RefObject<HTMLButtonElement>}
              onClick={handleButtonClick}
              className="p-4 bg-[#10837f] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all flex items-center gap-2 group border-4 border-white">
              <MessageSquare size={24} />
              <span className="font-semibold whitespace-nowrap text-sm">
                Clinical AI
              </span>
            </button>
          </DraggableComponent>
        </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 left-6 w-96 max-w-[calc(100vw-3rem)] h-[580px] bg-white rounded-3xl shadow-2xl z-[100] flex flex-col border border-gray-200 overflow-hidden">
            
            {/* Widget Top Bar / Tab Toggles */}
            <div className="bg-[#0e4e5e] text-white shrink-0">
              <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#0e4e5e] to-[#10837f] border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full animate-pulse">
                    <Bot size={22} className="text-teal-200" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide">PrimeVita Clinical AI</h3>
                    <p className="text-[10px] text-teal-100/80">Support Hotline & Active EMR Triage</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/25 p-1 rounded-full transition-all text-white/90">
                  <X size={20} />
                </button>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex border-b border-white/10 text-xs text-center font-semibold bg-[#0e4e5e]">
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'chat' ? 'bg-[#10837f] text-white border-b-2 border-white' : 'text-white/70 hover:bg-white/5'}`}>
                  <MessageSquare size={14} /> Traditional Chat
                </button>
                <button 
                  onClick={() => setActiveTab('hotline')}
                  className={`flex-1 py-3 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'hotline' ? 'bg-[#10837f] text-white border-b-2 border-white' : 'text-white/70 hover:bg-white/5'}`}>
                  <Phone size={14} className="animate-bounce" /> Telehealth Hotline
                </button>
              </div>
            </div>

            {/* View Switching */}
            <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
              {activeTab === 'chat' ? (
                /* ----------------- TRADITIONAL TEXT CHAT VIEW ----------------- */
                <>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Welcome hotline suggestion banner */}
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 p-4 rounded-2xl flex gap-3 items-start shadow-sm flex-col">
                      <div className="flex gap-2 items-center text-[#0e4e5e] font-bold text-xs">
                        <Phone size={16} className="text-teal-600 animate-pulse" />
                        <span>Try Simulated Clinical Hotline</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Need formal triage? Switch to the <strong>Telehealth Hotline</strong> tab above to place an interactive spoken triage consultation call.
                      </p>
                    </div>

                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-xs text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#10837f] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-xs text-gray-400 text-xs italic flex items-center gap-2">
                          <Activity className="w-4 h-4 text-[#10837f] animate-spin" />
                          <span>AI Triage Nurse is formulating response...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-2">
                    <button
                      onClick={toggleListening}
                      className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      <Mic size={18} />
                    </button>
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 p-2.5 bg-gray-100 text-sm rounded-full outline-hidden focus:ring-2 focus:ring-[#10837f]/20 transition-all text-gray-800 placeholder:text-gray-400"
                      placeholder="Ask any general health question..."
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="p-3 bg-[#10837f] text-white rounded-full hover:bg-[#0d6e6a] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <Send size={18} />
                    </button>
                  </div>
                </>
              ) : (
                /* ----------------- TELEHEALTH VOICE CALL HOTLINE VIEW ----------------- */
                <div className="flex-1 flex flex-col bg-[#0b2b35] text-white relative overflow-hidden">
                  
                  {callState === 'idle' ? (
                    /* Dialing Idle State */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <button 
                        onClick={initiateHotlineCall}
                        className="flex flex-col items-center gap-2 p-6 bg-teal-500/10 rounded-full mb-6 border border-teal-500/20 relative hover:bg-teal-500/20 transition-all cursor-pointer">
                        <Phone size={44} className="text-teal-400 animate-pulse" />
                        <span className="text-teal-300 font-bold text-xs uppercase tracking-widest">Dial</span>
                        <span className="w-3 h-3 bg-green-400 rounded-full border-2 border-[#0b2b35] absolute top-1 right-1 animate-ping"></span>
                      </button>
                      
                      <h4 className="font-bold text-lg mb-2">PrimeVita Telehealth Line</h4>
                      <p className="text-xs text-slate-300 max-w-sm leading-relaxed mb-6">
                        Place a simulated hands-free voice call to our Triage Call Centre. This AI agent collects symptoms, checks medical history, and saves official HIPAA summaries in the Patient Portal EMR.
                      </p>

                      <div className="bg-slate-800/60 text-left border border-slate-700/50 p-4 rounded-xl text-[11px] text-slate-300 space-y-2 max-w-xs mb-8">
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                          <ShieldCheck size={14} />
                          <span>Clinic Agent Guidelines</span>
                        </div>
                        <p>1. Speaks natural step-by-step triage diagnostics</p>
                        <p>2. Checks return patient histories dynamically</p>
                        <p>3. Screens red flags and coordinates clinic referrals</p>
                      </div>

                      <button 
                        onClick={initiateHotlineCall}
                        className="py-4 px-10 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-base shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95 border-b-4 border-green-800">
                        <Phone size={20} /> Place Telehealth Call
                      </button>
                    </div>
                  ) : (
                    /* Active Hotline Call State */
                    <div className="flex-1 flex flex-col justify-between p-6 overflow-hidden">
                      {/* Audio Telehealth Status Bar */}
                      <div className="flex justify-between items-center bg-[#072027] p-2.5 rounded-xl border border-teal-950">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                            {callState === 'ringing' ? 'Ringing Hotline...' : 'Clinical Call Connected'}
                          </span>
                        </div>
                        <div className="bg-teal-950 text-teal-300 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock size={10} />
                          <span>{formattedCallDuration()}</span>
                        </div>
                      </div>

                      {/* Giant Pulse Call waves visualization */}
                      <div className="my-auto flex flex-col items-center justify-center py-4">
                        <div className="relative flex items-center justify-center w-24 h-24 bg-teal-500/10 rounded-full mb-4 border border-teal-500/20">
                          {/* Pulsing visual circles */}
                          <div className="absolute w-full h-full bg-teal-500/5 rounded-full animate-ping"></div>
                          <PhoneOff size={32} className={`${callState === 'emergency_escalated' ? 'text-red-500' : 'text-teal-400'} animate-bounce`} />
                        </div>

                        {/* Animated Soundwave bars */}
                        <div className="flex gap-1 h-8 items-center mt-2">
                          {[...Array(9)].map((_, idx) => (
                            <motion.div
                              key={idx}
                              animate={{ 
                                height: callState === 'ringing' 
                                  ? [4, 8, 4] 
                                  : isListening 
                                    ? [4, 24, 4] 
                                    : [4, 16, 4]
                              }}
                              transition={{ 
                                duration: 0.6, 
                                repeat: Infinity, 
                                delay: idx * 0.08 
                              }}
                              className={`w-1 rounded-full ${callState === 'emergency_escalated' ? 'bg-red-500' : 'bg-teal-400'}`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-teal-300/80 mt-2 font-semibold">
                          {isListening ? "CALLER TRANSCRIPT ACTIVE..." : "AI AGENT IS SPEAKING..."}
                        </p>
                      </div>

                      {/* Live Captions Display Box */}
                      <div className="bg-[#051a20] border border-teal-950/80 rounded-2xl p-4 text-xs font-medium leading-relaxed shadow-inner max-h-[160px] overflow-y-auto space-y-2 flex flex-col">
                        <div className="text-[10px] text-teal-400 uppercase tracking-wider font-extrabold flex items-center justify-between">
                          <span>📋 Telehealth Agent Transcript</span>
                          {voiceEnabled ? (
                            <span className="text-[9px] text-emerald-500 flex items-center gap-0.5 font-bold animate-pulse"><Volume2 size={10}/> Spoken TTS On</span>
                          ) : (
                            <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><VolumeX size={10}/> Spoken TTS Muted</span>
                          )}
                        </div>
                        <p className="text-slate-100">{liveCaptions}</p>
                        
                        {userTranscript && (
                          <div className="border-t border-teal-950/80 pt-2 text-slate-300">
                            <span className="text-slate-500 font-bold font-mono">You:</span> "{userTranscript}"
                          </div>
                        )}
                      </div>

                      {/* Text Input Fallback / Control panel */}
                      <div className="mt-4 space-y-3 shrink-0">
                        {/* Text Fallback Row */}
                        <div className="flex gap-2 bg-[#051a20] p-1.5 rounded-full border border-teal-950">
                          <input 
                            type="text" 
                            value={hotlineInput}
                            onChange={(e) => setHotlineInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleHotlineInputSubmit(hotlineInput)}
                            placeholder="Type response fallback here..."
                            className="bg-transparent border-0 ring-0 focus:ring-0 outline-hidden pl-4 pr-2 flex-1 text-xs text-white"
                          />
                          <button 
                            type="button"
                            onClick={() => handleHotlineInputSubmit(hotlineInput)}
                            disabled={!hotlineInput.trim()}
                            className="p-2 bg-teal-600 hover:bg-teal-500 rounded-full text-white disabled:opacity-30">
                            <Send size={12} />
                          </button>
                        </div>

                        {/* Call control Buttons */}
                        <div className="flex justify-between items-center gap-3 text-xs">
                          {/* Toggle Voice output */}
                          <button 
                            onClick={() => {
                              setVoiceEnabled(!voiceEnabled);
                              if (voiceEnabled) window.speechSynthesis.cancel();
                            }}
                            className={`flex-1 py-2 px-3 rounded-lg border transition-all flex items-center justify-center gap-1.5 ${voiceEnabled ? 'bg-teal-800/30 text-teal-300 border-teal-800' : 'bg-slate-800/10 text-slate-400 border-slate-800/40'}`}>
                            {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />} Voice output
                          </button>

                          {/* Toggle Mic input */}
                          <button 
                            onClick={() => {
                              setMicStateEnabled(!micStateEnabled);
                              if (isListening) recognitionRef.current?.stop();
                            }}
                            className={`flex-1 py-2 px-3 rounded-lg border transition-all flex items-center justify-center gap-1.5 ${micStateEnabled ? 'bg-teal-800/30 text-teal-300 border-teal-800' : 'bg-red-950/40 text-red-400 border-red-950/80'}`}>
                            {micStateEnabled ? <Mic size={14} /> : <MicOff size={14} />} Mic Capturing
                          </button>

                          {/* End call button */}
                          <button 
                            onClick={endHotlineCall}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 border border-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 text-center justify-center transition-all">
                            <PhoneOff size={14} /> Disconnect
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
