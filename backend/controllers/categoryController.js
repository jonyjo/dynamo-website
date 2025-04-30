import Category from "../models/categoryModel.js"
import Subcategory from "../models/subcategoryModel.js"
import Product from "../models/productModel.js"

// @desc    Fetch all categories with their subcategories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find({}).sort({ order: 1, name: 1 })

    // Get all subcategories
    const subcategories = await Subcategory.find({}).sort({ order: 1, name: 1 })

    // Group subcategories by category
    const categoriesWithSubs = categories.map((category) => {
      const categoryObj = category.toObject()
      categoryObj.subcategories = subcategories.filter((sub) => sub.category.toString() === category._id.toString())
      return categoryObj
    })

    res.json(categoriesWithSubs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Fetch single category with its subcategories
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (category) {
      // Get subcategories for this category
      const subcategories = await Subcategory.find({ category: category._id }).sort({ order: 1, name: 1 })

      const categoryWithSubs = category.toObject()
      categoryWithSubs.subcategories = subcategories

      res.json(categoryWithSubs)
    } else {
      res.status(404).json({ message: "Category not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name } = req.body

    // Get the highest order value
    const highestOrder = await Category.findOne().sort("-order")
    const order = highestOrder ? highestOrder.order + 1 : 0

    const category = new Category({
      name,
      order,
    })

    const createdCategory = await category.save()
    res.status(201).json(createdCategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, order } = req.body

    const category = await Category.findById(req.params.id)

    if (category) {
      category.name = name || category.name
      if (order !== undefined) {
        category.order = order
      }

      const updatedCategory = await category.save()
      res.json(updatedCategory)
    } else {
      res.status(404).json({ message: "Category not found" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (category) {
      // First, delete all subcategories associated with this category
      await Subcategory.deleteMany({ category: category._id })

      // Update any products that use this category
      await Product.updateMany({ category: category._id }, { category: null, subcategory: null })

      // Delete the category
      await category.deleteOne()
      res.json({ message: "Category and associated subcategories removed" })
    } else {
      res.status(404).json({ message: "Category not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a subcategory
// @route   POST /api/categories/:id/subcategories
// @access  Private/Admin
const createSubcategory = async (req, res) => {
  try {
    const { name } = req.body
    const categoryId = req.params.id

    // Verify the category exists
    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Get the highest order value for subcategories in this category
    const highestOrder = await Subcategory.findOne({ category: categoryId }).sort("-order")
    const order = highestOrder ? highestOrder.order + 1 : 0

    // Create the subcategory
    const subcategory = new Subcategory({
      name,
      category: categoryId,
      order,
    })

    const createdSubcategory = await subcategory.save()
    res.status(201).json(createdSubcategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a subcategory
// @route   PUT /api/categories/:id/subcategories/:subcategoryId
// @access  Private/Admin
const updateSubcategory = async (req, res) => {
  try {
    const { name, order } = req.body
    const { id: categoryId, subcategoryId } = req.params

    // Verify the subcategory exists and belongs to the specified category
    const subcategory = await Subcategory.findOne({
      _id: subcategoryId,
      category: categoryId,
    })

    if (subcategory) {
      subcategory.name = name || subcategory.name
      if (order !== undefined) {
        subcategory.order = order
      }

      const updatedSubcategory = await subcategory.save()
      res.json(updatedSubcategory)
    } else {
      res.status(404).json({ message: "Subcategory not found" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete a subcategory
// @route   DELETE /api/categories/:id/subcategories/:subcategoryId
// @access  Private/Admin
const deleteSubcategory = async (req, res) => {
  try {
    const { id: categoryId, subcategoryId } = req.params

    // Verify the subcategory exists and belongs to the specified category
    const subcategory = await Subcategory.findOne({
      _id: subcategoryId,
      category: categoryId,
    })

    if (subcategory) {
      // Update any products that use this subcategory
      await Product.updateMany({ subcategory: subcategoryId }, { subcategory: null })

      // Delete the subcategory
      await subcategory.deleteOne()
      res.json({ message: "Subcategory removed" })
    } else {
      res.status(404).json({ message: "Subcategory not found" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
const reorderCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body

    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ message: "categoryIds must be an array" })
    }

    // Update the order of each category
    const updatePromises = categoryIds.map((id, index) => {
      return Category.findByIdAndUpdate(id, { order: index }, { new: true })
    })

    await Promise.all(updatePromises)

    res.json({ message: "Categories reordered successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Reorder subcategories
// @route   PUT /api/categories/:id/subcategories/reorder
// @access  Private/Admin
const reorderSubcategories = async (req, res) => {
  try {
    const { subcategoryIds } = req.body
    const categoryId = req.params.id

    if (!Array.isArray(subcategoryIds)) {
      return res.status(400).json({ message: "subcategoryIds must be an array" })
    }

    // Verify all subcategories belong to the specified category
    const subcategories = await Subcategory.find({
      _id: { $in: subcategoryIds },
      category: categoryId,
    })

    if (subcategories.length !== subcategoryIds.length) {
      return res.status(400).json({
        message: "Some subcategories do not exist or do not belong to the specified category",
      })
    }

    // Update the order of each subcategory
    const updatePromises = subcategoryIds.map((id, index) => {
      return Subcategory.findByIdAndUpdate(id, { order: index }, { new: true })
    })

    await Promise.all(updatePromises)

    res.json({ message: "Subcategories reordered successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Move a subcategory to a different category
// @route   PUT /api/categories/:id/subcategories/:subcategoryId/move
// @access  Private/Admin
const moveSubcategory = async (req, res) => {
  try {
    const { targetCategoryId } = req.body
    const { id: sourceCategoryId, subcategoryId } = req.params

    // Verify the subcategory exists and belongs to the source category
    const subcategory = await Subcategory.findOne({
      _id: subcategoryId,
      category: sourceCategoryId,
    })

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" })
    }

    // Verify the target category exists
    const targetCategory = await Category.findById(targetCategoryId)
    if (!targetCategory) {
      return res.status(404).json({ message: "Target category not found" })
    }

    // Get the highest order value for subcategories in the target category
    const highestOrder = await Subcategory.findOne({ category: targetCategoryId }).sort("-order")
    const newOrder = highestOrder ? highestOrder.order + 1 : 0

    // Update the subcategory
    subcategory.category = targetCategoryId
    subcategory.order = newOrder

    const updatedSubcategory = await subcategory.save()

    // Update any products that use this subcategory
    await Product.updateMany({ subcategory: subcategoryId }, { category: targetCategoryId })

    res.json(updatedSubcategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update category navbar visibility
// @route   PUT /api/categories/:id/navbar
// @access  Private/Admin
const updateCategoryNavbar = async (req, res) => {
  try {
    const { showInNavbar } = req.body

    const category = await Category.findById(req.params.id)

    if (category) {
      category.showInNavbar = showInNavbar

      // If showing in navbar and no navbarOrder is set, set it to the highest current order + 1
      if (showInNavbar && category.navbarOrder === 0) {
        const highestOrder = await Category.findOne({ showInNavbar: true }).sort("-navbarOrder")
        category.navbarOrder = highestOrder ? highestOrder.navbarOrder + 1 : 1
      }

      const updatedCategory = await category.save()
      res.json(updatedCategory)
    } else {
      res.status(404).json({ message: "Category not found" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Reorder navbar categories
// @route   PUT /api/categories/navbar/reorder
// @access  Private/Admin
const reorderNavbarCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body

    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ message: "categoryIds must be an array" })
    }

    // Update the navbarOrder of each category
    const updatePromises = categoryIds.map((id, index) => {
      return Category.findByIdAndUpdate(
        id,
        { navbarOrder: index + 1 }, // Start from 1 for better readability
        { new: true },
      )
    })

    await Promise.all(updatePromises)

    res.json({ message: "Navbar categories reordered successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  reorderCategories,
  reorderSubcategories,
  moveSubcategory,
  updateCategoryNavbar,
  reorderNavbarCategories,
}

