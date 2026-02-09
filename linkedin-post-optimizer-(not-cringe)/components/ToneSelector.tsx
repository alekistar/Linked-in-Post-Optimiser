import React from 'react';
import { Tone } from '../types';
import { Hammer, GraduationCap, Rocket } from 'lucide-react';

interface ToneSelectorProps {
  selectedTone: Tone;
  onSelect: (tone: Tone) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = React.memo(({ selectedTone, onSelect }) => {
  const tones = [
    { id: Tone.BUILDER, icon: Hammer, desc: "Technical, process, humble" },
    { id: Tone.STUDENT, icon: GraduationCap, desc: "Curious, learning, open" },
    { id: Tone.FOUNDER, icon: Rocket, desc: "Visionary, journey, lessons" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {tones.map(({ id, icon: Icon, desc }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`
            relative group flex flex-col items-center p-4 rounded-xl border transition-all duration-300
            ${selectedTone === id 
              ? 'bg-neon-cyan/10 border-neon-cyan text-white shadow-[0_0_20px_rgba(0,243,255,0.2)]' 
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
            }
          `}
        >
          <Icon className={`w-8 h-8 mb-3 ${selectedTone === id ? 'text-neon-cyan' : 'text-slate-500 group-hover:text-slate-300'}`} />
          <span className="font-bold text-lg mb-1">{id}</span>
          <span className="text-xs text-center opacity-70">{desc}</span>
        </button>
      ))}
    </div>
  );
});
