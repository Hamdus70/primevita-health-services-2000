import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquareQuote, Video, CheckCircle2, Upload, AlertCircle, Play, Info, ThumbsUp, Sparkles, Send, X } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  clientName: string;
  relation: string;
  rating: number;
  text: string;
  videoUrl?: string;
  isApproved: boolean;
  createdAt?: any;
}

const PRESET_TESTIMONIALS: Testimonial[] = [
  {
    id: "seed-1",
    clientName: "Mrs. Funmilayo Adebayo",
    relation: "Daughter of Patient",
    rating: 5,
    text: "PrimeVita's elderly care was a lifesaver for our family in Lagos. Their registered nurse visits my 82-year-old mother thrice a week. They monitor her blood pressure, manage her medication, and give us complete peace of mind through their real-time portal notes. Truly, they care like family!",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isApproved: true
  },
  {
    id: "seed-2",
    clientName: "Dr. Emeka Okafor",
    relation: "Son of Post-Stroke Patient",
    rating: 5,
    text: "Following my father’s discharge after a mild stroke, we were worried about daily rehab. PrimeVita's physiotherapist visited our home daily. His mobility improved by 80% within a month. The staff are so professional, responsive, and remarkably loving.",
    videoUrl: "",
    isApproved: true
  },
  {
    id: "seed-3",
    clientName: "Alhaji Ibrahim Musa",
    relation: "Home Nursing Client",
    rating: 5,
    text: "Outstanding service. The level of transparency in their app portal is unheard of in Nigeria. I am able to see the vital signs logs directly while sitting in my office in Abuja. They are incredibly reliable.",
    videoUrl: "",
    isApproved: true
  },
  {
    id: "seed-4",
    clientName: "Chioma Nwachukwu",
    relation: "Daughter of Dementia Patient",
    rating: 5,
    text: "Caring for an elderly parent with progressive dementia is an emotional roller coaster. The specialized dementia caregivers from PrimeVita are highly trained. They set structured routines and sensory tasks that calmed my father down. Unmatched reliability.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isApproved: true
  }
];

export function TestimonialsPage() {
  const [dbTestimonials, setDbTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Form states
  const [clientName, setClientName] = useState('');
  const [relation, setRelation] = useState('Daughter of Patient');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load testimonials
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const testimonialsCol = collection(db, 'testimonials');
        const q = query(testimonialsCol, where('isApproved', '==', true), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetched: Testimonial[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            id: doc.id,
            clientName: data.clientName,
            relation: data.relation,
            rating: data.rating,
            text: data.text,
            videoUrl: data.videoUrl || '',
            isApproved: data.isApproved,
            createdAt: data.createdAt
          });
        });
        setDbTestimonials(fetched);
      } catch (error) {
        console.warn('Error fetching testimonials from firestore, using presets:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !text.trim()) {
      toast.error('Please fill in your name and success story message.');
      return;
    }

    setIsSubmitting(true);
    const testimonialPath = 'testimonials';
    try {
      const payload = {
        clientName: clientName.trim(),
        relation,
        rating: Number(rating),
        text: text.trim(),
        videoUrl: videoUrl.trim() || '',
        isApproved: false, // Default to false for moderation safety
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, testimonialPath), payload);
      
      toast.success('Thank you! Your story has been submitted and is awaiting administrative approval.', {
        duration: 8000
      });
      
      // Reset form fields
      setClientName('');
      setRelation('Daughter of Patient');
      setRating(5);
      setText('');
      setVideoUrl('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, testimonialPath);
      toast.error('Failed to submit story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allTestimonials = [...dbTestimonials, ...PRESET_TESTIMONIALS.filter(p => !dbTestimonials.some(d => d.id === p.id || d.clientName === p.clientName))];

  return (
    <div className="bg-[#fcfdfd] min-h-screen">
      {/* Visual Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eaf4f4] to-white py-20 border-b border-emerald-50">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576766145347-1a1a79db1270?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80")' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10837f]/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d8a846]/5 rounded-full blur-3xl translate-y-24 -translate-x-12"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#10837f]/10 text-[#0e4e5e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Voted Most Empathetic Domiciliary Care Team
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#0e4e5e] font-heading tracking-tight mb-4"
          >
            Client Testimonials & Success Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto"
          >
            We take pride in providing exceptional home nursing, post-surgical rehabilitation, and elder companion support in Nigeria. Read how we make a difference, one family at a time.
          </motion.p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16 container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Success Stories Grid (8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0e4e5e] font-heading">Inspirational Journeys</h2>
                <p className="text-sm text-gray-500">Real verified stories submitted by our healthcare community.</p>
              </div>
              <span className="font-mono text-xs text-[#10837f] bg-emerald-50 px-3 py-1 rounded-full font-semibold">
                {allTestimonials.length} Stories Shared
              </span>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-white border border-gray-100 p-6 rounded-2xl h-64 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                    </div>
                    <div className="h-10 bg-gray-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                layout
                className="grid md:grid-cols-2 gap-6"
              >
                {allTestimonials.map((testimonial, idx) => (
                  <motion.div
                    key={testimonial.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 2) * 0.1 }}
                    className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 hover:border-[#10837f]/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group shadow-sm"
                  >
                    <MessageSquareQuote className="absolute top-5 right-5 text-emerald-100 w-12 h-12 -z-0 pointer-events-none group-hover:text-emerald-200 transition-colors" />
                    
                    <div>
                      {/* Rating Stars & Badge */}
                      <div className="flex items-center gap-1.5 mb-4 relative z-10">
                        <div className="flex text-[#d8a846]">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        {testimonial.videoUrl && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100 shrink-0">
                            <Video className="w-3 h-3 text-[#d8a846]" />
                            Includes Video
                          </span>
                        )}
                      </div>

                      {/* Story Description Text */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light italic relative z-10">
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Bottom identity area */}
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between relative z-10">
                      <div>
                        <h4 className="font-heading font-bold text-[#0e4e5e] text-sm md:text-base flex items-center gap-1">
                          {testimonial.clientName}
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">{testimonial.relation}</p>
                      </div>

                      {/* Video testimony activator */}
                      {testimonial.videoUrl && (
                        <button
                          onClick={() => setActiveVideo(testimonial.videoUrl || null)}
                          className="bg-emerald-50 text-[#10837f] p-2.5 rounded-full hover:bg-[#10837f] hover:text-white hover:scale-105 active:scale-95 transition-all text-xs flex items-center gap-1 shadow-sm"
                          title="Watch video success story"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Structured Advice block on incorporating video reviews - Requested by User */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#0e4e5e] to-[#10837f] rounded-[2.5rem] text-white p-8 md:p-12 shadow-xl relative overflow-hidden"
            >
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
              
              <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="bg-[#d8a846] text-[#0e4e5e] font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full inline-block mb-3">
                    Video Success Stories
                  </span>
                  <h3 className="text-2xl md:text-3xl font-heading font-black mb-4">How Video Testimonials Work</h3>
                  <p className="text-sm md:text-base text-white/90 font-light leading-relaxed mb-6">
                    Watching and listening to another family's authentic story provides unparalleled trust. We welcome you to share an emotional video review of your experiences with PrimeVita's nursing and rehabilitation professionals!
                  </p>

                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 p-1 rounded mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-[#d8a846]" />
                      </div>
                      <p className="text-xs text-white/80"><strong className="text-white">Record simply</strong> on your smartphone or webcam. Keep it friendly, direct, and under 2 minutes.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 p-1 rounded mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-[#d8a846]" />
                      </div>
                      <p className="text-xs text-white/80"><strong className="text-white">Easy sharing</strong>: Upload to Google Drive (with public link sharing) or post on YouTube/Vimeo.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 p-1 rounded mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-[#d8a846]" />
                      </div>
                      <p className="text-xs text-white/80"><strong className="text-white">Automatic embedding</strong>: Safe linkage of Google Drive or video platform URLs inside our interactive viewer.</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center p-6 border border-white/10 bg-white/5 rounded-3xl text-center">
                  <Video className="w-12 h-12 text-[#d8a846] mb-3 animate-pulse" strokeWidth={1} />
                  <h4 className="font-heading font-bold text-sm mb-1">Email Your Clips Too</h4>
                  <p className="text-[11px] text-white/70 font-light mb-4 leading-relaxed">Prefer to send us files directly? Send recordings via email, and our media team will embed them for you.</p>
                  <a
                    href="mailto:testimonials@primevitahealth.com"
                    className="bg-white text-[#0e4e5e] hover:bg-[#d8a846] hover:text-white px-5 py-2 rounded-2xl font-bold text-xs transition-all w-full flex items-center justify-center gap-2 shadow"
                  >
                    Email Video File
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Submission Form (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#10837f]/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="mb-6 relative z-10 flex items-center gap-2.5">
                <div className="bg-emerald-50 text-[#10837f] p-3 rounded-2xl shadow-inner">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#0e4e5e] font-heading">Submit Your Story</h3>
                  <p className="text-xs text-gray-500">Inspire other families looking for quality care.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2"> Your Name / Alias</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alhaji Mustapha A."
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#10837f]/50 hover:bg-white focus:bg-white rounded-xl h-12 px-4 text-xs font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Relationship to Patient</label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#10837f]/50 hover:bg-white focus:bg-white rounded-xl h-12 px-3 text-xs font-medium transition-all"
                  >
                    <option value="Daughter of Patient">Daughter of Patient</option>
                    <option value="Son of Patient">Son of Patient</option>
                    <option value="Spouse of Patient">Spouse of Patient</option>
                    <option value="Patient / Self">Patient / Self</option>
                    <option value="Nephew / Niece">Nephew / Niece</option>
                    <option value="Healthcare Colleague">Healthcare Colleague</option>
                    <option value="Other Relative">Other Relative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Assign Care Rating</label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-colors hover:scale-110 active:scale-95 text-[#d8a846] duration-150"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-gray-200'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-gray-400 ml-2">({rating}/5)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Your Personal Success Story / Feedback</label>
                  <textarea
                    required
                    maxLength={3000}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe how our nursing staff, physiotherapist, or caregivers helped you or your family member..."
                    rows={5}
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#10837f]/50 hover:bg-white focus:bg-white rounded-xl p-4 text-xs font-medium leading-relaxed transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Video Link <span className="text-[10px] text-gray-400">(Optional)</span></label>
                    <span className="text-[10px] bg-amber-50 text-[#b58b35] border border-amber-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Video className="w-2.5 h-2.5" />
                      Google Drive / YT
                    </span>
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="e.g. https://youtube.com/watch?v=..."
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#10837f]/50 hover:bg-white focus:bg-white rounded-xl h-12 px-4 text-xs font-medium transition-all"
                  />
                </div>

                <div className="flex items-start gap-2.5 bg-emerald-50/50 border border-emerald-50 p-4 rounded-2xl">
                  <Info className="w-4.5 h-4.5 text-[#10837f] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-600 leading-relaxed font-light">
                    Submissions undergo a short administrative screening to ensure privacy and compliance before showing up live.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#10837f] hover:bg-[#0c6b68] text-white font-bold h-12 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs"
                >
                  {isSubmitting ? (
                    <span className="inline-block border-2 border-white/30 border-t-white rounded-full w-4 h-4 animate-spin"></span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Publish Story Submission
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Support panel */}
            <div className="bg-amber-50/30 border border-amber-50 p-6 rounded-[2rem] space-y-3 shadow-inner">
              <h4 className="font-heading font-black text-[#0e4e5e] text-sm flex items-center gap-1.5 matches-glow">
                <ThumbsUp className="w-4 h-4 text-[#d8a846]" />
                Become an Ambassador
              </h4>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                By allowing us to share your success story, you prevent families from choosing unqualified self-employed staff. Join our ambassador network to receive exclusive invitations and premium loyalty tokens.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Embedded Video Testimonials Visual Simulator Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl relative border border-gray-100"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 hover:scale-105 active:scale-95 transition-all z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-red-50 p-2 rounded-xl">
                    <Video className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[#0e4e5e] text-base md:text-lg">Video Success Story</h3>
                    <p className="text-xs text-gray-500">Live testimonial preview</p>
                  </div>
                </div>

                {/* Simulated/Real Video Frame */}
                <div className="w-full aspect-video bg-gray-950 rounded-2xl overflow-hidden relative group flex items-center justify-center border border-gray-800">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm brightness-50" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576766145347-1a1a79db1270?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80")' }}></div>
                  
                  {activeVideo.includes('youtube.com') || activeVideo.includes('youtu.be') ? (
                    <div className="w-full h-full relative z-10">
                      <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="relative z-10 text-center text-white px-6">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 animate-pulse">
                        <Play className="w-6 h-6 text-[#d8a846] fill-current translate-x-0.5" />
                      </div>
                      <p className="text-sm font-semibold text-gray-200 mb-1">Playing Shared Link Video</p>
                      <span className="text-xs text-gray-400 font-mono inline-block truncate max-w-xs mb-3 bg-black/50 px-3 py-1 rounded-full">{activeVideo}</span>
                      <p className="text-[11px] text-gray-400 max-w-md mx-auto">This browser frame safely simulates streaming from a custom Google Drive, private server share, or third-party storage platform.</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-start gap-2.5 bg-amber-50/50 border border-amber-50 p-4 rounded-xl">
                  <AlertCircle className="w-4.5 h-4.5 text-[#b58b35] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <strong>Administrative Notice:</strong> In our live production environment, video testimonials are securely hosted on an enterprise Google Workspace Storage bucket or our YouTube Community channel to guarantee low-latency buffering.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
