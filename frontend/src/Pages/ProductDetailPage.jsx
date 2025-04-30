"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../Services/api"
import ProductCard from "../Components/ProductCard"

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [activeImage, setActiveImage] = useState(null)
  const [allImages, setAllImages] = useState([])
  const APP_IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await api.getProduct(id)
        setProduct(response.data)

        // Combine main image with additional images
        const mainImage = response.data.image
        const additionalImages = response.data.images || []
        const combinedImages = mainImage ? [mainImage, ...additionalImages] : additionalImages

        setAllImages(combinedImages)
        setActiveImage(combinedImages.length > 0 ? combinedImages[0] : null)

        // Fetch related products based on category
        if (response.data.category) {
          const relatedResponse = await api.getProducts({
            category: response.data.category._id || response.data.category,
            limit: 4,
          })

          // Filter out the current product from related products
          const filtered = relatedResponse.data.products.filter((relatedProduct) => relatedProduct._id !== id)
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Product not found or an error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    // Reset state when product ID changes
    return () => {
      setProduct(null)
      setRelatedProducts([])
      setQuantity(1)
      setActiveTab("description")
      setActiveImage(null)
      setAllImages([])
    }
  }, [id])

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && value <= (product?.countInStock || 10)) {
      setQuantity(value)
    }
  }

  const incrementQuantity = () => {
    if (quantity < (product?.countInStock || 10)) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex">
            <svg className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
        <div className="mt-6">
          <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  // Calculate sale price if discount is applied
  const salePrice = product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(2) : null

  return (
    <div className="bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumbs - Enhanced with subcategory */}
        <nav
  className="flex mb-3 sm:mb-6 overflow-x-auto whitespace-nowrap py-1 scrollbar-hide"
  aria-label="Breadcrumb"
>
  <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
    <li>
      <Link to="/products" className="text-gray-500 hover:text-gray-700">
        Products
      </Link>
    </li>
    {product.category && (
      <>
        <li className="flex items-center">
          <svg
            className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li>
          <Link
            to={`/products?category=${product.category._id || product.category}`}
            className="text-gray-500 hover:text-gray-700 truncate max-w-[80px] sm:max-w-none inline-block"
          >
            {product.category.name || "Category"}
          </Link>
        </li>
      </>
    )}
    {product.subcategory && (
      <>
        <li className="flex items-center">
          <svg
            className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li>
          <Link
            to={`/products?category=${product.category._id || product.category}&subcategory=${product.subcategory._id || product.subcategory}`}
            className="text-gray-500 hover:text-gray-700 truncate max-w-[80px] sm:max-w-none inline-block"
          >
            {product.subcategory.name || "Subcategory"}
          </Link>
        </li>
      </>
    )}
  </ol>
</nav>

        {/* Product Detail */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Product Images */}
            <div className="w-full md:w-1/2 p-3 sm:p-6">
              <div className="md:sticky md:top-6">
                <div className="aspect-square overflow-hidden rounded-lg mb-2 sm:mb-4 bg-gray-100 flex items-center justify-center">
                  <img
                    src={`${APP_IMAGE_URL}${activeImage}` || "https://via.placeholder.com/600"}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 sm:p-4"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://via.placeholder.com/600"
                    }}
                  />
                </div>

                {/* Thumbnail gallery - scrollable on mobile */}
                {allImages.length > 0 && (
                  <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 border-2 rounded-md overflow-hidden ${activeImage === image ? "border-blue-500" : "border-gray-200"}`}
                        onClick={() => setActiveImage(image)}
                      >
                        <img
                          src={`${APP_IMAGE_URL}${image}` || "https://via.placeholder.com/150"}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://via.placeholder.com/150"
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 p-3 sm:p-6 bg-white">
              <div className="flex flex-wrap gap-1.5 mb-2 sm:mb-3">
                {product.category?.name && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {product.category.name}
                  </span>
                )}
                {product.subcategory?.name && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    {product.subcategory.name}
                  </span>
                )}
                {product.status === "featured" && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{product.name}</h1>

              <div className="mb-3 sm:mb-4">
                {salePrice ? (
                  <div className="flex items-center flex-wrap">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mr-2">₹{salePrice}</span>
                    <span className="text-sm sm:text-base text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                      {product.discount}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {product.countInStock > 0 ? (
                <div className="mb-3 sm:mb-4 flex items-center">
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    In Stock
                  </span>
                  <span className="ml-2 text-xs text-gray-500">{product.countInStock} units available</span>
                </div>
              ) : (
                <div className="mb-3 sm:mb-4">
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Product Description */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-gray-600">{product.description || "No description provided."}</p>
              </div>

              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <div className="mb-3 sm:mb-4">
                  <label htmlFor="quantity" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      <svg
                        className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max={product.countInStock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-12 sm:w-16 text-center border-t border-b border-gray-300 py-1 sm:py-2 text-sm"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <svg
                        className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-3 sm:mb-4 bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Key Features</h3>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* WhatsApp Order Button */}
              <div className="mb-3 sm:mb-6">
                <a
                  href={`https://wa.me/1234567890?text=${encodeURIComponent(
                    `Hello, I would like to order:

                    *${product.name}*
                    Quantity: ${quantity}
                    Price: ₹${salePrice || product.price.toFixed(2)}
                    SKU: ${product.sku || "N/A"}

                    Thank you!`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-white ${
                    product.countInStock > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                  } transition-colors duration-200 flex items-center justify-center text-xs sm:text-sm`}
                  disabled={product.countInStock === 0}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {product.countInStock > 0 ? "Order via WhatsApp" : "Out of Stock"}
                </a>
              </div>

              {/* SKU and Category */}
              <div className="border-t border-gray-200 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                <div>SKU: {product.sku || "N/A"}</div>
                {product.category?.name && (
                  <Link
                    to={`/products?category=${product.category._id || product.category}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View similar products
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs - Scrollable on mobile */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-8">
        <div className="border-b border-gray-200 overflow-hidden">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-2 px-3 sm:py-3 sm:px-4 text-center border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "description"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`py-2 px-3 sm:py-3 sm:px-4 text-center border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "specifications"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Specifications
              </button>
            </nav>
          </div>

          <div className="p-3 sm:p-5">
            {activeTab === "description" && (
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Product Description</h2>
                <div className="prose max-w-none text-xs sm:text-sm text-gray-600">
                  <p>{product.description || "No description provided."}</p>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                  Technical Specifications
                </h2>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="border-t border-gray-200">
                      <dl>
                        {product.specifications.map((spec, index) => (
                          <div
                            key={index}
                            className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} px-3 py-2 sm:px-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 text-xs sm:text-sm`}
                          >
                            <dt className="font-medium text-gray-500">{spec.name}</dt>
                            <dd className="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500">No specifications available for this product.</p>
                )}
              </div>
            )}

            
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-4 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold text-gray-900">Related Products</h2>
              {product.category && (
                <Link
                  to={`/products?category=${product.category._id || product.category}`}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  View All
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage

