// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const User = require('../models/User');
const router = express.Router();

// GET login page
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');  // Redirect to home page if already logged in
    }
    res.render('login');  // Render login page
});

// POST Login request
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { message: 'Invalid credentials' });
        }

        // Log the user in
        req.login(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).send('Server error during login');
            }

            // Set req.session.user to store user data in the session
            req.session.user = {
                id: user._id,
                name: user.name,
                email: user.email
            };

            // After setting session user
            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.status(500).send('Session error');
                }
                res.redirect('/');  // Proceed with the redirection
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// GET Register page
router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');  // Redirect to home page if already logged in
    }
    res.render('register');  // Render register page
});

// POST Register request (to create a new user)
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;

    // Check if passwords match
    if (password !== password2) {
        return res.render('register', { message: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        return res.render('register', { message: 'Email already in use' });
    }


    try {
        // Hash password and create new user
        const newUser = new User({
            name,
            email,
            password
        });

        // Save user to the database
        await newUser.save();
        return res.redirect('/auth/login');  // Redirect to home page after successful registration

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// POST Logout request
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error during logout');
        }
        req.session.user = null; // Clear the session user data
        res.redirect('/auth/login'); // Redirect to login page after logout
    });
});


module.exports = router;
