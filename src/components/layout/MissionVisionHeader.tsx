export function MissionVisionHeader() {
  return (
    <div className="bg-[#f0f5fa] border-b border-[#e1eaf3] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-12 font-medium text-xs">
            <div className="flex gap-12">
                <span><span className="text-[#d8a846] font-bold mr-2">OUR MISSION:</span> 
                <span className="text-gray-700">To deliver high-quality, personalized home healthcare with compassion, professionalism, and respect for every client and family we serve.</span></span>
                <span><span className="text-[#d8a846] font-bold mr-2">OUR VISION:</span> 
                <span className="text-gray-700">To become a trusted leader in home healthcare, recognized for excellence, reliability, and a genuine commitment to improving quality of life.</span></span>
            </div>
            {/* Duplicate for infinite loop */}
            <div className="flex gap-12">
                <span><span className="text-[#d8a846] font-bold mr-2">OUR MISSION:</span> 
                <span className="text-gray-700">To deliver high-quality, personalized home healthcare with compassion, professionalism, and respect for every client and family we serve.</span></span>
                <span><span className="text-[#d8a846] font-bold mr-2">OUR VISION:</span> 
                <span className="text-gray-700">To become a trusted leader in home healthcare, recognized for excellence, reliability, and a genuine commitment to improving quality of life.</span></span>
            </div>
        </div>
    </div>
  );
}
