import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="bg-emerald-50/30">
      {/* Hero Section */}
      <div className="bg-white pb-20 pt-32 overflow-hidden border-b border-gray-100 relative">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-teal-100/50 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter text-[#0e4e5e]">Caring Like <span className="text-[#10837f]">Family.</span></h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
            We understand how important it is to have peace of mind when it comes to the health and safety of your loved ones. 
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column: Who we are */}
          <div>
            <h2 className="text-4xl font-bold mb-8 text-[#0e4e5e]">Who We Are</h2>
            <div className="prose prose-lg text-gray-700 leading-relaxed font-light">
              <p className="mb-6">
                <strong>PrimeVita Health Services</strong> is a dedicated team of compassionate healthcare professionals committed to redefining home-based nursing and caregiving. Based in Alimosho, Lagos State, we bridge the gap between hospital care and home comfort.
              </p>
              <p className="mb-6">
                When illness strikes or aging slows us down, the comfort of home shouldn't be a privilege—it should be part of the healing process. We step into your home not just as healthcare providers, but as trusted partners who treat your parents, spouses, and family members with the utmost dignity and respect.
              </p>
              <p>
                From post-surgical recovery to long-term dementia care, our registered nurses and trained caregivers are here to ensure you never have to walk the caregiving journey alone.
              </p>
            </div>

            <h3 className="text-3xl font-bold mt-16 mb-8 text-[#0e4e5e]">Why Families Choose Us</h3>
            <ul className="space-y-6">
              {[
                "Carefully vetted, qualified, and highly trained clinical staff.",
                "Personalized care plans tailored exactly to your family's needs.",
                "Consistent, communicative, and transparent reporting on patient health.",
                "A genuine culture of empathy—we treat every client as our own family."
              ].map((point, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                  <span className="text-lg text-gray-700 font-light">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div className="bg-[#10837f]/10 p-6 rounded-3xl border border-[#10837f]/20">
                <h3 className="text-xl font-bold text-[#0e4e5e] mb-3">Our Mission</h3>
                <p className="text-gray-700 font-light leading-relaxed">
                  To deliver high-quality, personalized home healthcare with compassion, professionalism, and respect for every client and family we serve.
                </p>
              </div>
              <div className="bg-[#d8a846]/10 p-6 rounded-3xl border border-[#d8a846]/20">
                <h3 className="text-xl font-bold text-[#0e4e5e] mb-3">Our Vision</h3>
                <p className="text-gray-700 font-light leading-relaxed">
                  To become a trusted leader in home healthcare, recognized for excellence, reliability, and a genuine commitment to improving quality of life.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0e4e5e] mb-6">Our Core Values</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg text-[#10837f] mb-1">Compassion & Empathy</h4>
                    <p className="text-gray-600 text-sm font-light leading-relaxed">We provide affectionate care, treating our clients with the same warmth and sensitivity we would our own parents.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#10837f] mb-1">Dignity & Respect</h4>
                    <p className="text-gray-600 text-sm font-light leading-relaxed">We safeguard the self-respect of our seniors, promoting their independence and ensuring they retain their dignity at home.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#10837f] mb-1">Excellence & Reliability</h4>
                    <p className="text-gray-600 text-sm font-light leading-relaxed">We go above and beyond industry standards, deploying rigorously screened, well-trained, and motivated staff.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#10837f] mb-1">Accessible Healthcare</h4>
                    <p className="text-gray-600 text-sm font-light leading-relaxed">We believe healthcare is a basic human right and strive to make top-tier domiciliary care affordable and well-coordinated.</p>
                  </div>
                </div>
            </div>
          </div>

          {/* Right Column: Image and Services */}
          <div>
            <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 w-full aspect-square relative">
              <img 
                src="https://www.image2url.com/r2/default/images/1778072876608-5498fd64-bb2e-4f79-b73d-4a011deb6967.jpg" 
                alt="Our Care Culture" 
                className="w-full h-[120%] object-cover object-top absolute top-0 left-0 hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-emerald-100">
              <h3 className="text-2xl font-bold mb-6 text-[#0e4e5e]">Our Core Services</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-[#d8a846] pl-4">
                  <h4 className="font-semibold text-lg text-gray-900">Home Nursing</h4>
                  <p className="text-gray-600 text-sm font-light">Wound care, medication administration, and vital signs monitoring.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-lg text-gray-900">Caregiving & Personal Aides</h4>
                  <p className="text-gray-600 text-sm font-light">Assistance with bathing, dressing, feeding, and daily activities.</p>
                </div>
                <div className="border-l-4 border-[#10837f] pl-4">
                  <h4 className="font-semibold text-lg text-gray-900">Specialized Care</h4>
                  <p className="text-gray-600 text-sm font-light">Dementia, palliative, and hospice care support.</p>
                </div>
              </div>
              <Link to="/services" className="mt-8 inline-block text-emerald-700 font-medium hover:text-emerald-900 transition-colors">
                View All Services &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-24 border-t border-emerald-100 mt-12">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h2 className="text-4xl font-bold mb-10 text-[#0e4e5e]">Get In Touch</h2>
          <p className="text-xl text-gray-500 font-light mb-16 max-w-2xl mx-auto">
            Ready to arrange care for a loved one, or simply have questions about how we can help? Our team is always here to listen.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <a href="tel:+2347012918331" className="flex flex-col items-center p-8 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 delay-100 transition-transform hover:scale-110">
                <Phone className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-900">Call Us</h4>
              <p className="text-gray-600 font-light text-center">+(234) 701-291-8331</p>
            </a>
            
            <a href="mailto:info@primevitahealthservices.com" className="flex flex-col items-center p-8 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 delay-100 transition-transform hover:scale-110">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-900">Email Us</h4>
              <p className="text-gray-600 font-light text-center">info@primevitahealthservices.com</p>
            </a>
            
            <a href="https://maps.google.com/?q=9+Alaka+off+Bammeke,+Alimosho,+Lagos+State" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-8 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 delay-100 transition-transform hover:scale-110">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-900">Visit Us</h4>
              <p className="text-gray-600 font-light text-center">9, Alaka off Bammeke,<br/>Alimosho, Lagos State.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
