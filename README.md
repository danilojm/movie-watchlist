# Movie Watchlist App

## Overview
The Movie Watchlist App is a Node.js-based application that allows users to manage their movie watchlists. Users can register, log in, create and manage watchlists, add movies from TMDB (The Movie Database), update movie details, and track which movies they've watched.

## Features
- **User Authentication**: Registration, login, and logout functionality using sessions.
- **Watchlist Management**: Create, delete, and manage multiple watchlists.
- **Movie Search**: Search for movies by title or ID using the TMDB API.
- **Movie Details**: Add movies to watchlists, update ratings, and toggle watched status.
- **Responsive UI**: Dynamic pages for displaying user watchlists and search results.

---




## Project Structure
```plaintext
├── controllers/
│   ├── watchlistController.js  # Handles business logic for watchlist operations
├── routes/
│   ├── index.js                # Home and main application routes
│   ├── auth.js                 # Authentication routes (login, register, logout)
│   ├── watchlist.js            # Watchlist management routes
├── models/
│   ├── User.js                 # MongoDB schema for users
│   ├── Watchlist.js            # MongoDB schema for watchlists
├── config/
│   ├── db.js                   # MongoDB connection setup
│   ├── tmdb.js                 # TMDB API configuration
├── views/                      # EJS templates for rendering UI
├── public/                     # Static files (CSS, JS, images)
├── .env                        # Environment variables (TMDB API key, MongoDB URI)
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
