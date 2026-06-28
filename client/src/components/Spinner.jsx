const SIZES = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-4' };

const Spinner = ({ size = 'md', label = 'Loading', className = '' }) => (
  <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center gap-3 ${className}`}>
    <div className={`animate-spin rounded-full border-slate-700 border-t-brand-500 ${SIZES[size]}`} />
    <span className="sr-only">{label}</span>
  </div>
);

export default Spinner;
