"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../Services/api"

function ProductForm({ product = null, isEdit = false }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const multipleFileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState("basic")
  const APP_IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    countInStock: "",
    image: "",
    images: [],
    sku: "",
    features: [""],
    specifications: [{ name: "", value: "" }],
    discount: "",
    status: "active",
    tags: "",
  })

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imagesPreviews, setImagesPreviews] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isDirty, setIsDirty] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories()
        setCategories(response.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories. Please try again.")
      }
    }

    fetchCategories()

    // If editing, populate form with product data
    if (isEdit && product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category?._id || product.category || "",
        subcategory: product.subcategory?._id || product.subcategory || "",
        countInStock: product.countInStock || "",
        image: product.image || "",
        images: product.images || [],
        sku: product.sku || "",
        features: product.features?.length ? product.features : [""],
        specifications: product.specifications?.length ? product.specifications : [{ name: "", value: "" }],
        discount: product.discount || "",
        status: product.status || "active",
        tags: product.tags ? product.tags.join(", ") : "",
      })

      // Set image preview if product has an image
      if (product.image) {
        setImagePreview(product.image)
      }

      // Set images previews if product has additional images
      if (product.images && product.images.length > 0) {
        setImagesPreviews(product.images)
      }

      // Load subcategories if category is selected
      if (product.category) {
        loadSubcategories(product.category._id || product.category)
      }
    }
  }, [isEdit, product])

  const loadSubcategories = async (categoryId) => {
    try {
      // Find the category in our local state
      const category = categories.find((cat) => cat._id === categoryId)

      // If we have the subcategories in our local state, use them
      if (category && category.subcategories) {
        setSubcategories(category.subcategories)
      } else {
        // Otherwise, fetch them from the API
        const response = await api.getCategory(categoryId)
        if (response.data && response.data.subcategories) {
          setSubcategories(response.data.subcategories)
        } else {
          setSubcategories([])
        }
      }
    } catch (error) {
      console.error("Error loading subcategories:", error)
      setSubcategories([])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setIsDirty(true)

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subcategory: "", // Reset subcategory when category changes
      }))
      loadSubcategories(value)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear validation error when field is changed
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }))
    setIsDirty(true)
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
    setIsDirty(true)
  }

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures.length ? updatedFeatures : [""],
    }))
    setIsDirty(true)
  }

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      specifications: updatedSpecs,
    }))
    setIsDirty(true)
  }

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }))
    setIsDirty(true)
  }

  const removeSpecification = (index) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      specifications: updatedSpecs.length ? updatedSpecs : [{ name: "", value: "" }],
    }))
    setIsDirty(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload the file
    setUploadLoading(true)
    setUploadError(null)
    setIsDirty(true)

    try {
      console.log("Uploading image:", file.name, "Type:", file.type)

      const formData = new FormData()
      formData.append("image", file)

      const response = await api.uploadImage(formData)

      // Extract only filename
      const imageUrl = response.data.imageUrl;
      const filename = imageUrl.split("/").pop();   // 👈 only filename

      setFormData((prev) => ({
        ...prev,
        image: filename,
      }));

      setUploadLoading(false)
    } catch (error) {
      console.error("Error uploading image:", error)

      let errorMessage = "Failed to upload image. Please try again."

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Authentication error. Please log in again."
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `Upload failed: ${error.response.data.message}`
        }
      }

      setUploadError(errorMessage)
      setUploadLoading(false)
    }
  }

  const handleMultipleImagesUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate files are images
    const invalidFiles = files.filter((file) => !file.type.startsWith("image/"))
    if (invalidFiles.length > 0) {
      setUploadError("Please select only image files")
      return
    }

    setUploadLoading(true)
    setUploadError(null)
    setIsDirty(true)

    try {
      // Upload each file and collect the URLs
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("image", file)
        const response = await api.uploadImage(formData)
        return response.data.imageUrl.split("/").pop();
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      // Create previews
      const readers = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      })

      const previewUrls = await Promise.all(readers)

      // Update state with new images
      setImagesPreviews((prev) => [...prev, ...previewUrls])
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }))

      setUploadLoading(false)
    } catch (error) {
      console.error("Error uploading images:", error)
      setUploadError("Failed to upload one or more images. Please try again.")
      setUploadLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      image: "",
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setIsDirty(true)
  }

  const handleRemoveAdditionalImage = (index) => {
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)

    const updatedPreviews = [...imagesPreviews]
    updatedPreviews.splice(index, 1)

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }))

    setImagesPreviews(updatedPreviews)
    setIsDirty(true)
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) errors.name = "Product name is required"
    if (!formData.price || isNaN(Number(formData.price))) errors.price = "Valid price is required"
    if (formData.price && Number(formData.price) <= 0) errors.price = "Price must be greater than zero"
    if (formData.countInStock && (isNaN(Number(formData.countInStock)) || Number(formData.countInStock) < 0)) {
      errors.countInStock = "Stock must be a non-negative number"
    }
    if (
      formData.discount &&
      (isNaN(Number(formData.discount)) || Number(formData.discount) < 0 || Number(formData.discount) > 100)
    ) {
      errors.discount = "Discount must be between 0 and 100"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0]
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    // Filter out empty features and specifications
    const filteredFeatures = formData.features.filter((feature) => feature.trim() !== "")
    const filteredSpecs = formData.specifications.filter((spec) => spec.name.trim() !== "" && spec.value.trim() !== "")

    // Parse tags
    const parsedTags = formData.tags
      ? formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : []

    // Prepare data for API
    const productData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      countInStock: formData.countInStock ? Number.parseInt(formData.countInStock, 10) : 0,
      features: filteredFeatures,
      specifications: filteredSpecs,
      // Ensure discount is properly parsed as a number, default to 0 if empty
      discount: formData.discount !== "" ? Number.parseFloat(formData.discount) : 0,
      tags: parsedTags,
      // Handle empty subcategory - send null instead of empty string
      subcategory: formData.subcategory || null,
      // Handle empty category - send null instead of empty string
      category: formData.category || null,
    }

    try {
      setLoading(true)
      console.log("Submitting product data:", productData)

      if (isEdit) {
        await api.updateProduct(product._id, productData)
      } else {
        await api.createProduct(productData)
      }

      navigate("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)

      let errorMessage = "Failed to save product. Please try again."

      // Extract more detailed error message if available
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `Error: ${error.response.data.message}`
        console.log("Detailed error:", error.response.data)
      }

      setError(errorMessage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setLoading(false)
    }
  }

  // Function to toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  // Calculate sale price if discount is applied
  const salePrice =
    formData.price && formData.discount ? (formData.price * (1 - formData.discount / 100)).toFixed(2) : null

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Compact Tabs with Icons */}
      <div className="border-b border-gray-200">
        <nav className="flex justify-around -mb-px">
          <button
            onClick={() => setActiveTab("basic")}
            className={`py-2 px-2 text-center border-b-2 font-medium text-xs flex flex-col items-center ${
              activeTab === "basic"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            title="Basic Information"
          >
            <svg className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden xs:block">Basic</span>
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`py-2 px-2 text-center border-b-2 font-medium text-xs flex flex-col items-center ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            title="Details & Specifications"
          >
            <svg className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="hidden xs:block">Details</span>
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`py-2 px-2 text-center border-b-2 font-medium text-xs flex flex-col items-center ${
              activeTab === "media"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            title="Media"
          >
            <svg className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="hidden xs:block">Media</span>
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`py-2 px-2 text-center border-b-2 font-medium text-xs flex flex-col items-center ${
              activeTab === "pricing"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            title="Pricing & Inventory"
          >
            <svg className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden xs:block">Pricing</span>
          </button>
        </nav>
      </div>

      {/* Compact Header with Preview Toggle */}
      <div className="bg-gray-50 px-2 py-1.5 flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h2>
        <button
          type="button"
          onClick={togglePreview}
          className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          {previewMode ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
          <span className="ml-1 hidden xs:inline">{previewMode ? "Edit" : "Preview"}</span>
        </button>
      </div>

      {/* Form or Preview */}
      {previewMode ? (
        // Product Preview - Compact Version
        <div className="p-2 sm:p-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border">
            <div className="flex flex-col xs:flex-row">
              <div className="w-full xs:w-1/3 bg-gray-50">
                <div className="h-40 w-full flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={`${APP_IMAGE_URL}${imagePreview}` || "/placeholder.svg"}
                      alt={formData.name}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="mt-1 text-xs">No image</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 w-full xs:w-2/3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {formData.category && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {categories.find((c) => c._id === formData.category)?.name || "Category"}
                    </span>
                  )}
                  {formData.subcategory && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                      {subcategories.find((s) => s._id === formData.subcategory)?.name || "Subcategory"}
                    </span>
                  )}
                </div>

                <h1 className="text-base font-bold text-gray-900 mb-1">{formData.name || "Product Name"}</h1>

                <div className="mb-2">
                  {salePrice ? (
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-red-600 mr-1">₹{salePrice}</span>
                      <span className="text-xs text-gray-500 line-through">₹{Number(formData.price).toFixed(2)}</span>
                      <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                        {formData.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-gray-900">₹{Number(formData.price || 0).toFixed(2)}</span>
                  )}
                </div>

                <div className="mb-2 text-xs text-gray-600 line-clamp-2">
                  {formData.description || "No description provided."}
                </div>

                {formData.sku && <div className="text-xs text-gray-500 mb-1">SKU: {formData.sku}</div>}
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={togglePreview}
              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Back to Editing
            </button>
          </div>
        </div>
      ) : (
        // Edit Form - Compact Version
        <form onSubmit={handleSubmit} className="p-2 sm:p-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-3 rounded text-xs">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information Tab - Compact */}
          {activeTab === "basic" && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center mb-1">
                  <svg className="h-3.5 w-3.5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                    Product Name *
                  </label>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <svg className="h-3.5 w-3.5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                    Description
                  </label>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center mb-1">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
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
                    <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                      Category
                    </label>
                  </div>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <label htmlFor="subcategory" className="block text-xs font-medium text-gray-700">
                      Brand
                    </label>
                  </div>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    disabled={!formData.category || subcategories.length === 0}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-xs"
                  >
                    <option value="">Select Brand</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center mb-1">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <label htmlFor="status" className="block text-xs font-medium text-gray-700">
                      Status
                    </label>
                  </div>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="featured">Featured</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    <label htmlFor="tags" className="block text-xs font-medium text-gray-700">
                      Tags (comma separated)
                    </label>
                  </div>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="electronics, gadget"
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Details & Specifications Tab - Compact */}
          {activeTab === "details" && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <label className="block text-xs font-medium text-gray-700">Key Features</label>
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center p-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex mb-1">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-1 py-1 bg-red-100 text-red-600 rounded-r-lg hover:bg-red-200 transition-colors"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <label className="block text-xs font-medium text-gray-700">Specifications</label>
                  </div>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="inline-flex items-center p-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex mb-1 space-x-1">
                    <input
                      type="text"
                      value={spec.name}
                      onChange={(e) => handleSpecificationChange(index, "name", e.target.value)}
                      className="w-1/3 px-2 py-1 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="px-1 py-1 bg-red-100 text-red-600 rounded-r-lg hover:bg-red-200 transition-colors"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Tab - Compact */}
          {activeTab === "media" && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center mb-1">
                  <svg className="h-3.5 w-3.5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <label className="block text-xs font-medium text-gray-700">Main Product Image</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="mt-1 flex justify-center px-2 pt-2 pb-2 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-6 w-6 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-xs text-gray-600 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
                    {uploadLoading && (
                      <div className="mt-1 flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-500 mr-1"></div>
                        <span className="text-xs text-gray-500">Uploading...</span>
                      </div>
                    )}
                  </div>

                  <div>
                    {imagePreview ? (
                      <div className="relative">
                        <div className="h-24 w-full border border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={`${APP_IMAGE_URL}${imagePreview}` || "/placeholder.svg"}
                            alt="Product preview"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 p-0.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <input type="hidden" name="image" value={formData.image} />
                      </div>
                    ) : (
                      <div className="h-24 w-full border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <p className="text-xs text-gray-500">No image</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Images Section - Compact */}
              <div>
                <div className="flex items-center mb-1">
                  <svg className="h-3.5 w-3.5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <label className="block text-xs font-medium text-gray-700">Additional Images</label>
                </div>
                <div className="mt-1 flex justify-center px-2 pt-2 pb-2 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-6 w-6 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-xs text-gray-600 justify-center">
                      <label
                        htmlFor="multiple-files-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload multiple</span>
                        <input
                          id="multiple-files-upload"
                          name="multiple-files-upload"
                          type="file"
                          ref={multipleFileInputRef}
                          onChange={handleMultipleImagesUpload}
                          accept="image/*"
                          multiple
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Additional Images Preview - Compact Grid */}
                {imagesPreviews.length > 0 && (
                  <div className="mt-2">
                    <div className="grid grid-cols-4 gap-1">
                      {imagesPreviews.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="h-12 border border-gray-300 rounded-lg overflow-hidden">
                            <img
                              src={`${APP_IMAGE_URL}${img}` || "/placeholder.svg"}
                              alt={`Product view ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAdditionalImage(index)}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing & Inventory Tab - Compact */}
          {activeTab === "pricing" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center mb-1">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <label htmlFor="price" className="block text-xs font-medium text-gray-700">
                      Price (₹) *
                    </label>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs">₹</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      className={`w-full pl-5 pr-8 py-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs ${
                        formErrors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {formErrors.price && <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>}
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
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
                    <label htmlFor="discount" className="block text-xs font-medium text-gray-700">
                      Discount (%)
                    </label>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className={`w-full pr-6 py-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs ${
                        formErrors.discount ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </div>
                  {formErrors.discount && <p className="mt-1 text-xs text-red-600">{formErrors.discount}</p>}
                  {formData.discount && formData.price && (
                    <p className="mt-1 text-xs text-gray-600">Sale: ₹{salePrice}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center mb-1">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <label htmlFor="countInStock" className="block text-xs font-medium text-gray-700">
                      Stock Quantity
                    </label>
                  </div>
                  <input
                    type="number"
                    id="countInStock"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-2 py-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs ${
                      formErrors.countInStock ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.countInStock && <p className="mt-1 text-xs text-red-600">{formErrors.countInStock}</p>}
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <svg
                      className="h-3.5 w-3.5 text-gray-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    <label htmlFor="sku" className="block text-xs font-medium text-gray-700">
                      SKU
                    </label>
                  </div>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions - Compact */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-2 py-1 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            {isDirty && (
              <button
                type="button"
                onClick={togglePreview}
                className="px-2 py-1 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Preview
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-colors text-xs"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
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
                  {isEdit ? "Updating..." : "Creating..."}
                </span>
              ) : isEdit ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProductForm

