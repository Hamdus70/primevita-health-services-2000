import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm, ValidationError } from '@formspree/react';
import { useEffect, useState } from 'react';

export function ContactPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get('type');
  
  const [inquiryType, setInquiryType] = useState(typeParam === 'assessment' ? 'Book an Assessment' : 'General Inquiry');
  const [formState, handleSubmit] = useForm('mojzrkkw');

  useEffect(() => {
    if (formState.succeeded) {
      toast.success("Form submitted successfully! We'll get back to you soon.");
    }
  }, [formState.succeeded]);

  useEffect(() => {
    if (typeParam === 'assessment') {
      setInquiryType('Book an Assessment');
    } else if (typeParam === 'request-caregiver') {
      setInquiryType('Request Caregiver');
    }
  }, [typeParam]);

  return (
    <div className="bg-[#f8fcfc] min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-[#0e4e5e] text-white py-24 object-cover overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Contact Us</h1>
          <p className="text-xl text-emerald-100 font-light max-w-2xl mx-auto">
            Whether you need to request immediate care, have questions about our services, or want to book an assessment, our team is ready to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
              <h3 className="text-2xl font-bold mb-8 text-[#0e4e5e]">Contact Details</h3>
              
              <div className="space-y-6">
                <a href="tel:+2347012918331" className="flex gap-4 items-start group hover:bg-slate-50 p-2 -ml-2 rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-[#10837f] font-light">+(234) 701-291-8331</p>
                  </div>
                </a>

                <a href="mailto:info@primevitahealthservices.com" className="flex gap-4 items-start group hover:bg-slate-50 p-2 -ml-2 rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-[#10837f] font-light">info@primevitahealthservices.com</p>
                  </div>
                </a>

                <a href="https://maps.google.com/?q=9+Alaka+off+Bammeke,+Alimosho,+Lagos+State" target="_blank" rel="noopener noreferrer" className="flex gap-4 items-start group hover:bg-slate-50 p-2 -ml-2 rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Head Office</h4>
                    <p className="text-gray-600 font-light leading-relaxed group-hover:text-[#10837f] transition-colors">
                      9, Alaka off Bammeke,<br/>
                      Alimosho, Lagos State,<br/>
                      Nigeria.
                    </p>
                  </div>
                </a>
              </div>
              
              <div className="mt-8 rounded-2xl overflow-hidden border border-emerald-100 h-64 bg-slate-100 relative shadow-inner">
                 <iframe 
                    title="PrimeVita Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.0298075791696!2d3.2982463!3d6.6346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzgnMDQuNiJOIDPCsDE3JzUzLjciRQ!5e0!3m2!1sen!2sng!4v1714150532298!5m2!1sen!2sng" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                 ></iframe>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                 <div className="flex items-center gap-3 text-gray-800">
                    <Clock className="w-5 h-5 text-[#d8a846]" />
                    <span className="font-medium">24/7 Support Available</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-800 mt-4">
                    <ShieldCheck className="w-5 h-5 text-[#10837f]" />
                    <span className="font-medium">Licensed Healthcare Provider</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-teal-900/5 border border-emerald-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#10837f] to-[#d8a846]"></div>
              
              <h2 className="text-3xl font-bold mb-2 text-[#0e4e5e]">Send Us a Message</h2>
              <p className="text-gray-500 font-light mb-8">Fill out the form below and one of our care coordinators will get back to you shortly.</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="firstName" required placeholder="John" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="lastName" required placeholder="Doe" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" required placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" />
                    <ValidationError prefix="Email" field="email" errors={formState.errors} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" name="phone" required placeholder="+234 800 000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Inquiry Type</label>
                  <select 
                     name="inquiryType"
                     value={inquiryType}
                     onChange={(e) => setInquiryType(e.target.value)}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Request Caregiver">Request Caregiver</option>
                    <option value="Book an Assessment">Book an Assessment</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Partnership">Partnership/Network</option>
                  </select>
                </div>

                {inquiryType === 'Book an Assessment' && (
                  <div className="grid md:grid-cols-2 gap-6 bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 mt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-emerald-900">Location Type *</label>
                        <select name="locationType" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all bg-white">
                            <option value="">Select location...</option>
                            <option value="Home">Patient's Home</option>
                            <option value="Hospital">Hospital</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-emerald-900">Requested Assessment Date *</label>
                        <input type="date" name="requestedDate" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all bg-white" min={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Message</label>
                  <textarea name="message" rows={5} required placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10837f] focus:ring-2 focus:ring-[#10837f]/20 outline-none transition-all resize-none"></textarea>
                </div>

                <button type="submit" disabled={formState.submitting} className="w-full bg-[#10837f] text-white font-semibold py-4 rounded-xl hover:bg-[#0c6b68] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(16,131,127,0.4)] disabled:opacity-50">
                  {formState.submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {formState.submitting ? 'Submitting...' : inquiryType === 'Book an Assessment' ? 'Submit Assessment Request' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
