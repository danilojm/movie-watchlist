const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

// Route to search for movies to add - define first to avoid conflicts
router.get('/refreshWatchlist/:id', watchlistController.refreshWatchlist);

// Route to search for movies to add - define first to avoid conflicts
router.get('/discover', watchlistController.discoverMovies);

// Route to search for movies to add - define first to avoid conflicts
router.get('/search', watchlistController.searchMovies);

// Route to search for a movie by ID
router.get('/searchByID', watchlistController.searchMoviesByID);

// Route to search watchlists by user (based on user ID in session)
router.get('/searchByUser', watchlistController.searchWatchlistsByUser);

// Route to create a new watch list
router.post('/create', watchlistController.createWatchlist);

// Route to delete a specific watchlist by ID
router.post('/delete/:id', watchlistController.deleteWatchlist);

// Route to get a user's watch list by ID
router.get('/:id', watchlistController.getWatchlist);

// Route to add a movie to the watchlist
router.post('/addMovie', watchlistController.addMovieToWatchlist);

// Route to remove a movie from the watchlist
router.post('/removeMovie', watchlistController.removeMovieFromWatchlist);

module.exports = router;
