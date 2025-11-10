const mongoose = require("mongoose");
require('dotenv').config();

const User = require('../models/User'); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected");
        await createDefaultAdmin();
        
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
};

const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: "ADMIN" });

        if (!adminExists) {
            const defaultAdmin = new User({
                fullName: process.env.ADMIN_NAME || "System Admin",
                email: process.env.ADMIN_EMAIL || "admin@expensetracker.com", 
                password: process.env.ADMIN_PASSWORD || "123456", 
                role: "ADMIN"
            });
            await defaultAdmin.save();
            console.log("Default ADMIN user created successfully.");
        } else {
        }
    } catch (error) {
        console.error("Error creating default admin:", error.message);
    }
};

module.exports = connectDB;