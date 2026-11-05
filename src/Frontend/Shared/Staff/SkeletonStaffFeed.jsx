import React from 'react';

const SkeletonStaffFeed = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-2">
            <div className="h-7 bg-slate-200 rounded-xl w-40" />
            <div className="h-4 bg-slate-100 rounded-lg w-64" />
          </div>
          <div className="w-full md:w-80 h-12 bg-slate-100 rounded-2xl" />
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-slate-200 rounded-lg w-48" />
              <div className="h-10 bg-slate-100 rounded-2xl w-48" />
            </div>

            <div className="space-y-5">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-4 bg-slate-200 rounded w-32" />
                        <div className="h-3 bg-slate-100 rounded w-24" />
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded w-16" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                  </div>
                  <div className="h-12 bg-slate-100 rounded-xl w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <div className="h-6 bg-slate-200 rounded w-40" />
              <div className="space-y-3">
                <div className="h-20 bg-slate-100 rounded-2xl w-full" />
                <div className="h-20 bg-slate-100 rounded-2xl w-full" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SkeletonStaffFeed;