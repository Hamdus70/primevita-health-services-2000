import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, ShieldCheck, Activity, BrainCircuit, ActivitySquare } from 'lucide-react';

const SERVICES = [
  {
    path: "/services/home-nursing",
    title: "Home Nursing",
    description: "Provided by Registered Nurses specially trained in domiciliary care for ongoing medical needs at home.",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "#10837f"
  },
  {
    path: "/services/elderly-care",
    title: "Elderly Care",
    description: "Compassionate, professional assistance with daily living to support seniors maintaining independence.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "#d8a846"
  },
  {
    path: "/services/post-hospital-recovery",
    title: "Post-Hospital Recovery",
    description: "Transitional care to bridge the gap between hospital and home, ensuring a safe and smooth recovery.",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "#0e4e5e"
  },
  {
    path: "/services/dementia-care",
    title: "Dementia Care",
    description: "Customized memory care by trained caregivers to help individuals live safely in familiar surroundings.",
    icon: BrainCircuit,
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "#004e82"
  },
  {
    path: "/services/physiotherapy",
    title: "Physiotherapy",
    description: "Expert in-home rehabilitation to help you regain physical strength, mobility, and independence safely.",
    icon: ActivitySquare,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "#4e8c75"
  }
];

export function ServicesPage() {
  return (
    <div className="bg-[#f8fcfc] min-h-screen">
      {/* Header */}
      <div className="bg-[#0e4e5e] text-white py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-[#003b64] to-transparent mix-blend-multiply" />
         <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-6xl font-bold font-heading tracking-tight mb-6"
           >
             Our Services
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-lg md:text-xl text-white/80 leading-relaxed"
           >
             We deliver comprehensive, high-quality, personalized home healthcare tailored to the unique needs of every individual and family.
           </motion.p>
         </div>
         {/* Slanted colored band on the bottom */}
        <div 
          className="absolute bottom-0 w-full h-[60px] md:h-[100px] bg-[#f8fcfc]"
          style={{ clipPath: 'polygon(0 100%, 100% 0%, 100% 100%)' }}
        />
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div 
                key={service.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                <div className="h-48 md:h-64 overflow-hidden relative">
                   <div className="absolute inset-0 bg-[#0e4e5e]/20 group-hover:bg-transparent transition-colors z-10" />
                   <img 
                     src={service.image} 
                     alt={service.title} 
                     className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                   />
                   <div 
                     className="absolute -bottom-1 w-full h-[40px] bg-white z-20"
                     style={{ clipPath: 'polygon(0 100%, 100% 0%, 100% 100%)' }}
                   />
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-md"
                      style={{ backgroundColor: service.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-[#0e4e5e] group-hover:text-[#10837f] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                    {service.description}
                  </p>
                  
                  <Link 
                    to={service.path}
                    className="inline-flex items-center text-sm font-bold tracking-wide uppercase transition-colors self-start"
                    style={{ color: service.color }}
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
