// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
//const movieRoutes = require('./routes/movies');
const watchlistRoutes = require('./routes/watchlist');

const flash = require('connect-flash');

/* Configuration for the Login */

const expressSession = require('express-session');
const passport = require('./config/passport'); // Import the passport configuration

const app = express();

// Database connection
connectDB();

// Session management
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'fallback_secret',  // Use the secret from .env
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to true if using HTTPS in production
}));

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');  // Redirect to login if not authenticated
}

// Routes
app.use('/auth', authRoutes);  // Auth routes (login, register)
app.use('/', isAuthenticated, indexRoutes);  // Home page protected
app.use('/watchlist', watchlistRoutes);
//app.use('/movies', movieRoutes);

// Catch 404 errors
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: req.app.get('env') === 'development' ? err : {} });
});



module.exports = app;
