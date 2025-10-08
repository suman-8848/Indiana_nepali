'use client'

import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 border border-gray-200/50 dark:border-gray-700/50">
              <svg width="30" height="24" viewBox="0 0 30 24" className="w-7 h-6 sm:w-8 sm:h-7">
                {/* Nepal Flag - Exact Recreation */}
                <defs>
                  <clipPath id="nepal-flag-clip">
                    <path d="M2 2 L15 2 L28 12 L15 12 L2 22 L2 2 Z"/>
                  </clipPath>
                </defs>
                
                {/* Blue outer border */}
                <path d="M0 0 L15 0 L30 12 L15 12 L0 24 L0 0 Z" fill="#003893"/>
                
                {/* Red inner triangles */}
                <path d="M2 2 L13 2 L2 10 Z" fill="#DC143C"/>
                <path d="M2 14 L13 14 L2 22 Z" fill="#DC143C"/>
                
                {/* White sun in upper triangle */}
                <g transform="translate(7.5, 6)">
                  {/* Sun rays - 12 pointed star */}
                  <g fill="white">
                    <polygon points="0,-2.5 0.3,-1.8 -0.3,-1.8"/>
                    <polygon points="1.25,-2.17 1.8,-1.25 1.06,-1.56"/>
                    <polygon points="2.17,-1.25 2.5,0 1.8,-0.3"/>
                    <polygon points="2.17,1.25 1.8,0.3 2.5,0"/>
                    <polygon points="1.25,2.17 1.06,1.56 1.8,1.25"/>
                    <polygon points="0,2.5 -0.3,1.8 0.3,1.8"/>
                    <polygon points="-1.25,2.17 -1.06,1.56 -1.8,1.25"/>
                    <polygon points="-2.17,1.25 -1.8,0.3 -2.5,0"/>
                    <polygon points="-2.17,-1.25 -2.5,0 -1.8,-0.3"/>
                    <polygon points="-1.25,-2.17 -1.8,-1.25 -1.06,-1.56"/>
                  </g>
                  {/* Sun center circle */}
                  <circle cx="0" cy="0" r="1.2" fill="white"/>
                </g>
                
                {/* White moon in lower triangle */}
                <g transform="translate(7.5, 18)">
                  {/* Moon rays - 8 pointed star */}
                  <g fill="white">
                    <polygon points="0,-2 0.2,-1.5 -0.2,-1.5"/>
                    <polygon points="1.4,-1.4 1.5,-1 1,-1.2"/>
                    <polygon points="2,0 1.5,0.2 1.5,-0.2"/>
                    <polygon points="1.4,1.4 1,1.2 1.5,1"/>
                    <polygon points="0,2 -0.2,1.5 0.2,1.5"/>
                    <polygon points="-1.4,1.4 -1,1.2 -1.5,1"/>
                    <polygon points="-2,0 -1.5,-0.2 -1.5,0.2"/>
                    <polygon points="-1.4,-1.4 -1.5,-1 -1,-1.2"/>
                  </g>
                  {/* Moon crescent */}
                  <path d="M-1,0 A1,1 0 1,1 1,0 A0.6,0.6 0 1,0 -1,0 Z" fill="white"/>
                </g>
                
                {/* Blue border outline */}
                <path d="M0 0 L15 0 L30 12 L15 12 L0 24 L0 0 Z" fill="none" stroke="#003893" strokeWidth="0.5"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Nepali Community
              </h1>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 -mt-1">
                Indiana
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                NC Indiana
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <a 
              href="/" 
              className="px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </a>
            <a 
              href="/map" 
              className="px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Find Members</span>
            </a>
            <a 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Join Community</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg mt-2 shadow-lg">
              <div className="p-2 space-y-1">
                <a 
                  href="/" 
                  className="block px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </a>
                <a 
                  href="/map" 
                  className="block px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span>Find Members</span>
                </a>
                <a 
                  href="/register" 
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Join Community</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}