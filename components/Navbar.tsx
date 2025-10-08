'use client'

import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-cyan-600/10 to-emerald-600/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 via-blue-500 to-red-500 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300">
              🇳🇵
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Nepali Community
              </h1>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 -mt-1">
                Indiana
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-black bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                NC Indiana
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <a 
              href="/" 
              className="group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative flex items-center gap-2">
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </div>
            </a>
            <a 
              href="/map" 
              className="group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <span>Find Members</span>
              </div>
            </a>
            <a 
              href="/register" 
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span>Join Community</span>
              </div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white p-3 rounded-2xl shadow-xl hover:shadow-violet-500/25 transform hover:scale-105 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
              <div className="relative backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl p-4 shadow-2xl space-y-2">
                <a 
                  href="/" 
                  className="group relative overflow-hidden block px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative flex items-center gap-3">
                    <span className="text-xl">🏠</span>
                    <span>Home</span>
                  </div>
                </a>
                <a 
                  href="/map" 
                  className="group relative overflow-hidden block px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative flex items-center gap-3">
                    <span className="text-xl">🗺️</span>
                    <span>Find Members</span>
                  </div>
                </a>
                <a 
                  href="/register" 
                  className="group relative overflow-hidden block bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-4 py-3 rounded-xl font-bold shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <span className="text-xl">👥</span>
                    <span>Join Community</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}