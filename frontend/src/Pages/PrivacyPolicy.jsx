"use client"

import { useEffect } from "react"

function PrivacyPolicy() {
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
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-500">Last Updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-500">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p>
              Welcome to {companyName}'s Privacy Policy. This document explains how we collect, use, and protect your
              personal information when you use our website and services.
            </p>
            <p>
              We respect your privacy and are committed to protecting your personal data. Please read this Privacy
              Policy carefully to understand our practices regarding your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and shipping/billing address
                when you make a purchase or create an account.
              </li>
              <li>
                <strong>Transaction Information:</strong> Details about purchases you make through our website,
                including payment information.
              </li>
              <li>
                <strong>Technical Information:</strong> IP address, browser type, device information, and cookies when
                you visit our website.
              </li>
              <li>
                <strong>Usage Information:</strong> How you use our website, products viewed, and features accessed.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To process and fulfill your orders</li>
              <li>To manage your account and provide customer support</li>
              <li>To send you important updates about your orders and our services</li>
              <li>To improve our website and services</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and to hold certain
              information. Cookies are files with a small amount of data which may include an anonymous unique
              identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
              if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access,
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p>
              We may use third-party services to process payments, analyze website traffic, or provide other services.
              These third parties have access to your personal information only to perform specific tasks on our behalf
              and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate or incomplete data</li>
              <li>The right to delete your personal data</li>
              <li>The right to restrict processing of your data</li>
              <li>The right to data portability</li>
              <li>The right to object to the processing of your data</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal
              information from children under 13. If you are a parent or guardian and believe your child has provided us
              with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p>
              We recommend that you review this Privacy Policy periodically for any changes. Changes to this Privacy
              Policy are effective when they are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
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

export default PrivacyPolicy
