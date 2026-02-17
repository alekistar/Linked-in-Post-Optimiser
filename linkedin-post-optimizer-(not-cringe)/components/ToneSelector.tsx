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
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-900 dark:bg-neon-cyan/10 dark:border-neon-cyan dark:text-white shadow-[0_0_20px_rgba(0,243,255,0.2)]' 
              : 'bg-white/70 dark:bg-white/5 border-slate-300/70 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400/70 dark:hover:border-white/20'
            }
          `}
        >
          <Icon className={`w-8 h-8 mb-3 ${selectedTone === id ? 'text-cyan-600 dark:text-neon-cyan' : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
          <span className="font-bold text-lg mb-1">{id}</span>
          <span className="text-xs text-center opacity-70">{desc}</span>
        </button>
      ))}
    </div>
  );
});
