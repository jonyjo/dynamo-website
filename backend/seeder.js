import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/userModel.js"
import connectDB from "./config/db.js"

dotenv.config()
connectDB()

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany()

    // Add admin users
    const adminUsers = [
      {
        name: "Admin User 1",
        email: "admin1@example.com",
        password: "password123", // Use bcrypt to hash passwords
        isAdmin: true,
      },
      {
        name: "Admin User 2",
        email: "admin2@example.com",
        password: "password123",
        isAdmin: true,
      },
    ]

    // Hash passwords before saving
    const bcrypt = await import("bcryptjs")
    const salt = await bcrypt.genSalt(10)
    for (const user of adminUsers) {
      user.password = await bcrypt.hash(user.password, salt)
    }

    await User.insertMany(adminUsers)
    console.log("Admin users seeded successfully!")
    process.exit()
  } catch (error) {
    console.error("Error seeding admin users:", error)
    process.exit(1)
  }
}

seedUsers()