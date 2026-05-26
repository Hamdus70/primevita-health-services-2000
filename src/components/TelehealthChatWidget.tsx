import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Video, X, Send, Camera, CameraOff, Mic, MicOff, AlertCircle, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';

export function TelehealthChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'waiting'>('chat');
  const [isConnected, setIsConnected] = useState(false);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [threadId, setThreadId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Waiting Room state
  const [camEnabled, setCamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camError, setCamError] = useState<string | null>(null);

  const location = useLocation();
  const user = { id: 'demo-user' }; // Mocked user

  const isDashboardRoute = location.pathname.includes('/portal') || location.pathname.includes('/dashboard');

  useEffect(() => {
    // Optionally only fetch if isOpen, but for testing let's just fetch if authenticated
    if (!user) return;
    const currentThreadId = user.id; // Using user.id as threadId
    setThreadId(currentThreadId);

    const q = query(collection(db, 'messages'), where('threadId', '==', currentThreadId));
    
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
    });

    return () => unsubscribe();
  }, [user.id]);

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

    try {
        await addDoc(collection(db, 'messages'), {
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
             await addDoc(collection(db, 'messages'), {
                 threadId: threadId,
                 senderId: 'system',
                 receiverId: threadId,
                 sender: 'Dr. Sarah',
                 role: 'doctor',
                 content: 'I see your message. Do you have a moment for a quick video consultation?',
                 createdAt: serverTimestamp()
             });
        }, 2000);
    } catch(err: any) {
        toast.error("Message failed to send. " + err.message);
    }
  };

  const handleJoinCall = () => {
      setIsConnected(true);
      // Simulate answering the call
      setTimeout(() => {
          toast.success("Connected to Telehealth session.");
      }, 500);
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
        <div className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 pointer-events-auto">
          
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shrink-0">
            <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                    PrimeVita Secure Chat
                </h3>
                <p className="text-[10px] text-blue-100 opacity-80 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Clinical Team Online
                </p>
            </div>
            <div className="flex items-center gap-1">
                {view === 'chat' && (
                    <button onClick={() => setView('waiting')} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Start Telehealth Call">
                        <Video className="w-4 h-4" />
                    </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
              
              {/* CHAT VIEW */}
              {view === 'chat' && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                                <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.sender} • {formatTime(msg.createdAt)}</span>
                                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : msg.role === 'system' ? 'bg-[#10837f]/10 text-[#0e4e5e] border border-[#10837f]/20 rounded-tl-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a secure message..."
                                className="flex-1 border border-gray-200 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 disabled:text-gray-400 disabled:bg-transparent hover:bg-blue-50 rounded-full transition-colors">
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
                            <h5 className="text-sm font-bold text-gray-800">Connection Status</h5>
                            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-50">
                                <span className="text-gray-500">Video Server:</span>
                                <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Connected</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Provider Status:</span>
                                <span className="text-orange-500 font-semibold animate-pulse">Waiting for host...</span>
                            </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex gap-3 mt-auto">
                          <Button variant="outline" className="flex-1" onClick={() => { setView('chat'); setIsConnected(false); }}>
                              Cancel
                          </Button>
                          <Button 
                              className={`flex-1 ${isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                              onClick={handleJoinCall}
                          >
                              {isConnected ? 'Joined' : <><PhoneCall className="w-4 h-4 mr-2" /> Join Call</>}
                          </Button>
                      </div>
                  </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}
