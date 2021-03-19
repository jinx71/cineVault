import { forwardRef } from 'react';

const Input = forwardRef(({ label, id, error, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
    )}
    <input
      id={id}
      ref={ref}
      className={`w-full rounded-xl border bg-slate-900 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition focus:outline-none focus:ring-2 focus:ring-brand-500 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700'
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
