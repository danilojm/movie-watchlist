// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Make sure this matches your User model

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);  // Store user ID in session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);  // Fetch user data based on stored ID
    } catch (err) {
        done(err);
    }
});

// Define local strategy for login
passport.use(new LocalStrategy(
    {
        usernameField: 'email',  // Use 'email' as username field
        passwordField: 'password'  // Use 'password' as password field
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            // Assuming you have bcrypt for password hashing
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            return done(null, user);  // Successfully authenticated
        } catch (err) {
            return done(err);
        }
    }
));

module.exports = passport;
