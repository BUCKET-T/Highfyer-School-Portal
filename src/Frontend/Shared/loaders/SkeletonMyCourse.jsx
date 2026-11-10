import React from 'react';

const SkeletonMyCourse = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-slate-50/60 min-h-screen animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
        <div className="space-y-2">
          <div className="w-48 h-6 bg-slate-200 rounded-lg" />
          <div className="w-32 h-4 bg-slate-100 rounded-lg" />
        </div>
        <div className="w-36 h-10 bg-slate-200 rounded-2xl" />
      </div>

      {/* Term Selector Bar Skeleton */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
        <div className="w-40 h-6 bg-slate-200 rounded-lg" />
        <div className="w-48 h-8 bg-slate-200 rounded-xl" />
      </div>

      {/* Course Cards Skeletons */}
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 h-24" />
        ))}
      </div>
    </div>
  );
};

export default SkeletonMyCourse;