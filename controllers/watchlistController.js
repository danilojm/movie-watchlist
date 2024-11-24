const Watchlist = require('../models/Watchlist');
const Movie = require('../models/movie'); // Assuming you have a Movie model or can fetch from TMDb
const tmdbAPI = require('../config/tmdb');  // Import the tmdbAPI module

// 1. Create a new watchlist
exports.createWatchlist = async (req, res) => {
    const { name } = req.body; // Only extract the name from the form
    const userId = req.session.user.id; // Assuming the user ID is stored in the session after login

    try {
        const newWatchlist = new Watchlist({ name, userId, movies: [] });
        await newWatchlist.save();

        const watchlists = await Watchlist.find({ userId: userId });
        res.render('index', { watchlists: watchlists });
    } catch (error) {
        console.error('Error creating watchlist:', error);
        res.status(500).json({ message: 'Error creating watchlist.' });
    }
};

// 1. Delete an existing watchlist
exports.deleteWatchlist = async (req, res) => {
    const watchlistId = req.params.id;  // Get the watchlist ID from the route parameter
    const userId = req.session.user.id; // Assuming the user ID is stored in the session after login

    try {
        // Delete the watchlist document
        const result = await Watchlist.deleteOne({ _id: watchlistId, userId: userId });

        if (result.deletedCount === 0) {
            // If no watchlist was deleted, return an error
            return res.status(404).json({ message: 'Watchlist not found or you do not have permission to delete it.' });
        }

        // Optionally, find all remaining watchlists for the user to update the UI
        const watchlists = await Watchlist.find({ userId: userId });

        // Redirect or re-render the page with updated watchlists
        res.render('index', { watchlists: watchlists });

    } catch (error) {
        console.error('Error deleting watchlist:', error);
        res.status(500).json({ message: 'Error deleting watchlist.' });
    }
};


// 2. Get a user's watchlist by ID
exports.refreshWatchlist = async (req, res) => {
    const { id } = req.params;
    try {
        const watchlist = await Watchlist.findById(id);
        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        // Fetch movies associated with this watchlist
        res.json({
            success: true,
            movies: watchlist.movies,
            watchlistId: watchlist._id,
            watchlistName: watchlist.name,
        });
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Error fetching watchlist.' });
    }
};

exports.getWatchlist = async (req, res) => {
    const { id } = req.params;
    try {
        const watchlist = await Watchlist.findById(id);
        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        // Fetch movies associated with this watchlist (you can also get movies from TMDb API if needed)
        if (watchlist.movies.length) {
            res.render('watchlist', { movies: watchlist.movies, watchlistId: watchlist._id, watchlistName: watchlist.name });
        } else {
            res.render('watchlist', { watchlistId: watchlist._id, watchlistName: watchlist.name });
        }
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Error fetching watchlist.' });
    }
};

// 3. Search for movies to add to a watchlist (using TMDb API)
exports.discoverMovies = async (req, res) => {
    const { watchlistId, watchlistName } = req.query;
    try {
        const { data } = await tmdbAPI.get('/discover/movie');
        res.render('searchResults', { movies: data.results, searchTerm: "Popular Movies", watchlistId: watchlistId, watchlistName: watchlistName });
    } catch (error) {
        console.error("Error finding movie:", error);
        res.status(500).send("Error finding movie.");
    }
};

exports.searchMovies = async (req, res) => {
    const { query, watchlistId, watchlistName } = req.query;

    if (!query) return res.status(400).send("Please provide a movie title to search.");

    try {
        const { data } = await tmdbAPI.get('/search/movie', {
            params: { query: query }
        });

        res.render('searchResults', { movies: data.results, searchTerm: query, watchlistId: watchlistId, watchlistName: watchlistName });
    } catch (error) {
        console.error("Error finding movie:", error);
        res.status(500).send("Error finding movie.");
    }
};

// 4. Search for a movie by its ID (using TMDb API)
exports.searchMoviesByID = async (req, res) => {
    const { id } = req.query; // Destructure `id` from the query parameters
    if (!id) return res.status(400).send("Please provide a movie ID to search.");

    try {
        const { data } = await tmdbAPI.get(`/movie/${id}`);
        res.render('watchlist', { movies: [], searchTerm: '', movie_results: [data] });
    } catch (error) {
        console.error("Error finding movie by ID:", error);
        res.status(500).send("Error finding movie by ID.");
    }
};

// 5. Search watchlists by user (based on user ID from session)
exports.searchWatchlistsByUser = async (req, res) => {
    const userId = req.session.user.id;  // Get the user ID from session

    try {
        const watchlists = await Watchlist.find({ userId: userId });
        if (!watchlists || watchlists.length === 0) {
            return res.status(404).json({ message: 'No watchlists found for this user.' });
        }

        // Render the user's watchlists
        res.render('watchlistSearchResult', { watchlists: watchlists });
    } catch (error) {
        console.error("Error searching for user's watchlists:", error);
        res.status(500).json({ message: 'Error searching for user\'s watchlists.' });
    }
};

// 6. Add a movie to the watchlist
exports.addMovieToWatchlist = async (req, res) => {
    const { watchlistId, movieId } = req.body;

    try {
        const watchlist = await Watchlist.findById(watchlistId);
        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        const { data } = await tmdbAPI.get(`/movie/${movieId}`);
        if (!data) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        watchlist.movies.push(data);
        await watchlist.save();
        res.render('watchlist', { movies: watchlist.movies, watchlistId: watchlist._id, watchlistName: watchlist.name });
    } catch (error) {
        console.error('Error adding movie to watchlist:', error);
        res.status(500).json({ message: 'Error adding movie to watchlist.' });
    }
};

// 7. Remove a movie from the watchlist
exports.removeMovieFromWatchlist = async (req, res) => {
    const { watchlistId, movieId } = req.body;

    try {
        const watchlist = await Watchlist.findById(watchlistId);
        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        watchlist.movies = watchlist.movies.filter(movie => movie.id !== movieId);
        await watchlist.save();
        // Return updated movie list as JSON

        return res.json({
            success: true,
            movies: watchlist.movies
        });
    } catch (error) {
        console.error('Error removing movie from watchlist:', error);
        res.status(500).json({ message: 'Error removing movie from watchlist.' });
    }
};

// Render user's watchlist page
exports.renderWatchlistPage = async (req, res) => {
    const userId = req.session.user._id;

    try {
        const watchlists = await Watchlist.find({ userId: userId });
        res.render('watchlist', { watchlists: watchlists });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
