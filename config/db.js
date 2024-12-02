// config/db.js

// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Import dotenv to load environment variables from a .env file
require('dotenv').config();

// Function to establish a connection to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.MONGO_URI);

        // Log a success message if the connection is established
        console.log("MongoDB connected!");
    } catch (error) {
        // Log the error if the connection fails
        console.error("MongoDB connection error:", error);

        // Exit the process with a failure code to indicate a critical issue
        process.exit(1);
    }
};

// Export the connectDB function to be used in other parts of the application
module.exports = connectDB;
