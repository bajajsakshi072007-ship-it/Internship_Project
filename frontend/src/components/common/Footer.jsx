import React from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORIES } from '../../utils/constants'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                AM
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Artisan<span className="text-primary-400">Market</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Connecting rural artisans with buyers across India. Discover authentic handcrafted products made with love and tradition.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <span className="text-xs font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/',         label: 'Home' },
                { to: '/products', label: 'Shop Products' },
                { to: '/about',    label: 'About Us' },
                { to: '/contact',  label: 'Contact' },
                { to: '/register', label: 'Sell with Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {PRODUCT_CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat}`}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="font-medium text-white">Address:</span>
                <span>Rural Artisan Marketplace<br />New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-white">Email:</span>
                <a href="mailto:support@artisanmarket.in" className="hover:text-primary-400 transition-colors">
                  support@artisanmarket.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-white">Phone:</span>
                <a href="tel:+911234567890" className="hover:text-primary-400 transition-colors">
                  +91 12345 67890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="divider border-gray-800 mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} ArtisanMarket. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
