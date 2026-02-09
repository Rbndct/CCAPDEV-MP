// Button Component with variants
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--accent-green)] text-[var(--bg-primary)] hover:bg-[var(--accent-green-hover)] hover:shadow-[var(--glow-green)] hover:scale-105',
    secondary: 'bg-[var(--accent-blue)] text-white hover:bg-[#0090dd] hover:shadow-[var(--glow-blue)] hover:scale-105',
    outline: 'bg-transparent border-2 border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-[var(--accent-green)] hover:text-[var(--bg-primary)]',
    ghost: 'bg-transparent text-[var(--accent-green)] hover:bg-[rgba(0,255,136,0.1)]'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </button>
  );
};

// Card Component with hover effects
export const Card = ({ 
  children, 
  variant = 'elevated', 
  hover = 'lift', 
  className = '',
  ...props 
}) => {
  const baseStyles = 'rounded-[var(--radius-lg)] overflow-hidden';
  
  const variants = {
    elevated: 'bg-[var(--bg-tertiary)] shadow-[var(--shadow-md)]',
    glass: 'glass',
    outlined: 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]'
  };
  
  const hoverEffects = {
    lift: 'hover-lift',
    scale: 'hover-scale',
    glow: 'hover-glow-green',
    none: ''
  };
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${hoverEffects[hover]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Input Component with icons
export const Input = ({ 
  label, 
  icon, 
  type = 'text', 
  className = '',
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={`w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 ${icon ? 'pl-11' : ''} text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'success', 
  className = '' 
}) => {
  const variants = {
    success: 'bg-[var(--success)] text-[var(--bg-primary)]',
    info: 'bg-[var(--info)] text-white',
    warning: 'bg-[var(--warning)] text-[var(--bg-primary)]',
    error: 'bg-[var(--error)] text-white',
    neon: 'bg-[var(--neon-green)] text-[var(--bg-primary)] animate-pulse-glow'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-[var(--radius-full)] text-xs font-bold uppercase tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
