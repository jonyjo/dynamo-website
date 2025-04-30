"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api from "../Services/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          api.setToken(token)
          const response = await api.get("/auth/me")
          setUser(response.data)
        } catch (error) {
          console.error("Authentication error:", error)
          localStorage.removeItem("token")
          api.setToken(null)
        }
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (emailOrMobile, password) => {
    try {
      // Determine if input is email or mobile
      const isEmail = emailOrMobile.includes("@")
      const loginData = isEmail ? { email: emailOrMobile, password } : { mobile: emailOrMobile, password }

      const response = await api.post("/auth/login", loginData)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.setToken(token)
      setUser(user)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (name, email, mobile, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email: email || undefined,
        mobile: mobile || undefined,
        password,
      })

      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.setToken(token)
      setUser(user)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    api.setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

