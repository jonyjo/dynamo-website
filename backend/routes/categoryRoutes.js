import express from "express"
import {
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
} from "../controllers/categoryController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(getCategories).post(protect, admin, createCategory)

router.route("/reorder").put(protect, admin, reorderCategories)

router.route("/:id").get(getCategoryById).put(protect, admin, updateCategory).delete(protect, admin, deleteCategory)

router.route("/:id/subcategories").post(protect, admin, createSubcategory)

router.route("/:id/subcategories/reorder").put(protect, admin, reorderSubcategories)

router
  .route("/:id/subcategories/:subcategoryId")
  .put(protect, admin, updateSubcategory)
  .delete(protect, admin, deleteSubcategory)

router.route("/:id/subcategories/:subcategoryId/move").put(protect, admin, moveSubcategory)

// Navbar-specific routes
router.route("/:id/navbar").put(protect, admin, updateCategoryNavbar)
router.route("/navbar/reorder").put(protect, admin, reorderNavbarCategories)

export default router

