const VARIANTS = {
  primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-card focus-visible:ring-brand-400',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 focus-visible:ring-slate-500',
  gold: 'bg-gold-500 hover:bg-gold-400 text-slate-900 focus-visible:ring-gold-400',
  ghost: 'bg-transparent hover:bg-slate-800 text-slate-200 focus-visible:ring-slate-600',
  danger: 'bg-red-600 hover:bg-red-500 text-white focus-visible:ring-red-400',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
