const Tabs = ({ tabs, active, onChange }) => (
  <div className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          active === tab.value
            ? 'bg-brand-600 text-white shadow-card'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        aria-pressed={active === tab.value}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;
