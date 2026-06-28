const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const User = require('../models/User');

const getWatchlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  success(res, { items: user.watchlist }, 'Watchlist fetched');
});

const addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId, title, posterUrl, voteAverage, releaseDate } = req.body;
  if (!movieId || !title) {
    res.status(400);
    throw new Error('movieId and title are required');
  }

  const user = await User.findById(req.user._id);
  const exists = user.watchlist.some((i) => i.movieId === Number(movieId));
  if (exists) {
    res.status(409);
    throw new Error('Movie is already in your watchlist');
  }

  user.watchlist.unshift({
    movieId: Number(movieId),
    title,
    posterUrl: posterUrl || null,
    voteAverage: voteAverage || 0,
    releaseDate: releaseDate || '',
  });
  await user.save();
  success(res, { items: user.watchlist }, 'Added to watchlist', 201);
});

const removeFromWatchlist = asyncHandler(async (req, res) => {
  const movieId = Number(req.params.movieId);
  const user = await User.findById(req.user._id);

  const before = user.watchlist.length;
  user.watchlist = user.watchlist.filter((i) => i.movieId !== movieId);
  if (user.watchlist.length === before) {
    res.status(404);
    throw new Error('Movie not found in your watchlist');
  }

  await user.save();
  success(res, { items: user.watchlist }, 'Removed from watchlist');
});

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
