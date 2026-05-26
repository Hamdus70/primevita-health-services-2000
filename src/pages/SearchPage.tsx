import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

// Simulated site-wide content for search purposes
const SITE_CONTENT = [
  { title: "Home", path: "/", description: "Welcome to PrimeVita Homecare Agency. Providing professional, compassionate, and personalized healthcare at home." },
  { title: "About Us", path: "/about", description: "Our mission is to deliver high-quality, personalized home healthcare. Learn about our vision, our team, and our commitment." },
  { title: "Our Services", path: "/services", description: "Comprehensive homecare services including Physiotherapy, Home Nursing, Elderly Care, Post-Surgical Support, and Medical Equipment." },
  { title: "Contact PrimeVita", path: "/contact", description: "Get in touch with us for inquiries, booking, or support. We are available 24/7 to assist our patients and clients." },
  { title: "Book an Appointment", path: "/book", description: "Schedule a care assessment or book services directly online with our professional healthcare and nursing staff." },
  { title: "Government Licensing", path: "/license", description: "PrimeVita Health Services is fully registered and licensed by the Corporate Affairs Commission (CAC) and relevant regulatory bodies." },
  { title: "Patient Portal", path: "/portal", description: "Login for existing patients or their families to track care progress, view vitals, handle payments, and communicate with staff." }
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState(SITE_CONTENT);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = SITE_CONTENT.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get('query')?.toString() || '';
    if (newQuery) {
      setSearchParams({ q: newQuery });
    }
  };

  return (
    <div className="bg-[#f8fcfc] min-h-[70vh] py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-[#0e4e5e] mb-8">Search Results</h1>
        
        <form onSubmit={handleSearchSubmit} className="mb-12 relative flex items-center max-w-xl mx-auto">
          <Search className="absolute left-4 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            name="query"
            defaultValue={query}
            placeholder="What are you looking for?"
            className="w-full bg-white border-2 border-gray-200 text-[#0e4e5e] text-base px-5 py-3.5 pl-12 rounded-full outline-none focus:border-[#10837f] transition-colors shadow-sm"
          />
          <button type="submit" className="absolute right-2 bg-[#10837f] hover:bg-[#0c6b68] text-white px-6 py-2 rounded-full font-medium transition-colors text-sm">
            Search
          </button>
        </form>

        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <p className="text-gray-600 font-medium">
            {query ? `Showing results for "${query}"` : 'Enter a search term'}
          </p>
          {query && <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{results.length} found</p>}
        </div>

        <div className="space-y-6">
          {results.length > 0 ? (
            results.map((result, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <Link to={result.path} className="block">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold font-heading text-[#0e4e5e] group-hover:text-[#10837f] transition-colors">
                      {result.title}
                    </h3>
                    <div className="bg-gray-50 p-2 rounded-full group-hover:bg-[#10837f]/10 transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#10837f] transition-colors" />
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {result.description}
                  </p>
                  <div className="text-sm text-[#10837f] font-mono tracking-tight opacity-70">
                    primevita.com{result.path}
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            query && (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold font-heading text-[#0e4e5e] mb-2">No results found</h3>
                <p className="text-gray-500">We couldn't find anything matching "{query}". Try different keywords.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
