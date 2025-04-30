import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

// Protect routes - verify token
const protect = async (req, res, next) => {
  console.log("🔒 Auth Middleware - Headers:", req.headers)

  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]
      console.log("🔑 Token found:", token ? "Token exists" : "No token")

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("✅ Token verified, user ID:", decoded.id)
      console.log("Request body",req.body);
      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password")

      next()
    } catch (error) {
      console.error("❌ Auth error:", error.message)
      res.status(401).json({ message: "Not authorized, token failed" })
    }
  } else {
    console.log("❌ No authorization header or incorrect format")
    res.status(401).json({ message: "Not authorized, no token" })
  }
}

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    console.log("❌ User not admin:", req.user ? req.user._id : "No user")
    res.status(401).json({ message: "Not authorized as an admin" })
  }
}

export { protect, admin }

