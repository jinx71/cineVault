import Button from './Button';

const ErrorState = ({ title = 'Something went wrong', message = '', onRetry = null }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-red-900/50 bg-red-950/20 px-6 py-16 text-center">
    <div className="mb-4 text-red-400">
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
    {message && <p className="mt-1 max-w-md text-sm text-slate-400">{message}</p>}
    {onRetry && (
      <Button variant="secondary" className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export default ErrorState;
