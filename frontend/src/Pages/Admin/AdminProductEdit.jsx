"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ProductForm from "../../Components/ProductForm"
import api from "../../Services/api"

function AdminProductEdit() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProduct(id)
        setProduct(response.data)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm product={product} isEdit={true} />
      </div>
    </div>
  )
}

export default AdminProductEdit

