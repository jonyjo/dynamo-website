import mongoose from "mongoose"
import dotenv from "dotenv"
import Category from "../models/categoryModel.js"
import Subcategory from "../models/subcategoryModel.js"

dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected for migration"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

const migrateData = async () => {
  try {
    console.log("Starting migration...")

    // Get all categories from the old structure
    const oldCategories = await mongoose.connection.db.collection("categories").find({}).toArray()
    console.log(`Found ${oldCategories.length} categories to migrate`)

    // Create new categories and subcategories
    for (let i = 0; i < oldCategories.length; i++) {
      const oldCategory = oldCategories[i]
      console.log(`Migrating category: ${oldCategory.name}`)

      // Create new category
      const newCategory = new Category({
        _id: oldCategory._id, // Keep the same ID
        name: oldCategory.name,
        order: i,
        createdAt: oldCategory.createdAt,
        updatedAt: oldCategory.updatedAt,
      })

      await newCategory.save()
      console.log(`Created new category: ${newCategory.name}`)

      // Create subcategories if they exist
      if (oldCategory.subcategories && oldCategory.subcategories.length > 0) {
        console.log(`Found ${oldCategory.subcategories.length} subcategories to migrate`)

        for (let j = 0; j < oldCategory.subcategories.length; j++) {
          const oldSubcategory = oldCategory.subcategories[j]

          const newSubcategory = new Subcategory({
            _id: oldSubcategory._id, // Keep the same ID
            name: oldSubcategory.name,
            category: oldCategory._id,
            order: j,
            createdAt: oldSubcategory.createdAt || new Date(),
            updatedAt: oldSubcategory.updatedAt || new Date(),
          })

          await newSubcategory.save()
          console.log(`Created new subcategory: ${newSubcategory.name}`)
        }
      }
    }

    console.log("Migration completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrateData()

