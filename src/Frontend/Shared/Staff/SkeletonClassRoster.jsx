import React from 'react';

const SkeletonClassRoster = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-2">
            <div className="h-7 bg-slate-200 rounded-xl w-44" />
            <div className="h-4 bg-slate-100 rounded-lg w-64" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-11 bg-slate-100 rounded-2xl w-36" />
            <div className="h-11 bg-slate-200 rounded-2xl w-36" />
          </div>
        </div>

        {/* Search & Sort Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-96 h-12 bg-white rounded-2xl border border-slate-200" />
          <div className="w-48 h-12 bg-white rounded-2xl border border-slate-200" />
        </div>

        {/* Pupil Cards List Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              <div className="flex items-center space-x-5 xl:w-64">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded-lg w-32" />
                  <div className="h-3 bg-slate-100 rounded w-20" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1">
                <div className="space-y-1.5"><div className="h-3 bg-slate-100 w-24 rounded" /><div className="h-4 bg-slate-200 w-36 rounded" /></div>
                <div className="space-y-1.5"><div className="h-3 bg-slate-100 w-24 rounded" /><div className="h-4 bg-slate-200 w-36 rounded" /></div>
                <div className="space-y-1.5"><div className="h-3 bg-slate-100 w-24 rounded" /><div className="h-4 bg-slate-200 w-44 rounded" /></div>
                <div className="space-y-1.5"><div className="h-3 bg-slate-100 w-24 rounded" /><div className="h-4 bg-slate-200 w-40 rounded" /></div>
              </div>
              <div className="flex flex-col sm:flex-row xl:flex-col gap-3 xl:w-72">
                <div className="h-16 bg-slate-100 rounded-2xl w-full" />
                <div className="h-16 bg-slate-100 rounded-2xl w-full" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SkeletonClassRoster;