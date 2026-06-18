import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Video, X, Send, Camera, CameraOff, Mic, MicOff, AlertCircle, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { db, getAuthClient, handleFirestoreError, OperationType } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';

export function TelehealthChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'waiting'>('chat');
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [threadId, setThreadId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
        setInputMode('text');
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setInputMode('text');
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleInputMode = () => {
    setInputMode(prev => prev === 'text' ? 'voice' : 'text');
    if (inputMode === 'text') {
        // Switching to voice: start listening
        if (!isListening) toggleListening();
    } else {
        // Switching to text: stop listening
        if (isListening) toggleListening();
    }
  };

  // Waiting Room state
  const [camEnabled, setCamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camError, setCamError] = useState<string | null>(null);

  const location = useLocation();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isDashboardRoute = location.pathname.includes('/portal') || location.pathname.includes('/dashboard');

  useEffect(() => {
    const auth = getAuthClient();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ id: u.uid, email: u.email || undefined });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authLoading || !user) {
      setMessages([]);
      return;
    }
    const currentThreadId = user.id; // Using user.id as threadId
    setThreadId(currentThreadId);

    const path = 'messages';
    const q = query(collection(db, path), where('threadId', '==', currentThreadId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: any[] = [];
        snapshot.forEach((doc) => {
            msgs.push({ id: doc.id, ...doc.data() });
        });
        msgs.sort((a, b) => {
           const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
           const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
           return timeA - timeB;
        });
        
        if (msgs.length === 0) {
            msgs.push({
                id: 'system-initial',
                sender: 'Clinical Team',
                role: 'system',
                content: 'Hello! How can we help you today? A nurse or doctor will respond shortly.',
                createdAt: { toMillis: () => Date.now() }
            });
        }
        setMessages(msgs);
    }, (error) => {
        console.error("Error fetching messages:", error);
        handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, view]);

  useEffect(() => {
    if (view === 'waiting' && camEnabled) {
      setCamError(null);
      navigator.mediaDevices.getUserMedia({ video: true, audio: micEnabled })
        .then(str => {
          setStream(str);
          if (videoRef.current) {
            videoRef.current.srcObject = str;
          }
        })
        .catch(err => {
            console.error("Camera/Mic access denied or error:", err);
            setCamError("Camera or Microphone access was denied or is unavailable. Please check your browser permissions.");
            setCamEnabled(false);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
      }
    }
    
    // Cleanup on unmount or view change
    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [view, camEnabled, micEnabled]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !threadId || !user) return;
    
    const textToSend = newMessage;
    setNewMessage('');

    const path = 'messages';
    try {
        await addDoc(collection(db, path), {
            threadId: threadId,
            senderId: user.id || 'anonymous',
            receiverId: 'clinical_team',
            sender: 'You',
            role: 'user',
            content: textToSend,
            createdAt: serverTimestamp()
        });
        
        // Simulate auto-reply from Clinical Team
        setTimeout(async () => {
             try {
                 await addDoc(collection(db, path), {
                     threadId: threadId,
                     senderId: 'system',
                     receiverId: threadId,
                     sender: 'Dr. Sarah',
                     role: 'doctor',
                     content: 'I see your message. Do you have a moment for a quick video consultation?',
                     createdAt: serverTimestamp()
                 });
             } catch (err: any) {
                 console.error("Failed to post clinical auto-reply simulated message", err);
             }
         }, 2000);
    } catch(err: any) {
        toast.error("Message failed to send. " + err.message);
        handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleJoinCall = () => {
      setCallStatus('connecting');
      setIsConnected(true);
      // Simulate answering the call
      setTimeout(() => {
          setCallStatus('active');
          toast.success("Connected to Telehealth session.");
      }, 500);
  };

  // Reconnection Mechanism
  useEffect(() => {
    // This is where real WebSocket or MediaStream reconnect logic would go.

    const handleConnectionError = () => {
        if (callStatus === 'active') {
            setCallStatus('connecting');
            toast.error("Connection lost. Attempting to reconnect...");
            // Real reconnection logic here...
        }
    };
    
    // Placeholder for actual event listeners
    // Example: mediaStream.addEventListener('error', handleConnectionError);
    // return () => mediaStream.removeEventListener('error', handleConnectionError);
  }, [callStatus]);
  
  const handleEndCall = async () => {
    setCallStatus('ended');
    setIsConnected(false);
    // Summarize messages and save
    const transcript = messages.map(m => `${m.sender}: ${m.content}`).join('\n');
    if (user && threadId) {
        try {
            await addDoc(collection(db, 'telehealth_transcripts'), {
                threadId,
                patientId: user.id,
                transcript,
                createdAt: serverTimestamp()
            });
            toast.success("Call ended and transcript saved to EMR.");
        } catch (error) {
            console.error("Error saving transcript:", error);
            // We do not toast an error here if the call already ended, just log.
        }
    }
  };

  const formatTime = (ts: any) => {
      if (!ts) return '';
      const date = ts.toDate ? ts.toDate() : new Date(ts.toMillis ? ts.toMillis() : Date.now());
      return date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
  }

  if (!isDashboardRoute) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center group pointer-events-auto"
        aria-label="Secure Clinical Chat"
      >
        <MessageSquare className="w-6 h-6" />
        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Contact Clinical Team
        </span>
      </button>

      {/* Main Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 pointer-events-auto">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#10837f] to-[#0d6e6a] text-white flex justify-between items-center shrink-0">
            <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                    PrimeVita Secure Chat
                </h3>
                <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Clinical Team Online
                </p>
            </div>
            <div className="flex items-center gap-1">
                {view === 'chat' && (
                    <button onClick={() => setView('waiting')} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Start Telehealth Call">
                        <Video className="w-5 h-5" />
                    </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
              
              {/* CHAT VIEW */}
              {view === 'chat' && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10 text-sm">
                                {!user ? "Please sign in to start a secure clinical chat." : "No messages yet."}
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                                <span className="text-[10px] text-gray-400 mb-1 px-1">{msg.sender} • {formatTime(msg.createdAt)}</span>
                                <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.role === 'user' ? 'bg-[#10837f] text-white rounded-tr-none' : msg.role === 'system' ? 'bg-gray-100/70 text-gray-800 border border-gray-200 rounded-tl-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={toggleInputMode}
                                className={`p-3 rounded-full transition-all ${inputMode === 'voice' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                <Mic className="w-4 h-4" />
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={!user || inputMode === 'voice'}
                                placeholder={user ? (inputMode === 'voice' ? "Listening..." : "Type or speak a message...") : "Please sign in to chat..."}
                                className="flex-1 border-0 bg-gray-100 rounded-full pl-5 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10837f]/20 disabled:bg-gray-50 disabled:text-gray-400"
                            />
                            <button type="submit" disabled={!newMessage.trim() || !user} className="p-3 bg-[#10837f] text-white rounded-full hover:bg-[#0d6e6a] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                  </>
              )}

              {/* WAITING ROOM VIEW */}
              {view === 'waiting' && (
                  <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                      <div className="text-center mb-6">
                        <h4 className="font-bold text-gray-900 text-lg">Telehealth Waiting Room</h4>
                        <p className="text-xs text-gray-500 mt-1">Check your video & audio before joining</p>
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        {/* Call Status & Dial Button (Prominent) */}
                        <div className="text-center mb-6">
                            <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 ${callStatus === 'active' ? 'bg-green-100 text-green-800' : callStatus === 'connecting' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>
                                {callStatus === 'idle' ? 'Ready for Call' : callStatus.toUpperCase()}
                            </div>
                            
                            {!isConnected && (
                                <button 
                                    onClick={handleJoinCall}
                                    className="w-24 h-24 bg-[#10837f] rounded-full flex flex-col items-center justify-center mx-auto hover:bg-[#0d6e6a] transition-all shadow-xl hover:scale-105 active:scale-95 z-20 gap-1"
                                >
                                    <PhoneCall className="w-8 h-8 text-white" />
                                    <span className="text-white font-bold text-xs uppercase">Dial</span>
                                </button>
                            )}
                        </div>

                        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center mb-6">
                            {camEnabled ? (
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                            ) : (
                                <div className="text-center text-gray-500 flex flex-col items-center">
                                    <CameraOff className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">Camera is off</span>
                                </div>
                            )}

                            {/* Self-view controls overlay */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3">
                                <button 
                                    onClick={() => setMicEnabled(!micEnabled)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${micEnabled ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500/80 text-white hover:bg-red-600/80'}`}
                                >
                                    {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                                </button>
                                <button 
                                    onClick={() => setCamEnabled(!camEnabled)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${camEnabled ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500/80 text-white hover:bg-red-600/80'}`}
                                >
                                    {camEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {camError && (
                            <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex gap-2 items-start">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{camError}</p>
                            </div>
                        )}

                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 mb-6 relative">
                            <h5 className="text-sm font-bold text-gray-800">Call Details</h5>
                            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-50">
                                <span className="text-gray-500">Status:</span>
                                <span className={`font-semibold ${callStatus === 'active' ? 'text-green-600' : callStatus === 'connecting' ? 'text-blue-600' : 'text-gray-500'}`}>{callStatus.toUpperCase()}</span>
                            </div>
                            
                            {isConnected && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-full ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                                        </button>
                                        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                        
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="rounded-full h-8"
                                            onClick={() => toast.success("AI Agent active and listening...")}
                                        >
                                            <MessageSquare className="w-3 h-3 mr-1" /> Agent
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                      </div>

                      <div className="shrink-0 flex gap-3 mt-auto">
                          <Button variant="outline" className="flex-1" onClick={() => { setView('chat'); setIsConnected(false); setCallStatus('idle'); }}>
                              Cancel
                          </Button>
                          {isConnected ? (
                              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleEndCall}>
                                  End Call
                              </Button>
                          ) : (
                              <Button 
                                  className={`flex-1 ${isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                  onClick={handleJoinCall}
                                  disabled={callStatus === 'connecting'}
                              >
                                  {callStatus === 'connecting' ? 'Connecting...' : <><PhoneCall className="w-4 h-4 mr-2" /> Join Call</>}
                              </Button>
                          )}
                      </div>
                  </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}
