const express = require("express");
const {protect} = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getUserInfo,
    updateUser,

} = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser) ;
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo) ;
router.put("/update", protect, upload.single("profileImage"), updateUser);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded"});
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    
    res.status(200).json({ imageUrl });
});

module.exports = router;
