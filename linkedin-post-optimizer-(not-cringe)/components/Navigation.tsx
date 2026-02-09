import React from 'react';
import { ViewMode } from '../types';
import { PenTool, BarChart3, Calendar } from 'lucide-react';

interface NavigationProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
}

export const Navigation: React.FC<NavigationProps> = React.memo(({ currentView, onChange }) => {
  const items = [
    { id: 'generator', label: 'Generator', icon: PenTool },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-black/40 p-1 rounded-full border border-white/10 backdrop-blur-md">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${currentView === item.id 
                ? 'bg-neon-cyan/20 text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
});
