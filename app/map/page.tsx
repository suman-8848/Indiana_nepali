import CommunityMap from '../../components/CommunityMap'

export default function MapPage() {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left">Find Community Members</h1>
        <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
          Discover Nepali community members near you in Indiana. Click on markers to see contact information.
        </p>
      </div>
      
      <CommunityMap />
      
      <div className="mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <h3 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">Privacy Notice</h3>
        <p className="text-xs sm:text-sm text-yellow-700">
          Locations shown are approximate for privacy protection. Contact information is only visible 
          to help community members connect with each other.
        </p>
      </div>
    </div>
  )
}