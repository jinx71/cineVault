const express = require('express');
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // all watchlist routes require auth

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);

module.exports = router;
