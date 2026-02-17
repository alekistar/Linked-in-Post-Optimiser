import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'none';
}

export const Card: React.FC<CardProps> = ({ children, className = '', glow = 'none' }) => {
  const glowStyles = {
    cyan: 'shadow-[0_10px_35px_-20px_rgba(0,243,255,0.55)] border-cyan-300/70 dark:border-neon-cyan/30',
    purple: 'shadow-[0_10px_35px_-20px_rgba(188,19,254,0.45)] border-violet-300/80 dark:border-neon-purple/30',
    none: 'border-slate-300/70 dark:border-white/10'
  };

  return (
    <div className={`app-card relative backdrop-blur-xl border rounded-xl overflow-hidden ${glowStyles[glow]} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
