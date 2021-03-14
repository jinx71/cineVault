const TONES = {
  brand: 'bg-brand-500/15 text-brand-200 ring-brand-500/30',
  gold: 'bg-gold-500/15 text-gold-400 ring-gold-500/30',
  green: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  slate: 'bg-slate-700/40 text-slate-300 ring-slate-600/40',
};

const Badge = ({ children, tone = 'slate', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONES[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
