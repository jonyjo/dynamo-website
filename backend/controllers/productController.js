import Product from "../models/productModel.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"


// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10
    const page = Number(req.query.page) || 1

    // Build query
    const query = {}

    // Add keyword search if provided
    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: "i",
      }
    }

    // Add category filter if provided
    if (req.query.category) {
      query.category = req.query.category
    }

    // Add subcategory filter if provided
    if (req.query.subcategory) {
      query.subcategory = req.query.subcategory
    }

    // Add status filter if provided
    if (req.query.status) {
      query.status = req.query.status
    }

    // Determine sort order
    let sort = { createdAt: -1 } // Default sort by newest
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith("-") ? req.query.sort.substring(1) : req.query.sort
      const sortDirection = req.query.sort.startsWith("-") ? -1 : 1
      sort = { [sortField]: sortDirection }
    }

    const count = await Product.countDocuments(query)
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(limit * (page - 1))
      .populate("category", "name")
      .populate("subcategory", "name")

    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name").populate("subcategory", "name")

    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      countInStock,
      image,
      images,
      category,
      subcategory,
      sku,
      features,
      discount,
      status,
      tags,
      specifications,
    } = req.body

    // Ensure discount is properly parsed as a number
    const parsedDiscount = discount !== undefined && discount !== "" ? Number(discount) : 0

    const product = new Product({
      name,
      description,
      price,
      countInStock,
      image,
      images: images || [],
      category,
      subcategory,
      sku,
      features,
      discount: parsedDiscount,
      status: status || "active",
      tags,
      specifications,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      countInStock,
      image,
      images,
      category,
      subcategory,
      sku,
      features,
      discount,
      status,
      tags,
      specifications,
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      // Only update fields that are explicitly provided in the request
      if (name !== undefined) product.name = name
      if (description !== undefined) product.description = description
      if (price !== undefined) product.price = Number(price)
      if (countInStock !== undefined) product.countInStock = Number(countInStock)
      if (image !== undefined) product.image = image
      if (images !== undefined) product.images = images
      if (category !== undefined) product.category = category
      if (subcategory !== undefined) product.subcategory = subcategory
      if (sku !== undefined) product.sku = sku
      if (features !== undefined) product.features = features
      if (discount !== undefined) product.discount = discount !== "" ? Number(discount) : product.discount
      if (status !== undefined) product.status = status
      if (tags !== undefined) product.tags = tags
      if (specifications !== undefined) product.specifications = specifications

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      console.log("Deleting product:", product)

      // Delete the main image if it exists
      if (product.image) {
        // Extract the filename from the URL
        const filename = product.image.split("/").pop()
        const imagePath = path.join(__dirname, "..", "uploads", "processed", filename)
        console.log("Main image path:", imagePath)
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
            console.log("Deleted main image:", imagePath)
          } else {
            console.log("Main image does not exist:", imagePath)
          }
        } catch (error) {
          console.error("Error deleting main image:", error)
        }
      }

      // Delete additional images if they exist
      if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
          // Extract the filename from the URL
          const filename = img.split("/").pop()
          const imagePath = path.join(__dirname, "..", "uploads", "processed", filename)
          console.log("Additional image path:", imagePath)
          try {
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath)
              console.log("Deleted additional image:", imagePath)
            } else {
              console.log("Additional image does not exist:", imagePath)
            }
          } catch (error) {
            console.error("Error deleting additional image:", error)
          }
        })
      }

      // Delete the product from the database
      await product.deleteOne()
      res.json({ message: "Product and associated images removed" })
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct }

