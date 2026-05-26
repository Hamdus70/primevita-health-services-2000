import React, { useState } from 'react';
import { ClipboardList, User, Activity, AlertCircle, Phone, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BodyMap, BodyPart } from '../components/BodyMap';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    primaryCondition: '',
    mobilityStatus: '',
    requiresMedication: 'no',
    careType: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    preferredDate: ''
  });

  const [painAreas, setPainAreas] = useState<BodyPart[]>([]);

  const togglePainArea = (part: BodyPart) => {
    setPainAreas(prev => 
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    );
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
       await addDoc(collection(db, 'care_requests'), {
           ...formData,
           painAreas: painAreas,
           status: 'pending_review',
           createdAt: serverTimestamp()
       });
       setIsSubmitted(true);
    } catch (error: any) {
       toast.error("Failed to submit assessment: " + error.message);
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 p-6">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-xl border border-emerald-50">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-[#0e4e5e] mb-4">Assessment Submitted</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for completing the initial assessment. Our clinical coordination team will review this information and contact you within 24 hours to schedule a detailed consultation.
          </p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-[#10837f] text-white rounded-xl font-bold hover:bg-[#0c6b68] transition-colors w-full shadow-lg">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fcfc] py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0e4e5e] mb-4 tracking-tight">Client Care Assessment</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Help us understand the specific care needs so we can prepare a personalized and comprehensive care plan.</p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-12 relative">
           <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full overflow-hidden">
             <div className="h-full bg-[#10837f] transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
           </div>
           <div className="relative flex justify-between z-10">
             {[1, 2, 3, 4].map(num => (
               <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors duration-300 ${step >= num ? 'bg-[#10837f] border-white text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400'}`}>
                 {num}
               </div>
             ))}
           </div>
           <div className="flex justify-between mt-4 px-1">
             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</span>
             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-8">Medical</span>
             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-12">Care</span>
             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider pr-1">Contact</span>
           </div>
        </div>

        <form onSubmit={submitForm} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-teal-900/5 border border-emerald-50">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><User className="w-6 h-6" /></div>
                  <h2 className="text-2xl font-bold text-[#0e4e5e]">Patient Identity</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Patient's Full Name *</label>
                    <input required name="patientName" value={formData.patientName} onChange={handleInput} type="text" className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" placeholder="Enter full name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Age *</label>
                      <input required name="age" value={formData.age} onChange={handleInput} type="number" className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" placeholder="Years" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Gender *</label>
                      <select required name="gender" value={formData.gender} onChange={handleInput} className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><Activity className="w-6 h-6" /></div>
                  <h2 className="text-2xl font-bold text-[#0e4e5e]">Medical & Health Profile</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Primary Diagnosis or Condition *</label>
                    <textarea required name="primaryCondition" value={formData.primaryCondition} onChange={handleInput} rows={3} className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all resize-none" placeholder="E.g., Post-stroke recovery, Dementia, General frailty..."></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Visual Pain / Assessment Map (Optional)</label>
                    <p className="text-xs text-gray-500 mb-2">Click on the body map or use the buttons to highlight areas needing care or physiotherapy.</p>
                    <BodyMap selectedParts={painAreas} onToggle={togglePainArea} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Mobility Status *</label>
                      <select required name="mobilityStatus" value={formData.mobilityStatus} onChange={handleInput} className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Select mobility</option>
                        <option value="independent">Fully Independent</option>
                        <option value="assisted">Needs Assistance (Walker/Cane)</option>
                        <option value="wheelchair">Wheelchair Bound</option>
                        <option value="bedridden">Bedridden</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Requires Medication Admin? *</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center px-5 py-4 rounded-xl cursor-pointer font-medium transition-all ${formData.requiresMedication === 'yes' ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                          <input type="radio" name="requiresMedication" value="yes" checked={formData.requiresMedication === 'yes'} onChange={handleInput} className="hidden" />
                          Yes
                        </label>
                        <label className={`flex-1 flex items-center justify-center px-5 py-4 rounded-xl cursor-pointer font-medium transition-all ${formData.requiresMedication === 'no' ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                          <input type="radio" name="requiresMedication" value="no" checked={formData.requiresMedication === 'no'} onChange={handleInput} className="hidden" />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
               <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                 <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><ClipboardList className="w-6 h-6" /></div>
                  <h2 className="text-2xl font-bold text-[#0e4e5e]">Care Requirements</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Type of Care Needed *</label>
                    <select required name="careType" value={formData.careType} onChange={handleInput} className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Select primary care type</option>
                        <option value="Live-in">Live-in Care (24/7)</option>
                        <option value="Day">Day Care (12 Hours)</option>
                        <option value="Night">Night Care (12 Hours)</option>
                        <option value="Visits">Intermittent Visits</option>
                        <option value="Post-Op">Post-Operative Recovery</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Preferred Start Date *</label>
                    <input required name="preferredDate" value={formData.preferredDate} onChange={handleInput} type="date" className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all cursor-pointer" />
                  </div>
                </div>
               </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"><Phone className="w-6 h-6" /></div>
                  <h2 className="text-2xl font-bold text-[#0e4e5e]">Contact Information</h2>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4 mb-6">
                  <AlertCircle className="w-6 h-6 text-[#10837f] shrink-0 fill-emerald-100" />
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    Please provide details of the primary contact person (Next of Kin or Guarantor) we should reach out to regarding this assessment.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Your Full Name *</label>
                    <input required name="contactName" value={formData.contactName} onChange={handleInput} type="text" className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                    <input required name="contactPhone" value={formData.contactPhone} onChange={handleInput} type="tel" className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" placeholder="+234 800 000 0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                    <input required name="contactEmail" value={formData.contactEmail} onChange={handleInput} type="email" className="w-full px-5 py-4 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-full text-gray-600 hover:bg-gray-50 font-semibold transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div></div>}
            
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-[#0e4e5e] text-white rounded-full hover:bg-[#093540] font-bold transition-all shadow-[0_4px_14px_rgba(14,78,94,0.3)]">
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-[#10837f] text-white rounded-full hover:bg-[#0c6b68] font-bold transition-all shadow-[0_4px_14px_rgba(16,131,127,0.3)] disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
