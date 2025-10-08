export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            {/* Flag and Title */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-600">
                <svg width="60" height="72" viewBox="0 0 60 72" className="w-14 h-17 sm:w-16 sm:h-19">
                  {/* Nepal Flag - Accurate Recreation */}
                  
                  {/* Blue outer border */}
                  <path d="M0 0 L36 0 L60 36 L36 36 L0 72 L0 0 Z" fill="#003893" stroke="#003893" stroke-width="1"/>
                  
                  {/* Red upper triangle */}
                  <path d="M3 3 L33 3 L3 33 Z" fill="#DC143C"/>
                  
                  {/* Red lower triangle */}
                  <path d="M3 39 L33 39 L3 69 Z" fill="#DC143C"/>
                  
                  {/* White sun in upper triangle */}
                  <g transform="translate(18, 18)">
                    {/* Sun rays - 12 pointed rays */}
                    <g fill="white">
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(30)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(60)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(90)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(120)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(150)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(180)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(210)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(240)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(270)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(300)"/>
                      <path d="M0,-8 L1.2,-5.5 L-1.2,-5.5 Z" transform="rotate(330)"/>
                    </g>
                    {/* Sun center circle */}
                    <circle cx="0" cy="0" r="3.5" fill="white"/>
                  </g>
                  
                  {/* White moon in lower triangle */}
                  <g transform="translate(18, 54)">
                    {/* Moon rays - 12 pointed rays */}
                    <g fill="white">
                      <path d="M0,-6 L1,-4 L-1,-4 Z"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(30)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(60)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(90)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(120)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(150)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(180)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(210)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(240)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(270)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(300)"/>
                      <path d="M0,-6 L1,-4 L-1,-4 Z" transform="rotate(330)"/>
                    </g>
                    {/* Moon crescent */}
                    <path d="M-2.5,0 A2.5,2.5 0 1,1 2.5,0 A1.5,1.5 0 1,0 -2.5,0 Z" fill="white"/>
                  </g>
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  Nepali Community
                </h1>
                <p className="text-2xl sm:text-3xl font-semibold text-blue-600 dark:text-blue-400 mt-2">
                  Indiana
                </p>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connect with fellow <span className="font-semibold text-blue-600 dark:text-blue-400">Nepali people</span> living in Indiana. 
              Build meaningful relationships and find your home away from home.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a 
                href="/map" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Explore Community Map</span>
              </a>

              <a 
                href="/register" 
                className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Join Community</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* New to Indiana Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <div className="relative backdrop-blur-2xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🏠
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  New to Indiana?
                </h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Find Nepali community members near you. Connect with people who share your culture, language, and can help you settle into your new home with confidence.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
                    <span className="text-violet-600">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Find nearby Nepali families</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
                    <span className="text-violet-600">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Get local recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
                    <span className="text-violet-600">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Cultural support & guidance</span>
                </div>
              </div>
              <a 
                href="/map" 
                className="group/btn relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-violet-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-xl">🗺️</span>
                  <span>Find Members Near You</span>
                </div>
              </a>
            </div>
          </div>

          {/* Join Community Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-blue-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <div className="relative backdrop-blur-2xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🤝
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Join Our Community
                </h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Register to help new Nepali residents find community support and connections. Be part of building a stronger, more connected Nepali community in Indiana.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Help newcomers settle in</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Share local knowledge</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Build lasting friendships</span>
                </div>
              </div>
              <a 
                href="/register" 
                className="group/btn relative overflow-hidden bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-xl">👥</span>
                  <span>Register Now</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* About Platform Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
          <div className="relative backdrop-blur-2xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Built by the community, for the community. We prioritize your privacy, security, and meaningful connections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-4xl shadow-2xl mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    🔒
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Privacy First</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We only store approximate locations and you have complete control over what contact information to share. Your privacy is our priority.
                </p>
              </div>

              <div className="group text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl shadow-2xl mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    🎯
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Easy Connection</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Find members through our beautiful interactive map and connect via your preferred method. Simple, fast, and effective.
                </p>
              </div>

              <div className="group text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-4xl shadow-2xl mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    ❤️
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Community Support</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Help newcomers feel at home by sharing your experience and local knowledge. Together, we build a stronger community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Footer */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-cyan-600/20 to-emerald-600/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Ready to Connect?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-10">
            Join hundreds of Nepali families who have already found their community in Indiana.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="/map" 
              className="group relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-violet-500/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                <span className="text-2xl">🗺️</span>
                <span>Start Exploring</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}