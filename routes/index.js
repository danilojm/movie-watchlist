// Import the Express module to create and manage routes
const express = require('express');
// Create an instance of the Express router
const router = express.Router();
// Import the Watchlist model to interact with the database
const Watchlist = require('../models/Watchlist'); // Assuming Watchlist is your model for storing watchlists

/**
 * Home route (index) - Displays the main page for logged-in users.
 * If the user is not logged in, they are redirected to the login page.
 */
router.get('/', async (req, res) => {
  if (!req.session.user) {
    // Redirect to the login page if the user is not authenticated
    return res.redirect('/auth/login');
  }

  try {
    // Fetch all watchlists associated with the logged-in user
    const watchlists = await Watchlist.find({ userId: req.session.user.id });
    // Render the index page with the user's data and their watchlists
    res.render('index', { user: req.session.user, watchlists });
  } catch (error) {
    console.error("Error loading watchlists:", error);
    // Send a server error response if something goes wrong
    res.status(500).send("Server error loading watchlists");
  }
});

/**
 * Route for searching watchlists by the logged-in user.
 * If the user is not logged in, they are redirected to the login page.
 */
router.get('/searchByUser', async (req, res) => {
  if (!req.session.user) {
    // Redirect to the login page if the user is not authenticated
    return res.redirect('/auth/login');
  }

  try {
    // Fetch all watchlists associated with the logged-in user
    const watchlists = await Watchlist.find({ userId: req.session.user.id });
    if (!watchlists || watchlists.length === 0) {
      // Respond with a 404 error if no watchlists are found
      return res.status(404).send("No watchlists found for this user.");
    }
    // Render the watchlists view with the fetched data
    res.render('watchlists', { watchlists });
  } catch (error) {
    console.error("Error searching watchlists by user:", error);
    // Send a server error response if something goes wrong
    res.status(500).send("Server error searching watchlists");
  }
});

/**
 * (Commented out for now) Route for viewing a specific watchlist by its ID.
 * If the user is not logged in, they are redirected to the login page.
 * Uncomment and use this route if you need to provide detailed views of specific watchlists.
 */
// router.get('/watchlist/:id', async (req, res) => {
//   if (!req.session.user) {
//     // Redirect to the login page if the user is not authenticated
//     return res.redirect('/auth/login');
//   }

//   try {
//     // Fetch the specific watchlist by its ID
//     const watchlist = await Watchlist.findById(req.params.id);
//     if (!watchlist) {
//       // Respond with a 404 error if the watchlist is not found
//       return res.status(404).send("Watchlist not found");
//     }
//     // Render the watchlist view with the fetched data
//     res.render('watchlist', { watchlist });
//   } catch (error) {
//     console.error("Error fetching watchlist:", error);
//     // Send a server error response if something goes wrong
//     res.status(500).send("Server error loading watchlist");
//   }
// });

// Export the router so it can be used in other parts of the application
module.exports = router;
