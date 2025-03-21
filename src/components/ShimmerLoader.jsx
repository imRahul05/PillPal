// src/components/ShimmerLoader.jsx
import {
    ShimmerSectionHeader,
    ShimmerText,
    ShimmerThumbnail,
    ShimmerSimpleGallery,
  } from "react-shimmer-effects";
  
  const ShimmerLoader = () => {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Enhanced Sidebar Shimmer */}
          <div className="lg:col-span-3 space-y-6 bg-gray-50 p-4 rounded-lg">
            {/* Profile/User Section */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
              <ShimmerThumbnail height={60} width={60} rounded={true} />
              <div className="flex-1">
                <ShimmerText line={2} gap={6} />
              </div>
            </div>
            
            {/* Navigation Items */}
            <div className="space-y-3 py-2">
              <ShimmerThumbnail height={36} width="100%" rounded />
              <ShimmerThumbnail height={36} width="90%" rounded />
              <ShimmerThumbnail height={36} width="80%" rounded />
              <ShimmerThumbnail height={36} width="85%" rounded />
              <ShimmerThumbnail height={36} width="70%" rounded />
            </div>
            
            {/* Additional Section */}
            <div className="pt-2 border-t border-gray-200">
              <ShimmerSectionHeader />
              <ShimmerText line={2} gap={8} />
            </div>
            
            {/* Footer Section */}
            <div className="pt-2 mt-auto border-t border-gray-200">
              <ShimmerThumbnail height={40} width="100%" rounded />
            </div>
          </div>
  
          {/* Main Content Shimmer */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              {/* Stats Cards Shimmer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ShimmerThumbnail height={100} width="100%" rounded />
                <ShimmerThumbnail height={100} width="100%" rounded />
                <ShimmerThumbnail height={100} width="100%" rounded />
              </div>
  
              {/* Medications List Shimmer */}
              <div className="space-y-4">
                <ShimmerSectionHeader /> {/* Header */}
                <ShimmerThumbnail height={80} width="100%" rounded /> {/* Medication Card */}
                <ShimmerThumbnail height={80} width="100%" rounded /> {/* Medication Card */}
                <ShimmerThumbnail height={80} width="100%" rounded /> {/* Medication Card */}
              </div>
  
              {/* Upcoming Renewals Shimmer */}
              <div className="space-y-4">
                <ShimmerSectionHeader /> {/* Header */}
                <ShimmerThumbnail height={80} width="100%" rounded /> {/* Renewal Card */}
                <ShimmerThumbnail height={80} width="100%" rounded /> {/* Renewal Card */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ShimmerLoader;