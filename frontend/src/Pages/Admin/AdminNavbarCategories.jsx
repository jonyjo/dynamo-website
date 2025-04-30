"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import api from "../../Services/api"

function AdminNavbarCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const categoryRefs = useRef({})

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.getCategories()

      // Sort categories: first navbar categories by navbarOrder, then others
      const sortedCategories = [...response.data].sort((a, b) => {
        // If both are in navbar, sort by navbarOrder
        if (a.showInNavbar && b.showInNavbar) {
          return (a.navbarOrder || 0) - (b.navbarOrder || 0)
        }
        // If only a is in navbar, a comes first
        if (a.showInNavbar) return -1
        // If only b is in navbar, b comes first
        if (b.showInNavbar) return 1
        // If neither is in navbar, sort by name
        return a.name.localeCompare(b.name)
      })

      setCategories(sortedCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleNavbarVisibility = async (categoryId, currentStatus) => {
    try {
      setFormLoading(true)
      await api.put(`/categories/${categoryId}/navbar`, { showInNavbar: !currentStatus })

      // Update local state
      setCategories(categories.map((cat) => (cat._id === categoryId ? { ...cat, showInNavbar: !currentStatus } : cat)))

      setSuccess(`Category ${!currentStatus ? "added to" : "removed from"} navbar successfully`)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error("Error updating navbar visibility:", error)
      setError("Failed to update navbar visibility. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, id) => {
    setDraggedItem(id)

    // Add visual effect
    if (categoryRefs.current[id]) {
      categoryRefs.current[id].classList.add("bg-blue-50")
    }
  }

  const handleDragEnd = () => {
    // Remove visual effects
    if (draggedItem && categoryRefs.current[draggedItem]) {
      categoryRefs.current[draggedItem].classList.remove("bg-blue-50")
    }

    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDragOver = (e, id) => {
    e.preventDefault()
    if (!draggedItem) return

    // Don't allow dropping on itself
    if (draggedItem === id) return

    // Only allow reordering for navbar categories
    const draggedCategory = categories.find((cat) => cat._id === draggedItem)
    const targetCategory = categories.find((cat) => cat._id === id)

    if (!draggedCategory?.showInNavbar || !targetCategory?.showInNavbar) return

    setDragOverItem(id)

    // Add visual effect to drop target
    if (categoryRefs.current[id]) {
      categoryRefs.current[id].classList.add("bg-gray-100")
    }
  }

  const handleDragLeave = (e, id) => {
    // Remove visual effect
    if (categoryRefs.current[id]) {
      categoryRefs.current[id].classList.remove("bg-gray-100")
    }
  }

  const handleDrop = async (e, id) => {
    e.preventDefault()
    if (!draggedItem) return

    // Remove visual effects
    if (categoryRefs.current[id]) {
      categoryRefs.current[id].classList.remove("bg-gray-100")
    }

    // Only allow reordering for navbar categories
    const draggedCategory = categories.find((cat) => cat._id === draggedItem)
    const targetCategory = categories.find((cat) => cat._id === id)

    if (!draggedCategory?.showInNavbar || !targetCategory?.showInNavbar || draggedItem === id) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    // Get only navbar categories and reorder them
    const navbarCategories = categories.filter((cat) => cat.showInNavbar)
    const draggedIndex = navbarCategories.findIndex((cat) => cat._id === draggedItem)
    const dropIndex = navbarCategories.findIndex((cat) => cat._id === id)

    if (draggedIndex !== -1 && dropIndex !== -1) {
      const reorderedNavbarCategories = [...navbarCategories]
      const [removed] = reorderedNavbarCategories.splice(draggedIndex, 1)
      reorderedNavbarCategories.splice(dropIndex, 0, removed)

      // Update the local state first for immediate feedback
      const updatedCategories = [...categories]
      reorderedNavbarCategories.forEach((cat, index) => {
        const catIndex = updatedCategories.findIndex((c) => c._id === cat._id)
        if (catIndex !== -1) {
          updatedCategories[catIndex] = { ...updatedCategories[catIndex], navbarOrder: index + 1 }
        }
      })

      setCategories(updatedCategories)

      // Update the order in the backend
      try {
        setFormLoading(true)
        const categoryIds = reorderedNavbarCategories.map((cat) => cat._id)
        await api.reorderNavbarCategories(categoryIds)
        setSuccess("Navbar categories reordered successfully")

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } catch (error) {
        console.error("Error reordering navbar categories:", error)
        setError("Failed to update navbar order. Please try again.")
        // Revert to original order if the API call fails
        fetchCategories()
      } finally {
        setFormLoading(false)
      }
    }

    setDraggedItem(null)
    setDragOverItem(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Separate categories into navbar and non-navbar
  const navbarCategories = categories.filter((cat) => cat.showInNavbar)
  const otherCategories = categories.filter((cat) => !cat.showInNavbar)

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Navbar Categories</h1>
        <Link
          to="/admin/categories"
          className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Categories
        </Link>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Navbar Categories */}
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Categories in Navbar</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Drag and drop to reorder. These categories will appear in the navigation bar.
              </p>
            </div>

            {navbarCategories.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {navbarCategories.map((category) => (
                  <li
                    key={category._id}
                    ref={(el) => (categoryRefs.current[category._id] = el)}
                    className="p-2 sm:p-4 hover:bg-gray-50 transition-colors duration-150 cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, category._id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, category._id)}
                    onDragLeave={(e) => handleDragLeave(e, category._id)}
                    onDrop={(e) => handleDrop(e, category._id)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center flex-wrap">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                        <span className="text-gray-900 font-medium text-sm sm:text-base mr-1">{category.name}</span>
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                          {category.navbarOrder || 0}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleNavbarVisibility(category._id, category.showInNavbar)}
                        disabled={formLoading}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs sm:text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 sm:p-6 text-center text-gray-500 text-sm sm:text-base">
                No categories in navbar. Add some from the list below.
              </div>
            )}
          </div>

          <div className="mt-3 sm:mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400"
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
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="text-xs sm:text-sm text-yellow-700">
                  For best results, limit the navbar to 5 categories to avoid overcrowding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Categories */}
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Available Categories</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Add these categories to the navbar by clicking "Add to Navbar".
              </p>
            </div>

            {otherCategories.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {otherCategories.map((category) => (
                  <li key={category._id} className="p-2 sm:p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 text-sm sm:text-base">{category.name}</span>
                      <button
                        onClick={() => toggleNavbarVisibility(category._id, category.showInNavbar)}
                        disabled={formLoading}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs sm:text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 sm:p-6 text-center text-gray-500 text-sm sm:text-base">
                All categories are already in the navbar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNavbarCategories

