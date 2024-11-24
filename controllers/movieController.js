// controllers/movieController.js
const tmdbAPI = require('../config/tmdb');

// Search for movies by title
exports.searchMovies = async (req, res) => {
  const { query } = req.query; // Destructure for clarity
  if (!query) return res.status(400).send("Please provide a search query.");

  try {
    const { data } = await tmdbAPI.get('/search/movie', { params: { query } });
    res.render('searchResults', { movies: data.results, searchTerm: query });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).send("Error fetching movies.");
  }
};

// Find a specific movie by title
exports.findMovieByTitle = async (req, res) => {
  const { title } = req.query; // Destructure for clarity
  if (!title) return res.status(400).send("Please provide a movie title to search.");

  try {
    const { data } = await tmdbAPI.get('/search/movie', { params: { query: title } });
    res.render('searchResults', { movies: data.results, searchTerm: title });
  } catch (error) {
    console.error("Error finding movie:", error);
    res.status(500).send("Error finding movie.");
  }
};
