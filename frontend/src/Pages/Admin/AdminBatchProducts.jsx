"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../Services/api"

function AdminBatchProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [batchAction, setBatchAction] = useState("")
  const [batchCategory, setBatchCategory] = useState("")
  const [batchSubcategory, setBatchSubcategory] = useState("")
  const [subcategories, setSubcategories] = useState([])
  const [batchDiscount, setBatchDiscount] = useState("")
  const [batchStatus, setBatchStatus] = useState("")
  const [batchLoading, setBatchLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const APP_IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    fetchData()
  }, [currentPage, itemsPerPage, sortBy, filterCategory, filterStatus, searchTerm])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Prepare query parameters
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      }

      // Add sorting
      switch (sortBy) {
        case "price-low":
          params.sort = "price"
          break
        case "price-high":
          params.sort = "-price"
          break
        case "name-asc":
          params.sort = "name"
          break
        case "name-desc":
          params.sort = "-name"
          break
        case "newest":
        default:
          params.sort = "-createdAt"
          break
      }

      // Add filters
      if (filterCategory) params.category = filterCategory
      if (filterStatus) params.status = filterStatus
      if (searchTerm) params.keyword = searchTerm

      // Fetch products and categories in parallel
      const [productsRes, categoriesRes] = await Promise.all([api.getProducts(params), api.getCategories()])

      setProducts(productsRes.data.products)
      setTotalPages(productsRes.data.pages || 1)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((product) => product._id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
      setSelectAll(false)
    } else {
      setSelectedProducts([...selectedProducts, productId])
      if (selectedProducts.length + 1 === products.length) {
        setSelectAll(true)
      }
    }
  }

  const openBatchModal = (action) => {
    if (selectedProducts.length === 0) {
      setError("Please select at least one product")
      return
    }

    setBatchAction(action)
    setShowBatchModal(true)
  }

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value
    setBatchCategory(categoryId)

    // Reset subcategory when category changes
    setBatchSubcategory("")

    // Load subcategories for the selected category
    if (categoryId) {
      const category = categories.find((cat) => cat._id === categoryId)
      setSubcategories(category?.subcategories || [])
    } else {
      setSubcategories([])
    }
  }

  const executeBatchAction = async () => {
    if (selectedProducts.length === 0) return

    try {
      setBatchLoading(true)

      let updates = {}
      let successMessage = ""

      switch (batchAction) {
        case "category":
          if (!batchCategory) {
            setError("Please select a category")
            setBatchLoading(false)
            return
          }
          updates = {
            category: batchCategory,
            subcategory: batchSubcategory || null,
          }
          successMessage = "Categories updated successfully"
          break

        case "discount":
          if (
            batchDiscount === "" ||
            isNaN(Number(batchDiscount)) ||
            Number(batchDiscount) < 0 ||
            Number(batchDiscount) > 100
          ) {
            setError("Please enter a valid discount percentage (0-100)")
            setBatchLoading(false)
            return
          }
          updates = { discount: Number(batchDiscount) }
          successMessage = "Discounts updated successfully"
          break

        case "status":
          if (!batchStatus) {
            setError("Please select a status")
            setBatchLoading(false)
            return
          }
          // Only update the status field, don't touch discount
          updates = { status: batchStatus }
          successMessage = "Status updated successfully"
          break

        case "delete":
          // Handle deletion separately
          await Promise.all(selectedProducts.map((id) => api.deleteProduct(id)))
          setProducts(products.filter((product) => !selectedProducts.includes(product._id)))
          setSelectedProducts([])
          setSelectAll(false)
          setShowBatchModal(false)
          setBatchLoading(false)
          return

        default:
          setError("Invalid action")
          setBatchLoading(false)
          return
      }

      // Update all selected products
      await Promise.all(selectedProducts.map((id) => api.updateProduct(id, updates)))

      // Refresh the product list
      fetchData()

      // Reset state
      setShowBatchModal(false)
      setSelectedProducts([])
      setSelectAll(false)
    } catch (error) {
      console.error("Error performing batch action:", error)
      setError("Failed to perform batch action. Please try again.")
    } finally {
      setBatchLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Batch Products</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="hidden sm:inline">Add New Product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow text-sm font-medium text-gray-700"
        >
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters & Sort
          </div>
          <svg
            className={`h-5 w-5 transform ${showMobileFilters ? "rotate-180" : ""} transition-transform`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mb-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-sm text-red-700 font-medium hover:text-red-800 mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`bg-white rounded-lg shadow p-3 sm:p-4 mb-4 ${!showMobileFilters && "hidden sm:block"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3">
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Batch Actions - Icon Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openBatchModal("category")}
            disabled={selectedProducts.length === 0}
            className="inline-flex items-center p-2 border border-gray-300 shadow-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Update Category"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="sr-only sm:not-sr-only sm:ml-2 sm:text-xs">Update Category</span>
          </button>

          <button
            onClick={() => openBatchModal("discount")}
            disabled={selectedProducts.length === 0}
            className="inline-flex items-center p-2 border border-gray-300 shadow-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Set Discount"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="sr-only sm:not-sr-only sm:ml-2 sm:text-xs">Set Discount</span>
          </button>

          <button
            onClick={() => openBatchModal("status")}
            disabled={selectedProducts.length === 0}
            className="inline-flex items-center p-2 border border-gray-300 shadow-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Update Status"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
              />
            </svg>
            <span className="sr-only sm:not-sr-only sm:ml-2 sm:text-xs">Update Status</span>
          </button>

          <button
            onClick={() => openBatchModal("delete")}
            disabled={selectedProducts.length === 0}
            className="inline-flex items-center p-2 border border-red-300 shadow-sm rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Selected"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="sr-only sm:not-sr-only sm:ml-2 sm:text-xs">Delete Selected</span>
          </button>
        </div>
      </div>

      {/* Products List - Mobile Cards */}
      <div className="block sm:hidden">
        {products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleSelectProduct(product._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <div className="flex items-center flex-1 min-w-0">
                    <img
                      className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                      src={`${APP_IMAGE_URL}${product.image}` || "https://via.placeholder.com/100"}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://via.placeholder.com/100"
                      }}
                    />
                    <div className="ml-2 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{product.sku || "No SKU"}</p>
                    </div>
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="ml-2 p-1.5 text-blue-600 hover:text-blue-900 bg-blue-50 rounded-full"
                      aria-label="Edit Product"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-gray-100">
                  <div className="bg-white p-2">
                    <p className="text-xs text-gray-500">Price</p>
                    <div className="flex items-baseline">
                      <span className="font-medium text-red-600 text-sm">
                        ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-1 truncate">
                          ₹{product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-2">
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm truncate">{product.category?.name || "Uncategorized"}</p>
                  </div>

                  <div className="bg-white p-2">
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium 
                ${
                  product.status === "active"
                    ? "bg-green-100 text-green-800"
                    : product.status === "featured"
                      ? "bg-purple-100 text-purple-800"
                      : product.status === "draft"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                }`}
                    >
                      {product.status || "Active"}
                    </span>
                  </div>

                  <div className="bg-white p-2">
                    <p className="text-xs text-gray-500">Stock</p>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium 
                ${product.countInStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {product.countInStock > 0 ? `${product.countInStock}` : "Out"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                Loading products...
              </div>
            ) : (
              "No products found matching your criteria"
            )}
          </div>
        )}
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden sm:block bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={`${APP_IMAGE_URL}${product.image}` || "https://via.placeholder.com/100"}
                            alt={product.name}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "https://via.placeholder.com/100"
                            }}
                          />
                        </div>
                        <div className="ml-2 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{product.sku || "No SKU"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        {product.category?.name || "Uncategorized"}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{product.subcategory?.name || ""}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {product.discount > 0 ? (
                        <div>
                          <div className="text-sm font-medium text-red-600">
                            ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 line-through">₹{product.price.toFixed(2)}</div>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "featured"
                              ? "bg-purple-100 text-purple-800"
                              : product.status === "draft"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status || "Active"}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.countInStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {product.countInStock > 0 ? `${product.countInStock}` : "Out"}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label="Edit Product"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                        Loading products...
                      </div>
                    ) : (
                      "No products found matching your criteria"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 mt-4 rounded-lg shadow">
          <div className="flex items-center mb-3 sm:mb-0">
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="hidden sm:inline">Showing </span>
              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
              <span className="hidden sm:inline"> to </span>
              <span className="sm:hidden">-</span>
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, (totalPages - 1) * itemsPerPage + products.length)}
              </span>
              <span className="hidden sm:inline"> of </span>
              <span className="sm:hidden">/</span>
              <span className="font-medium">{totalPages * itemsPerPage}</span>
            </p>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="ml-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 py-1"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 sm:px-3 sm:py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="hidden sm:flex">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border text-sm font-medium ${
                      currentPage === pageNum
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-3 py-1 text-gray-700">...</span>}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`px-3 py-1 border text-sm font-medium ${
                    currentPage === totalPages
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <div className="flex items-center sm:hidden">
              <span className="px-2 text-sm text-gray-700">
                {currentPage} / {totalPages}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 sm:px-3 sm:py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="hidden sm:inline">Next</span>
            </button>
          </div>
        </div>
      )}

      {/* Batch Action Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {batchAction === "category"
                  ? "Update Category"
                  : batchAction === "discount"
                    ? "Set Discount"
                    : batchAction === "status"
                      ? "Update Status"
                      : "Confirm Delete"}
              </h3>
              <button onClick={() => setShowBatchModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {batchAction === "category" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="batchCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="batchCategory"
                    value={batchCategory}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {batchCategory && subcategories.length > 0 && (
                  <div>
                    <label htmlFor="batchSubcategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory (Optional)
                    </label>
                    <select
                      id="batchSubcategory"
                      value={batchSubcategory}
                      onChange={(e) => setBatchSubcategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">None</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {batchAction === "discount" && (
              <div>
                <label htmlFor="batchDiscount" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage (0-100)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="batchDiscount"
                    value={batchDiscount}
                    onChange={(e) => setBatchDiscount(e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full pr-12 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">Set to 0 to remove discount</p>
              </div>
            )}

            {batchAction === "status" && (
              <div>
                <label htmlFor="batchStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="batchStatus"
                  value={batchStatus}
                  onChange={(e) => setBatchStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="featured">Featured</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            )}

            {batchAction === "delete" && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Are you sure you want to delete {selectedProducts.length} selected product(s)? This action cannot
                      be undone.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={batchLoading}
              >
                Cancel
              </button>
              <button
                onClick={executeBatchAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  batchAction === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={batchLoading}
              >
                {batchLoading ? (
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
                    Processing...
                  </span>
                ) : batchAction === "category" ? (
                  "Update Category"
                ) : batchAction === "discount" ? (
                  "Set Discount"
                ) : batchAction === "status" ? (
                  "Update Status"
                ) : (
                  "Delete Products"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <div className="sm:hidden fixed bottom-6 right-6 z-10">
        <Link
          to="/admin/products/new"
          className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Add New Product"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default AdminBatchProducts
