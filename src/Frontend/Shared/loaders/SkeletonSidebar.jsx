import React from 'react';

const SkeletonSidebar = () => {
  return (
    <aside className="w-64 bg-brand-navy min-h-screen p-6 flex flex-col justify-between select-none animate-pulse">
      
      {/* Top Section: Logo & App Title Placeholder */}
      <div className="space-y-8">
        <div className="flex items-center space-x-3">
          {/* Logo Box Skeleton */}
          <div className="w-10 h-10 bg-slate-700/60 rounded-xl" />
          
          {/* Brand Name & Portal Text Skeletons */}
          <div className="space-y-1.5">
            <div className="w-24 h-4 bg-slate-700/60 rounded-md" />
            <div className="w-16 h-2.5 bg-slate-700/40 rounded-md" />
          </div>
        </div>

        {/* Navigation Links Skeletons */}
        <div className="space-y-4 pt-2">
          {/* Dashboard (Active Pill Simulation) */}
          <div className="w-full h-12 bg-blue-500/20 rounded-2xl flex items-center px-4 space-x-3">
            <div className="w-5 h-5 bg-blue-400/40 rounded-md" />
            <div className="w-28 h-4 bg-blue-400/40 rounded-md" />
          </div>

          {/* Other Nav Links (My Courses, Assignments, Results, Feed) */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="w-full h-12 flex items-center px-4 space-x-3 opacity-60">
              <div className="w-5 h-5 bg-slate-700/60 rounded-md" />
              <div className="w-24 h-3.5 bg-slate-700/60 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Settings & Logout Skeletons */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        {/* Settings */}
        <div className="w-full h-10 flex items-center px-4 space-x-3 opacity-60">
          <div className="w-5 h-5 bg-slate-700/60 rounded-md" />
          <div className="w-20 h-3.5 bg-slate-700/60 rounded-md" />
        </div>

        {/* Logout */}
        <div className="w-full h-10 flex items-center px-4 space-x-3 opacity-70">
          <div className="w-5 h-5 bg-coral-500/30 rounded-md" />
          <div className="w-16 h-3.5 bg-brand-coral/40 rounded-md" />
        </div>
      </div>

    </aside>
  );
};

export default SkeletonSidebar;