import React from 'react';

const SkeletonStaffSettings = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar Skeleton */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-2">
          <div className="h-7 bg-slate-200 rounded-xl w-48" />
          <div className="h-4 bg-slate-100 rounded-lg w-80" />
        </div>

        {/* Main Settings Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Sidebar Navigation Skeleton (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-12 bg-slate-100 rounded-2xl" />
            ))}
          </div>

          {/* Right Content Area Skeleton (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-8">
            
            {/* Avatar Section Skeleton */}
            <div className="space-y-5 border-b border-slate-100 pb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-200 flex-shrink-0" />
              <div className="space-y-2.5 w-full text-center sm:text-left pt-2">
                <div className="h-5 bg-slate-200 rounded-lg w-40 mx-auto sm:mx-0" />
                <div className="h-4 bg-slate-100 rounded-lg w-32 mx-auto sm:mx-0" />
                <div className="h-3 bg-slate-100 rounded-lg w-64 mx-auto sm:mx-0" />
              </div>
            </div>

            {/* Form Inputs Grid Skeleton */}
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="h-5 bg-slate-200 rounded-lg w-36" />
                <div className="h-3 bg-slate-100 rounded-lg w-52" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-24" />
                    <div className="w-full h-12 bg-slate-100 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="pt-4 flex justify-end">
              <div className="w-32 h-11 bg-slate-200 rounded-2xl" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SkeletonStaffSettings;