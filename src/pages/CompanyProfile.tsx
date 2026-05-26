import React, { useRef, useState, useEffect } from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

export function CompanyProfile() {
  const contentRef = useRef<HTMLDivElement>(null);
  const images = { 
    logo: 'https://www.image2url.com/r2/default/images/1778073229664-4aa07c71-2ec8-4eb8-895d-24201a8b1c3d.jpg', 
    caring: 'https://www.image2url.com/r2/default/images/1778073234752-b84ec824-7286-496d-b869-8168c437d061.jpg', 
    senior: 'https://www.image2url.com/r2/default/images/1778070733395-41884973-86b2-4d77-b466-626014118642.jpg' 
  };

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: 'PrimeVita-Company-Profile',
  });

  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4 font-sans print:bg-white print:py-0 print:px-0">
      
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-[#10837f] bg-white px-4 py-2 rounded-lg shadow-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={() => handlePrint()}
            className="inline-flex items-center gap-2 bg-white text-[#10837f] border border-[#10837f] hover:bg-[#10837f]/10 px-6 py-2 rounded-lg shadow-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button 
            onClick={() => handlePrint()}
            className="inline-flex items-center gap-2 bg-[#10837f] hover:bg-[#0c6b68] text-white px-6 py-2 rounded-lg shadow-md font-medium transition-colors"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div ref={contentRef} className="space-y-8 print:space-y-0" style={{ backgroundColor: '#ffffff' }}>
        
        {/* PAGE 1: COVER */}
        <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-xl relative overflow-hidden flex flex-col print:shadow-none print:break-after-page p-8">
          <div className="w-full h-full border-[3px] border-[#10837f] p-1.5">
            <div className="w-full h-full border border-[#10837f] flex flex-col text-center bg-white relative">
              {/* Top Theme Banner */}
              <div className="w-full h-24 bg-[#10837f] shrink-0 mb-12"></div>

              <div className="flex-1 flex flex-col items-center px-12">
                <img 
                  src={images.logo} 
                  alt="PrimeVita Health Services Logo" 
                  className="w-72 object-contain mb-8 mix-blend-multiply" 
                />
                
                <h1 className="text-4xl font-extrabold text-[#0e4e5e] mb-4 tracking-tight">PrimeVita Homecare Agency</h1>
                <p className="text-xl font-bold text-[#d8a846] italic tracking-wide">
                  ...Compassionate • Professional • Reliable Home
                </p>

                {/* Content Area - Images */}
                <div className="mt-16 w-full h-[280px] bg-[#10837f] flex p-1 shadow-md shrink-0">
                  <img 
                      src={images.caring} 
                      alt="Caring Professional" 
                      className="w-1/2 h-full object-cover pr-0.5"
                  />
                  <img 
                      src={images.senior} 
                      alt="Senior Assistance" 
                      className="w-1/2 h-full object-cover pl-0.5"
                  />
                </div>

                {/* Contact Details */}
                <div className="mt-auto mb-16 space-y-4 text-[#0e4e5e] font-medium text-[16px] w-full">
                  <p>Tel: +2347012918331 (whatsapp)</p>
                  <p className="text-[#10837f] underline decoration-[#10837f]/30 underline-offset-4">info@primevitahealthservices.com</p>
                  <p className="text-[#10837f] underline decoration-[#10837f]/30 underline-offset-4">www.primevitahealthservices.com</p>
                  <p className="mt-4 text-gray-500 font-normal">Office Address: 9, Alaka off Bammeke, Alimosho, Lagos State, Nigeria</p>
                </div>
              </div>
              
              {/* Bottom Theme Banner */}
              <div className="w-full h-12 bg-[#10837f] shrink-0 mt-auto flex items-center justify-between px-10 text-white text-xs font-semibold tracking-widest opacity-90 relative z-20">
                <span>PRIMEVITA HEALTH SERVICES</span>
                <span>COMPANY PROFILE</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 2 */}
        <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-xl relative overflow-hidden print:shadow-none print:break-after-page flex flex-col p-8">
          <div className="w-full h-full border-[3px] border-[#10837f] p-1.5">
            <div className="w-full h-full border border-[#10837f] flex flex-col bg-white relative">
              {/* Top Strip */}
              <div className="w-full h-4 bg-[#10837f] shrink-0 relative z-20"></div>
              
              <div className="flex-1 p-14 relative flex flex-col overflow-hidden">
                {/* Watermark */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center -z-10">
                  <img 
                    src={images.logo} 
                    className="w-[120%] max-w-[800px] object-contain grayscale mix-blend-multiply"
                    alt=""
                  />
                </div>
                
                {/* Content Frame */}
                <div className="relative z-10 h-full">
                  
                  <div className="prose prose-sm max-w-none text-[#0e4e5e] prose-p:text-[#455a64] prose-p:text-justify prose-p:leading-[1.8] prose-p:mb-6">
                    
                    <h3 className="text-[#10837f] text-lg font-bold uppercase tracking-wider mb-2">INTRODUCING PRIMEVITA HOMECARE AGENCY</h3>
                    <p>
                      PrimeVita Homecare Agency is a standard and well-coordinated domiciliary care service provider. We offer preventive, curative, promotional, rehabilitative and palliative healthcare services to seniors through a person-centred approach, to keep seniors safe and sound at home, instead of anywhere else.
                    </p>

                    <h3 className="text-[#10837f] text-lg font-bold uppercase tracking-wider mb-2 mt-6">VISION STATEMENT</h3>
                    <p>
                      To become a trusted leader in home healthcare, recognized for excellence, reliability, and a genuine commitment to improving quality of life.
                    </p>

                    <h3 className="text-[#10837f] text-lg font-bold uppercase tracking-wider mb-2 mt-6">MISSION STATEMENT</h3>
                    <p>
                      To deliver high-quality, personalized home healthcare with compassion, professionalism, and respect for every client and family we serve.
                    </p>

                    <h3 className="text-[#10837f] text-lg font-bold uppercase tracking-wider mb-2 mt-8">WHAT GUIDES US?</h3>
                    <p>
                      We are guided by passion and compassion for the care of the aged in our society. The growing numbers of the elderly in the country represent thousands of families who are facing the ordeal of life beyond retirement. PrimeVita Homecare Agency exists because we strongly believe that health care is a basic human right. It must be available, coordinated and provided comprehensively.
                    </p>
                    <p>
                      We are poised to abate strains and tensions in the lives of families, as we ease the stress that comes with providing affectionate and professional care for beloved parents. We lean on the nurturing ability of our warm-hearted caregivers. We are committed to the rehabilitation of the diseased and disabled senior citizens within the structure of their home environments, allowing maximum contribution, independence and retention of self-respect.
                    </p>

                    <h3 className="text-[#10837f] text-lg font-bold uppercase tracking-wider mb-2 mt-8">OUR VALUE PROPOSITION</h3>
                    <p>
                      We offer quality and bespoke healthcare services that are worthy of your absolute trust, with guaranteed clients' satisfaction and total peace of mind.
                    </p>

                    <h3 className="text-[#10837f] text-lg font-bold uppercase tracking-wider mb-3 mt-8">OUR SERVICES</h3>
                    <ul className="list-none pl-0 space-y-3 mt-2 font-medium text-[15px] mb-0 text-[#0e4e5e]">
                      <li className="flex items-center gap-3">
                        <span className="text-[#10837f] text-lg font-bold leading-none">➢</span> Elderly Care
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-[#10837f] text-lg font-bold leading-none">➢</span> Home Nursing
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-[#10837f] text-lg font-bold leading-none">➢</span> Post-Hospital Recovery
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-[#10837f] text-lg font-bold leading-none">➢</span> Dementia Care
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-[#10837f] text-lg font-bold leading-none">➢</span> Physiotherapy
                      </li>
                    </ul>

                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* PAGE 3 */}
        <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-xl relative overflow-hidden print:shadow-none pb-0 flex flex-col p-8">
          <div className="w-full h-full border-[3px] border-[#10837f] p-1.5">
            <div className="w-full h-full border border-[#10837f] flex flex-col bg-white relative">
              {/* Top Strip */}
              <div className="w-full h-4 bg-[#10837f] shrink-0 relative z-20"></div>
              
              <div className="flex-1 p-14 relative flex flex-col overflow-hidden">
                {/* Watermark */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center -z-10">
                  <img 
                    src={images.logo} 
                    className="w-[120%] max-w-[800px] object-contain grayscale mix-blend-multiply"
                    alt=""
                  />
                </div>
                
                <div className="relative z-10 h-full">
                  
                  <div className="prose prose-sm max-w-none text-[#0e4e5e] prose-p:text-[#455a64] prose-p:text-justify prose-p:leading-[1.8] prose-p:mb-5">
                    
                    <h3 className="text-[#d8a846] text-xl font-bold uppercase tracking-wide mb-8">WHY YOU SHOULD CHOOSE US</h3>

                    <h4 className="text-[#10837f] text-base font-semibold mb-2 mt-0">Value for Money</h4>
                    <p>
                      Our rates are very reasonable mainly because we are motivated by a need to entrench a culture of excellence in service delivery and not profit.
                    </p>
                    <p>
                      We understand the impact of good remuneration on employees, as it translates to high-quality service delivery.
                    </p>

                    <h4 className="text-[#10837f] text-base font-semibold mb-2 mt-6">Recruitment and Selection</h4>
                    <p>
                      Our staff are subjected to various screening processes, to ensure high client satisfaction. Some of which are; Background and guarantor checks, permanent address verification, medical screening etc.
                    </p>

                    <h4 className="text-[#10837f] text-base font-semibold mb-2 mt-6">Staff Training</h4>
                    <p className="mb-2">
                      We deploy only adequately trained staff who must have successfully scaled through our theoretical and practical hands-on training and evaluation at our exclusive Retirement Home for Senior Citizens.
                    </p>
                    <p>
                      Our staff are well motivated with attractive incentives and wages. Our dedicated care team are passionate and dependable, delivering dedicated services above industry standards.
                    </p>

                    <h4 className="text-[#10837f] text-base font-semibold mb-2 mt-6">Record Management</h4>
                    <p className="mb-2">
                      Our cloud-based record management software is currently unrivalled in Nigeria. This gives our clients' families access to their loved one's care plans, care notes, monitoring areas and various assessments, at any time of the day, irrespective of their locations.
                    </p>
                    <p className="font-bold text-[#10837f]">
                      The utmost satisfaction of our client is always our watchword.
                    </p>

                    <h4 className="text-[#10837f] text-base font-semibold mb-2 mt-6">Our Reputation</h4>
                    <p className="mb-2">
                      We are a registered multidisciplinary health care agency, providing comprehensive medical and rehabilitative services. We have many happy clients from several states in Nigeria with satisfied children in various countries, who are our chief promoters.
                    </p>
                    <p className="font-bold text-[#10837f] mt-4">
                      We are fixated on excellence.
                    </p>
                    
                  </div>
                </div>

                {/* Slogan */}
                <div className="absolute bottom-16 left-0 right-0 w-full text-center pointer-events-none opacity-[0.4] z-0">
                  <span className="text-2xl font-black tracking-[0.1em] text-[#d8a846] uppercase">...We Care Like Family</span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
