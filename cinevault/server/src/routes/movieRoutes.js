const express = require('express');
const { getMovies, searchMovies, getMovie } = require('../controllers/movieController');

const router = express.Router();

// Specific routes before the catch-all "/:id"
router.get('/search', searchMovies);
router.get('/category/:category', getMovies);
router.get('/:id', getMovie);

module.exports = router;
