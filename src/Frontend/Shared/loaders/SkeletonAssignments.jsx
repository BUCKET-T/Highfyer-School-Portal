import React from 'react';

const SkeletonAssignments = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/60 min-h-screen animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
        <div className="space-y-2">
          <div className="w-48 h-6 bg-slate-200 rounded-lg" />
          <div className="w-32 h-4 bg-slate-100 rounded-lg" />
        </div>
        <div className="w-44 h-10 bg-slate-200 rounded-2xl" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 h-24" />
        ))}
      </div>

      {/* Main Section Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="w-32 h-6 bg-slate-200 rounded-lg" />
          <div className="w-28 h-8 bg-slate-200 rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonAssignments;