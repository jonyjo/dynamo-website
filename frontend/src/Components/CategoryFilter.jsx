"use client"

function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
}) {
  // Find subcategories for the selected category
  const subcategories = selectedCategory
    ? categories.find((cat) => cat._id === selectedCategory)?.subcategories || []
    : []

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Filter Products</h3>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={selectedCategory || ""}
          onChange={(e) => {
            const value = e.target.value || null
            setSelectedCategory(value)
            setSelectedSubcategory(null) // Reset subcategory when category changes
          }}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && subcategories.length > 0 && (
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <select
            id="subcategory"
            value={selectedSubcategory || ""}
            onChange={(e) => setSelectedSubcategory(e.target.value || null)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Brands</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter

