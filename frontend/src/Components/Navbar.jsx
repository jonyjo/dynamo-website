"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import api from "../Services/api"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories()
        const navbarCategories = response.data
          .filter((cat) => cat.showInNavbar)
          .sort((a, b) => (a.navbarOrder || 0) - (b.navbarOrder || 0))
          .slice(0, 5)

        setCategories(navbarCategories)
      } catch (error) {
        console.error("Error fetching categories for navbar:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [location.pathname])

  const handleCategoryClick = (categoryId, categoryName) => {
    console.log(`Navigating to category: ${categoryName} with ID: ${categoryId}`)
    navigate(`/products?category=${categoryId}`)
    setIsOpen(false)
  }

  return (
    <nav className="bg-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="ShopEase Logo"
                className="h-6 sm:h-8 w-auto"
              />
              <span className="text-white text-lg sm:text-xl font-bold">ShopEase</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            {/* Desktop Links */}
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              {!loading &&
                categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id, category.name)}
                    className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {category.name}
                  </button>
                ))}
              <Link
                to="/products"
                className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                All Products
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="flex md:hidden items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      {/* Side Panel */}
  <div
    className={`fixed inset-y-0 left-0 bg-slate-800 transform ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } transition-transform duration-300 ease-in-out z-50 w-64`}
  >
    <div className="px-4 py-6">
      <button
        onClick={() => setIsOpen(false)}
        className="text-gray-400 hover:text-white focus:outline-none"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="mt-6 space-y-4">
        <Link
          to="/"
          className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        {!loading &&
          categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category._id, category.name)}
              className="w-full text-left text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              {category.name}
            </button>
          ))}
        <Link
          to="/products"
          className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
          onClick={() => setIsOpen(false)}
        >
          All Products
        </Link>
        <Link
          to="/about"
          className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
          onClick={() => setIsOpen(false)}
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
          onClick={() => setIsOpen(false)}
        >
          Contact
        </Link>
        {user ? (
          <>
            {user.isAdmin && (
              <Link
                to="/admin"
                className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  </div>
    </nav>
  )
}

export default Navbar