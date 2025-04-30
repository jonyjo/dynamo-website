import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows null/undefined values to not trigger unique constraint
      lowercase: true,
    },
    mobile: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows null/undefined values to not trigger unique constraint
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Custom validation to ensure either email or mobile is provided
userSchema.pre("validate", function (next) {
  if (!this.email && !this.mobile) {
    this.invalidate("email", "Either email or mobile number is required")
    this.invalidate("mobile", "Either email or mobile number is required")
  }
  next()
})

const User = mongoose.model("User", userSchema)

export default User

