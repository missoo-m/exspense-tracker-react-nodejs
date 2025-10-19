exports.adminProtect = (req, res, next) => {
    // protect middleware уже добавил req.user
    if (req.user && req.user.role === "ADMIN") {
        next(); // Пользователь - администратор, продолжаем
    } else {
        res.status(403).json({ message: "Access denied. Only for administrators." });
    }
};