import React from 'react';

const SkeletonAdminSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col bg-[#121B2D] text-slate-300 h-screen sticky top-0 border-r border-slate-800/80 shadow-xl z-20 flex-shrink-0 w-[280px] p-5 animate-pulse justify-between">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl" />
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-800 rounded w-20" />
              <div className="h-2.5 bg-slate-800/60 rounded w-14" />
            </div>
          </div>
          <div className="w-8 h-8 bg-slate-800 rounded-xl" />
        </div>

        {/* Nav Links Skeletons */}
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-11 bg-slate-800/50 rounded-2xl w-full" />
          ))}
        </div>
      </div>

      {/* Footer Section Skeleton */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="h-11 bg-slate-800/50 rounded-2xl w-full" />
        <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-800 rounded w-24" />
              <div className="h-2 bg-slate-800/60 rounded w-16" />
            </div>
          </div>
          <div className="w-8 h-8 bg-slate-800 rounded-xl flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
};

export default SkeletonAdminSidebar;