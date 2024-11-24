// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tmdbId: { type: Number, unique: true },
    releaseDate: { type: Date },
    overview: { type: String },
    poster_path: { type: String },
    userAdded: { type: Boolean, default: false },
});

// Optional index on tmdbId for performance
movieSchema.index({ tmdbId: 1 });

module.exports = mongoose.model('Movie', movieSchema);