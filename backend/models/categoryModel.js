import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Instead of embedding subcategories, we'll reference them
    order: {
      type: Number,
      default: 0,
    },
    // New fields for navbar functionality
    showInNavbar: {
      type: Boolean,
      default: false,
    },
    navbarOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Category = mongoose.model("Category", categorySchema)

export default Category

