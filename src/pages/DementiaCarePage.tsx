import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DementiaCarePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Slanted Overlay */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-[#0e4e5e]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
            opacity: 0.6
          }}
        />
        
        {/* Slanted overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003b64]/80 to-transparent mix-blend-multiply" />
        
        {/* Slanted colored band on the bottom matching reference shape */}
        <div 
          className="absolute bottom-0 w-full h-[120px] md:h-[200px] bg-[#10837f]"
          style={{ clipPath: 'polygon(0 100%, 100% 0%, 100% 100%)' }}
        />

        {/* Hero Content */}
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold font-heading text-white max-w-4xl tracking-tight leading-tight"
          >
            Dementia Care
          </motion.h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="container mx-auto px-6 py-20 text-center max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold font-heading text-[#0e4e5e] mb-6"
        >
          Specialized, Heartfelt Care
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
        >
          When memory begins to fade, familiar surroundings become incredibly grounding. 
          We offer specialized, gentle care designed to help those facing dementia or Alzheimer's 
          feel safe, understood, and comfortable right at home.
        </motion.p>
      </div>

      {/* Information Section */}
      <div className="container mx-auto px-6 pb-24">
        <div className="bg-[#f8fcfc] rounded-3xl p-8 md:p-12 lg:p-16 border border-[#10837f]/10 shadow-[0_8px_25px_rgba(16,131,127,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Image */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Caregiver reassuring an elderly patient" 
                className="w-full h-auto rounded-3xl shadow-xl object-cover"
              />
            </motion.div>

            {/* Right Content */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-3xl font-bold font-heading text-[#0e4e5e] mb-8 leading-tight">
                How our dementia program brings peace of mind:
              </h3>
              
              <ul className="space-y-6 mb-10">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#10837f]/10 p-1 rounded-full text-[#10837f]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed pt-0.5">
                    For individuals touched by Alzheimer's or other forms of dementia, maintaining 
                    a consistent daily routine in a familiar environment is essential for peace of mind.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#10837f]/10 p-1 rounded-full text-[#10837f]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed pt-0.5">
                    We offer families a much-needed break from the round-the-clock demands of memory care, 
                    ensuring their loved ones are safe, engaged, and treated with deep respect.
                  </p>
                </li>
              </ul>

               <div>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center bg-[#10837f] hover:bg-[#0c6b68] text-white px-8 py-3.5 rounded-xl font-bold transition-all"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Duties Section */}
      <div className="container mx-auto px-6 pb-24 max-w-5xl">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold font-heading text-[#0e4e5e] mb-12 text-center"
        >
          Our memory care specialists focus on:
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
            >
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Creating a secure home environment to prevent wandering and reduce confusion.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Establishing calming, predictable routines that reduce anxiety and agitation.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Providing gentle reminders for meals, hydration, and daily medications.</p>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
            >
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Engaging in stimulating activities proven to support memory and cognitive function.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Offering compassionate support during moments of distress or behavioral changes.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Assisting with personal care tasks respectfully when they become difficult to manage alone.</p>
                </li>
              </ul>
            </motion.div>
        </div>
      </div>
      
    </div>
  );
}
