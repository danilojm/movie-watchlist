// models/Watchlist.js
const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [
    {
      title: String,
      id: String,
      imdb_id: String,
      poster_path: String,
      release_date: String,
      overview: String,
      rating: { type: String, default: '0' }, 
      watched: { type: Boolean, default: false }, 
    },
  ],
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
module.exports = Watchlist;
