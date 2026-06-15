import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeartHandshake, Home, Users, Pill, ArrowRight } from 'lucide-react';
import { HeroCarousel } from '@/components/HeroCarousel';
import { motion } from 'motion/react';
import { AnimatedNumber } from '@/components/AnimatedNumber';

const services = [
  { title: 'Carers - Personal Aides', description: 'Support for activities of daily living.', icon: Users, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800' },
  { title: 'Nursing Services', description: 'Professional home-based medical care.', icon: Pill, image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800' },
  { title: 'Nursing Assistant Service', description: 'Support for daily activities by trained assistants.', icon: Home, image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=800' },
  { title: 'Dementia Care', description: 'Specialized support for those with dementia.', icon: HeartHandshake, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800' },
  { title: 'Palliative & Hospice Care', description: 'Specialized care for life-limiting illnesses.', icon: HeartHandshake, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800' },
  { title: 'Caregivers Training', description: 'Training for professional caregiving.', icon: Users, image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=800' },
];

export function HomePage() {
  return (
    <div>
      <HeroCarousel />

      {/* Quick Actions */}
      <div className="bg-emerald-50 border-b border-emerald-100">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-4">
          <Link to="/assessment" className="py-3 text-center text-emerald-950 font-medium border-r border-emerald-100 hover:bg-emerald-100 transition-colors">Client Assessment</Link>
          <Link to="/contact?type=assessment" className="py-3 text-center text-emerald-950 font-medium border-r border-emerald-100 hover:bg-emerald-100 transition-colors">Book an Appointment</Link>
          <Link to="/apply" className="py-3 text-center text-emerald-950 font-medium border-r border-emerald-100 hover:bg-emerald-100 transition-colors">Join the Network</Link>
          <Link to="/contact" className="py-3 text-center text-emerald-950 font-medium hover:bg-emerald-100 transition-colors">Contact Us</Link>
        </div>
      </div>

      {/* Metrics / Stats Section */}
      <section className="py-20 bg-[#f8fcfc] relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[20px] p-10 flex flex-col items-center text-center shadow-[0_15px_40px_rgba(16,131,127,0.08)] border border-[#10837f]/5 hover:-translate-y-2 transition-transform duration-300"
            >
              <h3 className="text-5xl md:text-6xl font-sans font-bold text-[#10837f] mb-4">
                <AnimatedNumber endValue={500} suffix="+" duration={4500} />
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Clients Served Across 5 States
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[20px] p-10 flex flex-col items-center text-center shadow-[0_15px_40px_rgba(16,131,127,0.08)] border border-[#10837f]/5 hover:-translate-y-2 transition-transform duration-300"
            >
              <h3 className="text-5xl md:text-6xl font-sans font-bold text-[#10837f] mb-4">
                <AnimatedNumber endValue={2023} duration={4500} />
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Pioneered Professional In-Home Care Service in 2023
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[20px] p-10 flex flex-col items-center text-center shadow-[0_15px_40px_rgba(16,131,127,0.08)] border border-[#10837f]/5 hover:-translate-y-2 transition-transform duration-300"
            >
              <h3 className="text-5xl md:text-6xl font-sans font-bold text-[#10837f] mb-4">
                <AnimatedNumber endValue={5} duration={4500} />
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                States Covered and Increasing
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#0e4e5e] font-heading">Our Specialty Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mt-12">
            {services.map((service, index) => (
              <motion.div 
                key={service.title} 
                className="relative pt-7 group flex flex-col h-full cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Icon Badge (overlapping top border) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center border border-emerald-50 shadow-[0_4px_10px_rgba(16,131,127,0.1)] group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(16,131,127,0.15)] transition-all duration-300">
                   <service.icon className="w-7 h-7 text-[#10837f]" strokeWidth={1.5} />
                </div>
                
                {/* Card Body */}
                <div className="rounded-[1.5rem] border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-4 pt-10 text-center h-full group-hover:border-[#10837f]/30 relative z-0 overflow-hidden">
                    {/* Image Area */}
                    <Link to={`/services/${service.title.toLowerCase().replace(/ /g, '-').replace('dimentia', 'dementia')}`} className="w-full h-52 overflow-hidden rounded-[1rem] mb-5 relative group-hover:shadow-inner transition-all block">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </Link>
                    {/* Title Area */}
                    <div className="flex-1 flex flex-col items-center justify-center py-2 px-2">
                        <h3 className="text-xl font-bold text-[#05445E] font-heading leading-tight mb-3">{service.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-6">{service.description}</p>
                        
                        <div className="mt-auto pt-4 relative z-20 w-full flex justify-center">
                            <Link to={`/services/${service.title.toLowerCase().replace(/ /g, '-').replace('dimentia', 'dementia')}`} className="inline-flex items-center justify-center bg-[#10837f] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#0c6b68] shadow-md hover:shadow-lg transition-all w-4/5 gap-2 group/btn">
                                Learn More
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Highlight Section */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50/50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0e4e5e] mb-4 font-heading tracking-tight">The PrimeVita Advantage</h2>
            <p className="text-lg text-gray-600 font-light">We leverage superior training facilities and cutting-edge technology to provide unmatched domiciliary care.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Record Management */}
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-emerald-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d8a846]/10 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#10837f]"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0e4e5e] mb-4">Cloud-Based Record Management</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-6">
                  Our proprietary record management software is truly unrivalled in Nigeria. It provides families direct, real-time access to their loved one’s care plans, nursing notes, vitals monitoring, and daily assessments—any time of the day, regardless of their location.
                </p>
                <div className="flex items-center text-[#10837f] font-semibold text-sm">
                  <span>Transparent Monitoring</span> <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>

            {/* Exclusive Training */}
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-emerald-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10837f]/10 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#10837f]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0e4e5e] mb-4">Exclusive Staff Training</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-6">
                  We deploy only adequately trained staff who must successfully scale through our rigorous theoretical and practical hands-on evaluation. This specialized training takes place at our exclusive Retirement Home for Senior Citizens, guaranteeing dependable, high-quality care.
                </p>
                <div className="flex items-center text-[#10837f] font-semibold text-sm">
                  <span>Industry-Leading Standards</span> <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#10837f] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#d8a846]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading tracking-tight">Need professional care for yourself or a loved one?</h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">We are here to help. Schedule an assessment to get started with our personalized care plans.</p>
            <Link to="/assessment" className="inline-flex items-center justify-center rounded-2xl h-16 px-12 bg-[#d8a846] text-[#0e4e5e] hover:bg-[#c2963f] hover:scale-105 font-bold transition-all shadow-[0_8px_30px_rgba(216,168,70,0.3)]">
                Start Client Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
        </div>
      </section>
    </div>
  );
}
