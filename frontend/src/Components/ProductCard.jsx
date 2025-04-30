"use client"

import { Link } from "react-router-dom"

function ProductCard({ product }) {
  // Change the currency symbol from $ to ₹
  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : null
  const finalPrice = discountedPrice || product.price

  // Format WhatsApp message
  const whatsappMessage = encodeURIComponent(`Hello, I would like to order:

    *${product.name}*
    Price: ₹${finalPrice.toFixed(2)}
    ${product.discount > 0 ? `Discount: ${product.discount}% OFF` : ""}
    SKU: ${product.sku || "N/A"}

    Thank you!`)
  const APP_IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL

  // WhatsApp phone number - replace with your actual business number
  const whatsappNumber = "1234567890" // No + symbol, just the number

  // Handle WhatsApp button click
  const handleWhatsAppClick = (e) => {
    e.preventDefault() // Prevent the card click event from firing
    e.stopPropagation() // Stop event propagation
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank")
  }

  return (
    <div className="group h-full w-full">
      <Link
        to={`/products/${product._id}`}
        className="block h-full bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col relative"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
          <img
            src={`${APP_IMAGE_URL}${product.image}` || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "https://via.placeholder.com/300"
            }}
          />

          {/* Badges */}
          <div className="absolute top-0 left-0 p-1.5 sm:p-2 flex flex-col gap-1 sm:gap-2">
            {product.discount > 0 && (
              <div className="bg-red-500 text-white text-[10px] xs:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                {product.discount}% OFF
              </div>
            )}
          </div>

          <div className="absolute top-0 right-0 p-1.5 sm:p-3">
            {product.countInStock === 0 && (
              <div className="bg-gray-800 text-white text-[10px] xs:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full shadow-sm">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-2 xs:p-3 sm:p-4 flex flex-col flex-grow">
          {/* Categories */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-1.5 sm:mb-2">
            {product.category && (
              <span className="text-[10px] xs:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-700 rounded-full">
                {product.category.name}
              </span>
            )}
            {product.subcategory && (
              <span className="text-[10px] xs:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 bg-indigo-50 text-indigo-700 rounded-full">
                {product.subcategory.name}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs xs:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 flex-grow">{product.description}</p>

          {/* Price and Button */}
          <div className="mt-auto pt-2 xs:pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="flex flex-col">
                {discountedPrice ? (
                  <>
                    <span className="text-sm xs:text-base sm:text-lg font-bold text-red-600">
                      ₹{discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] xs:text-xs text-gray-500 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm xs:text-base sm:text-lg font-bold text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Order Button */}
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-[10px] xs:text-xs sm:text-sm font-medium"
                disabled={product.countInStock === 0}
              >
                <svg className="h-3 w-3 xs:h-4 xs:w-4 mr-0.5 xs:mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="hidden xs:inline">Order Now</span>
                <span className="inline xs:hidden">Order</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard

