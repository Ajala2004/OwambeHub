// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Menu, X, Calendar, Settings, LogIn } from "lucide-react"

// export function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

//   useEffect(() => {
//     checkAdminAuth()
//   }, [])

//   const checkAdminAuth = async () => {
//     try {
//       const response = await fetch("/api/admin/check-auth")
//       setIsAdminAuthenticated(response.ok)
//     } catch (error) {
//       setIsAdminAuthenticated(false)
//     }
//   }

//   return (
//     <nav className="bg-background border-b border-border sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <Calendar className="h-8 w-8 text-accent" />
//             <span className="font-bold text-xl text-foreground">EventHub</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link href="/" className="text-foreground hover:text-accent transition-colors">
//               Events
//             </Link>
//             <Link href="/categories" className="text-muted hover:text-accent transition-colors">
//               Categories
//             </Link>
//             <Link href="/my-tickets" className="text-muted hover:text-accent transition-colors">
//               My Tickets
//             </Link>
//             <Link href="/verify" className="text-muted hover:text-accent transition-colors">
//               Verify
//             </Link>
//             {isAdminAuthenticated ? (
//               <Link href="/admin" className="text-muted hover:text-accent transition-colors flex items-center gap-1">
//                 <Settings className="h-4 w-4" />
//                 Admin Panel
//               </Link>
//             ) : (
//               <Link
//                 href="/admin/login"
//                 className="text-muted hover:text-accent transition-colors flex items-center gap-1"
//               >
//                 <LogIn className="h-4 w-4" />
//                 Admin Login
//               </Link>
//             )}
//             <Link href="/about" className="text-muted hover:text-accent transition-colors">
//               About
//             </Link>
//           </div>

//           {/* Desktop CTA */}
//           <div className="hidden md:flex items-center space-x-4">
            
//             <Button size="sm" className="bg-accent hover:bg-accent/90">
//               Create Event
//             </Button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
//               <Link
//                 href="/"
//                 className="block px-3 py-2 text-foreground hover:text-accent transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Events
//               </Link>
//               <Link
//                 href="/categories"
//                 className="block px-3 py-2 text-muted hover:text-accent transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Categories
//               </Link>
//               <Link
//                 href="/my-tickets"
//                 className="block px-3 py-2 text-muted hover:text-accent transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 My Tickets
//               </Link>
//               <Link
//                 href="/verify"
//                 className="block px-3 py-2 text-muted hover:text-accent transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Verify
//               </Link>
//               {isAdminAuthenticated ? (
//                 <Link
//                   href="/admin"
//                   className="block px-3 py-2 text-muted hover:text-accent transition-colors"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Settings className="h-4 w-4" />
//                     Admin Panel
//                   </div>
//                 </Link>
//               ) : (
//                 <Link
//                   href="/admin/login"
//                   className="block px-3 py-2 text-muted hover:text-accent transition-colors"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <LogIn className="h-4 w-4" />
//                     Admin Login
//                   </div>
//                 </Link>
//               )}
//               <Link
//                 href="/about"
//                 className="block px-3 py-2 text-muted hover:text-accent transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </Link>
//               <div className="flex flex-col space-y-2 px-3 py-2">
//                 <Button variant="outline" size="sm">
//                   Sign In
//                 </Button>
//                 <Button size="sm" className="bg-accent hover:bg-accent/90">
//                   Create Event
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, CalendarHeart, Settings, LogIn } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch("/api/admin/check-auth")
      setIsAdminAuthenticated(response.ok)
    } catch (error) {
      setIsAdminAuthenticated(false)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <CalendarHeart className="h-8 w-8 text-orange-500" />
            <span className="font-extrabold text-xl text-gray-900">OwambeHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-800 hover:text-orange-500 transition-colors">
              Events
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-orange-500 transition-colors">
              Categories
            </Link>
            <Link href="/my-tickets" className="text-gray-600 hover:text-orange-500 transition-colors">
              My Tickets
            </Link>
            <Link href="/verify" className="text-gray-600 hover:text-orange-500 transition-colors">
              Verify
            </Link>
            {isAdminAuthenticated ? (
              <Link href="/admin" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Admin Panel
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1"
              >
                <LogIn className="h-4 w-4" />
                Admin Login
              </Link>
            )}
            <Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors">
              About
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
              Create Event
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-800 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
             
              <Link
                href="/my-tickets"
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Tickets
              </Link>
              <Link
                href="/verify"
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Verify
              </Link>
              {isAdminAuthenticated ? (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Admin Panel
                  </div>
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="block px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Admin Login
                  </div>
                </Link>
              )}
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
