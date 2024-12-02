// Import necessary modules
const express = require('express'); // Framework for creating routes
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const passport = require('../config/passport'); // Passport configuration for authentication
const User = require('../models/User'); // User model for database operations
const router = express.Router(); // Create a new router instance

/**
 * GET Login Page
 * Displays the login page unless the user is already authenticated,
 * in which case they are redirected to the home page.
 */
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        // If user is already logged in, redirect to the home page
        return res.redirect('/');
    }
    res.render('login'); // Render the login view
});

/**
 * POST Login Request
 * Handles login form submission, authenticates the user, and starts a session.
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body

    try {
        // Find the user by their email
        const user = await User.findOne({ email });
        if (!user) {
            // If no user is found, re-render the login page with an error message
            return res.render('login', { message: 'User not found' });
        }

        // Compare the submitted password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // If passwords don't match, re-render the login page with an error message
            return res.render('login', { message: 'Invalid credentials' });
        }

        // Log the user in using Passport's `req.login` method
        req.login(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).send('Server error during login');
            }

            // Store user data in the session for easy access
            req.session.user = {
                id: user._id,
                name: user.name,
                email: user.email
            };

            // Save the session and redirect to the home page
            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.status(500).send('Session error');
                }
                res.redirect('/');
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

/**
 * GET Register Page
 * Displays the registration page unless the user is already authenticated,
 * in which case they are redirected to the home page.
 */
router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        // If user is already logged in, redirect to the home page
        return res.redirect('/');
    }
    res.render('register'); // Render the registration view
});

/**
 * POST Register Request
 * Handles registration form submission, creates a new user, and redirects to login.
 */
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body; // Extract form data

    // Validate passwords match
    if (password !== password2) {
        return res.render('register', { message: 'Passwords do not match' });
    }

    // Check if the email is already in use
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.render('register', { message: 'Email already in use' });
    }

    try {
        // Create a new user instance with hashed password
        const newUser = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10) // Hash the password
        });

        // Save the new user to the database
        await newUser.save();
        return res.redirect('/auth/login'); // Redirect to the login page after registration
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

/**
 * POST Logout Request
 * Logs out the user and redirects to the login page.
 */
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error during logout');
        }
        // Clear the user session and redirect to the login page
        req.session.user = null;
        res.redirect('/auth/login');
    });
});

// Export the router for use in other parts of the application
module.exports = router;
