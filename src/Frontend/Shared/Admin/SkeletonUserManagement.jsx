import React from 'react';

const SkeletonUserManagement = () => {
  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased animate-pulse">
      
      {/* Top Header Card Container Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 text-left">
          <div className="h-8 w-56 bg-slate-200 rounded-xl" />
          <div className="h-4 w-72 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-11 w-32 bg-slate-100 rounded-2xl" />
          <div className="h-11 w-36 bg-slate-200 rounded-2xl" />
        </div>
      </div>

      {/* Navigation Filter Tabs Skeleton */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 flex gap-2 max-w-fit">
        {[1, 2, 3, 4].map((tab) => (
          <div key={tab} className="h-10 w-28 bg-slate-100 rounded-xl" />
        ))}
      </div>

      {/* Search Bar & User Directory Card Skeleton */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-12 w-full sm:w-96 bg-slate-100 rounded-2xl" />
          <div className="h-4 w-24 bg-slate-100 rounded" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between py-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-200 flex-shrink-0" />
                <div className="space-y-2">
                  <div className="h-3.5 w-36 bg-slate-200 rounded" />
                  <div className="h-3 w-48 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-slate-100 rounded-full hidden sm:block" />
              <div className="h-6 w-16 bg-slate-100 rounded-full" />
              <div className="h-3 w-24 bg-slate-100 rounded hidden md:block" />
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100" />
                <div className="w-8 h-8 rounded-xl bg-slate-100" />
                <div className="w-8 h-8 rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SkeletonUserManagement;