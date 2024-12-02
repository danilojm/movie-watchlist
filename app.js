// Import necessary modules
const express = require('express'); // Web framework for Node.js
const path = require('path'); // Utility for working with file and directory paths
const cookieParser = require('cookie-parser'); // Middleware to parse cookies
const logger = require('morgan'); // HTTP request logger middleware
const session = require('express-session'); // Middleware for session handling
const flash = require('connect-flash'); // Flash messages middleware for temporary messages
const passport = require('./config/passport'); // Passport for authentication
const connectDB = require('./config/db'); // Function to connect to the database
require('dotenv').config(); // Load environment variables from .env file

// Handlebars for view rendering
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');

// Route imports
const authRoutes = require('./routes/auth'); // Authentication routes
const indexRoutes = require('./routes/index'); // Main index routes
const watchlistRoutes = require('./routes/watchlist'); // Watchlist related routes

// Initialize the app
const app = express();

// === Database Connection ===
connectDB(); // Connect to the database using the connectDB function

// === Middleware ===

// Logger for HTTP requests
app.use(logger('dev')); // Log incoming requests for development

// Parsing middleware to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Parse cookies from requests

// Serve static files (like images, styles, etc.) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Register Handlebars as the view engine with specific settings
app.engine('hbs', exphbs.engine({
    extname: 'hbs', // Set file extension for Handlebars files
    defaultLayout: false, // No default layout used
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Allow prototype properties
        allowProtoMethodsByDefault: true     // Allow prototype methods
    }
}));
app.set('view engine', 'hbs'); // Set Handlebars as the view engine

// Set the 'views' folder path for rendering views
app.set('views', path.join(__dirname, 'views'));

// Register a custom 'eq' helper for Handlebars to compare two values
Handlebars.registerHelper('eq', function(a, b) {
    return parseInt(a) === parseInt(b); // Check if two values are equal
});

// === Session Management ===

// Set up session with a secret and options for cookie
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'fallback_secret', // Secret key for session encryption (from .env or fallback)
        resave: false, // Do not save session if not modified
        saveUninitialized: false, // Do not create sessions for uninitialized data
        cookie: { secure: false }, // Cookies are not secure in development (use 'true' in production with HTTPS)
    })
);

// Flash messages for one-time notifications (e.g., success/error messages)
app.use(flash());

// Initialize Passport for authentication handling
app.use(passport.initialize());
app.use(passport.session());

// === Authentication Middleware ===
// Check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // Allow the request to proceed if authenticated
    }
    res.redirect('/auth/login'); // Redirect to login page if not authenticated
};

// === Routes ===

// Authentication routes (login, registration, etc.)
app.use('/auth', authRoutes);

// Main index route (protected by authentication middleware)
app.use('/', isAuthenticated, indexRoutes); 

// Watchlist routes (also protected by authentication middleware)
app.use('/watchlist', isAuthenticated, watchlistRoutes); 

// === Error Handling ===

// Catch 404 errors for routes that do not exist
app.use((req, res, next) => {
    const error = new Error('Not Found'); // Create a 404 error
    error.status = 404;
    next(error); // Pass the error to the next middleware
});

// General error handler for any other errors
app.use((err, req, res, next) => {
    res.status(err.status || 500); // Set the response status code (default to 500 if not set)
    res.render('error', { // Render an error view
        message: err.message, // Display the error message
        error: req.app.get('env') === 'development' ? err : {}, // Show full stack trace in development only
    });
});

// Export the app instance so it can be used in other files (e.g., for testing)
module.exports = app;
