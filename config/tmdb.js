// config/tmdb.js

// Import the axios library to make HTTP requests
const axios = require('axios');

// Import dotenv to load environment variables from a .env file
require('dotenv').config();

// Create an axios instance configured to interact with The Movie Database (TMDb) API
const tmdbAPI = axios.create({
    // Base URL for all TMDb API requests
    baseURL: 'https://api.themoviedb.org/3',

    // Default parameters to include in every API request
    params: {
        // API key for authentication, loaded from environment variables
        api_key: process.env.TMDB_API_KEY,
    },
});

// Export the configured axios instance for use in other parts of the application
module.exports = tmdbAPI;
