// tmdbAPI.js
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;  // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';

module.exports = {
    searchMovies: async (query) => {
        try {
            const response = await axios.get(`${BASE_URL}/search/movie`, {
                params: {
                    api_key: API_KEY,
                    query: query,
                    language: 'en-US',
                },
            });
            return response.data.results;  // Return the movie search results
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;  // Propagate the error to handle it in the controller
        }
    },
};
