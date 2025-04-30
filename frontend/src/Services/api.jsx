import axios from "axios"

const API_URL = import.meta.env.VITE_APP_ENDPOINTS
// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request logging middleware
api.interceptors.request.use(
  (config) => {
    console.log("🚀 REQUEST:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params,
    })

    // Add token to all requests
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error)
    return Promise.reject(error)
  },
)

// Response logging middleware
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    })
    return response
  },
  (error) => {
    console.error("❌ RESPONSE ERROR:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          }
        : "No response",
      config: error.config
        ? {
            url: error.config.url,
            method: error.config.method,
            data: error.config.data ? JSON.parse(error.config.data) : null,
            headers: error.config.headers,
          }
        : "No config",
    })
    return Promise.reject(error)
  },
)

// Helper methods
const apiService = {
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common.Authorization
    }
  },

  // Auth
  post: (url, data) => api.post(url, data),
  get: (url) => api.get(url),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),

  // Products
  getProducts: (params = {}) => {
    // If no limit is specified, set a high limit to get all products
    if (!params.limit) {
      params.limit = 100
    }
    return api.get("/products", { params })
  },
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Categories
  getCategories: () => api.get("/categories"),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  reorderCategories: (categoryIds) => api.put("/categories/reorder", { categoryIds }),

  // Subcategories
  createSubcategory: (categoryId, data) => api.post(`/categories/${categoryId}/subcategories`, data),
  updateSubcategory: (categoryId, subcategoryId, data) =>
    api.put(`/categories/${categoryId}/subcategories/${subcategoryId}`, data),
  deleteSubcategory: (categoryId, subcategoryId) =>
    api.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`),
  reorderSubcategories: (categoryId, subcategoryIds) =>
    api.put(`/categories/${categoryId}/subcategories/reorder`, { subcategoryIds }),
  moveSubcategory: (sourceCategoryId, subcategoryId, targetCategoryId) =>
    api.put(`/categories/${sourceCategoryId}/subcategories/${subcategoryId}/move`, { targetCategoryId }),

  // Image Upload - Use the configured api instance instead of axios directly
  uploadImage: (formData) => {
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // Navbar category management
  updateCategoryNavbar: (categoryId, data) => api.put(`/categories/${categoryId}/navbar`, data),
  reorderNavbarCategories: (categoryIds) => api.put("/categories/navbar/reorder", { categoryIds }),
}

export default apiService

