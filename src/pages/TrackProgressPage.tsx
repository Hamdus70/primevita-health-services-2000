import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Search, ArrowRight } from 'lucide-react';

export default function TrackProgressPage() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Simulate that it sends an email with the link, but for demo just redirect to a mock token
            navigate(`/track-application/mock-token-12345`);
        }, 1000);
    };

    return (
        <div className="flex bg-white items-center justify-center min-h-screen py-10 px-4">
            <div className="w-full max-w-md bg-white border border-gray-100 shadow-xl rounded-3xl p-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-[#5F55EE]" strokeWidth={2} />
                </div>
                
                <h1 className="text-4xl font-serif italic font-bold text-[#05445E] mb-2 text-center">Track Progress</h1>
                <p className="text-xs font-bold uppercase tracking-widest text-[#88B0C3] mb-6 text-center">Global Pipeline Access</p>
                <p className="text-sm text-[#05445E] text-center mb-8 px-4">
                    Enter your registered email or tracking token to establish a secure handshake.
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-[#5F55EE]" />
                        </div>
                        <Input 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Email or Token"
                            className="pl-12 h-14 rounded-2xl border-[#D7CCFF] text-[#05445E] placeholder-[#88B0C3] focus-visible:ring-[#5F55EE]"
                            required
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="w-full bg-[#AF9CFF] hover:bg-[#9B89E5] text-white h-14 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all"
                        disabled={loading}
                    >
                        {loading ? 'REQUESTING...' : (
                            <span className="flex items-center justify-center gap-2">
                                REQUEST SECURE LINK <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
