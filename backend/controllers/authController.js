import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

// Generate JWT
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, mobile, password } = req.body

    // Check if login is with email or mobile
    let user
    if (email) {
      user = await User.findOne({ email })
    } else if (mobile) {
      user = await User.findOne({ mobile })
    } else {
      return res.status(400).json({ message: "Please provide email or mobile number" })
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id,user.isAdmin),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          isAdmin: user.isAdmin,
        },
      })
    } else {
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body

    // Check if user exists with either email or mobile
    let userExists = null
    if (email) {
      userExists = await User.findOne({ email })
    }

    if (!userExists && mobile) {
      userExists = await User.findOne({ mobile })
    }

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Ensure at least one contact method is provided
    if (!email && !mobile) {
      return res.status(400).json({ message: "Either email or mobile number is required" })
    }

    const user = await User.create({
      name,
      email: email || null,
      mobile: mobile || null,
      password,
      isAdmin: true, // Ensure new users are never admins
    })

    if (user) {
      res.status(201).json({
        token: generateToken(user._id,user.isAdmin),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          isAdmin: user.isAdmin,
        },
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { loginUser, registerUser, getUserProfile }

