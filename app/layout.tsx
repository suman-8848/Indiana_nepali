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
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Nepali Community Indiana</h1>
            <div className="space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/map" className="hover:underline">Find Members</a>
              <a href="/register" className="hover:underline">Register</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}