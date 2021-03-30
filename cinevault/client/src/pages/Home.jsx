import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { fetchMovies, searchMovies } from '../api/movies';
import MovieGrid from '../components/MovieGrid';
import Tabs from '../components/Tabs';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Button from '../components/Button';

const TABS = [
  { value: 'trending', label: '🔥 Trending' },
  { value: 'popular', label: '⭐ Popular' },
  { value: 'top-rated', label: '🏆 Top Rated' },
  { value: 'now-playing', label: '🎬 Now Playing' },
];

// Small inline debounce hook so a keystroke doesn't fire a request on every letter.
const useDebounced = (value, delay = 450) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

const Home = () => {
  const [category, setCategory] = useState('trending');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search.trim(), 450);
  const isSearching = debouncedSearch.length > 0;

  // One query key for both modes. When searching, the key carries the query;
  // otherwise it carries the active category tab. React Query caches each separately.
  const queryKey = isSearching ? ['search', debouncedSearch] : ['movies', category];

  const {
    data,
    error,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    queryKey,
    ({ pageParam = 1 }) =>
      isSearching ? searchMovies(debouncedSearch, pageParam) : fetchMovies(category, pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      keepPreviousData: false,
    }
  );

  // Flatten every loaded page into one list, de-duplicating by movie id.
  // TMDB can return the same film on adjacent pages, which would crash React's keys.
  const movies = useMemo(() => {
    const seen = new Set();
    const out = [];
    (data?.pages || []).forEach((page) => {
      (page.results || []).forEach((m) => {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          out.push(m);
        }
      });
    });
    return out;
  }, [data]);

  // IntersectionObserver: when the sentinel scrolls near the viewport, load more.
  const sentinelRef = useRef(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '600px' } // start fetching before the user actually hits the bottom
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const totalResults = data?.pages?.[0]?.totalResults ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section className="mb-8">
        <h1 className="bg-gradient-to-r from-brand-300 via-brand-200 to-gold-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          Discover your next watch
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Browse what&apos;s trending, dig into the all-time greats, and build a watchlist that
          follows you across sessions.
        </p>

        <div className="mt-6 max-w-xl">
          <Input
            id="movie-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a movie…"
            aria-label="Search for a movie"
          />
        </div>
      </section>

      {/* Tabs hide while searching — the search results take over the grid. */}
      {!isSearching && (
        <div className="mb-6">
          <Tabs tabs={TABS} active={category} onChange={setCategory} />
        </div>
      )}

      {isSearching && (
        <p className="mb-4 text-sm text-slate-400">
          {isLoading
            ? `Searching for “${debouncedSearch}”…`
            : `${totalResults.toLocaleString()} result${totalResults === 1 ? '' : 's'} for “${debouncedSearch}”`}
        </p>
      )}

      {/* States */}
      {isError ? (
        <ErrorState
          title="Couldn’t load movies"
          message={error?.message || 'Please check your connection and try again.'}
          onRetry={refetch}
        />
      ) : isLoading ? (
        <MovieGrid loading skeletonCount={18} />
      ) : movies.length === 0 ? (
        <EmptyState
          title={isSearching ? 'No matches found' : 'Nothing to show'}
          message={
            isSearching
              ? 'Try a different title or check the spelling.'
              : 'There are no movies in this category right now.'
          }
        />
      ) : (
        <>
          <MovieGrid movies={movies} />

          {/* Infinite-scroll footer: sentinel + graceful fallbacks. */}
          <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
          <div className="flex flex-col items-center justify-center py-10">
            {isFetchingNextPage ? (
              <Spinner size="md" label="Loading more movies" />
            ) : hasNextPage ? (
              <Button variant="secondary" onClick={() => fetchNextPage()}>
                Load more
              </Button>
            ) : (
              <p className="text-sm text-slate-500">You&apos;ve reached the end · {movies.length} movies</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
