"use client"

import { useEffect } from "react"

function TermsOfService() {
  const companyName = import.meta.env.VITE_APP_CLIENT_NAME || "Our Company"
  const email = import.meta.env.VITE_APP_EMAIL || "contact@example.com"
  const lastUpdated = "November 15, 2023"

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Terms of Service</h1>
          <p className="mt-4 text-lg text-gray-500">Last Updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-500">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p>
              Welcome to {companyName}. These Terms of Service govern your use of our website and the services we
              provide. By accessing or using our website, you agree to be bound by these Terms.
            </p>
            <p>
              Please read these Terms carefully before using our website. If you do not agree with any part of these
              Terms, you may not use our website or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Our Website</h2>
            <p>By using our website, you agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Use our website only for lawful purposes and in accordance with these Terms</li>
              <li>Not use our website in any way that violates applicable laws or regulations</li>
              <li>Not attempt to gain unauthorized access to any part of our website</li>
              <li>Not interfere with the proper working of our website</li>
              <li>Not use our website to transmit malware or other harmful code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Registration</h2>
            <p>
              Some features of our website may require you to create an account. When you create an account, you agree
              to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account and password</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Products and Orders</h2>
            <p>
              All product descriptions, prices, and availability are subject to change without notice. We reserve the
              right to limit quantities of any product and to discontinue any product at any time.
            </p>
            <p>
              When you place an order, you are making an offer to purchase the products. We reserve the right to accept
              or decline your order for any reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <p>
              All prices are in the currency indicated on our website. Payment must be made at the time of order. We
              accept various payment methods as indicated on our website.
            </p>
            <p>
              You represent and warrant that you have the legal right to use any payment method you provide in
              connection with any order.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping and Delivery</h2>
            <p>
              We will make reasonable efforts to deliver products within the estimated delivery time. However, we are
              not responsible for delays beyond our control.
            </p>
            <p>
              Risk of loss and title for products pass to you upon delivery to the carrier. You are responsible for
              inspecting products upon receipt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
            <p>
              Our return and refund policy is outlined separately. Please refer to our Return Policy for detailed
              information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, and software, is the property of{" "}
              {companyName} or our content suppliers and is protected by copyright and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
              republish, download, store, or transmit any of the material on our website without our prior written
              consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {companyName} shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising out of or relating to your use of our website or
              services.
            </p>
            <p>
              Our total liability for all claims arising out of or relating to these Terms shall not exceed the amount
              you paid to us for products or services in the preceding six months.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless {companyName} and our officers, directors, employees,
              agents, and affiliates from and against any claims, liabilities, damages, judgments, awards, losses,
              costs, expenses, or fees arising out of or relating to your violation of these Terms or your use of our
              website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which{" "}
              {companyName} is established, without giving effect to any principles of conflicts of law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on
              this page and updating the "Last Updated" date.
            </p>
            <p>
              We recommend that you review these Terms periodically for any changes. Changes to these Terms are
              effective when they are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
