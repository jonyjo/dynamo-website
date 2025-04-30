"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import api from "../Services/api"
import ProductCard from "../Components/ProductCard"
import { Link } from "react-router-dom"

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get("subcategory") || null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")
  const [totalProducts, setTotalProducts] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState(localStorage.getItem("productViewMode") || "grid")
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  })
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const navigate = useNavigate()
  const APP_IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL
  
  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem("productViewMode", viewMode)
  }, [viewMode])

  // Update state when URL params change
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const subcategoryParam = searchParams.get("subcategory")
    const sortParam = searchParams.get("sort")
    const minPriceParam = searchParams.get("minPrice")
    const maxPriceParam = searchParams.get("maxPrice")

    // Only update if different to avoid infinite loops
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam || null)
    }

    if (subcategoryParam !== selectedSubcategory) {
      setSelectedSubcategory(subcategoryParam || null)
    }

    if (sortParam && sortParam !== sortBy) {
      setSortBy(sortParam)
    }

    if (minPriceParam !== priceRange.min || maxPriceParam !== priceRange.max) {
      setPriceRange({
        min: minPriceParam || "",
        max: maxPriceParam || "",
      })
    }
  }, [searchParams])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories()
        setCategories(response.data)

        // If we have a selected category, find its name
        if (selectedCategory) {
          const category = response.data.find((cat) => cat._id === selectedCategory)
          if (category) {
            setCurrentCategory(category.name)
            console.log(`Found category: ${category.name} with ID: ${category._id}`)
          } else {
            console.log(`Category with ID ${selectedCategory} not found`)
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [selectedCategory])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {
          limit: 100, // Increase limit to get more products
        }
        if (selectedCategory) params.category = selectedCategory
        if (selectedSubcategory) params.subcategory = selectedSubcategory
        if (priceRange.min) params.minPrice = priceRange.min
        if (priceRange.max) params.maxPrice = priceRange.max

        // Add sorting
        switch (sortBy) {
          case "price-low":
            params.sort = "price"
            break
          case "price-high":
            params.sort = "-price"
            break
          case "newest":
          default:
            params.sort = "-createdAt"
            break
        }

        console.log("Fetching products with params:", params)
        const response = await api.getProducts(params)
        setProducts(response.data.products)
        setTotalProducts(response.data.total || response.data.products.length)

        // Check if any filters are applied
        setIsFilterApplied(!!selectedCategory || !!selectedSubcategory || !!priceRange.min || !!priceRange.max)

        setIsInitialLoad(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setIsInitialLoad(false)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    // Update URL search params
    const params = new URLSearchParams()
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedSubcategory) params.set("subcategory", selectedSubcategory)
    if (sortBy) params.set("sort", sortBy)
    if (priceRange.min) params.set("minPrice", priceRange.min)
    if (priceRange.max) params.set("maxPrice", priceRange.max)
    setSearchParams(params)
  }, [selectedCategory, selectedSubcategory, sortBy, priceRange, setSearchParams])

  // Get the current subcategory name if selected
  const getCurrentSubcategoryName = () => {
    if (!selectedSubcategory) return null

    const category = categories.find((cat) => cat._id === selectedCategory)
    if (!category) return null

    const subcategory = category.subcategories.find((sub) => sub._id === selectedSubcategory)
    return subcategory ? subcategory.name : null
  }

  const subcategoryName = getCurrentSubcategoryName()

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setPriceRange({ min: "", max: "" })
    setSortBy("newest")

    // Clear URL params
    navigate("/products")
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value || null
    setSelectedCategory(value)
    setSelectedSubcategory(null) // Reset subcategory when category changes

    // Update URL directly
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("category", value)
    } else {
      params.delete("category")
    }
    params.delete("subcategory") // Remove subcategory when category changes
    setSearchParams(params)
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header with breadcrumbs */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
          <a href="/" className="hover:text-blue-600 transition-colors">
            Home
          </a>
          <svg className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-gray-700">Products</span>
          {currentCategory && (
            <>
              <svg className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-700">{currentCategory}</span>
            </>
          )}
          {subcategoryName && (
            <>
              <svg className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-700">{subcategoryName}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1">
              {currentCategory ? currentCategory : "All Products"}
              {subcategoryName && ` - ${subcategoryName}`}
            </h1>
            <p className="text-sm text-gray-600">
              {subcategoryName
                ? `Browse our selection of ${subcategoryName} ${currentCategory}`
                : currentCategory
                  ? `Explore our range of ${currentCategory} from top brands`
                  : "Discover our complete collection of electronics and home appliances"}
            </p>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                aria-label="Grid view"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                aria-label="List view"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="lg:hidden">
              <button
                onClick={toggleFilters}
                className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {showFilters ? "Hide Filters" : "Filters"}
                {isFilterApplied && (
                  <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                    ✓
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center text-xs sm:text-sm text-gray-500">
          <span className="font-medium text-gray-700 mr-1">{totalProducts}</span>
          {totalProducts === 1 ? "product" : "products"} found
          {isFilterApplied && (
            <button onClick={clearFilters} className="ml-3 flex items-center text-blue-600 hover:text-blue-800">
              <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar with filters - conditionally shown on mobile */}
        <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-6 space-y-4 sm:space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Filters</h3>
                {isFilterApplied && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={selectedCategory || ""}
                      onChange={handleCategoryChange}
                      className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {selectedCategory &&
                  categories.find((cat) => cat._id === selectedCategory)?.subcategories.length > 0 && (
                    <div>
                      <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <div className="relative">
                        <select
                          id="subcategory"
                          value={selectedSubcategory || ""}
                          onChange={(e) => setSelectedSubcategory(e.target.value || null)}
                          className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none text-sm"
                        >
                          <option value="">All Brands</option>
                          {categories
                            .find((cat) => cat._id === selectedCategory)
                            ?.subcategories.map((subcategory) => (
                              <option key={subcategory._id} value={subcategory._id}>
                                {subcategory.name}
                              </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                <div>
                  <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range (₹)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        id="min-price"
                        name="min"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={handlePriceRangeChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        id="max-price"
                        name="max"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={handlePriceRangeChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Brands */}
            {selectedCategory && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Popular Brands</h3>
                <div className="space-y-2">
                  {categories
                    .find((cat) => cat._id === selectedCategory)
                    ?.subcategories.slice(0, 5)
                    .map((brand) => (
                      <div key={brand._id} className="flex items-center">
                        <button
                          onClick={() => setSelectedSubcategory(brand._id)}
                          className={`text-sm hover:text-blue-600 transition-colors flex items-center ${
                            selectedSubcategory === brand._id ? "font-bold text-blue-600" : "text-gray-700"
                          }`}
                        >
                          {selectedSubcategory === brand._id && (
                            <svg className="h-3 w-3 mr-1.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {brand.name}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mt-0.5 mr-2"
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
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Need Help?</h4>
                  <p className="text-xs text-blue-700">
                    Contact our support team for assistance with your order or product questions.
                  </p>
                  <a
                    href="/contact"
                    className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Contact Support
                    <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-sm text-gray-500">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <Link to={`/products/${product._id}`} className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="w-full sm:w-1/4 aspect-[4/3] sm:aspect-square relative">
                          <img
                            src={`${APP_IMAGE_URL}${product.image}` || "https://via.placeholder.com/300"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "https://via.placeholder.com/300"
                            }}
                          />

                          {/* Badges */}
                          <div className="absolute top-0 left-0 p-1.5 sm:p-2 flex flex-col gap-1">
                            {product.discount > 0 && (
                              <div className="bg-red-500 text-white text-[10px] xs:text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                {product.discount}% OFF
                              </div>
                            )}
                          </div>

                          {product.countInStock === 0 && (
                            <div className="absolute top-0 right-0 p-1.5">
                              <div className="bg-gray-800 text-white text-[10px] xs:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                Out of Stock
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 sm:p-4 flex-1 flex flex-col">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {product.category && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                                {product.category.name}
                              </span>
                            )}
                            {product.subcategory && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                                {product.subcategory.name}
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{product.name}</h3>

                          <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-grow">{product.description}</p>

                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                            {/* Price */}
                            <div className="flex flex-col">
                              {product.discount > 0 ? (
                                <>
                                  <span className="text-sm sm:text-base font-bold text-red-600">
                                    ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-gray-500 line-through">
                                    ₹{product.price.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm sm:text-base font-bold text-gray-900">
                                  ₹{product.price.toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Order Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Format WhatsApp message
                                const discountedPrice =
                                  product.discount > 0 ? product.price * (1 - product.discount / 100) : null
                                const finalPrice = discountedPrice || product.price
                                const whatsappMessage = encodeURIComponent(`Hello, I would like to order:

                                                        *${product.name}*
                                                        Price: ₹${finalPrice.toFixed(2)}
                                                        ${product.discount > 0 ? `Discount: ${product.discount}% OFF` : ""}
                                                        SKU: ${product.sku || "N/A"}

                                                        Thank you!`)
                                const whatsappNumber = "1234567890"
                                window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank")
                              }}
                              className="inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium"
                              disabled={product.countInStock === 0}
                            >
                              <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.32-4.962c0-5.42 4.409-9.832 9.829-9.832a9.829 9.829 0 019.829 9.832 9.87 9.87 0 01-9.829 9.832z" />
                              </svg>
                              Order
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500">Try changing your filter criteria</p>
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage

