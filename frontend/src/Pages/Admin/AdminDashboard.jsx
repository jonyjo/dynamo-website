"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../Services/api"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    recentProducts: [],
  })
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  })
  const APP_IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts({ limit: 5, sort: "-createdAt" }),
          api.getCategories(),
        ])

        setStats({
          totalProducts: productsRes.data.total || productsRes.data.products.length,
          totalCategories: categoriesRes.data.length,
          recentProducts: productsRes.data.products,
        })

        // Mock sales data (in a real app, this would come from an API)
        setSalesData({
          today: Math.floor(Math.random() * 5000) + 1000,
          week: Math.floor(Math.random() * 20000) + 10000,
          month: Math.floor(Math.random() * 100000) + 50000,
          year: Math.floor(Math.random() * 1000000) + 500000,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="px-2 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border-l-4 border-blue-500 admin-dashboard-card">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-3 rounded-full bg-blue-100 text-blue-600 mr-2 sm:mr-4 admin-dashboard-card-icon">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-3 rounded-full bg-green-100 text-green-600 mr-2 sm:mr-4">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Categories</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-3 rounded-full bg-purple-100 text-purple-600 mr-2 sm:mr-4">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">₹{salesData.today.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 mr-2 sm:mr-4">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Monthly Sales</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">₹{salesData.month.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Link
            to="/admin/products/new"
            className="flex items-center p-2 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-md text-blue-600 mr-2 sm:mr-3">
              <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Add Product</span>
          </Link>

          <Link
            to="/admin/products/batch"
            className="flex items-center p-2 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-md text-green-600 mr-2 sm:mr-3">
              <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Batch Manage</span>
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center p-2 sm:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-md text-purple-600 mr-2 sm:mr-3">
              <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Categories</span>
          </Link>

          <Link
            to="/admin/navbar-categories"
            className="flex items-center p-2 sm:p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-md text-yellow-600 mr-2 sm:mr-3">
              <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Navbar Menu</span>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 sm:mb-6">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Recent Products</h2>
          <Link to="/admin/products" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center">
            View All
            <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile view for recent products */}
        <div className="sm:hidden divide-y divide-gray-200">
          {stats.recentProducts.length > 0 ? (
            stats.recentProducts.map((product) => (
              <div key={product._id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <img
                        src={`${APP_IMAGE_URL}${product.image}` || "https://via.placeholder.com/100"}
                        alt={product.name}
                        className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "https://via.placeholder.com/100"
                        }}
                      />
                    </div>
                    <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate w-8">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate w-10">
                        {product.category?.name}
                        {product.subcategory?.name && ` • ${product.subcategory.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {product.discount > 0 ? (
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-red-600">
                          ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 line-through ml-1">₹{product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</span>
                    )}
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center justify-end mt-1"
                    >
                      Edit
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">No products found</div>
          )}
        </div>

        {/* Desktop view for recent products */}
        <div className="hidden sm:block divide-y divide-gray-200">
          {stats.recentProducts.length > 0 ? (
            stats.recentProducts.map((product) => (
              <div
                key={product._id}
                className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0 h-12 w-12">
                  <img
                    src={`${APP_IMAGE_URL}${product.image}` || "https://via.placeholder.com/100"}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://via.placeholder.com/100"
                    }}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {product.category?.name}
                    {product.subcategory?.name && ` • ${product.subcategory.name}`}
                  </p>
                </div>
                <div className="ml-4">
                  {product.discount > 0 ? (
                    <div>
                      <span className="text-sm font-medium text-red-600">
                        ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 line-through ml-1">₹{product.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="ml-4">
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    Edit
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">No products found</div>
          )}
        </div>
      </div>

      {/* Sales Overview */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Sales Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="p-2 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-gray-500">Today</p>
            <p className="text-sm sm:text-xl font-bold text-gray-900">₹{salesData.today.toLocaleString()}</p>
          </div>
          <div className="p-2 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-gray-500">This Week</p>
            <p className="text-sm sm:text-xl font-bold text-gray-900">₹{salesData.week.toLocaleString()}</p>
          </div>
          <div className="p-2 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-gray-500">This Month</p>
            <p className="text-sm sm:text-xl font-bold text-gray-900">₹{salesData.month.toLocaleString()}</p>
          </div>
          <div className="p-2 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-gray-500">This Year</p>
            <p className="text-sm sm:text-xl font-bold text-gray-900">₹{salesData.year.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
