import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, "../uploads")

// Function to clean up temporary files older than a certain time
export const cleanupTempFiles = () => {
  console.log("Running temporary file cleanup...")

  // Don't clean the processed directory
  const processedDir = path.join(uploadsDir, "processed")

  try {
    // Read all files in the uploads directory
    if (!fs.existsSync(uploadsDir)) return

    const files = fs.readdirSync(uploadsDir)

    // Current time
    const now = Date.now()
    // Files older than 1 hour (3600000 ms) will be deleted
    const maxAge = 3600000

    files.forEach((file) => {
      // Skip directories and the processed directory
      const filePath = path.join(uploadsDir, file)
      if (fs.statSync(filePath).isDirectory() || filePath === processedDir) return

      // Check if file starts with "original-" (our temp files)
      if (file.startsWith("original-")) {
        const stats = fs.statSync(filePath)
        const fileAge = now - stats.mtimeMs

        // Delete if older than maxAge
        if (fileAge > maxAge) {
          try {
            fs.unlinkSync(filePath)
            console.log(`Deleted old temporary file: ${file}`)
          } catch (error) {
            console.warn(`Could not delete file ${file}:`, error.message)
          }
        }
      }
    })

    console.log("Temporary file cleanup completed")
  } catch (error) {
    console.error("Error during file cleanup:", error)
  }
}

// Schedule cleanup to run every hour
export const scheduleCleanup = () => {
  // Run once at startup
  cleanupTempFiles()

  // Then schedule to run every hour
  setInterval(cleanupTempFiles, 3600000)

  console.log("Scheduled temporary file cleanup (runs hourly)")
}

