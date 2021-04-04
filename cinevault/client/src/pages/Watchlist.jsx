import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getWatchlist, removeFromWatchlist } from '../api/watchlist';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Badge from '../components/Badge';
import Button from '../components/Button';

const PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450">' +
      '<rect width="100%" height="100%" fill="#1e293b"/>' +
      '<text x="50%" y="50%" fill="#64748b" font-family="sans-serif" font-size="18" text-anchor="middle" dominant-baseline="middle">No poster</text>' +
      '</svg>'
  );

const Watchlist = () => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, isError, error, refetch } = useQuery(
    ['watchlist'],
    getWatchlist
  );

  const removeMutation = useMutation(removeFromWatchlist, {
    onSuccess: (next) => {
      queryClient.setQueryData(['watchlist'], next);
      toast.info('Removed from your watchlist');
    },
    onError: (err) => toast.error(err.message || 'Could not remove movie'),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">My Watchlist</h1>
        <p className="mt-2 text-slate-400">
          {items.length > 0
            ? `${items.length} movie${items.length === 1 ? '' : 's'} saved for later.`
            : 'Movies you save will show up here.'}
        </p>
      </header>

      {isError ? (
        <ErrorState
          title="Couldn’t load your watchlist"
          message={error?.message || 'Please try again in a moment.'}
          onRetry={refetch}
        />
      ) : isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label="Loading watchlist" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Your watchlist is empty"
          message="Browse movies and tap “Add to watchlist” to build your collection."
          action={
            <Link to="/">
              <Button variant="gold">Discover movies</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => {
            const year = item.releaseDate ? item.releaseDate.slice(0, 4) : '—';
            return (
              <div
                key={item.movieId}
                className="group relative overflow-hidden rounded-xl bg-slate-900 shadow-card ring-1 ring-slate-800 transition duration-200 hover:ring-brand-500/60"
              >
                <Link to={`/movie/${item.movieId}`} className="block">
                  <div className="aspect-[2/3] w-full overflow-hidden bg-slate-800">
                    <img
                      src={item.posterUrl || PLACEHOLDER}
                      alt={`${item.title} poster`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  </div>
                  <div className="absolute right-2 top-2">
                    <Badge tone="gold">★ {item.voteAverage ? item.voteAverage.toFixed(1) : 'NR'}</Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="truncate text-sm font-semibold text-slate-100" title={item.title}>
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">{year}</p>
                  </div>
                </Link>
                <div className="px-3 pb-3">
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full"
                    disabled={removeMutation.isLoading}
                    onClick={() => removeMutation.mutate(item.movieId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
