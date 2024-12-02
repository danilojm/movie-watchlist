// Import the Express module to create and manage routes
const express = require('express');
// Create an instance of the Express router
const router = express.Router();
// Import the watchlist controller to handle the route logic
const watchlistController = require('../controllers/watchlistController');

/**
 * Route to refresh the user's watchlist by ID.
 * This could be used to sync or update the watchlist data from a persistent storage or API.
 * @param {string} id - The unique identifier for the watchlist.
 */
router.get('/refreshWatchlist/:id', watchlistController.refreshWatchlist);

/**
 * Route to discover new movies.
 * Fetches a list of trending or recommended movies for the user.
 */
router.get('/discover', watchlistController.discoverMovies);

/**
 * Route to search for movies by keyword.
 * Allows users to search for movies using a text query.
 */
router.get('/search', watchlistController.searchMovies);

/**
 * Route to search for a specific movie by its unique ID.
 * Useful when users want detailed information about a particular movie.
 */
router.get('/searchByID', watchlistController.searchMoviesByID);

/**
 * Route to search for watchlists associated with a specific user.
 * The user ID is typically inferred from the session or request parameters.
 */
router.get('/searchByUser', watchlistController.searchWatchlistsByUser);

/**
 * Route to fetch a user's specific watchlist by its unique ID.
 * @param {string} id - The unique identifier of the watchlist to retrieve.
 */
router.get('/:id', watchlistController.getWatchlist);

/**
 * Route to create a new watchlist.
 * Expects data such as the watchlist name and associated user in the request body.
 */
router.post('/create', watchlistController.createWatchlist);

/**
 * Route to delete a watchlist by its unique ID.
 * @param {string} id - The ID of the watchlist to delete.
 */
router.post('/delete/:id', watchlistController.deleteWatchlist);

/**
 * Route to add a movie to a specific watchlist.
 * Expects movie details (like ID and title) and watchlist ID in the request body.
 */
router.post('/addMovie', watchlistController.addMovieToWatchlist);

/**
 * Route to remove a movie from a specific watchlist.
 * Expects movie ID and watchlist ID in the request body.
 */
router.post('/removeMovie', watchlistController.removeMovieFromWatchlist);

/**
 * Route to update a movie's rating in a watchlist.
 * Expects the watchlist ID, movie ID, and new rating in the request body.
 */
router.post('/updateRating', watchlistController.updateRating);

/**
 * Route to toggle the "watched" status of a movie in a watchlist.
 * Expects the watchlist ID and movie ID in the request body.
 */
router.post('/toggleWatched', watchlistController.toggleWatched);

// Export the router so it can be used in other parts of the application
module.exports = router;
