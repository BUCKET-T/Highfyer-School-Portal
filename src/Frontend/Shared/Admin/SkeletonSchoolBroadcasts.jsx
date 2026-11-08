import React from 'react';

const SkeletonSchoolBroadcasts = () => {
  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased animate-pulse">
      
      {/* Top Header Card Container Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 text-left">
          <div className="h-8 w-60 bg-slate-200 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-10 w-44 bg-slate-100 rounded-2xl" />
      </div>

      {/* Compose Announcement Card Container Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6">
        <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 flex-shrink-0" />
          <div className="space-y-2 text-left">
            <div className="h-5 w-44 bg-slate-200 rounded" />
            <div className="h-3 w-64 bg-slate-100 rounded" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-100 rounded" />
              <div className="h-12 w-full bg-slate-100 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-12 w-full bg-slate-100 rounded-2xl" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-28 bg-slate-100 rounded" />
            <div className="h-12 w-full bg-slate-100 rounded-2xl" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-32 bg-slate-100 rounded" />
            <div className="h-32 w-full bg-slate-100 rounded-2xl" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="h-12 w-44 bg-slate-100 rounded-2xl" />
            <div className="h-12 w-40 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Recent History Section Skeleton */}
      <div className="space-y-4 pt-4 text-left">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-5 h-5 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>

        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="h-6 w-24 bg-slate-100 rounded-full" />
                  <div className="h-6 w-20 bg-slate-100 rounded-full" />
                </div>
                <div className="h-4 w-20 bg-slate-100 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-64 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SkeletonSchoolBroadcasts;