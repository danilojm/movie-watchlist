// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Create a Schema for the User
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/  // Email format validation
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {  // Ensure password is hashed on creation or modification
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);