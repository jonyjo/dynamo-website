"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../Services/api"
import HomepageProductCard from "../Components/HomepageProductCard"

function HomePage() {
  const [categories, setCategories] = useState([])
  const [categoryProducts, setCategoryProducts] = useState({})
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch categories
        const categoriesRes = await api.getCategories()
        const fetchedCategories = categoriesRes.data
        setCategories(fetchedCategories)

        // Fetch featured products
        const featuredRes = await api.getProducts({
          status: "featured",
          limit: 4,
        })
        setFeaturedProducts(featuredRes.data.products)

        // Fetch products for each category
        const productsMap = {}

        // Fetch products for each category in parallel
        await Promise.all(
          fetchedCategories.map(async (category) => {
            try {
              const response = await api.getProducts({
                category: category._id,
                limit: 5, // Get at least 5 products per category
                sort: "-createdAt",
              })
              productsMap[category._id] = response.data.products
            } catch (error) {
              console.error(`Error fetching products for category ${category.name}:`, error)
              productsMap[category._id] = []
            }
          }),
        )

        setCategoryProducts(productsMap)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Icons for categories
  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case "mobile phones":
        return "📱"
      case "televisions":
        return "📺"
      case "laptops":
        return "💻"
      case "air conditioners":
        return "❄️"
      case "refrigerators":
        return "🧊"
      case "washing machines":
        return "🧼"
      case "audio devices":
        return "🎧"
      default:
        return "📦"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Filter out categories with no products
  const categoriesWithProducts = categories.filter((category) => categoryProducts[category._id]?.length > 0)

  return (
    <div>
      {/* Hero Section - Modern Version */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center py-12 md:py-24">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
                Shop Smarter with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  ShopEase
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
                Discover premium electronics and home appliances at unbeatable prices. Fast delivery, secure payments,
                and exceptional service.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                <Link
                  to="/products"
                  className="inline-block bg-white text-blue-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="inline-block bg-transparent text-white border-2 border-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-base sm:text-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-2xl">
                <img src="./bg.webp" alt="Electronics showcase" className="rounded-lg object-cover w-full h-full" />
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-lg shadow-lg transform rotate-3">
                  New Arrivals!
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-600 rounded-full opacity-40 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff">
            <path d="M0,96L60,80C120,64,240,32,360,32C480,32,600,64,720,69.3C840,75,960,53,1080,48C1200,43,1320,53,1380,58.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Fixed header with View All link */}
            <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8 lg:mb-12">
              <div className="w-full sm:w-auto mb-4 sm:mb-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                <div className="w-24 h-1 bg-blue-600 mb-2 sm:mb-4 rounded-full"></div>
                <p className="text-sm sm:text-lg text-gray-600">Handpicked by our experts just for you</p>
              </div>
              <Link
                to="/products"
                className="w-full sm:w-auto flex justify-center items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <HomepageProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid Section - Modern Version */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-2 sm:mb-4 rounded-full"></div>
            <p className="text-sm sm:text-lg text-gray-600">Browse our extensive collection by category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {categories.map((category) => (
              <Link key={category._id} to={`/products?category=${category._id}`} className="group">
                <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 h-full border border-gray-100">
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4">
                    <span className="inline-block bg-blue-100 text-blue-600 p-2 sm:p-3 md:p-4 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {getCategoryIcon(category.name)}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {category.subcategories?.length || 0} brands available
                  </p>
                  <div className="mt-2 sm:mt-4 text-blue-600 group-hover:text-blue-800 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium">Shop Now</span>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories with Products Sections - Modern Version */}
      {categoriesWithProducts.slice(0, 5).map((category, index) => (
        <section key={category._id} className={`py-8 sm:py-12 lg:py-16 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Fixed header with View All link */}
            <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8 lg:mb-12">
              <div className="w-full sm:w-auto mb-4 sm:mb-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{category.name}</h2>
                <div className="w-16 h-1 bg-blue-600 mb-2 sm:mb-4 rounded-full"></div>
                <p className="text-sm sm:text-lg text-gray-600">Explore our {category.name.toLowerCase()} collection</p>
              </div>
              <Link
                to={`/products?category=${category._id}`}
                className="w-full sm:w-auto flex justify-center items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-8">
              {categoryProducts[category._id]?.map((product) => (
                <HomepageProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Features Section - Modern Version */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Why Choose ShopEase</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-2 sm:mb-4 rounded-full"></div>
            <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best shopping experience with these benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-full mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Fast Delivery</h3>
              <p className="text-sm text-gray-600">
                Get your products delivered within 24-48 hours of placing your order.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Secure Payments</h3>
              <p className="text-sm text-gray-600">
                All transactions are secure with multiple payment options available.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 text-yellow-600 rounded-full mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Easy Returns</h3>
              <p className="text-sm text-gray-600">
                Not satisfied with your purchase? Return it within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-2 sm:mb-4 rounded-full"></div>
            <p className="text-sm sm:text-lg text-gray-600">Don't just take our word for it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Tech Enthusiast",
                quote:
                  "ShopEase has the best selection of electronics I've found online. Fast shipping and excellent customer service!",
              },
              {
                name: "Michael Chen",
                role: "Home Improvement DIYer",
                quote:
                  "I've purchased several appliances from ShopEase and have always been impressed with the quality and value.",
              },
              {
                name: "Emily Rodriguez",
                role: "Smart Home Enthusiast",
                quote:
                  "The product descriptions are detailed and accurate, and their support team is incredibly helpful when you need assistance.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg sm:text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <h4 className="font-semibold text-base sm:text-lg">{testimonial.name}</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm sm:text-base italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - WhatsApp Ordering */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
            }}
          ></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-600 rounded-full opacity-20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-white">Ready to place an order?</h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto text-green-100">
              Browse our products, select what you need, and order directly via WhatsApp for a quick and easy shopping
              experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-block bg-white text-green-600 px-4 sm:px-5 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg font-medium text-sm sm:text-base lg:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
              >
                Browse Products
              </Link>
              <a
                href="https://wa.me/1234567890?text=Hello%2C%20I%27m%20interested%20in%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-green-800 text-white px-4 sm:px-5 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg font-medium text-sm sm:text-base lg:text-lg hover:bg-green-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-md">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Join Our Newsletter</h2>
              <p className="text-sm sm:text-lg text-gray-600">
                Get the latest updates, deals and exclusive offers directly to your inbox
              </p>
            </div>
            <form className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

