import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { getDb, getAuthClient } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

export function SecurePatientChat({ patientId }: { patientId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuthClient();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading || !patientId || !user) return;
    
    const q = query(collection(getDb(), 'messages'), where('threadId', '==', patientId));
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
        setMessages(msgs);
    }, (error) => {
        console.error("Error fetching messages:", error);
        toast.error("Error fetching messages: " + error.message);
    });

    return () => unsubscribe();
  }, [patientId, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !patientId || !user) return;
    
    const textToSend = newMessage;
    setNewMessage('');

    try {
        await addDoc(collection(getDb(), 'messages'), {
            threadId: patientId,
            senderId: user.uid,
            receiverId: patientId,
            sender: user.email || 'Clinical Team',
            role: 'doctor', // clinician marker
            content: textToSend,
            createdAt: serverTimestamp()
        });
    } catch(err: any) {
        toast.error("Message failed to send. " + err.message);
    }
  };

  if (loading) return <div>Loading chat...</div>;
  if (!user) return <div>Please sign in to chat.</div>;

  const formatTime = (ts: any) => {
      if (!ts) return '';
      const date = ts.toDate ? ts.toDate() : new Date(ts.toMillis ? ts.toMillis() : Date.now());
      return date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border overflow-hidden min-h-[400px]">
        <div className="bg-[#0e4e5e] text-white p-3 font-semibold text-sm flex items-center justify-between shrink-0">
            Secure Chat with Patient
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10 text-sm">No messages yet.</div>
            )}
            {messages.map((msg) => {
                const isMine = msg.role !== 'user';
                return (
                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.sender} • {formatTime(msg.createdAt)}</span>
                        <div className={`p-3 rounded-2xl text-sm ${isMine ? 'bg-[#10837f] text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                            {msg.content}
                        </div>
                    </div>
                )
            })}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a secure message..."
                    className="flex-1 border border-gray-300 bg-gray-50 focus:bg-white rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#10837f] focus:ring-1 focus:ring-[#10837f] transition-colors"
                />
                <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#10837f] disabled:text-gray-400 hover:bg-[#10837f]/10 rounded-full transition-colors">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    </div>
  );
}
