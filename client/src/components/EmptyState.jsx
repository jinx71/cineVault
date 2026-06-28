const EmptyState = ({ icon = null, title = 'Nothing here yet', message = '', action = null }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
    <div className="mb-4 text-brand-400">
      {icon || (
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3h9L21 7.5M3 7.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.5M3 7.5h18M9 12h6" />
        </svg>
      )}
    </div>
    <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
    {message && <p className="mt-1 max-w-sm text-sm text-slate-400">{message}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
