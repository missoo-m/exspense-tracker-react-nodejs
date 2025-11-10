const mongoose = require("mongoose");
require('dotenv').config();

// *** 1. Импортируем модель пользователя ***
const User = require('../models/User'); // Убедитесь, что путь к вашей модели User верен

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

// --- ЛОГИКА СОЗДАНИЯ АДМИНИСТРАТОРА ---

const createDefaultAdmin = async () => {
    try {
        // Проверяем, существует ли уже администратор
        const adminExists = await User.findOne({ role: "ADMIN" });

        if (!adminExists) {
            // Если администратор не найден, создаем его
            const defaultAdmin = new User({
                fullName: process.env.ADMIN_NAME || "System Admin",
                // Используем переменные окружения для гибкости
                email: process.env.ADMIN_EMAIL || "admin@expensetracker.com", 
                password: process.env.ADMIN_PASSWORD || "123456", 
                role: "ADMIN"
            });
            
            // Благодаря UserSchema.pre('save'), пароль будет автоматически хеширован
            await defaultAdmin.save();
            console.log("✅ Default ADMIN user created successfully.");
        } else {
            // console.log("Admin user already exists."); // Можно оставить закомментированным или удалить
        }
    } catch (error) {
        console.error("Error creating default admin:", error.message);
    }
};

module.exports = connectDB;