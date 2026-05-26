import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircleQuestion, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    question: "What kind of home care services do you offer?",
    answer: "We offer a comprehensive range of in-home care services, from personal aides and professional nursing to specialized dementia care, post-hospital recovery, and physiotherapy. Our goal is to provide whatever support you or your loved one needs to live safely and comfortably at home. <a href='/services' class='text-[#10837f] font-semibold hover:underline inline-flex items-center mt-1'>Explore our full range of services <svg class='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M14 5l7 7m0 0l-7 7m7-7H3'></path></svg></a>"
  },
  {
    question: "How soon can a caregiver start working with us?",
    answer: "We understand that finding care can be urgent. Once we complete a personalized care assessment, we can typically arrange for a qualified caregiver to be at your home within 24 hours. After they arrive, your dedicated Care Supervisor will personally reach out to introduce themselves and guide you through the next steps."
  },
  {
    question: "Are your caregivers properly trained and vetted?",
    answer: "Absolutely. Every caregiver on our team goes through rigorous training based on internationally recognized standards. To ensure the highest quality of care, they also participate in regular quarterly retraining so they stay current with global best practices in compassion and safety."
  },
  {
    question: "How much does your home care service cost?",
    answer: "Because every individual's needs are unique, our premium care services are entirely customized. After finishing your initial assessment, we will provide a clear, transparent cost estimate that directly reflects the specific level of care and support required."
  },
  {
    question: "Do you offer services outside of Lagos?",
    answer: "Yes, we proudly serve clients across multiple states! PrimeVita Health Services provides dedicated home care throughout Nigeria. Whether you are in Lagos, Abuja, Port Harcourt, or other regions, our compassionate caregivers are ready to assist you."
  },
  {
    question: "Is around-the-clock or live-in care available?",
    answer: "Yes. We provide 24/7 care options, including dedicated live-in caregivers, so you can have peace of mind knowing your loved one is never alone. Our team operates in coordinated shifts to ensure constant, seamless support day and night."
  },
  {
    question: "Can your nurses handle complex medical needs like wound care or injections?",
    answer: "Yes, they can. Our team includes licensed registered nurses who are clinically trained to manage skilled medical procedures—such as administering medications, handling injections, providing wound care, and managing post-surgical recovery—all from the comfort of your own home."
  },
  {
    question: "What if my normal caregiver is sick or I need a replacement?",
    answer: "Your care will never be interrupted. If your caregiver is unavailable or if you feel you need a different match, your Care Supervisor will step in immediately to arrange a qualified, briefed replacement, ensuring a smooth and stress-free transition."
  },
  {
    question: "Do you offer short-term or temporary care?",
    answer: "Definitely. Whether you need an extra hand for just a few hours a day, help during a short recovery period, or long-term ongoing care, we will design a flexible schedule that fits your exact situation."
  },
  {
    question: "How do you ensure the care being provided is high quality?",
    answer: "We maintain strict oversight through daily structured reporting. Caregivers securely log vitals, track medication schedules, and write daily progress notes. Our clinical supervisors regularly review these reports to verify that the care plan is being followed perfectly."
  },
  {
    question: "Who makes up your healthcare team?",
    answer: "Our team comprises licensed registered nurses, certified physiotherapists, medical doctors, and trained personal aides. Every staff member undergoes a deep vetting process, including thorough background checks and rigorous clinical competency evaluations before they join our family."
  },
  {
    question: "Can we request a different nurse or therapist if we aren't satisfied?",
    answer: "We carefully match our professionals to your specific clinical needs and personality preferences. However, your comfort is our top priority—if you ever feel a caregiver or therapist isn't the perfect fit, just let us know, and we will happily arrange a replacement."
  },
  {
    question: "Do I have to sign a long-term contract?",
    answer: "No, we believe our care should earn your trust every day. You are never locked into a restrictive long-term contract, giving you the flexibility to adjust or pause services as your family's needs evolve."
  },
  {
    question: "How do I get started with PrimeVita Health Services?",
    answer: "Getting started is simple. Just reach out to us via our contact form or give us a call to request a free initial care assessment. We will evaluate your needs, create a personalized care plan, and match you with the right professionals."
  }
];

const FAQItem: React.FC<{ item: typeof FAQS[0], index: number, isOpen: boolean, toggleOpen: () => void }> = ({ item, index, isOpen, toggleOpen }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#10837f] bg-white shadow-md' : 'border-gray-200 bg-white hover:border-[#10837f]/50'}`}
    >
      <button
        onClick={toggleOpen}
        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
      >
        <span className={`text-lg font-bold font-heading pr-8 transition-colors ${isOpen ? 'text-[#0e4e5e]' : 'text-gray-800'}`}>
          {item.question}
        </span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#10837f]/10 text-[#10837f]' : 'bg-gray-50 text-gray-400'}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div 
              className="px-6 pb-6 text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  return (
    <div className="bg-[#f8fcfc] min-h-screen">
      {/* Header */}
      <div className="bg-[#0e4e5e] text-white py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-[#003b64] to-transparent mix-blend-multiply" />
         <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
           >
             <MessageCircleQuestion className="w-10 h-10 text-[#10837f]" />
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-6xl font-bold font-heading tracking-tight mb-6"
           >
             Frequently Asked Questions
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-lg md:text-xl text-white/80 leading-relaxed"
           >
             Finding the right care can be overwhelming. We've compiled answers to the most common questions to help you make an informed decision for your family.
           </motion.p>
         </div>
         {/* Slanted colored band on the bottom */}
        <div 
          className="absolute bottom-0 w-full h-[60px] md:h-[100px] bg-[#f8fcfc]"
          style={{ clipPath: 'polygon(0 100%, 100% 0%, 100% 100%)' }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 max-w-4xl tracking-wide">
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={index}
              item={faq}
              index={index}
              isOpen={openIndex === index}
              toggleOpen={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-3xl p-10 md:p-14 text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10837f]/5 rounded-bl-full -z-10" />
          
          <h3 className="text-3xl font-bold font-heading text-[#0e4e5e] mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            We are here to listen and help you explore the best care options. Reach out to our care coordinators directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
             <Link 
                to="/contact" 
                className="bg-[#10837f] hover:bg-[#0c6b68] text-white px-8 py-3.5 rounded-xl font-bold transition-all inline-flex items-center justify-center w-full sm:w-auto"
              >
                Contact Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
             <Link 
                to="/contact?type=assessment" 
                className="bg-white border-2 border-[#10837f] text-[#10837f] hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold transition-all inline-flex items-center justify-center w-full sm:w-auto"
              >
                Book an Assessment
              </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
