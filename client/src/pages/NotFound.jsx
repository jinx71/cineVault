import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
    <p className="bg-gradient-to-r from-brand-400 to-gold-400 bg-clip-text text-7xl font-extrabold text-transparent">
      404
    </p>
    <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
    <p className="mt-2 text-slate-400">
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>
    <Link to="/" className="mt-6">
      <Button variant="gold" size="lg">
        Back to discover
      </Button>
    </Link>
  </div>
);

export default NotFound;
