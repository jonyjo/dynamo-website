import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import ProductsPage from "./Pages/ProductsPage"
import ProductDetailPage from "./Pages/ProductDetailPage"
import AboutPage from "./Pages/AboutPage"
import ContactPage from "./Pages/ContactPage"
import LoginPage from "./Pages/LoginPage"
import RegisterPage from "./Pages/RegisterPage"
import AdminDashboard from "./Pages/Admin/AdminDashboard"
import AdminProducts from "./Pages/Admin/AdminProducts"
import AdminBatchProducts from "./Pages/Admin/AdminBatchProducts"
import AdminProductNew from "./Pages/Admin/AdminProductNew"
import AdminProductEdit from "./Pages/Admin/AdminProductEdit"
import AdminCategories from "./Pages/Admin/AdminCategories"
import ProtectedRoute from "./Components/ProtectedRoute"
import AdminLayout from "./Components/AdminLayout"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import { AuthProvider } from "./Context/AuthContext"
import ScrollToTop from "./Components/ScrollToTop"
import AdminNavbarCategories from "./Pages/Admin/AdminNavbarCategories"
import PrivacyPolicy from "./Pages/PrivacyPolicy"
import TermsOfService from "./Pages/TermsOfService"

function App() {
  return (
    <AuthProvider>
      <Router>
      <ScrollToTop />

        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Regular routes with Navbar and Footer */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <HomePage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/products"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ProductsPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/products/:id"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ProductDetailPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <AboutPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ContactPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route 
              path="/privacy-policy"
              element={
                <>
                <Navbar />
                <main className="flex-grow">
                  <PrivacyPolicy/>
                </main>
                <Footer />
                </>
              }
            />
          <Route 
              path="/terms-of-service"
              element={
                <>
                <Navbar />
                <main className="flex-grow">
                  <TermsOfService/>
                </main>
                <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <LoginPage />
                  </main>
                  <Footer />
                </>
              }
            />
            {/* <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <RegisterPage />
                  </main>
                  <Footer />
                </>
              }
            /> */}

            {/* Admin routes with AdminLayout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/batch"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminBatchProducts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminProductNew />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminProductEdit />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminCategories />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            {/* Add the new route inside the admin routes section */}
            <Route
              path="/admin/navbar-categories"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminNavbarCategories />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

