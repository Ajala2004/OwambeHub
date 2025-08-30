// import type { Metadata } from 'next'
// import { GeistSans } from 'geist/font/sans'
// import { GeistMono } from 'geist/font/mono'
// import { Analytics } from '@vercel/analytics/next'
// import './globals.css'

// export const metadata: Metadata = {
//   title: 'v0 App',
//   description: 'Created with v0',
//   generator: 'v0.app',
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   )
// }

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OwambeHub | Naija Event Platform',
  description:
    'OwambeHub is your No.1 Nigerian platform to discover concerts, owambes, festivals, and unforgettable gatherings. Built to connect people through experiences, proudly located in Gombe State, North East Nigeria.',
  generator: 'OwambeHub',
  keywords: [
    'OwambeHub',
    'Naija Events',
    'Gombe Events',
    'Nigeria Concerts',
    'Festivals',
    'Parties',
    'Event Tickets',
  ],
  authors: [{ name: 'OwambeHub Team' }],
  openGraph: {
    title: 'OwambeHub | Naija Event Platform',
    description:
      'Discover and create amazing events with OwambeHub — from local owambes to big concerts, right here in Gombe State, North East Nigeria.',
    url: 'https://owambehub.vercel.app', // ✅ using Vercel free domain
    siteName: 'OwambeHub',
    locale: 'en_NG',
    type: 'website',
  },
  metadataBase: new URL('https://owambehub.vercel.app'), // ✅ so all links/images resolve correctly
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-gray-50 text-gray-900`}
      >
        {children}
        <Analytics />

        {/* Small footer note visible on all pages */}
        <footer className="text-center py-4 text-gray-500 text-sm border-t mt-10">
          Proudly built in Gombe State, North East Nigeria 🇳🇬 
        </footer>
      </body>
    </html>
  )
}
