"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="mt-4 text-gray-600 text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

