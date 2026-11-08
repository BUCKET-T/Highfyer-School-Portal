import React from 'react';

const SkeletonSettings = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/60 min-h-screen animate-pulse font-sans">
      
      {/* Top Header Banner Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-slate-200 rounded-2xl flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-7 w-40 bg-slate-200 rounded-xl" />
            <div className="h-4 w-64 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="h-10 w-48 bg-slate-100 rounded-2xl" />
      </div>

      {/* Main Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sub-Tab Navigation Skeleton */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl border border-slate-100 space-y-2">
          {[1, 2, 3, 4, 5].map((btn) => (
            <div key={btn} className="w-full h-12 bg-slate-100 rounded-2xl" />
          ))}
        </div>

        {/* Right Content Area Skeleton */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-8">
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-72 bg-slate-100 rounded" />
            <div className="flex items-center gap-6 pt-2">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex-shrink-0" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-44 bg-slate-100 rounded" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-5 w-36 bg-slate-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((field) => (
                <div key={field} className="space-y-1.5">
                  <div className="h-3 w-28 bg-slate-100 rounded" />
                  <div className="h-12 w-full bg-slate-100 rounded-2xl" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SkeletonSettings;