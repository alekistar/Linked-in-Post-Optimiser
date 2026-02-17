import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all duration-300 rounded-lg group focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-500/10 border border-cyan-500/45 text-cyan-700 hover:bg-cyan-500/20 dark:text-neon-cyan dark:border-neon-cyan/50 dark:hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)]",
    secondary: "bg-violet-500/10 border border-violet-500/45 text-violet-700 hover:bg-violet-500/20 dark:text-neon-purple dark:border-neon-purple/50 dark:hover:bg-neon-purple/20 hover:shadow-[0_0_20px_rgba(188,19,254,0.25)]",
    ghost: "bg-transparent hover:bg-slate-900/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 border border-transparent hover:border-slate-300 dark:hover:border-white/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Optimizing...
        </span>
      ) : (
        <span className="relative flex items-center gap-2">{children}</span>
      )}
    </button>
  );
};
