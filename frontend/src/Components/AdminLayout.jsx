"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      <div className="lg:hidden bg-slate-800 text-white shadow-md">
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-200 hover:text-white focus:outline-none"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <Link to="/admin" className="ml-2 text-xl font-bold truncate">
              ShopEase Admin
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/" className="text-sm text-gray-300 hover:text-white mr-4" aria-label="View store">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
            <div className="relative">
              <button className="flex text-sm rounded-full focus:outline-none" aria-label="User menu">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
        <div
          className={`fixed inset-y-0 left-0 flex flex-col max-w-xs w-full bg-slate-800 text-white shadow-xl transform transition-transform duration-300 ease-in-out`}
        >
          <div className="h-16 flex items-center px-6 border-b border-slate-700">
            <Link to="/admin" className="text-xl font-bold">
              ShopEase Admin
            </Link>
            <button
              className="ml-auto p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 px-2 space-y-1">
              <Link
                to="/admin"
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                  isActive("/admin") && !isActive("/admin/products") && !isActive("/admin/categories")
                    ? "bg-slate-900 text-white"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    isActive("/admin") && !isActive("/admin/products") && !isActive("/admin/categories")
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                to="/admin/products"
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                  isActive("/admin/products")
                    ? "bg-slate-900 text-white"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    isActive("/admin/products") ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                  }`}
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
                Products
              </Link>

              <Link
                to="/admin/categories"
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                  isActive("/admin/categories")
                    ? "bg-slate-900 text-white"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    isActive("/admin/categories") ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                  }`}
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
                Categories
              </Link>

              <Link
                to="/admin/navbar-categories"
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                  isActive("/admin/navbar-categories")
                    ? "bg-slate-900 text-white"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    isActive("/admin/navbar-categories") ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
                Navbar Menu
              </Link>

              <div className="pt-4 mt-4 border-t border-slate-700">
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-4 py-3 text-base font-medium rounded-md text-gray-300 hover:bg-slate-700 hover:text-white w-full text-left"
                >
                  <svg
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-slate-700 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">{user?.name || "Admin User"}</p>
                  <p className="text-sm font-medium text-gray-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-slate-800 lg:text-white">
        <div className="flex items-center h-16 px-6 border-b border-slate-700">
          <Link to="/admin" className="text-xl font-bold">
            ShopEase Admin
          </Link>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link
              to="/admin"
              className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                isActive("/admin") && !isActive("/admin/products") && !isActive("/admin/categories")
                  ? "bg-slate-900 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 ${
                  isActive("/admin") && !isActive("/admin/products") && !isActive("/admin/categories")
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>

            <Link
              to="/admin/products"
              className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                isActive("/admin/products")
                  ? "bg-slate-900 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 ${
                  isActive("/admin/products") ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                }`}
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
              Products
            </Link>

            <Link
              to="/admin/categories"
              className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                isActive("/admin/categories")
                  ? "bg-slate-900 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 ${
                  isActive("/admin/categories") ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                }`}
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
              Categories
            </Link>

            <Link
              to="/admin/navbar-categories"
              className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                isActive("/admin/navbar-categories")
                  ? "bg-slate-900 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 ${
                  isActive("/admin/navbar-categories") ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              Navbar Menu
            </Link>

            <div className="pt-4 mt-4 border-t border-slate-700">
              <Link
                to="/"
                className="group flex items-center px-4 py-3 text-base font-medium rounded-md text-gray-300 hover:bg-slate-700 hover:text-white"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                View Store
              </Link>

              <button
                onClick={handleLogout}
                className="mt-1 group flex items-center px-4 py-3 text-base font-medium rounded-md text-gray-300 hover:bg-slate-700 hover:text-white w-full text-left"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-slate-700 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name || "Admin User"}</p>
                <p className="text-xs font-medium text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Add padding at the bottom for mobile to account for the bottom navigation */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <main className="flex-1 pb-20 lg:pb-8">
          {" "}
          {/* Added extra padding at bottom for mobile */}
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">{children}</div>
          </div>
        </main>
        {/* Mobile Bottom Navigation - Only visible on small screens */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-800 shadow-lg lg:hidden">
          <div className="flex justify-around items-center h-14 sm:h-16 px-1 sm:px-2">
            <Link
              to="/admin"
              className={`flex flex-col items-center justify-center w-1/4 py-2 ${
                isActive("/admin") &&
                !isActive("/admin/products") &&
                !isActive("/admin/categories") &&
                !isActive("/admin/navbar-categories")
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs mt-1">Dashboard</span>
            </Link>

            <Link
              to="/admin/products"
              className={`flex flex-col items-center justify-center w-1/4 py-2 ${
                isActive("/admin/products") ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="text-xs mt-1">Products</span>
            </Link>

            <Link
              to="/admin/categories"
              className={`flex flex-col items-center justify-center w-1/4 py-2 ${
                isActive("/admin/categories") ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span className="text-xs mt-1">Categories</span>
            </Link>

            <Link
              to="/admin/navbar-categories"
              className={`flex flex-col items-center justify-center w-1/4 py-2 ${
                isActive("/admin/navbar-categories") ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              <span className="text-xs mt-1">Menu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout

