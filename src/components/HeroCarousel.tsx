import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// 1st item: https://www.image2url.com/r2/default/images/1778073234752-b84ec824-7286-496d-b869-8168c437d061.jpg
// 2nd item: https://www.image2url.com/r2/default/images/1778070733395-41884973-86b2-4d77-b466-626014118642.jpg
// 3rd item: https://www.image2url.com/r2/default/images/1778072880520-5c68477d-a517-44ff-8043-b9c38e9e3afd.jpg

const slides = [
  {
    title: 'Professional Home Care\nin Lagos',
    subtitle: 'Qualified Nurses &\nCaregivers Available 24/7',
    image: 'https://www.image2url.com/r2/default/images/1778073234752-b84ec824-7286-496d-b869-8168c437d061.jpg',
  },
  {
    title: 'Hire a Trusted Caregiver\nToday',
    subtitle: 'Reliable, compassionate daily support\nfor your beloved family members',
    image: 'https://www.image2url.com/r2/default/images/1778070733395-41884973-86b2-4d77-b466-626014118642.jpg',
  },
  {
    title: 'Medical Recovery\nat Home',
    subtitle: 'Skilled nursing care customized\nfor prompt healing',
    image: 'https://www.image2url.com/r2/default/images/1778072880520-5c68477d-a517-44ff-8043-b9c38e9e3afd.jpg',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        nextSlide();
      }, 10000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isPlaying, nextSlide]);

  return (
    <div className="relative min-h-[550px] h-[80vh] max-h-[700px] w-full overflow-hidden text-white flex flex-col justify-center py-20">
      {/* Background shape and image area */}
      <div className="absolute inset-0 flex w-full">
        {/* Full width image with overlay */}
        <div className="w-full absolute inset-0 z-0 overflow-hidden">
           {slides.map((slide, index) => (
            <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover z-0" />
            </div>
           ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-black/30 md:hidden z-0" />

      {/* Top Left Navigation Arrows */}
      <div className="absolute top-6 left-6 md:left-20 z-30 flex gap-2">
        <button onClick={prevSlide} className="text-white hover:text-white/80 transition-colors p-1" aria-label="Previous Slide">
            <ChevronLeft className="w-6 h-6 fill-white" />
        </button>
        <button onClick={nextSlide} className="text-white hover:text-white/80 transition-colors p-1" aria-label="Next Slide">
            <ChevronRight className="w-6 h-6 fill-white" />
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-0 h-full relative z-20 flex flex-col justify-center w-full">
         <div className="max-w-[500px] md:ml-[5%] flex flex-col items-center text-center">
             {/* Logo or Icon block */}
             <div className="mb-8 flex flex-col items-center opacity-90 hover:opacity-100 transition-opacity">
                 <div className="flex items-center gap-2 mb-1">
                     <div className="w-10 h-10 relative flex items-center justify-center bg-gradient-to-br from-[#d8a846] to-[#af832c] rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm overflow-hidden transform -rotate-3 border border-white/20">
                         <span className="text-white font-bold text-xl relative z-10 block">+</span>
                     </div>
                     <div className="flex flex-col items-start leading-none text-white">
                        <span className="text-3xl font-extrabold tracking-tight">PrimeVita</span>
                        <span className="text-[10px] font-bold tracking-[0.2em] mt-1 ml-0.5 text-[#d8a846]">HEALTH SERVICES</span>
                     </div>
                  </div>
             </div>

             {/* Slide Text */}
             <div className="relative min-h-[160px] md:min-h-[180px] w-full mb-8 flex flex-col items-center justify-center">
                 {slides.map((slide, index) => (
                    <div 
                        key={index} 
                        className={`absolute inset-0 w-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-4 whitespace-pre-line tracking-tight drop-shadow-sm">
                            {slide.title}
                        </h2>
                        <p className="text-2xl md:text-[28px] font-normal whitespace-pre-line drop-shadow-sm">
                            {slide.subtitle}
                        </p>
                    </div>
                 ))}
             </div>
             
             {/* Call to action */}
             <Link to="/about" className="group inline-flex items-center justify-center rounded-xl px-10 py-4 text-sm tracking-wider font-bold bg-[#10837f] text-white hover:bg-white hover:text-[#10837f] transition-all duration-300 shadow-xl overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-2">
                    LEARN MORE
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
             </Link>
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-10 left-6 md:left-20 z-30 flex items-center gap-3">
        <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="w-8 h-8 rounded-full border border-white flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
        >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
        </button>

        {slides.map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                    index === currentSlide ? 'bg-white text-[#10837f]' : 'bg-transparent border border-white text-white hover:bg-white/20'
                }`}
                aria-label={`Go to slide ${index + 1}`}
            >
                {index + 1}
            </button>
        ))}
      </div>
    </div>
  );
}
