import Link from "next/link"
import { CalendarHeart, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarHeart className="h-8 w-8 text-orange-500" />
              <span className="font-extrabold text-xl text-gray-900">OwambeHub</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your No.1 Naija platform for discovering concerts, owambes, festivals, and unforgettable experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-600 hover:text-orange-500 transition-colors text-sm">
                Browse Events
              </Link>
              <Link href="/categories" className="block text-gray-600 hover:text-orange-500 transition-colors text-sm">
                Categories
              </Link>
              <Link href="/my-tickets" className="block text-gray-600 hover:text-orange-500 transition-colors text-sm">
                My Tickets
              </Link>
              <Link href="/create-event" className="block text-gray-600 hover:text-orange-500 transition-colors text-sm">
                Create Event
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-gray-600 hover:text-orange-500 transition-colors text-sm">
                Help Center
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-orange-500 transition-colors text-sm">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-gray-600 hover:text-orange-500 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-600 hover:text-orange-500 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>support@owambehub.ng</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>+234 812 345 6789</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 OwambeHub. All rights reserved. Built with in Naija for event lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}
