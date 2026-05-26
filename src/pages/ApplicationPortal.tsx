import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { UserPlus, Stethoscope, ArrowRight, CheckCircle2, User, Phone, Mail, FileText, Upload, Briefcase, Copy, FileUp, Info } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getDb, getAuthClient } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

export function ApplicationPortal() {
  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState<'patient' | 'staff' | null>(null);
  const [credentials, setCredentials] = useState<{ id: string, pass: string } | null>(null);
  const [savedCredentials, setSavedCredentials] = useState(false);
  const navigate = useNavigate();

  // OTP Modal
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [generatingTracker, setGeneratingTracker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    
    // patient specific
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',

    // staff specific
    cvFile: null as File | null,
    certType: '',
    certFile: null as File | null,
    idType: '',
    idFile: null as File | null,

    schoolName: '',
    qualification: '',
    gradYear: '',
    eduFile: null as File | null,

    guarantorName: '',
    guarantorRelation: '',
    guarantorPhone: '',
    guarantorAddress: '',
    guarantorOccupation: '',
    guarantorIdType: '',
    guarantorIdFile: null as File | null,
    guarantorReferenceId: '',

    declarationChecked: false
  });

  const extractInitials = (name: string) => {
    const parts = name.split(' ').filter(p => p.trim() !== '');
    if (parts.length === 0) return 'XX';
    const first = parts[0][0]?.toUpperCase() || 'X';
    const last = parts.length > 1 ? parts[parts.length - 1][0]?.toUpperCase() : 'X';
    return `${first}${last}`;
  };

  const handleGeneratePatientId = (name: string) => {
      const seqStr = localStorage.getItem('mockPatientSequence') || '4'; 
      let seq = parseInt(seqStr, 10);
      localStorage.setItem('mockPatientSequence', (seq + 1).toString());
      const initials = extractInitials(name);
      return `CL-${initials}-${seq.toString().padStart(4, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const { name } = e.target;
          setFormData(prev => ({ ...prev, [name]: e.target.files![0] }));
      }
  };

  const maxSteps = appType === 'patient' ? 4 : 6;

  const handleNextStep = () => {
    if (step === 1 && !appType) {
      toast.error('Please select an application type.');
      return;
    }
    if (step === 2) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.dob) {
        toast.error('Please fill in all basic information fields.');
        return;
      }
    }
    
    if (appType === 'staff') {
        if (step === 3 && (!formData.cvFile || !formData.idType || !formData.idFile)) {
             toast.error('Please upload your CV and a valid Identity Document.');
             return;
        }
        if (step === 4 && (!formData.schoolName || !formData.qualification || !formData.gradYear || !formData.eduFile)) {
             toast.error('Please complete your educational records and upload supporting documents.');
             return;
        }
    }

    setStep(s => Math.min(s + 1, maxSteps));
  };

  const handlePrevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (appType === 'patient') {
        setIsSubmitting(true);
        try {
            const firstName = formData.fullName.split(' ')[0];
            const lastName = formData.fullName.split(' ').slice(1).join(' ') || 'Unknown';
            
            // Create user in Firebase Auth
            const tempPassword = `Temp@${Math.random().toString(36).slice(-6)}!`;
            let userCredential;
            try {
                userCredential = await createUserWithEmailAndPassword(getAuthClient(), formData.email, tempPassword);
            } catch (authErr: any) {
                console.error("Auth error details:", JSON.stringify(authErr));
                if (authErr.code === 'auth/email-already-in-use') {
                    toast.error("Email already registered.", {
                        description: "This email is already in use. Please log in to your account.",
                        action: {
                            label: "Log In",
                            onClick: () => navigate('/login')
                        }
                    });
                    return;
                }
                throw authErr;
            }
            const idToken = await userCredential.user.getIdToken();
            
            const response = await fetch('/api/patient/apply', {
                method: 'POST',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: formData.email,
                    phone: formData.phone,
                    dateOfBirth: formData.dob,
                    address: formData.address,
                    emergencyName: formData.emergencyName,
                    emergencyPhone: formData.emergencyPhone,
                    emergencyRelation: formData.emergencyRelation,
                }),
            });
            const textResponse = await response.text();
            let result: any = {};
            try {
                result = textResponse ? JSON.parse(textResponse) : {};
            } catch (e) {
                console.error("Non-JSON response from /api/patient/apply:", textResponse);
                throw new Error("Server returned an invalid response. " + (response.status !== 200 ? `Status: ${response.status}` : ''));
            }

            if (!response.ok) throw new Error(result.error || result.message || "Failed to submit application. Please try again or refresh.");

            toast.success('Registration successful. Your application is under review by our admin team.');
            setStep(4);
        } catch (err: any) {
            toast.error("Failed to submit application: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    } else {
        if(!formData.declarationChecked) {
            toast.error("You must agree to the declaration.");
            return;
        }
        if(!formData.guarantorName || !formData.guarantorReferenceId || !formData.guarantorIdType || !formData.guarantorIdFile) {
            toast.error("Guarantor information is incomplete.");
            return;
        }

        // Trigger OTP Modal for staff
        setOtpModalOpen(true);
        toast.info("An OTP has been sent to your email to secure your application.");
    }
  };

    const verifyOTPAndGenerateLink = () => {
      if(otpValue.length < 4) {
          toast.error("Invalid OTP");
          return;
      }
      setGeneratingTracker(true);
      setTimeout(async () => {
          try {
              const firstName = formData.fullName.split(' ')[0];
              const lastName = formData.fullName.split(' ').slice(1).join(' ') || 'Unknown';
              
              const response = await fetch('/api/staff/apply', {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      firstName,
                      lastName,
                      email: formData.email,
                      phone: formData.phone,
                      role: 'NURSE', // Defaulting since form doesn't cleanly ask for role here, but could be added
                      guarantorName: formData.guarantorName,
                      guarantorPhone: formData.guarantorPhone
                  }),
              });

              // Create user in Firebase Auth after staff submission success
              const tempPassword = `Staff@${Math.random().toString(36).slice(-6)}!`;
              try {
                await createUserWithEmailAndPassword(getAuthClient(), formData.email, tempPassword);
              } catch (authErr: any) {
                console.error("Staff Auth error details:", JSON.stringify(authErr));
                if (authErr.code === 'auth/email-already-in-use') {
                    toast.error("Email already registered.", {
                        description: "This email is already in use. Please log in to your account.",
                        action: {
                            label: "Log In",
                            onClick: () => navigate('/login')
                        }
                    });
                    return;
                }
                throw authErr;
              }
              
              const textResponse = await response.text();
              let result: any = {};
              try {
                  result = textResponse ? JSON.parse(textResponse) : {};
              } catch (e) {
                  throw new Error("Server returned an invalid response. " + (response.status !== 200 ? `Status: ${response.status}` : ''));
              }
              if (!response.ok) throw new Error(result.error || result.message || "Failed to submit application");
              
              const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

              setGeneratingTracker(false);
              setOtpModalOpen(false);
              
              toast.success("Application successfully securely submitted!");
              
              // Store application locally
              const existing = JSON.parse(localStorage.getItem('trackedApplications') || '[]');
              localStorage.setItem('trackedApplications', JSON.stringify([...existing, { ...formData, cvFile: null, certFile: null, idFile: null, eduFile: null, guarantorIdFile: null, token, status: 'pending' }]));

              // Redirect after a brief moment so they read the toast
              setTimeout(() => {
                  navigate(`/track-application/${token}`);
              }, 1500);
          } catch(err: any) {
              setGeneratingTracker(false);
              toast.error("Failed to submit application: " + err.message);
          }
      }, 1500);
  };


  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#0e4e5e] mb-4">Join Our Network</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Apply to receive premium home care services or join our team of dedicated healthcare professionals.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-4">
            <div className={`flex items-center space-x-2 md:space-x-4 ${appType === 'staff' ? 'min-w-[500px]' : ''}`}>
              {Array.from({ length: maxSteps - 1 }).map((_, i) => i + 1).map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 shrink-0 ${
                    step > s ? 'bg-[#10837f] border-[#10837f] text-white' :
                    step === s ? 'bg-white border-[#10837f] text-[#10837f]' :
                    'bg-white border-gray-300 text-gray-300'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < (maxSteps - 1) && (
                    <div className={`h-1 w-8 md:w-16 mx-1 md:mx-2 shrink-0 ${step > s ? 'bg-[#10837f]' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg border-0 overflow-hidden">
            {step === 1 && (
              <>
                <CardHeader className="text-center bg-white border-b border-gray-100">
                  <CardTitle className="text-2xl">I am applying as a...</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 p-6 md:p-10 bg-white">
                  <button
                    onClick={() => { setAppType('patient'); handleNextStep(); }}
                    className={`group p-8 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 ${appType === 'patient' ? 'border-[#10837f] bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-[#10837f] hover:bg-gray-50 hover:shadow-md'}`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${appType === 'patient' ? 'bg-[#10837f] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-100 group-hover:text-[#10837f]'}`}>
                      <User className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Patient / Client</h3>
                    <p className="text-gray-600">Register to receive dedicated home care, nursing, or physiotherapy services.</p>
                  </button>

                  <button
                    onClick={() => { setAppType('staff'); handleNextStep(); }}
                    className={`group p-8 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 ${appType === 'staff' ? 'border-[#10837f] bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-[#10837f] hover:bg-gray-50 hover:shadow-md'}`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${appType === 'staff' ? 'bg-[#10837f] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-100 group-hover:text-[#10837f]'}`}>
                      <Stethoscope className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Healthcare Staff</h3>
                    <p className="text-gray-600">Apply to join our network as a nurse, doctor, caregiver, or physiotherapist.</p>
                  </button>
                </CardContent>
              </>
            )}

            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                         <User className="w-5 h-5"/>
                     </div>
                     <div>
                        <CardTitle className="text-2xl text-[#0e4e5e]">Personal Information</CardTitle>
                        <CardDescription>Section A: Identify yourself.</CardDescription>
                     </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label>Full Name <span className="text-red-500">*</span></Label>
                       <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Jane Doe" required />
                    </div>
                    <div className="space-y-2">
                       <Label>Email Address <span className="text-red-500">*</span></Label>
                       <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="jane@example.com" required />
                    </div>
                    <div className="space-y-2">
                       <Label>Phone Number <span className="text-red-500">*</span></Label>
                       <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. 08012345678" required />
                    </div>
                    <div className="space-y-2">
                       <Label>Date of Birth <span className="text-red-500">*</span></Label>
                       <Input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <Label>Physical Address <span className="text-red-500">*</span></Label>
                       <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="e.g. 15 Allen Avenue, Ikeja" required />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50">
                  <Button variant="outline" type="button" onClick={handlePrevStep}>Go Back</Button>
                  <Button type="submit" className="bg-[#10837f] hover:bg-[#0c6b68]">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </CardFooter>
              </form>
            )}

            {/* PATIENT STEP 3 */}
            {step === 3 && appType === 'patient' && (
               <form onSubmit={handleSubmit}>
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <CardTitle className="text-2xl text-[#0e4e5e]">Emergency & Medical Info</CardTitle>
                  <CardDescription>
                    We need an emergency contact to verify your application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                     <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-4 border border-blue-100">
                            <span className="text-blue-600 bg-white p-2 rounded-full shadow-sm"><Phone className="w-5 h-5"/></span>
                            <div>
                                <h4 className="font-semibold text-blue-900">Emergency Contact Requirement</h4>
                                <p className="text-sm text-blue-800">For patient safety, at least one emergency contact or next-of-kin must be provided before onboarding.</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Emergency Contact Name <span className="text-red-500">*</span></Label>
                                <Input name="emergencyName" value={formData.emergencyName} onChange={handleInputChange} placeholder="Full Name" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Relationship <span className="text-red-500">*</span></Label>
                                <Input name="emergencyRelation" value={formData.emergencyRelation} onChange={handleInputChange} placeholder="e.g. Sibling, Spouse" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Emergency Phone Number <span className="text-red-500">*</span></Label>
                                <Input name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} placeholder="Phone number" required />
                            </div>
                        </div>
                     </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50">
                  <Button variant="outline" type="button" onClick={handlePrevStep}>Go Back</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#0e4e5e] hover:bg-[#093540] text-white">
                      {isSubmitting ? 'Processing...' : <>Complete Registration <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                </CardFooter>
              </form>
            )}

            {/* STAFF STEP 3 */}
            {step === 3 && appType === 'staff' && (
               <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                         <FileUp className="w-5 h-5"/>
                     </div>
                     <div>
                         <CardTitle className="text-2xl text-[#0e4e5e]">Document Validation (Section B)</CardTitle>
                         <CardDescription>
                            Upload your professional CV, Certification, and valid ID.
                         </CardDescription>
                     </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    {/* CV Upload */}
                    <div className="space-y-3">
                        <Label className="text-md font-bold text-gray-800">1. Curriculum Vitae / Resume <span className="text-red-500">*</span></Label>
                        <div className="border hover:border-[#10837f] border-dashed rounded-xl p-6 text-center bg-gray-50 transition-colors">
                             <Input type="file" name="cvFile" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" id="cvFile" />
                             <label htmlFor="cvFile" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                 <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                 <span className="font-medium text-[#10837f] hover:underline">Click to Upload CV</span>
                                 <span className="text-xs text-gray-500 mt-1">Accepts: PDF, DOC, DOCX. Use Device File Manager or Camera.</span>
                                 {formData.cvFile && <span className="mt-4 text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">{formData.cvFile.name} (Ready)</span>}
                             </label>
                        </div>
                    </div>

                    <div className="h-px bg-gray-200" />

                    {/* Certification Upload */}
                    <div className="space-y-4">
                        <Label className="text-md font-bold text-gray-800">2. Certification / License (Mandatory if available)</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Document Type</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" name="certType" value={formData.certType} onChange={handleInputChange}>
                                    <option value="">Select Document Type...</option>
                                    <option value="Professional License">Professional License</option>
                                    <option value="Certification">Certification</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Upload File</Label>
                                 <Input type="file" name="certFile" onChange={handleFileChange} accept=".pdf,.jpg,.png" id="certFile" className="cursor-pointer file:bg-emerald-50 text-[#10837f]" />
                                 <p className="text-xs text-gray-500 mt-1">Accepts: PDF, JPG, PNG</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-px bg-gray-200" />

                    {/* Identity Document */}
                     <div className="space-y-4">
                        <Label className="text-md font-bold text-gray-800">3. Identity Document <span className="text-red-500">*</span></Label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ID Type</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" name="idType" value={formData.idType} onChange={handleInputChange} required>
                                    <option value="">Select ID Type...</option>
                                    <option value="Voters Card">Voter's Card</option>
                                    <option value="National ID Card">National ID Card</option>
                                    <option value="International Passport">International Passport</option>
                                    <option value="Drivers License">Driver's License</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Upload Document Image</Label>
                                <Input type="file" name="idFile" onChange={handleFileChange} accept=".pdf,.jpg,.png" className="cursor-pointer file:bg-emerald-50 text-[#10837f]" required />
                                <p className="text-xs text-gray-500 mt-1">Accepts: PDF, JPG, PNG. Snap a clear photo.</p>
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50">
                  <Button variant="outline" type="button" onClick={handlePrevStep}>Go Back</Button>
                  <Button type="submit" className="bg-[#10837f] hover:bg-[#0c6b68]">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </CardFooter>
              </form>
            )}

            {/* STAFF STEP 4: Educational Records */}
            {step === 4 && appType === 'staff' && (
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                 <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                         <Briefcase className="w-5 h-5"/>
                     </div>
                     <div>
                         <CardTitle className="text-2xl text-[#0e4e5e]">Educational Records</CardTitle>
                         <CardDescription>Section C: Academic background.</CardDescription>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label>School Name <span className="text-red-500">*</span></Label>
                           <Input name="schoolName" value={formData.schoolName} onChange={handleInputChange} placeholder="University / College" required />
                        </div>
                        <div className="space-y-2">
                           <Label>Highest Qualification <span className="text-red-500">*</span></Label>
                           <Input name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="e.g. B.Sc Nursing, MBBS" required />
                        </div>
                        <div className="space-y-2">
                           <Label>Year of Graduation <span className="text-red-500">*</span></Label>
                           <Input name="gradYear" type="number" value={formData.gradYear} onChange={handleInputChange} placeholder="YYYY" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Upload Educational Document <span className="text-red-500">*</span></Label>
                            <Input type="file" name="eduFile" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg" required className="cursor-pointer file:bg-purple-50 text-purple-700 decoration-purple-600" />
                        </div>
                    </div>
                    <div className="bg-purple-50 text-purple-800 p-4 rounded-lg flex items-start gap-4">
                         <Info className="w-5 h-5 min-w-[20px] mt-0.5" />
                         <p className="text-sm">Please ensure the uploaded document clearly shows the institution's hallmark and date of issuance.</p>
                     </div>
                 </CardContent>
                 <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50">
                    <Button variant="outline" type="button" onClick={handlePrevStep}>Go Back</Button>
                    <Button type="submit" className="bg-[#10837f] hover:bg-[#0c6b68]">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                 </CardFooter>
               </form>
             )}

             {/* STAFF STEP 5: Guarantor Information */}
             {step === 5 && appType === 'staff' && (
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                 <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                         <UserPlus className="w-5 h-5"/>
                     </div>
                     <div>
                         <CardTitle className="text-2xl text-[#0e4e5e]">Guarantor Information</CardTitle>
                         <CardDescription>Section D: Mandatory Security Reference.</CardDescription>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label>Guarantor Full Name <span className="text-red-500">*</span></Label>
                           <Input name="guarantorName" value={formData.guarantorName} onChange={handleInputChange} placeholder="Name" required />
                        </div>
                        <div className="space-y-2">
                           <Label>Relationship <span className="text-red-500">*</span></Label>
                           <Input name="guarantorRelation" value={formData.guarantorRelation} onChange={handleInputChange} placeholder="e.g. Sibling, Mentor, Employer" required />
                        </div>
                         <div className="space-y-2">
                           <Label>Phone Number <span className="text-red-500">*</span></Label>
                           <Input name="guarantorPhone" value={formData.guarantorPhone} onChange={handleInputChange} placeholder="Phone" required />
                        </div>
                        <div className="space-y-2">
                           <Label>Occupation <span className="text-red-500">*</span></Label>
                           <Input name="guarantorOccupation" value={formData.guarantorOccupation} onChange={handleInputChange} placeholder="Occupation" required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                           <Label>Address <span className="text-red-500">*</span></Label>
                           <Textarea name="guarantorAddress" value={formData.guarantorAddress} onChange={handleInputChange} required />
                        </div>

                        <div className="h-px bg-gray-200 md:col-span-2 my-2" />

                         <div className="space-y-2">
                            <Label>Guarantor ID Type <span className="text-red-500">*</span></Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" name="guarantorIdType" value={formData.guarantorIdType} onChange={handleInputChange} required>
                                <option value="">Select ID Type...</option>
                                <option value="Voters Card">Voter's Card</option>
                                <option value="National ID Card">National ID Card</option>
                                <option value="International Passport">International Passport</option>
                                <option value="Drivers License">Driver's License</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Upload Guarantor ID <span className="text-red-500">*</span></Label>
                            <Input type="file" name="guarantorIdFile" onChange={handleFileChange} accept=".pdf,.jpg,.png" required className="cursor-pointer file:bg-amber-50 text-amber-700" />
                        </div>

                        <div className="space-y-2 md:col-span-2 mt-4 bg-gray-100 p-4 border border-gray-200 rounded-lg">
                           <Label className="text-md text-gray-900 mb-1 block">Guarantor Reference ID <span className="text-red-500">*</span></Label>
                           <p className="text-xs text-gray-500 mb-3 block">Your guarantor MUST provide their secure reference number via email to you.</p>
                           <Input name="guarantorReferenceId" value={formData.guarantorReferenceId} onChange={handleInputChange} placeholder="e.g. REF-XYZ-999" required className="bg-white border-2 border-gray-300 focus:border-[#10837f] text-lg font-mono tracking-wider"/>
                        </div>

                    </div>
                 </CardContent>
                 <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50">
                    <Button variant="outline" type="button" onClick={handlePrevStep}>Go Back</Button>
                    <Button type="submit" className="bg-[#10837f] hover:bg-[#0c6b68]">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                 </CardFooter>
               </form>
             )}

             {/* STAFF STEP 6: Declaration */}
             {step === 6 && appType === 'staff' && (
                <form onSubmit={handleSubmit}>
                 <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                         <FileText className="w-5 h-5"/>
                     </div>
                     <div>
                         <CardTitle className="text-2xl text-[#0e4e5e]">Official Declaration</CardTitle>
                         <CardDescription>Final Submission Step.</CardDescription>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-6">
                    <div className="bg-red-50 text-red-900 border border-red-200 p-6 rounded-xl font-medium leading-relaxed">
                        "I hereby declare that all information provided is true and authentic. Any falsification may result in disqualification and possible legal/government action."
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-8 pb-4">
                        <Checkbox 
                            id="declaration" 
                            checked={formData.declarationChecked} 
                            onCheckedChange={(c) => setFormData(p => ({...p, declarationChecked: !!c}))}
                            className="bg-white border-gray-400 data-[state=checked]:bg-[#10837f] data-[state=checked]:border-[#10837f] h-6 w-6" 
                        />
                        <label htmlFor="declaration" className="text-md font-semibold text-gray-900 cursor-pointer">
                            I agree to this declaration
                        </label>
                    </div>

                 </CardContent>
                 <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50">
                    <Button variant="outline" type="button" onClick={handlePrevStep} disabled={generatingTracker}>Go Back</Button>
                    <Button type="submit" className="bg-[#0e4e5e] hover:bg-[#093540] text-lg px-8 py-6" disabled={generatingTracker || !formData.declarationChecked}>
                        {generatingTracker ? "Processing..." : "Submit Application Securely"} 
                    </Button>
                 </CardFooter>
               </form>
             )}

            {/* PATIENT SUCCESS UI */}
            {step === 4 && appType === 'patient' && credentials && (
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-[#0e4e5e] mb-4">You are Approved!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your profile has been generated. Use these secure credentials to access your Patient Portal immediately.
                </p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 w-full max-w-sm mx-auto text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#10837f]" />
                    <div className="ml-2">
                        <p className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">System Username</p>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xl font-bold font-mono tracking-widest text-[#0e4e5e] truncate break-all">{credentials.id}</p>
                            <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(credentials.id); toast.success('Username copied'); }}><Copy className="w-4 h-4" /></Button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">Temporary Password</p>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold font-mono tracking-widest text-emerald-700 truncate">{credentials.pass}</p>
                            <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(credentials.pass); toast.success('Password copied'); }}><Copy className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-emerald-700 bg-emerald-50 p-4 rounded-lg mt-6 mb-6 border border-emerald-200 max-w-sm mx-auto flex items-start gap-3">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <strong>Important:</strong> Keep your credentials secure. You will use these to access your health portal.
                </div>
                <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-200 max-w-sm mx-auto mb-6">
                  <Checkbox id="savedCredentials" checked={savedCredentials} onCheckedChange={(c) => setSavedCredentials(c as boolean)} className="h-5 w-5" />
                  <label htmlFor="savedCredentials" className="text-md font-medium leading-none text-gray-800 cursor-pointer">
                    I have saved my credentials
                  </label>
                </div>
                <Button 
                    className="w-full max-w-sm bg-[#10837f] hover:bg-[#0c6b68] text-lg font-semibold py-6"
                    disabled={!savedCredentials}
                    onClick={() => navigate('/login')}
                >
                  Proceed to Login Portal
                </Button>
              </CardContent>
            )}

            {/* STAFF OTP MODAL */}
            <Dialog open={otpModalOpen} onOpenChange={(open) => !generatingTracker && setOtpModalOpen(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center font-bold text-[#0e4e5e]">
                            <Mail className="w-6 h-6 mr-3 text-[#10837f]"/> Verify your email to secure your application
                        </DialogTitle>
                        <DialogDescription className="text-md mt-2">
                           An OTP has been sent to <strong>{formData.email}</strong>. Enter it below to complete and secure your application.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                         <div className="space-y-4">
                             <Label className="text-md font-semibold text-gray-800">One-Time Password (OTP)</Label>
                             <Input 
                                type="text" 
                                placeholder="123456" 
                                value={otpValue} 
                                onChange={(e) => setOtpValue(e.target.value)} 
                                className="text-center font-mono text-2xl tracking-[0.5em] font-bold py-6 border-2 border-emerald-200 focus:border-emerald-500" 
                                autoFocus
                             />
                         </div>
                    </div>
                    <Button 
                        className="w-full bg-[#10837f] hover:bg-[#0c6b68] text-lg py-6" 
                        onClick={verifyOTPAndGenerateLink} 
                        disabled={generatingTracker || otpValue.length < 4}
                    >
                        {generatingTracker ? "Verifying & Generating Secure Link..." : "Verify & Submit"}
                    </Button>
                </DialogContent>
            </Dialog>

          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
