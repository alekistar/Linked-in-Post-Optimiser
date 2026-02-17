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
      <div className="flex bg-slate-100/80 dark:bg-black/40 p-1 rounded-full border border-slate-300/70 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${currentView === item.id 
                ? 'bg-cyan-500/15 text-cyan-700 shadow-[0_0_15px_rgba(0,243,255,0.2)] dark:bg-neon-cyan/20 dark:text-neon-cyan' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5'
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
