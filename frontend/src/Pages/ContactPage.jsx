"use client";

import { useState } from "react";

function ContactPage() {
  const Address = import.meta.env.VITE_APP_ADDRESS;
  const Mobile_number = import.meta.env.VITE_APP_MOBILE_NUMBER;
  const email = import.meta.env.VITE_APP_EMAIL;
  const Name = import.meta.env.VITE_APP_CLIENT_NAME;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus("loading");

    setTimeout(() => {
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Get in Touch</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={formStatus === "loading"}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {formStatus === "loading" ? "Sending..." : "Send Message"}
            </button>

            {formStatus === "success" && (
              <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4 text-sm">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Contact Information</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-gray-600 text-sm">
                {Address}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600 text-sm">{Mobile_number}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600 text-sm">{email}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
              <p className="text-gray-600 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 10:00 AM - 4:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="mt-8 rounded-lg overflow-hidden h-[250px] sm:h-[400px]">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31721.25010675401!2d77.22277183652704!3d8.30177906044913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05e8c0a8b8b8b8%3A0x123456789abcdef!2sLocation+Name!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;