// config/tmdb.js
const axios = require('axios');
require('dotenv').config();

const tmdbAPI = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.TMDB_API_KEY,
    },
});

module.exports = tmdbAPI;
