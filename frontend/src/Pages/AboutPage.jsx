function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold">About ShopEase</h1>
        <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted destination for quality products at affordable prices.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Story</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            Founded in 2023, ShopEase was born from a simple idea: shopping should be easy, enjoyable, and accessible to
            everyone.
          </p>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            What started as a small online store has grown into a comprehensive e-commerce platform offering a wide
            range of products across multiple categories.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            Our mission is to provide customers with a seamless shopping experience, quality products, and exceptional
            customer service.
          </p>
        </div>
        <div className="bg-gray-200 h-60 sm:h-80 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-base sm:text-lg">Company Image</span>
        </div>
      </div>

      <div className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">
              1
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Quality</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              We carefully curate our product selection to ensure we offer only the highest quality items to our
              customers.
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">
              2
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Transparency</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              We believe in being honest and transparent in all our dealings with customers, partners, and employees.
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">
              3
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Customer Focus</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Our customers are at the heart of everything we do. We continuously strive to improve their shopping
              experience.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 sm:p-8 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center">Our Team</h2>
        <p className="text-gray-600 text-center mb-6 sm:mb-8 max-w-3xl mx-auto text-sm sm:text-base">
          ShopEase is powered by a dedicated team of professionals who are passionate about e-commerce and customer
          satisfaction.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded-full mx-auto mb-3 sm:mb-4"></div>
              <h3 className="font-semibold text-sm sm:text-base">Team Member {i}</h3>
              <p className="text-xs sm:text-sm text-gray-600">Position</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutPage

