// routes/index.js
const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist'); // Assuming Watchlist is your model for storing watchlists

const watchlistController = require('../controllers/watchlistController');

// Home route (index) - this is the home page
router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');  // Redirect to login if not logged in
  }

  try {
    // Fetch watchlists associated with the user
    const watchlists = await Watchlist.find({ userId: req.session.user.id });
    res.render('index', { user: req.session.user, watchlists });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error loading watchlists");
  }
});

// Route for displaying the create watchlist page
// Route for searching watchlists by user (using new route for user-specific watchlists)
router.get('/searchByUser', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');  // Redirect to login if not logged in
  }

  try {
    // Fetch all watchlists for the logged-in user
    const watchlists = await Watchlist.find({ userId: req.session.user.id });
    if (!watchlists || watchlists.length === 0) {
      return res.status(404).send("No watchlists found for this user.");
    }
    // Render the search results page with the watchlists
    res.render('watchlists', { watchlists: watchlists });
  } catch (error) {
    console.error("Error searching watchlists by user:", error);
    res.status(500).send("Server error searching watchlists");
  }
});


// Route for viewing a specific watchlist by ID
// router.get('/watchlist/:id', async (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/auth/login');  // Redirect to login if not logged in
//   }

//   console.log("Passei Aqui", req.session.user);

//   try {
//     const watchlist = await Watchlist.findById(req.params.id);
//     if (!watchlist) {
//       return res.status(404).send("Watchlist not found");
//     }
//     res.render('watchlist', { watchlist });  // Render the watchlist view with data
//   } catch (error) {
//     console.error("Error fetching watchlist:", error);
//     res.status(500).send("Server error loading watchlist");
//   }
// });

module.exports = router;
