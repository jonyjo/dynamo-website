import express from "express"
import { upload, processImage } from "../utils/fileupload.js"
import { protect, admin } from "../middleware/authMiddleware.js"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  console.log("🖼️ File upload handler")

  if (!req.file) {
    console.log("❌ No file uploaded")
    return res.status(400).json({ message: "No file uploaded" })
  }

  try {
    console.log("✅ Original file uploaded:", req.file.filename)
    console.log("📐 Processing image to WebP with 1:1 ratio...")

    // Process the image
    const processedImage = await processImage(req.file)

    console.log("✅ Image processed:", processedImage.filename)

    // Create the URL for the processed file
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const filePath = `/uploads/processed/${processedImage.filename}`
    const fileUrl = `${baseUrl}${filePath}`

    res.json({
      message: "Image uploaded and processed successfully",
      imageUrl: fileUrl,
      filename: processedImage.filename,
    })
  } catch (error) {
    console.error("Error processing image:", error)

    // If the file exists but processing failed, try to clean up
    if (req.file && req.file.path) {
      try {
        const fs = await import("fs")
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
      } catch (cleanupError) {
        console.warn("Failed to clean up original file:", cleanupError)
      }
    }

    res.status(500).json({
      message: "Image processing failed",
      error: error.message,
    })
  }
})

export default router

