import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, User, Stethoscope, CheckCircle2, ChevronRight, Activity, MapPin, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm, ValidationError } from '@formspree/react';
import { toast } from 'sonner';

export function ReferralFormPage() {
  const [formState, handleSubmit] = useForm('mjgdlaoq');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  useEffect(() => {
    if (formState.succeeded) {
      toast.success("Referral submitted successfully!");
    }
  }, [formState.succeeded]);

  const toggleService = (service: string) => {
      setSelectedServices(prev => 
          prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
      );
  };

  if (formState.succeeded) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#0e4e5e] mb-4">Referral Received</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Thank you for referring your patient to PrimeVita Health Services. Our care team will review the details and contact the patient directly within 24 hours to schedule an initial assessment.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-[#10837f] hover:bg-[#0c6b68] rounded-full px-8 py-6"
          >
            Return to Homepage
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0e4e5e] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl pt-8">
          <div className="flex items-center gap-2 text-emerald-100/80 mb-6 text-sm">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Refer a Patient</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">Refer a Patient</h1>
          <p className="text-lg text-emerald-50 max-w-2xl leading-relaxed">
            Partner with PrimeVita to provide your patients with exceptional home health care. Please complete the form below to initiate the referral process.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl -mt-32 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Referring Physician Information */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-[#10837f]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0e4e5e] font-heading">Referring Provider Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Provider Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input required name="referrerName" type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" placeholder="Dr. Jane Smith" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Clinic / Hospital Name *</label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input required name="hospitalName" type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" placeholder="City General Hospital" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input required name="referrerPhone" type="tel" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" placeholder="+234 (0) 800 000 0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input type="email" name="referrerEmail" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" placeholder="dr.smith@example.com" />
                      <ValidationError prefix="Email" field="referrerEmail" errors={formState.errors} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#10837f]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0e4e5e] font-heading">Patient Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Patient Full Name *</label>
                    <input required name="patientName" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input type="date" name="patientDob" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Patient Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input required name="patientPhone" type="tel" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" placeholder="+234 (0) 800 000 0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Patient Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input type="email" name="patientEmail" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" placeholder="john.doe@example.com" />
                      <ValidationError prefix="Email" field="patientEmail" errors={formState.errors} />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Patient Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input type="text" name="patientAddress" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all" placeholder="123 Care Avenue, Lagos, Nigeria" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Requested */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#10837f]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0e4e5e] font-heading">Services Requested</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Home Nursing",
                    "Elderly Care",
                    "Post-Hospital Recovery",
                    "Dementia Care",
                    "Physiotherapy",
                    "Carers - Personal Aides",
                    "Palliative & Hospice Care"
                  ].map((service) => (
                    <label key={service} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" name="services" value={service} checked={selectedServices.includes(service)} onChange={() => toggleService(service)} className="w-5 h-5 rounded border-gray-300 text-[#10837f] focus:ring-[#10837f]" />
                      <span className="text-gray-700 font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#10837f]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0e4e5e] font-heading">Medical History & Notes</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Diagnosis / Primary Reason for Referral *</label>
                    <textarea required name="diagnosis" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all resize-none" placeholder="Briefly describe the patient's condition..."></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Additional Notes / Special Requirements</label>
                    <textarea name="additionalNotes" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10837f] focus:border-transparent outline-none transition-all resize-none" placeholder="Any other relevant details or specific care requirements..."></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <Button disabled={formState.submitting} type="submit" size="lg" className="w-full md:w-auto px-10 py-6 rounded-full bg-[#10837f] hover:bg-[#0c6b68] text-white font-medium text-lg shadow-[0_4px_14px_rgba(16,131,127,0.4)] disabled:opacity-50">
                   {formState.submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                   {formState.submitting ? 'Submitting...' : 'Submit Referral'}
                </Button>
              </div>

            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
