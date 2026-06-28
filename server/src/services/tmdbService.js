const axios = require('axios');
const NodeCache = require('node-cache');

// ---------------------------------------------------------------------------
// THE ENGINEERING LESSON LIVES HERE.
// The React client NEVER calls TMDB directly. This service:
//   1. injects the secret key server-side,
//   2. caches responses in node-cache (TTL per endpoint type), and
//   3. reshapes raw TMDB JSON into our { id, title, posterUrl, ... } shape.
// Client infinite-scroll paging hits OUR cache, not TMDB's rate limit.
// ---------------------------------------------------------------------------

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const cache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 600 });

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: process.env.TMDB_API_KEY },
  timeout: 10000,
});

// Translate upstream TMDB errors into clean, key-safe errors for our client.
tmdb.interceptors.response.use(
  (response) => response,
  (error) => {
    const upstream = error.response ? error.response.status : null;
    let statusCode = 502;
    let message = 'Failed to reach the movie service';

    if (upstream === 404) {
      statusCode = 404;
      message = 'Movie not found';
    } else if (upstream === 401) {
      // Bad/missing key is OUR config problem — don't leak it to the client.
      statusCode = 500;
      message = 'Movie service is misconfigured (check TMDB_API_KEY)';
    } else if (upstream === 429) {
      statusCode = 429;
      message = 'Movie service rate limit reached, please retry shortly';
    }

    const err = new Error(message);
    err.statusCode = statusCode;
    return Promise.reject(err);
  }
);

const imageUrl = (path, size = 'w500') => (path ? `${IMAGE_BASE_URL}/${size}${path}` : null);

const mapSummary = (m) => ({
  id: m.id,
  title: m.title || m.name,
  overview: m.overview || '',
  posterUrl: imageUrl(m.poster_path, 'w500'),
  backdropUrl: imageUrl(m.backdrop_path, 'w780'),
  releaseDate: m.release_date || '',
  voteAverage: Math.round((m.vote_average || 0) * 10) / 10,
  voteCount: m.vote_count || 0,
});

const mapDetail = (m) => ({
  ...mapSummary(m),
  tagline: m.tagline || '',
  runtime: m.runtime || 0,
  status: m.status || '',
  genres: (m.genres || []).map((g) => g.name),
  cast: ((m.credits && m.credits.cast) || []).slice(0, 12).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character || '',
    profileUrl: imageUrl(c.profile_path, 'w185'),
  })),
  trailers: ((m.videos && m.videos.results) || [])
    .filter((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
    .map((v) => ({ key: v.key, name: v.name, type: v.type, site: v.site })),
});

const shapePage = (data) => ({
  page: data.page,
  totalPages: Math.min(data.total_pages || 1, 500), // TMDB caps paging at 500
  totalResults: data.total_results || 0,
  results: (data.results || []).map(mapSummary),
});

const withCache = async (key, ttl, fetcher) => {
  const cached = cache.get(key);
  if (cached) return cached;
  const fresh = await fetcher();
  cache.set(key, fresh, ttl);
  return fresh;
};

const ENDPOINTS = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  'top-rated': '/movie/top_rated',
  'now-playing': '/movie/now_playing',
};

const getList = async (category, page = 1) => {
  const endpoint = ENDPOINTS[category];
  if (!endpoint) {
    const err = new Error(`Unknown category: ${category}`);
    err.statusCode = 400;
    throw err;
  }
  return withCache(`list:${category}:${page}`, 60 * 60, async () => {
    const { data } = await tmdb.get(endpoint, { params: { page } });
    return shapePage(data);
  });
};

const searchMovies = async (query, page = 1) =>
  withCache(`search:${query.toLowerCase()}:${page}`, 10 * 60, async () => {
    const { data } = await tmdb.get('/search/movie', {
      params: { query, page, include_adult: false },
    });
    return shapePage(data);
  });

const getMovieById = async (id) =>
  withCache(`movie:${id}`, 6 * 60 * 60, async () => {
    const { data } = await tmdb.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos' },
    });
    return mapDetail(data);
  });

module.exports = { getList, searchMovies, getMovieById };
