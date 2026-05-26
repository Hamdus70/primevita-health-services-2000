import React from 'react';
import { motion } from 'framer-motion';

export type BodyPart = 'Head' | 'Neck' | 'Shoulders' | 'Chest' | 'Back' | 'Arms' | 'Hands' | 'Abdomen' | 'Pelvis' | 'Legs' | 'Feet';

interface BodyMapProps {
  selectedParts: BodyPart[];
  onToggle: (part: BodyPart) => void;
}

export function BodyMap({ selectedParts, onToggle }: BodyMapProps) {
  const parts: { id: BodyPart; label: string; cx: string; cy: string; rx?: string; ry?: string; width?: string; height?: string; type: 'ellipse' | 'rect' }[] = [
    { id: 'Head', label: 'Head', cx: '50', cy: '15', rx: '12', ry: '15', type: 'ellipse' },
    { id: 'Neck', label: 'Neck', cx: '50', cy: '35', rx: '6', ry: '5', type: 'ellipse' },
    { id: 'Shoulders', label: 'Shoulders', cx: '50', cy: '45', rx: '25', ry: '8', type: 'ellipse' },
    { id: 'Chest', label: 'Chest', cx: '50', cy: '60', rx: '18', ry: '15', type: 'ellipse' },
    { id: 'Arms', label: 'Arms', cx: '20', cy: '75', rx: '8', ry: '25', type: 'ellipse' },
    { id: 'Hands', label: 'Hands', cx: '15', cy: '105', rx: '6', ry: '8', type: 'ellipse' },
    { id: 'Abdomen', label: 'Abdomen', cx: '50', cy: '85', rx: '16', ry: '15', type: 'ellipse' },
    { id: 'Pelvis', label: 'Pelvis', cx: '50', cy: '105', rx: '18', ry: '10', type: 'ellipse' },
    { id: 'Legs', label: 'Legs', cx: '40', cy: '140', rx: '10', ry: '35', type: 'ellipse' },
    { id: 'Feet', label: 'Feet', cx: '35', cy: '180', rx: '8', ry: '5', type: 'ellipse' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-2xl border border-emerald-50">
      <div className="relative w-48 h-80 bg-emerald-50/50 rounded-3xl p-4 flex-shrink-0">
        <svg viewBox="0 0 100 200" className="w-full h-full overflow-visible">
          {/* Duplicate Arms/Hands/Legs/Feet for symmetry */}
          {parts.map(p => {
             const isSelected = selectedParts.includes(p.id);
             const fillColor = isSelected ? '#ef4444' : '#10837f';
             const opacity = isSelected ? 0.8 : 0.2;
             
             return (
              <g key={p.id} onClick={() => onToggle(p.id)} className="cursor-pointer transition-all hover:opacity-80">
                {p.type === 'ellipse' && (
                  <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill={fillColor} opacity={opacity} />
                )}
                {/* Right side for symmetric parts */}
                {p.id === 'Arms' && <ellipse cx="80" cy="75" rx="8" ry="25" fill={fillColor} opacity={opacity} />}
                {p.id === 'Hands' && <ellipse cx="85" cy="105" rx="6" ry="8" fill={fillColor} opacity={opacity} />}
                {p.id === 'Legs' && <ellipse cx="60" cy="140" rx="10" ry="35" fill={fillColor} opacity={opacity} />}
                {p.id === 'Feet' && <ellipse cx="65" cy="180" rx="8" ry="5" fill={fillColor} opacity={opacity} />}
              </g>
             );
          })}
        </svg>
      </div>
      
      <div className="flex-1 w-full">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Select Areas of Discomfort / Pain</h3>
        <div className="flex flex-wrap gap-2">
          {parts.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggle(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                selectedParts.includes(p.id) 
                  ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#10837f] hover:text-[#10837f]'
              }`}
            >
              {p.label}
            </button>
          ))}
          {/* Additional Parts that might not fit perfectly on the simple SVG */}
          <button
              type="button"
              onClick={() => onToggle('Back')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                selectedParts.includes('Back') 
                  ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#10837f] hover:text-[#10837f]'
              }`}
            >
              Back
            </button>
        </div>
        {selectedParts.length > 0 && (
            <div className="mt-4 p-3 bg-red-50/50 rounded-lg border border-red-100 text-sm text-red-800">
                <strong>Selected:</strong> {selectedParts.join(', ')}
            </div>
        )}
      </div>
    </div>
  );
}
