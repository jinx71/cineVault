import { Link } from 'react-router-dom';
import Badge from './Badge';

const StarIcon = () => (
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 0 0 .95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 0 0-.36 1.12l1.36 4.18c.3.92-.76 1.69-1.54 1.12l-3.56-2.59a1 1 0 0 0-1.18 0l-3.56 2.59c-.78.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 0 0-.36-1.12L2.15 9.6c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 0 0 .95-.69L9.05 2.93Z" />
  </svg>
);

const PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450">' +
      '<rect width="100%" height="100%" fill="#1e293b"/>' +
      '<text x="50%" y="50%" fill="#64748b" font-family="sans-serif" font-size="18" text-anchor="middle" dominant-baseline="middle">No poster</text>' +
      '</svg>'
  );

const MovieCard = ({ movie }) => {
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : '—';
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative block overflow-hidden rounded-xl bg-slate-900 shadow-card ring-1 ring-slate-800 transition duration-200 hover:-translate-y-1 hover:ring-brand-500/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-slate-800">
        <img
          src={movie.posterUrl || PLACEHOLDER}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </div>
      <div className="absolute right-2 top-2">
        <Badge tone="gold">
          <StarIcon />
          {movie.voteAverage ? movie.voteAverage.toFixed(1) : 'NR'}
        </Badge>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-slate-100 group-hover:text-brand-300" title={movie.title}>
          {movie.title}
        </h3>
        <p className="mt-0.5 text-xs text-slate-400">{year}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
