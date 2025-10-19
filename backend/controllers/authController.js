const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign ({ id }, process.env.JWT_SECRET, {expiresIn: "1h"});
}


exports.registerUser = async (req, res) => {
    
    if (!req.body) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const {fullName, email, password, profileImageUrl, role } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({messege: "All field are required"});
    }

    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({messege: "Email already in use"});
        }

        const userRole = role === "ADMIN" ? "ADMIN" : "NORMAL";

        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
            role: userRole,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch(err) {
        res
           .status(500)
           .json({messege: "Error registering user ", error: err.message});
    }
};

exports.loginUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({messege: "All field are required"});
    }

    try { 
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({messege: "Invalid credentials"});
        }
        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });

        
    } catch(err) {
        res
           .status(500)
           .json({messege: "Error registering user ", error: err.message});
    }

};

exports.getUserInfo = async (req, res) => {

    try { 
        const user = await User.findById( req.user.id ).select("-password") ;

        if (!user) {
            return res.status(400).json({messege: "User not found"});
        }

        res.status(200).json(user);
    } catch(err) {
        res
           .status(500)
           .json({messege: "Error registering user ", error: err.message});
    }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { fullName, password } = req.body; 
    if (fullName) user.fullName = fullName;

    if (password) {
      const bcrypt = require("bcryptjs");
      user.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      user.profileImageUrl = imageUrl;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        fullName: user.fullName,
        email: user.email, 
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


