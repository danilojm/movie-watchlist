// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport'); // Passport configuration
const connectDB = require('./config/db'); // Database connection
require('dotenv').config(); // Load environment variables

const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');

// Route imports
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const watchlistRoutes = require('./routes/watchlist');

// Initialize the app
const app = express();

// === Database Connection ===
connectDB();

// === Middleware ===

// Logger for requests
app.use(logger('dev'));

// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Register Handlebars as the view engine
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: false,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Allow access to prototype properties
        allowProtoMethodsByDefault: true     // Allow access to prototype methods
      }
  }));
  app.set('view engine', 'hbs');
  
  // Set the path for the views folder
  app.set('views', path.join(__dirname, 'views'));
  
  // Define the custom 'eq' helper
  Handlebars.registerHelper('eq', function(a, b) {
    return parseInt(a) === parseInt(b);
  });


// Session management
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'fallback_secret', // Secret from .env
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Use `true` if HTTPS is enabled in production
    })
);

// Flash messages
app.use(flash());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// === Authentication Middleware ===
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login'); // Redirect to login if not authenticated
};

// === Routes ===
app.use('/auth', authRoutes); // Authentication routes
app.use('/', isAuthenticated, indexRoutes); // Protected routes
app.use('/watchlist', isAuthenticated, watchlistRoutes); // Watchlist routes

// === Error Handling ===

// Catch 404 errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// General error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}, // Show stacktrace only in development
    });
});

// Export the app instance
module.exports = app;
