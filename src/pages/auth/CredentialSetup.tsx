import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Copy, Check, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function CredentialSetup() {
  const navigate = useNavigate();
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Simulated generated credentials
  const mockCredentials = {
    username: 'PT-1042',
    password: 'x7#K9!mP2@qL'
  };

  const handleCopy = (text: string, type: 'user' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'user') {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
      toast.success("Username copied to clipboard");
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
      toast.success("Password copied to clipboard");
    }
  };

  const handleContinue = () => {
    if (!acknowledged) {
      toast.error("You must acknowledge that you have safely stored your credentials.");
      return;
    }
    toast.success("Credentials confirmed! Redirecting to login...");
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#10837f] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Application Approved</h1>
          <p className="text-gray-500 mt-2">Welcome to the network! Your secure access credentials have been generated.</p>
        </div>

        <Card className="border-0 shadow-xl ring-1 ring-gray-200">
          <CardHeader className="bg-yellow-50 border-b border-yellow-100 rounded-t-xl px-6 py-4">
            <CardTitle className="text-yellow-800 text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Critical Security Step
            </CardTitle>
            <CardDescription className="text-yellow-700">
              This is the <strong>only time</strong> your password will be shown. Please copy and store it safely before proceeding.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">System Username</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 border border-gray-200 rounded-md px-4 py-3 font-mono text-gray-900 tracking-wide">
                    {mockCredentials.username}
                  </div>
                  <Button 
                    variant="outline" 
                    className="shrink-0 h-12 w-12" 
                    onClick={() => handleCopy(mockCredentials.username, 'user')}
                  >
                    {copiedUser ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Generated Password</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex bg-gray-100 border border-gray-200 rounded-md overflow-hidden relative pr-10">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={mockCredentials.password}
                      readOnly
                      className="w-full bg-transparent px-4 py-3 font-mono text-gray-900 tracking-wider outline-none"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="shrink-0 h-12 w-12" 
                    onClick={() => handleCopy(mockCredentials.password, 'pass')}
                  >
                    {copiedPass ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg border">
              <div className="mt-0.5">
                  <Checkbox 
                    id="acknowledge" 
                    checked={acknowledged} 
                    onCheckedChange={(checked) => setAcknowledged(checked as boolean)} 
                  />
              </div>
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="acknowledge"
                  className="text-sm font-medium leading-tight text-gray-900 cursor-pointer"
                >
                  I have copied my login details securely.
                </label>
                <p className="text-xs text-gray-500">
                  I understand that I will not be able to see this password again once I leave this screen.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 border-t bg-gray-50 rounded-b-xl gap-3">
            <Button 
              className={`w-full ${acknowledged ? 'bg-[#10837f] hover:bg-[#0c6b68]' : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'}`}
              onClick={handleContinue}
              disabled={!acknowledged}
            >
              Continue to Login <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
