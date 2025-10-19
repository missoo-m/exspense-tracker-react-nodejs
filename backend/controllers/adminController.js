const User = require("../models/User");
const News = require("../models/News"); // Будет новая модель

// Получить список всех пользователей
exports.getAllUsers = async (req, res) => {
    try {
        // Исключаем поле password
        const users = await User.find().select("-password"); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error during fetching users" });
    }
};

// Удалить пользователя
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error during deleting user" });
    }
};

// --- Функции для управления новостями/курсами валют ---

// Добавить новость/курс валют (пример)
exports.addNews = async (req, res) => {
    try {
        const { title, content, type } = req.body; // type: 'news' или 'currency'

        if (!title || !content || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPost = new News({
            title,
            content,
            type,
            authorId: req.user.id, // ID администратора
        });

        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Server Error during adding news", error });
    }
};

// Получить все новости/курсы (для панели управления)
exports.getAllContent = async (req, res) => {
    try {
        const content = await News.find().sort({ date: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: "Server Error during fetching content" });
    }
};

// ... Можно добавить deleteNews, updateNews и т.д.