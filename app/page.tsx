export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to Nepali Community Indiana
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-2">
          Connect with fellow Nepali people living in Indiana
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">New to Indiana?</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Find Nepali community members near you. Connect with people who share your culture and can help you settle in.
          </p>
          <a 
            href="/map" 
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 inline-block text-sm sm:text-base w-full sm:w-auto text-center"
          >
            Find Members Near You
          </a>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Register to help new Nepali residents find community support and connections in Indiana.
          </p>
          <a 
            href="/register" 
            className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-green-700 inline-block text-sm sm:text-base w-full sm:w-auto text-center"
          >
            Register Now
          </a>
        </div>
      </div>

      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">About This Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600">
              We only store approximate locations and you control what contact information to share.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Easy Connection</h3>
            <p className="text-sm text-gray-600">
              Find members through our interactive map and connect via your preferred method.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Community Support</h3>
            <p className="text-sm text-gray-600">
              Help newcomers feel at home by sharing your experience and local knowledge.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}