import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },
    sku: {
      type: String,
    },
    features: [String],
    specifications: [
      {
        name: String,
        value: String,
      },
    ],
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      set: (val) => {
        // Ensure discount is a number and within valid range
        if (val === undefined || val === null || val === "") return 0
        const num = Number(val)
        return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 100)
      },
    },
    status: {
      type: String,
      enum: ["active", "draft", "featured", "archived"],
      default: "active",
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
)

// Add a validation to ensure subcategory is only set when category is set
productSchema.pre("validate", function (next) {
  if (this.subcategory && !this.category) {
    this.invalidate("subcategory", "Cannot have a subcategory without a category")
  }
  next()
})

// Add a validation to ensure subcategory belongs to the specified category
productSchema.pre("save", async function (next) {
  if (this.subcategory && this.category) {
    try {
      // Import Subcategory model here to avoid circular dependency
      const Subcategory = mongoose.model("Subcategory")

      // Check if the subcategory belongs to the category
      const subcategory = await Subcategory.findById(this.subcategory)
      if (!subcategory || subcategory.category.toString() !== this.category.toString()) {
        this.invalidate("subcategory", "Subcategory must belong to the specified category")
      }
    } catch (error) {
      // If there's an error, we'll just continue
      console.error("Error validating subcategory:", error)
    }
  }
  next()
})

const Product = mongoose.model("Product", productSchema)

export default Product

