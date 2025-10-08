import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nepali Community Indiana',
  description: 'Connect with Nepali people living in Indiana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100`}>
        <nav className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-lg">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-0">Nepali Community Indiana</h1>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <a href="/" className="hover:underline text-sm sm:text-base hover:text-blue-200">Home</a>
                <a href="/map" className="hover:underline text-sm sm:text-base hover:text-blue-200">Find Members</a>
                <a href="/register" className="hover:underline text-sm sm:text-base hover:text-blue-200">Register</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-4 sm:py-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}