const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const tmdb = require('../services/tmdbService');

const getMovies = asyncHandler(async (req, res) => {
  const category = req.params.category || 'trending';
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const data = await tmdb.getList(category, page);
  success(res, data, `Fetched ${category} movies`);
});

const searchMovies = asyncHandler(async (req, res) => {
  const query = (req.query.q || '').trim();
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  if (!query) {
    res.status(400);
    throw new Error('Search query "q" is required');
  }
  const data = await tmdb.searchMovies(query, page);
  success(res, data, `Search results for "${query}"`);
});

const getMovie = asyncHandler(async (req, res) => {
  const data = await tmdb.getMovieById(req.params.id);
  success(res, data, 'Movie detail fetched');
});

module.exports = { getMovies, searchMovies, getMovie };
