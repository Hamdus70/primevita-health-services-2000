import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PostHospitalRecoveryPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Slanted Overlay */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-[#0e4e5e]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
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
            Post-Hospital Recovery
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
          Healing Comfortably at Home
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
        >
          Coming home after a hospital stay should be a relief, not a source of stress. 
          Our team is here to smoothly bridge the gap between the hospital ward and your living room, 
          ensuring your recovery is as safe, comfortable, and fast as possible.
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
                src="https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Nurse caring for a patient at home" 
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
                Who benefits from our recovery care?
              </h3>
              
              <ul className="space-y-6 mb-10">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#10837f]/10 p-1 rounded-full text-[#10837f]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed pt-0.5">
                    Anyone returning home after a major procedure, like an orthopedic surgery, 
                    a cardiac operation, or an intensive abdominal treatment.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#10837f]/10 p-1 rounded-full text-[#10837f]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed pt-0.5">
                    Individuals fighting back after severe, acute medical events—like strokes, 
                    heart attacks, or major infections—who need an expert eye on their progress.
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
          How we make your recovery seamless:
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
                  <p className="text-gray-600">Expert care for post-operative wounds, taking the worry out of dressing changes.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Encouragement and support through prescribed physical therapy exercises.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Keeping ahead of discomfort with strict, proper pain medication management.</p>
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
                  <p className="text-gray-600">Vigilant daily monitoring to catch any signs of complications or infections early.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Acting as your voice, actively communicating your progress back to the hospital team.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-gray-600">Handling everyday life tasks so you don't over-exert yourself while you heal.</p>
                </li>
              </ul>
            </motion.div>
        </div>
      </div>
      
    </div>
  );
}
