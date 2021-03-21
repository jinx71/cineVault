import MovieCard from './MovieCard';

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-xl ring-1 ring-slate-800">
    <div className="skeleton aspect-[2/3] w-full rounded-b-none" />
    <div className="space-y-2 p-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/3" />
    </div>
  </div>
);

const MovieGrid = ({ movies = [], loading = false, skeletonCount = 12 }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    {movies.map((m) => (
      <MovieCard key={m.id} movie={m} />
    ))}
    {loading && Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
  </div>
);

export default MovieGrid;
