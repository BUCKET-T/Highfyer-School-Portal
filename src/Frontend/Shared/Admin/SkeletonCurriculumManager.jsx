import React from 'react';

const SkeletonCurriculumManager = () => {
  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased animate-pulse">
      
      {/* Top Header Banner Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 text-left">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-slate-200 rounded-2xl flex-shrink-0" />
            <div className="h-8 w-64 bg-slate-200 rounded-xl" />
          </div>
          <div className="h-4 w-96 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-12 w-36 bg-slate-200 rounded-2xl" />
      </div>

      {/* Filter Toolbar Skeleton */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((filter) => (
          <div key={filter} className="space-y-1.5 text-left">
            <div className="h-3 w-28 bg-slate-100 rounded" />
            <div className="h-12 w-full bg-slate-100 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Term Planner Skeleton */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="h-5 w-56 bg-slate-200 rounded" />
              <div className="h-6 w-32 bg-slate-100 rounded-full" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4].map((week) => (
                <div key={week} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="h-5 w-20 bg-slate-200 rounded-lg" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="h-10 bg-white border border-slate-200 rounded-xl" />
                    <div className="h-10 bg-white border border-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Objectives Skeleton */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="h-5 w-52 bg-slate-200 rounded" />
              <div className="h-6 w-24 bg-slate-100 rounded-full" />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1 h-12 bg-slate-100 rounded-2xl" />
              <div className="h-12 w-32 bg-slate-200 rounded-2xl flex-shrink-0" />
            </div>

            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((obj) => (
                <div key={obj} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-slate-200 rounded-lg flex-shrink-0" />
                    <div className="h-4 w-64 bg-slate-200 rounded" />
                  </div>
                  <div className="w-8 h-8 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-5">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-32 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl" />
          </div>

          <div className="bg-[#121B2D] p-6 rounded-3xl space-y-3">
            <div className="h-4 w-32 bg-sky-400/40 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-700 rounded" />
              <div className="h-3 w-3/4 bg-slate-700 rounded" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SkeletonCurriculumManager;