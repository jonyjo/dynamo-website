"use client"

import { useState, useEffect, useRef } from "react"
import api from "../../Services/api"

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newCategory, setNewCategory] = useState({ name: "" })
  const [newSubcategory, setNewSubcategory] = useState({ name: "", categoryId: "" })

  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSubcategory, setEditingSubcategory] = useState(null)

  const [deleteType, setDeleteType] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteParentId, setDeleteParentId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [formLoading, setFormLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState({})
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)
  const [dragType, setDragType] = useState(null) // 'category' or 'subcategory'
  const [moveSubcategoryModal, setMoveSubcategoryModal] = useState(false)
  const [subcategoryToMove, setSubcategoryToMove] = useState(null)
  const [targetCategoryId, setTargetCategoryId] = useState("")

  const categoryRefs = useRef({})
  const subcategoryRefs = useRef({})

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.getCategories()
      setCategories(response.data)

      // Initialize expanded state for all categories (collapsed by default)
      const expanded = {}
      response.data.forEach((cat) => {
        expanded[cat._id] = false // Start with all collapsed
      })
      setExpandedCategories(expanded)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const handleNewCategorySubmit = async (e) => {
    e.preventDefault()
    if (!newCategory.name.trim()) return

    try {
      setFormLoading(true)
      const response = await api.createCategory({ name: newCategory.name })

      // Add empty subcategories array to the new category
      const newCategoryWithSubs = {
        ...response.data,
        subcategories: [],
      }

      setCategories([...categories, newCategoryWithSubs])
      setNewCategory({ name: "" })
    } catch (error) {
      console.error("Error creating category:", error)
      setError("Failed to create category. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleNewSubcategorySubmit = async (e) => {
    e.preventDefault()
    if (!newSubcategory.name.trim() || !newSubcategory.categoryId) return

    try {
      setFormLoading(true)
      const response = await api.createSubcategory(newSubcategory.categoryId, { name: newSubcategory.name })

      // Update the categories state with the new subcategory
      setCategories(
        categories.map((cat) => {
          if (cat._id === newSubcategory.categoryId) {
            return {
              ...cat,
              subcategories: [...(cat.subcategories || []), response.data],
            }
          }
          return cat
        }),
      )

      setNewSubcategory({ name: "", categoryId: "" })
    } catch (error) {
      console.error("Error creating subcategory:", error)
      setError("Failed to create subcategory. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditCategorySubmit = async (e) => {
    e.preventDefault()
    if (!editingCategory || !editingCategory.name.trim()) return

    try {
      setFormLoading(true)
      await api.updateCategory(editingCategory._id, { name: editingCategory.name })

      // Update the categories state
      setCategories(
        categories.map((cat) => {
          if (cat._id === editingCategory._id) {
            return { ...cat, name: editingCategory.name }
          }
          return cat
        }),
      )

      setEditingCategory(null)
    } catch (error) {
      console.error("Error updating category:", error)
      setError("Failed to update category. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditSubcategorySubmit = async (e) => {
    e.preventDefault()
    if (!editingSubcategory || !editingSubcategory.name.trim()) return

    try {
      setFormLoading(true)
      await api.updateSubcategory(editingSubcategory.categoryId, editingSubcategory._id, {
        name: editingSubcategory.name,
      })

      // Update the categories state
      setCategories(
        categories.map((cat) => {
          if (cat._id === editingSubcategory.categoryId) {
            return {
              ...cat,
              subcategories: cat.subcategories.map((sub) => {
                if (sub._id === editingSubcategory._id) {
                  return { ...sub, name: editingSubcategory.name }
                }
                return sub
              }),
            }
          }
          return cat
        }),
      )

      setEditingSubcategory(null)
    } catch (error) {
      console.error("Error updating subcategory:", error)
      setError("Failed to update subcategory. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteClick = (type, id, parentId = null) => {
    setDeleteType(type)
    setDeleteId(id)
    setDeleteParentId(parentId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      setFormLoading(true)

      if (deleteType === "category") {
        await api.deleteCategory(deleteId)
        setCategories(categories.filter((cat) => cat._id !== deleteId))
      } else if (deleteType === "subcategory" && deleteParentId) {
        await api.deleteSubcategory(deleteParentId, deleteId)

        // Update the categories state
        setCategories(
          categories.map((cat) => {
            if (cat._id === deleteParentId) {
              return {
                ...cat,
                subcategories: cat.subcategories.filter((sub) => sub._id !== deleteId),
              }
            }
            return cat
          }),
        )
      }

      setShowDeleteModal(false)
    } catch (error) {
      console.error("Error deleting:", error)
      setError(`Failed to delete ${deleteType}. Please try again.`)
    } finally {
      setFormLoading(false)
      setDeleteType(null)
      setDeleteId(null)
      setDeleteParentId(null)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, id, type, parentId = null) => {
    setDraggedItem({ id, parentId })
    setDragType(type)

    // Add a visual effect
    if (type === "category" && categoryRefs.current[id]) {
      categoryRefs.current[id].classList.add("bg-blue-50")
    } else if (type === "subcategory" && subcategoryRefs.current[id]) {
      subcategoryRefs.current[id].classList.add("bg-blue-50")
    }
  }

  const handleDragEnd = () => {
    // Remove visual effects
    if (draggedItem) {
      if (dragType === "category" && categoryRefs.current[draggedItem.id]) {
        categoryRefs.current[draggedItem.id].classList.remove("bg-blue-50")
      } else if (dragType === "subcategory" && subcategoryRefs.current[draggedItem.id]) {
        subcategoryRefs.current[draggedItem.id].classList.remove("bg-blue-50")
      }
    }

    setDraggedItem(null)
    setDragOverItem(null)
    setDragType(null)
  }

  const handleDragOver = (e, id, type, parentId = null) => {
    e.preventDefault()
    if (!draggedItem) return

    // Don't allow dropping on itself
    if (draggedItem.id === id && dragType === type) return

    // For subcategories, don't allow dropping on items in different categories
    if (dragType === "subcategory" && type === "subcategory" && draggedItem.parentId !== parentId) return

    setDragOverItem({ id, parentId })

    // Add visual effect to drop target
    if (type === "category" && categoryRefs.current[id]) {
      categoryRefs.current[id].classList.add("bg-gray-100")
    } else if (type === "subcategory" && subcategoryRefs.current[id]) {
      subcategoryRefs.current[id].classList.add("bg-gray-100")
    }
  }

  const handleDragLeave = (e, id, type) => {
    // Remove visual effect
    if (type === "category" && categoryRefs.current[id]) {
      categoryRefs.current[id].classList.remove("bg-gray-100")
    } else if (type === "subcategory" && subcategoryRefs.current[id]) {
      subcategoryRefs.current[id].classList.remove("bg-gray-100")
    }
  }

  const handleDrop = async (e, id, type, parentId = null) => {
    e.preventDefault()
    if (!draggedItem) return

    // Remove visual effects
    if (type === "category" && categoryRefs.current[id]) {
      categoryRefs.current[id].classList.remove("bg-gray-100")
    } else if (type === "subcategory" && subcategoryRefs.current[id]) {
      subcategoryRefs.current[id].classList.remove("bg-gray-100")
    }

    // Handle category reordering
    if (dragType === "category" && type === "category" && draggedItem.id !== id) {
      // Reorder categories
      const reorderedCategories = [...categories]
      const draggedIndex = reorderedCategories.findIndex((cat) => cat._id === draggedItem.id)
      const dropIndex = reorderedCategories.findIndex((cat) => cat._id === id)

      if (draggedIndex !== -1 && dropIndex !== -1) {
        const [removed] = reorderedCategories.splice(draggedIndex, 1)
        reorderedCategories.splice(dropIndex, 0, removed)
        setCategories(reorderedCategories)

        // Update the order in the backend
        const categoryIds = reorderedCategories.map((cat) => cat._id)
        try {
          await api.reorderCategories(categoryIds)
        } catch (error) {
          console.error("Error reordering categories:", error)
          setError("Failed to update category order. Please try again.")
          // Revert to original order if the API call fails
          fetchCategories()
        }
      }
    }

    // Handle subcategory reordering within the same category
    else if (
      dragType === "subcategory" &&
      type === "subcategory" &&
      draggedItem.parentId === parentId &&
      draggedItem.id !== id
    ) {
      const updatedCategories = categories.map((cat) => {
        if (cat._id === parentId) {
          const reorderedSubcategories = [...cat.subcategories]
          const draggedIndex = reorderedSubcategories.findIndex((sub) => sub._id === draggedItem.id)
          const dropIndex = reorderedSubcategories.findIndex((sub) => sub._id === id)

          if (draggedIndex !== -1 && dropIndex !== -1) {
            const [removed] = reorderedSubcategories.splice(draggedIndex, 1)
            reorderedSubcategories.splice(dropIndex, 0, removed)

            // Update the order in the backend
            const subcategoryIds = reorderedSubcategories.map((sub) => sub._id)
            try {
              api.reorderSubcategories(parentId, subcategoryIds)
            } catch (error) {
              console.error("Error reordering subcategories:", error)
              setError("Failed to update subcategory order. Please try again.")
              // We'll continue with the UI update even if the API call fails
              // The next fetch will sync the UI with the backend
            }

            return { ...cat, subcategories: reorderedSubcategories }
          }
        }
        return cat
      })

      setCategories(updatedCategories)
    }

    // Handle moving a subcategory to a different category
    else if (dragType === "subcategory" && type === "category" && draggedItem.parentId !== id) {
      // Open the move confirmation modal
      setSubcategoryToMove({
        id: draggedItem.id,
        sourceId: draggedItem.parentId,
      })
      setTargetCategoryId(id)
      setMoveSubcategoryModal(true)
    }

    setDraggedItem(null)
    setDragOverItem(null)
    setDragType(null)
  }

  const confirmMoveSubcategory = async () => {
    if (!subcategoryToMove || !targetCategoryId) return

    try {
      setFormLoading(true)

      // Find the subcategory to move
      const sourceCategory = categories.find((cat) => cat._id === subcategoryToMove.sourceId)
      const subcategory = sourceCategory?.subcategories.find((sub) => sub._id === subcategoryToMove.id)

      if (!subcategory) {
        throw new Error("Subcategory not found")
      }

      // Call the API to move the subcategory
      await api.moveSubcategory(subcategoryToMove.sourceId, subcategoryToMove.id, targetCategoryId)

      // Update the local state
      const updatedCategories = categories.map((cat) => {
        // Remove from source category
        if (cat._id === subcategoryToMove.sourceId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter((sub) => sub._id !== subcategoryToMove.id),
          }
        }
        // Add to target category
        if (cat._id === targetCategoryId) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, { ...subcategory, category: targetCategoryId }],
          }
        }
        return cat
      })

      setCategories(updatedCategories)
    } catch (error) {
      console.error("Error moving subcategory:", error)
      setError("Failed to move subcategory. Please try again.")
    } finally {
      setFormLoading(false)
      setMoveSubcategoryModal(false)
      setSubcategoryToMove(null)
      setTargetCategoryId("")
    }
  }

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) => {
    const matchesCategory = category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const hasMatchingSubcategories = category.subcategories?.some((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    return matchesCategory || hasMatchingSubcategories
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8">Manage Categories</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Add Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Add New Category */}
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Add New Category</h2>
            <form onSubmit={handleNewCategorySubmit}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ name: e.target.value })}
                  className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-blue-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {formLoading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>

          {/* Add New Subcategory */}
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Add New Subcategory</h2>
            <form onSubmit={handleNewSubcategorySubmit}>
              <div className="mb-4">
                <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  id="parentCategory"
                  value={newSubcategory.categoryId}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                  className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  id="subcategoryName"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-blue-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {formLoading ? "Adding..." : "Add Subcategory"}
              </button>
            </form>
          </div>

          {/* Help Card */}
          <div className="bg-blue-50 p-3 sm:p-6 rounded-xl border border-blue-200">
            <h3 className="text-base sm:text-lg font-medium text-blue-800 mb-1 sm:mb-2">Tips</h3>
            <ul className="text-xs sm:text-sm text-blue-700 space-y-1 sm:space-y-2">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Drag and drop categories or subcategories to reorder them.</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Drag a subcategory onto a category to move it.</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Click the arrow icon to expand or collapse a category.</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Deleting a category will also delete all its subcategories.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Categories List */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 sm:pl-10 sm:pr-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <li
                    key={category._id}
                    ref={(el) => (categoryRefs.current[category._id] = el)}
                    className="p-0"
                    draggable
                    onDragStart={(e) => handleDragStart(e, category._id, "category")}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, category._id, "category")}
                    onDragLeave={(e) => handleDragLeave(e, category._id, "category")}
                    onDrop={(e) => handleDrop(e, category._id, "category")}
                  >
                    <div className="p-2 sm:p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleCategoryExpand(category._id)}
                            className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            <svg
                              className={`h-5 w-5 transform transition-transform ${expandedCategories[category._id] ? "rotate-90" : ""}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          {editingCategory && editingCategory._id === category._id ? (
                            <form onSubmit={handleEditCategorySubmit} className="flex-1">
                              <input
                                type="text"
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                                autoFocus
                              />
                              <div className="mt-2 flex space-x-2">
                                <button
                                  type="submit"
                                  disabled={formLoading}
                                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCategory(null)}
                                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-200 text-gray-800 text-xs sm:text-sm rounded-lg hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center flex-wrap">
                              <span className="mr-2">{category.name}</span>
                              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full ml-1 mt-1 sm:mt-0">
                                {category.subcategories?.length || 0} subcategories
                              </span>
                            </h3>
                          )}
                        </div>

                        {!editingCategory && (
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit category"
                            >
                              <svg
                                className="h-4 w-4 sm:h-5 sm:w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick("category", category._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete category"
                            >
                              <svg
                                className="h-4 w-4 sm:h-5 sm:w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Subcategories */}
                      {expandedCategories[category._id] &&
                        category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="ml-6 mt-2 space-y-2">
                            <div className="text-sm font-medium text-gray-500 mb-2">Subcategories</div>
                            <ul className="space-y-2">
                              {category.subcategories.map((subcategory) => (
                                <li
                                  key={subcategory._id}
                                  ref={(el) => (subcategoryRefs.current[subcategory._id] = el)}
                                  className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg"
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, subcategory._id, "subcategory", category._id)}
                                  onDragEnd={handleDragEnd}
                                  onDragOver={(e) => handleDragOver(e, subcategory._id, "subcategory", category._id)}
                                  onDragLeave={(e) => handleDragLeave(e, subcategory._id, "subcategory")}
                                  onDrop={(e) => handleDrop(e, subcategory._id, "subcategory", category._id)}
                                >
                                  {editingSubcategory && editingSubcategory._id === subcategory._id ? (
                                    <form onSubmit={handleEditSubcategorySubmit} className="flex-1 mr-4">
                                      <input
                                        type="text"
                                        value={editingSubcategory.name}
                                        onChange={(e) =>
                                          setEditingSubcategory({ ...editingSubcategory, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        autoFocus
                                      />
                                      <div className="mt-2 flex space-x-2">
                                        <button
                                          type="submit"
                                          disabled={formLoading}
                                          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditingCategory(null)}
                                          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-200 text-gray-800 text-xs sm:text-sm rounded-lg hover:bg-gray-300"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </form>
                                  ) : (
                                    <>
                                      <div className="flex items-center">
                                        <svg
                                          className="h-4 w-4 text-gray-400 mr-2"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                          />
                                        </svg>
                                        <span>{subcategory.name}</span>
                                      </div>

                                      <div className="flex space-x-1 sm:space-x-2">
                                        <button
                                          onClick={() =>
                                            setEditingSubcategory({ ...subcategory, categoryId: category._id })
                                          }
                                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                                          title="Edit subcategory"
                                        >
                                          <svg
                                            className="h-4 w-4 sm:h-5 sm:w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteClick("subcategory", subcategory._id, category._id)
                                          }
                                          className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
                                          title="Delete subcategory"
                                        >
                                          <svg
                                            className="h-4 w-4 sm:h-5 sm:w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-md text-center">
              <svg
                className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                {searchTerm ? "No matching categories found" : "No categories found"}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">
                {searchTerm
                  ? "Try adjusting your search term or clear it to see all categories."
                  : "Add a category to get started with organizing your products."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md mx-auto shadow-xl w-[90%] sm:w-auto">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">Confirm Delete</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
              {deleteType === "category" && " All subcategories will also be deleted."}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={formLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={formLoading}
              >
                {formLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Subcategory Modal */}
      {moveSubcategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md mx-auto shadow-xl w-[90%] sm:w-auto">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">Move Subcategory</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Are you sure you want to move this subcategory to a different category? This will also update any products
              using this subcategory.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Category</label>
              <select
                value={targetCategoryId}
                onChange={(e) => setTargetCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={formLoading}
              >
                <option value="">Select Target Category</option>
                {categories.map(
                  (category) =>
                    subcategoryToMove &&
                    category._id !== subcategoryToMove.sourceId && (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ),
                )}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setMoveSubcategoryModal(false)
                  setSubcategoryToMove(null)
                  setTargetCategoryId("")
                }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={formLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmMoveSubcategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={formLoading || !targetCategoryId}
              >
                {formLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Moving...
                  </span>
                ) : (
                  "Move Subcategory"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories

