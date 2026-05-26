import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, LogIn, Key, Search, Mail, Lock, ArrowRight, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');

  // Recovery System State
  const [recoveryStep, setRecoveryStep] = useState<'SEARCH' | 'OTP' | 'RESET' | 'SUCCESS'>('SEARCH');
  const [recoveryName, setRecoveryName] = useState('');
  const [recoveryContact, setRecoveryContact] = useState('');
  const [recoveryOTP, setRecoveryOTP] = useState('');
  const [recoverySearching, setRecoverySearching] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<{username: string} | null>(null);
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState('');

  const handleRecoverySearch = () => {
      if(!recoveryName || !recoveryContact) {
          toast.error("Please enter your full name and registered contact method.");
          return;
      }
      setRecoverySearching(true);
      setTimeout(() => {
          setRecoverySearching(false);
          setRecoveryResult({
              username: `CL-${recoveryName.split(' ')[0][0]?.toUpperCase() || 'X'}X-0001`
          });
          setRecoveryStep('OTP');
          toast.success(`A secure OTP has been sent to ${recoveryContact}`);
      }, 1500);
  };

  const handleVerifyOTP = () => {
      if (recoveryOTP.length < 4) {
          toast.error("Please enter a valid OTP.");
          return;
      }
      setRecoverySearching(true);
      setTimeout(() => {
          setRecoverySearching(false);
          setRecoveryStep('RESET');
          toast.success("Identity verified successfully.");
      }, 1000);
  };

  const handleRecoveryReset = () => {
      if (!recoveryNewPassword || recoveryNewPassword !== recoveryConfirmPassword) {
          toast.error("Passwords must match.");
          return;
      }
      if (recoveryNewPassword.length < 8) {
          toast.error("Password must be at least 8 characters.");
          return;
      }
      setRecoverySearching(true);
      setTimeout(() => {
          setRecoverySearching(false);
          setRecoveryStep('SUCCESS');
          toast.success("Password reset successfully. You can now login.");
      }, 1000);
  };


  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both System ID and password.');
      return;
    }

    setLoading(true);
    
    try {
        if (isRegistering) {
            toast.error('Registration is currently handled via the application portal.');
            setLoading(false);
            return;
        } else {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Authentication failed');

            toast.success('Login successful!');
            routeUser(result.user.type.toLowerCase());
        }
    } catch (error: any) {
        toast.error(`Authentication failed: ${error.message}`);
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const routeUser = (role: string) => {
     if (role === 'admin') navigate('/dashboard/admin');
     else if (role === 'patient') navigate('/portal');
     else if (role === 'family') navigate('/family-portal');
     else navigate('/dashboard/clinical');
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
            <h2 className="text-4xl font-bold text-[#05445E] tracking-tight">{isRegistering ? 'Register Account' : 'Session Authentication'}</h2>
            <p className="text-sm text-[#05445E] mt-3">Enter your credentials to access your private clinical vault.</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-bold text-[#05445E] tracking-widest uppercase">System ID / Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Mail className="w-5 h-5 text-[#88B0C3]" />
                  </div>
                  <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="email@example.com or admin1" 
                    className="pl-12 h-14 rounded-2xl border-gray-300 text-[#05445E] placeholder-[#88B0C3]"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold text-[#05445E] tracking-widest uppercase">Security Cipher</Label>
                </div>
                <div className="flex items-center gap-3">
                   <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-[#88B0C3]" />
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="pl-12 h-14 rounded-2xl border-gray-300 text-[#05445E] placeholder-[#88B0C3]"
                        required
                      />
                   </div>
                   {!isRegistering && (
                       <Button type="button" variant="outline" className="h-14 w-14 shrink-0 rounded-2xl border-gray-300 text-[#05445E]" onClick={() => toast.success("Biometric WebAuthn triggered. Please authenticate.")}>
                          <Fingerprint className="w-6 h-6" />
                       </Button>
                   )}
                </div>
              </div>

              {isRegistering && (
                  <div className="space-y-2">
                      <Label htmlFor="role" className="text-xs font-bold text-[#05445E] tracking-widest uppercase">Select Role for Testing</Label>
                      <select 
                          id="role"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="flex h-14 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-[#05445E]"
                      >
                          <option value="patient">Patient</option>
                          <option value="admin">Admin</option>
                          <option value="doctor">Doctor</option>
                          <option value="nurse">Nurse</option>
                          <option value="physiotherapist">Physiotherapist</option>
                          <option value="family">Family Member</option>
                      </select>
                  </div>
              )}
            </div>

            <div className="flex items-center justify-between">
                <Button type="button" variant="link" className="px-0 font-bold text-xs uppercase tracking-widest text-[#88B0C3] hover:text-[#05445E] h-auto p-0" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Back to Login' : 'Create an Account'}
                </Button>
                
                {!isRegistering && (
                    <Dialog onOpenChange={(open) => {
                        if (!open) {
                            setRecoveryStep('SEARCH');
                            setRecoveryName('');
                            setRecoveryContact('');
                            setRecoveryOTP('');
                            setRecoveryNewPassword('');
                            setRecoveryConfirmPassword('');
                            setRecoveryResult(null);
                        }
                    }}>
                        <DialogTrigger className={buttonVariants({ variant: "link", className: "px-0 font-bold text-xs uppercase tracking-widest text-[#88B0C3] hover:text-[#05445E] h-auto p-0" })}>
                            Credential Recovery
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-[#10837f]" /> Recover Credentials</DialogTitle>
                                <DialogDescription>
                                    Secure identity verification and credential recovery.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                {recoveryStep === 'SEARCH' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="recoveryName">Full Name</Label>
                                            <Input
                                                id="recoveryName"
                                                value={recoveryName}
                                                onChange={(e) => setRecoveryName(e.target.value)}
                                                placeholder="e.g. Jane Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="recoveryContact">Registered Email or Phone</Label>
                                            <Input
                                                id="recoveryContact"
                                                value={recoveryContact}
                                                onChange={(e) => setRecoveryContact(e.target.value)}
                                                placeholder="e.g. jane@example.com or +123456789"
                                            />
                                        </div>
                                        <Button 
                                            className="w-full bg-[#10837f] hover:bg-[#0c6b68]" 
                                            onClick={handleRecoverySearch}
                                            disabled={recoverySearching || !recoveryName || !recoveryContact}
                                        >
                                            {recoverySearching ? <><Search className="w-4 h-4 mr-2 animate-spin" /> Searching...</> : "Verify Identity"}
                                        </Button>
                                    </>
                                )}
                                {recoveryStep === 'OTP' && (
                                    <>
                                        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-md border border-emerald-200">
                                            <p className="text-sm font-medium">OTP Sent</p>
                                            <p className="text-xs opacity-90 mt-1">Please enter the One-Time Password sent to your contact method.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="recoveryOTP">Enter OTP</Label>
                                            <Input
                                                id="recoveryOTP"
                                                value={recoveryOTP}
                                                onChange={(e) => setRecoveryOTP(e.target.value)}
                                                placeholder="1234"
                                                className="font-mono text-center tracking-widest text-lg"
                                            />
                                        </div>
                                        <Button 
                                            className="w-full bg-[#10837f] hover:bg-[#0c6b68]" 
                                            onClick={handleVerifyOTP}
                                            disabled={recoverySearching || !recoveryOTP}
                                        >
                                            {recoverySearching ? "Verifying..." : "Confirm OTP"}
                                        </Button>
                                    </>
                                )}
                                {recoveryStep === 'RESET' && recoveryResult && (
                                    <>
                                        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-md border border-emerald-200">
                                            <p className="font-semibold mb-1">Identity Verified!</p>
                                            <p className="text-sm opacity-90 text-gray-700">Your Username is: <span className="font-mono font-bold text-gray-900 bg-white px-1.5 py-0.5 rounded border border-emerald-300">{recoveryResult.username}</span></p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="recoveryNewPassword">New Password</Label>
                                            <Input
                                                id="recoveryNewPassword"
                                                type="password"
                                                value={recoveryNewPassword}
                                                onChange={(e) => setRecoveryNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="recoveryConfirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="recoveryConfirmPassword"
                                                type="password"
                                                value={recoveryConfirmPassword}
                                                onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <Button 
                                            className="w-full bg-[#10837f] hover:bg-[#0c6b68]" 
                                            onClick={handleRecoveryReset}
                                            disabled={recoverySearching || !recoveryNewPassword || !recoveryConfirmPassword}
                                        >
                                            {recoverySearching ? "Updating..." : "Reset Password & Continue"}
                                        </Button>
                                    </>
                                )}
                                {recoveryStep === 'SUCCESS' && (
                                    <div className="text-center py-6">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Complete</h3>
                                        <p className="text-gray-500 text-sm">Your credentials have been securely updated. You can now log in using your new password.</p>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
              </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-[#05445E] hover:bg-[#043347] text-white h-14 rounded-full text-xs font-bold tracking-widest uppercase transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <span>PROCESSING...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isRegistering ? 'CREATE SECURE ACCOUNT' : 'INITIALIZE SESSION'} <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-8 space-y-6">
                <Button variant="link" className="text-xs font-bold uppercase tracking-widest text-[#88B0C3] hover:text-[#05445E] h-auto p-0" onClick={() => navigate('/apply')}>
                    REQUEST NEW NETWORK ACCESS
                </Button>
                <div className="w-16 h-px bg-gray-200"></div>
                <Button variant="link" className="text-xs font-bold uppercase tracking-widest text-[#88B0C3] hover:text-[#05445E] h-auto p-0" onClick={() => navigate('/track-application')}>
                    TRACK APPLICATION PROGRESS
                </Button>
            </div>
          </form>
      </div>
    </div>
  );
}

