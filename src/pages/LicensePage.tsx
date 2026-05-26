import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export function LicensePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <div className="mb-10 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                 <ShieldCheck className="w-10 h-10" />
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-[#0e4e5e] mb-4">Official Registration & License</h1>
             <p className="text-lg text-gray-600 max-w-2xl font-light">
               PrimeVita Health Services is fully registered and licensed by the Corporate Affairs Commission (CAC) and relevant regulatory bodies. View our Certificate of Registration below.
             </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-xl border border-emerald-100 max-w-3xl mx-auto mb-16 relative overflow-hidden flex flex-col items-center">
            <img 
               src="https://kommodo.ai/i/AmdKnUUnV58kXvDd4hej" 
               alt="Official CAC Certificate of Registration for PrimeVita Health Services"
               className="w-full h-auto object-contain rounded-lg border border-gray-100"
            />
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium bg-emerald-50 px-6 py-3 rounded-full hover:bg-emerald-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
