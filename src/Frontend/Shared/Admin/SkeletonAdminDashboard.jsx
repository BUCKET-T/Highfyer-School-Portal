import React from 'react';

const SkeletonAdminDashboard = () => {
  return (
    <div className="p-3 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto font-sans antialiased animate-pulse">
      
      {/* Header Bar Skeleton */}
      <div className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2 text-left">
          <div className="h-8 w-64 bg-slate-200 rounded-xl" />
          <div className="h-4 w-80 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-44 bg-slate-100 rounded-full" />
          <div className="h-10 w-10 bg-slate-200 rounded-2xl" />
          <div className="h-11 w-11 bg-slate-200 rounded-2xl" />
        </div>
      </div>

      {/* High-Level Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-200" />
              <div className="w-14 h-5 bg-slate-100 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-slate-100 rounded" />
              <div className="h-8 w-16 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Section: Portal Traffic Graph & Staff Activity Feed Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-3xl border border-slate-100 space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-slate-200 rounded-md" />
              <div className="h-3 w-64 bg-slate-100 rounded" />
            </div>
            <div className="h-7 w-20 bg-slate-100 rounded-2xl" />
          </div>
          <div className="h-48 w-full bg-slate-50 rounded-2xl border border-slate-100" />
        </div>

        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 space-y-6 text-left flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="h-5 w-28 bg-slate-200 rounded-md" />
            <div className="w-4 h-4 bg-slate-200 rounded-full" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-11 w-full bg-slate-100 rounded-2xl" />
        </div>
      </div>

      {/* Action Banners Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {[1, 2, 3].map((card) => (
          <div key={card} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6 text-left">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-slate-200 rounded-lg" />
              <div className="h-4 w-full bg-slate-100 rounded" />
            </div>
            <div className="h-11 w-full bg-slate-200 rounded-2xl" />
          </div>
        ))}
      </div>

    </div>
  );
};

export default SkeletonAdminDashboard;