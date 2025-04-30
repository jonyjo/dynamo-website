import ProductForm from "../../Components/ProductForm"

function AdminProductNew() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8">Add New Product</h1>
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
        <ProductForm />
      </div>
    </div>
  )
}

export default AdminProductNew

