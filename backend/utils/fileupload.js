import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import sharp from "sharp"

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads")
const processedDir = path.join(__dirname, "../uploads/processed")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true })
}

// Configure storage for original uploads (temporary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    // Keep original extension for initial upload
    const ext = path.extname(file.originalname)
    cb(null, "original-" + uniqueSuffix + ext)
  },
})

// File filter - accept all image types
const fileFilter = (req, file, cb) => {
  // Accept all image types
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"))
  }
}

// Create the multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: fileFilter,
})

// Safe file deletion function
const safeDeleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`Successfully deleted: ${filePath}`)
    }
  } catch (error) {
    console.warn(`Warning: Could not delete file ${filePath}`, error.message)
    // Don't throw the error - just log it and continue
  }
}

// Process image function - converts to WebP and resizes to 1:1
const processImage = async (file) => {
  try {
    const filename = "product-" + Date.now() + ".webp"
    const outputPath = path.join(processedDir, filename)

    // Get image metadata to determine dimensions
    const metadata = await sharp(file.path).metadata()

    // Determine the size for the square (use the smaller dimension)
    const size = Math.min(metadata.width, metadata.height)

    // Process the image: resize to square and convert to WebP
    await sharp(file.path)
      .resize({
        width: size,
        height: size,
        fit: sharp.fit.cover,
        position: sharp.strategy.attention, // Focus on the most interesting part
      })
      .toFormat("webp", { quality: 80 }) // Convert to WebP with 80% quality
      .toFile(outputPath)

    // Try to delete the original file, but don't fail if it doesn't work
    safeDeleteFile(file.path)

    return {
      filename,
      path: outputPath,
    }
  } catch (error) {
    console.error("Error processing image:", error)
    throw new Error("Image processing failed")
  }
}

export { upload, processImage }

