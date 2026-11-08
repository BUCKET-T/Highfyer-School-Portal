import React from 'react';

const SkeletonAcademicApprovals = () => {
  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased animate-pulse">
      
      {/* Top Header Card Container Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 text-left">
          <div className="h-8 w-72 bg-slate-200 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-40 bg-slate-100 rounded-2xl" />
          <div className="h-11 w-36 bg-slate-200 rounded-2xl" />
        </div>
      </div>

      {/* Status Result Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((card) => (
          <div key={card} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3 text-left">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-9 w-12 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Submission Queue Table Card Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="h-5 w-44 bg-slate-200 rounded-md" />
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="h-10 w-full sm:w-80 bg-slate-100 rounded-2xl" />
            <div className="h-10 w-36 bg-slate-100 rounded-2xl" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between py-4 border-b border-slate-100">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-100 rounded" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-slate-200 rounded" />
                  <div className="h-2.5 w-24 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-4 w-12 bg-slate-200 rounded" />
              <div className="h-6 w-24 bg-slate-100 rounded-full" />
              <div className="flex items-center space-x-2">
                <div className="h-9 w-24 bg-slate-100 rounded-xl" />
                <div className="w-9 h-9 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SkeletonAcademicApprovals;