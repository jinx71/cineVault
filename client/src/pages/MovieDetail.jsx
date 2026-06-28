import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { fetchMovieById } from '../api/movies';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../api/watchlist';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';

const PERSON_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="185" height="278">' +
      '<rect width="100%" height="100%" fill="#1e293b"/>' +
      '<text x="50%" y="50%" fill="#64748b" font-family="sans-serif" font-size="14" text-anchor="middle" dominant-baseline="middle">No photo</text>' +
      '</svg>'
  );

const formatRuntime = (mins) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const MovieDetail = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: movie,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(['movie', id], () => fetchMovieById(id));

  // Only fetch the watchlist when signed in; otherwise the button just prompts login.
  const { data: watchlistItems = [] } = useQuery(['watchlist'], getWatchlist, {
    enabled: isAuthenticated,
  });

  const inWatchlist = useMemo(
    () => watchlistItems.some((i) => i.movieId === numericId),
    [watchlistItems, numericId]
  );

  const addMutation = useMutation(addToWatchlist, {
    onSuccess: (items) => {
      queryClient.setQueryData(['watchlist'], items);
      toast.success('Added to your watchlist');
    },
    onError: (err) => toast.error(err.message || 'Could not add to watchlist'),
  });

  const removeMutation = useMutation(removeFromWatchlist, {
    onSuccess: (items) => {
      queryClient.setQueryData(['watchlist'], items);
      toast.info('Removed from your watchlist');
    },
    onError: (err) => toast.error(err.message || 'Could not remove from watchlist'),
  });

  const handleWatchlist = () => {
    if (!isAuthenticated) {
      toast.info('Sign in to save movies to your watchlist');
      return;
    }
    if (inWatchlist) {
      removeMutation.mutate(numericId);
    } else {
      addMutation.mutate({
        movieId: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        voteAverage: movie.voteAverage,
        releaseDate: movie.releaseDate,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Loading movie" />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          title="Couldn’t load this movie"
          message={error?.message || 'The movie may not exist or the service is unavailable.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : null;
  const runtime = formatRuntime(movie.runtime);
  const trailer = movie.trailers?.[0];
  const isMutating = addMutation.isLoading || removeMutation.isLoading;

  return (
    <div className="pb-16">
      {/* Backdrop header */}
      <div className="relative">
        {movie.backdropUrl && (
          <div className="absolute inset-0 h-[420px] overflow-hidden">
            <img
              src={movie.backdropUrl}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
          </div>
        )}

        <div className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-brand-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to discover
          </Link>

          <div className="mt-6 grid gap-8 md:grid-cols-[260px_1fr]">
            {/* Poster */}
            <div className="mx-auto w-full max-w-[260px] md:mx-0">
              <img
                src={movie.posterUrl || PERSON_PLACEHOLDER}
                alt={`${movie.title} poster`}
                className="w-full rounded-2xl shadow-card ring-1 ring-slate-800"
              />
            </div>

            {/* Meta */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {movie.title}{' '}
                {year && <span className="font-semibold text-slate-400">({year})</span>}
              </h1>
              {movie.tagline && (
                <p className="mt-2 text-lg italic text-brand-300">{movie.tagline}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="gold">
                  ★ {movie.voteAverage ? movie.voteAverage.toFixed(1) : 'NR'}
                  {movie.voteCount ? (
                    <span className="font-normal text-gold-400/70">
                      ({movie.voteCount.toLocaleString()})
                    </span>
                  ) : null}
                </Badge>
                {runtime && <Badge tone="slate">{runtime}</Badge>}
                {movie.status && <Badge tone="brand">{movie.status}</Badge>}
              </div>

              {movie.genres?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {movie.overview && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Overview
                  </h2>
                  <p className="mt-2 leading-relaxed text-slate-200">{movie.overview}</p>
                </div>
              )}

              <div className="mt-6">
                <Button
                  variant={inWatchlist ? 'secondary' : 'gold'}
                  size="lg"
                  onClick={handleWatchlist}
                  disabled={isMutating}
                >
                  {isMutating
                    ? 'Saving…'
                    : inWatchlist
                      ? '✓ In your watchlist'
                      : '+ Add to watchlist'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-xl font-bold text-white">Trailer</h2>
          <div className="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-slate-800">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name || 'Trailer'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Cast */}
      {movie.cast?.length > 0 && (
        <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-xl font-bold text-white">Top billed cast</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movie.cast.map((person) => (
              <div
                key={person.id}
                className="overflow-hidden rounded-xl bg-slate-900 ring-1 ring-slate-800"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-slate-800">
                  <img
                    src={person.profileUrl || PERSON_PLACEHOLDER}
                    alt={person.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = PERSON_PLACEHOLDER;
                    }}
                  />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-sm font-semibold text-slate-100" title={person.name}>
                    {person.name}
                  </p>
                  {person.character && (
                    <p className="truncate text-xs text-slate-400" title={person.character}>
                      {person.character}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
