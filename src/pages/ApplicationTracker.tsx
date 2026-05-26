import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Clock, Calendar, XCircle, Search, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ApplicationTracker() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mocked Application State
  const [appStatus, setAppStatus] = useState<string>('Pending Review');
  const [appName, setAppName] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const q = query(
            collection(db, 'applications'),
            where('email', '==', email.trim()),
            where('phone', '==', password.trim())
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            toast.error("Application not found.");
            setIsAuthenticated(false);
            return;
        }
        
        const docInfo = snapshot.docs[0].data();
        setAppStatus(docInfo.status || 'Pending Review');
        setAppName(docInfo.fullName || 'Applicant');
        setIsAuthenticated(true);
        toast.success("Identity verified securely.");
    } catch (err: any) {
        toast.error("An error occurred: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  const getStatusDisplay = () => {
      switch(appStatus.toLowerCase()) {
          case 'pending review':
          case 'pending':
              return { icon: <Clock className="w-12 h-12 text-yellow-500" />, title: "Application Pending", desc: "Your application has been received and is waiting for initial review." };
          case 'review':
              return { icon: <Search className="w-12 h-12 text-blue-500" />, title: "Under Review", desc: "Our team is currently reviewing your documents and guarantor details." };
          case 'interview scheduled':
          case 'interview':
              return { icon: <Calendar className="w-12 h-12 text-emerald-500" />, title: "Selected for Interview", desc: "Congratulations! You have been selected for an interview stage. We will contact you soon." };
          case 'rejected':
              return { icon: <XCircle className="w-12 h-12 text-red-500" />, title: "Application Rejected", desc: "Unfortunately, your application did not meet our current requirements." };
          case 'approved':
              return { icon: <CheckCircle2 className="w-12 h-12 text-green-500" />, title: "Approved", desc: "Your application has been successfully approved. Credentials have been dispatched." };
          default:
              return { icon: <Clock className="w-12 h-12 text-gray-500" />, title: "Status Unknown", desc: `Current status is: ${appStatus}` };
      }
  };

  const statusInfo = getStatusDisplay();

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#10837f]">
                  <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-[#0e4e5e]">Secure Tracker Login</CardTitle>
                      <CardDescription>Enter your email and the generated OTP or your Phone number to access your application status.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                              <Label>Registered Email</Label>
                              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="applicant@example.com" required />
                          </div>
                          <div className="space-y-2">
                              <Label>OTP / Phone Number</Label>
                              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                          </div>
                          <Button className="w-full bg-[#10837f] hover:bg-[#0c6b68]" type="submit" disabled={loading}>
                              {loading ? "Verifying..." : "Access Tracker"}
                          </Button>
                      </form>
                  </CardContent>
              </Card>
          </div>
      );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-3xl">
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
                      <div>
                          <h1 className="text-3xl font-bold text-[#0e4e5e] tracking-tight">Application Tracker</h1>
                          <p className="text-sm text-gray-500 mt-1 font-mono">Welcome, {appName || 'Applicant'}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)}>Sign Out</Button>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center py-8 bg-gray-50 rounded-lg mb-8">
                      <div className="mb-4 bg-white p-4 rounded-full shadow-sm ring-1 ring-gray-100">
                          {statusInfo.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{statusInfo.title}</h2>
                      <p className="text-gray-600 max-w-md">{statusInfo.desc}</p>
                  </div>

                  {appStatus === 'interview' && (
                      <Card className="border-emerald-200 bg-emerald-50 mb-8 shadow-sm">
                          <CardHeader className="pb-3">
                              <CardTitle className="text-emerald-800 flex items-center gap-2">
                                  <Calendar className="w-5 h-5"/> Interview Invitation
                              </CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-emerald-700 mb-4">
                                  You are scheduled for a clinical assessment and interview. A reminder will be sent 1 day before. 
                              </p>
                              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-lg border border-emerald-100">
                                  <div>
                                      <p className="text-xs font-semibold text-gray-500 uppercase">Date & Time</p>
                                      <p className="font-medium text-gray-900">Nov 25, 2024 at 10:00 AM</p>
                                  </div>
                                  <div>
                                      <p className="text-xs font-semibold text-gray-500 uppercase">Format</p>
                                      <p className="font-medium text-gray-900">Virtual CBT & Video Call</p>
                                  </div>
                              </div>
                              <Button className="w-full bg-[#10837f] hover:bg-[#0c6b68]" onClick={() => navigate(`/interview/${token}`)}>
                                  Access Secure Interview Portal
                              </Button>
                          </CardContent>
                      </Card>
                  )}

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h3 className="font-semibold text-gray-700">Application Timeline</h3>
                      </div>
                      <div className="p-4 space-y-4">
                          <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                      <CheckCircle2 className="w-5 h-5" />
                                  </div>
                                  <div className="w-0.5 h-10 bg-emerald-100 mt-2"></div>
                              </div>
                              <div>
                                  <p className="font-semibold text-gray-900">Application Submitted</p>
                                  <p className="text-sm text-gray-500">Documents and guarantor details received securely.</p>
                              </div>
                          </div>
                           <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${appStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                      {appStatus === 'pending' ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                  </div>
                                  {(appStatus === 'review' || appStatus === 'interview') && <div className="w-0.5 h-10 bg-emerald-100 mt-2"></div>}
                              </div>
                              <div>
                                  <p className="font-semibold text-gray-900">Document Verification</p>
                                  <p className="text-sm text-gray-500">Identity and licenses evaluated by admin.</p>
                              </div>
                          </div>
                          {(appStatus === 'review' || appStatus === 'interview') && (
                              <div className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${appStatus === 'review' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                          {appStatus === 'review' ? <Search className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                      </div>
                                  </div>
                                  <div>
                                      <p className="font-semibold text-gray-900">Final Decision</p>
                                      <p className="text-sm text-gray-500">Application moved to final stage.</p>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
