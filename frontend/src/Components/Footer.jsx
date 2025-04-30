"use client"

import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Phone, Mail, MessageCircle } from "lucide-react"

function Footer() {
  const currentYear = new Date().getFullYear()
  const Address = import.meta.env.VITE_APP_ADDRESS
  const Mobile_number = import.meta.env.VITE_APP_MOBILE_NUMBER
  const email = import.meta.env.VITE_APP_EMAIL
  const Name = import.meta.env.VITE_APP_CLIENT_NAME

  // WhatsApp API URL generator
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I would like to place an order.")
    window.open(`https://wa.me/${Mobile_number}?text=${message}`, "_blank")
  }

  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {/* About Section */}
          <div className="cursor-pointer hover:bg-slate-700 transition-colors duration-300 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">{Name}</h3>
            <p className="text-slate-300 mb-6">Your one-stop shop for quality products at affordable prices.</p>
            <button
              onClick={handleWhatsAppClick}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors duration-300"
            >
              Order Now
            </button>
          </div>

          {/* Quick Links Section */}
          <div className="cursor-pointer hover:bg-slate-700 transition-colors duration-300 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="cursor-pointer hover:bg-slate-700 transition-colors duration-300 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <address className="not-italic text-slate-300 space-y-3">
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                {Mobile_number}
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                {email}
              </p>
              <p className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                {Address}
              </p>
            </address>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mt-10 mb-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-emerald-500 transition duration-300 transform hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook className="h-6 w-6" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-emerald-500 transition duration-300 transform hover:scale-110"
            aria-label="Twitter"
          >
            <Twitter className="h-6 w-6" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-emerald-500 transition duration-300 transform hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a
            href={`https://wa.me/${Mobile_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-emerald-500 transition duration-300 transform hover:scale-110"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-emerald-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-gray-400 hover:text-emerald-500 transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="border-t border-gray-800 pt-3 text-sm text-gray-400">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-2 sm:mb-0 text-sm">
                © {currentYear} {Name}. All rights reserved.
              </div>
              <div className="pt-3">
                Developed by{" "}
                <a
                  href="https://www.orangemegasoftware.com"
                  className="text-emerald-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Orange Mega Software
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
