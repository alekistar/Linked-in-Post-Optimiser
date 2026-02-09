import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'none';
}

export const Card: React.FC<CardProps> = ({ children, className = '', glow = 'none' }) => {
  const glowStyles = {
    cyan: 'shadow-[0_0_30px_-5px_rgba(0,243,255,0.15)] border-neon-cyan/30',
    purple: 'shadow-[0_0_30px_-5px_rgba(188,19,254,0.15)] border-neon-purple/30',
    none: 'border-white/10'
  };

  return (
    <div className={`relative backdrop-blur-xl bg-neon-card/60 border rounded-xl overflow-hidden ${glowStyles[glow]} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
