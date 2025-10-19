const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, // Для курса валют можно использовать JSON-строку или отдельное поле
    type: { type: String, enum: ["news", "currency"], required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("News", NewsSchema);