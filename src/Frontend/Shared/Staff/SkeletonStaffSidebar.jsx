import React from 'react';

const SkeletonStaffSidebar = () => {
  return (
    <aside className="w-64 bg-[#1B253B] h-screen fixed left-0 top-0 z-30 border-r border-slate-800 shadow-xl p-5 flex flex-col justify-between animate-pulse">
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-1 pt-2">
          <div className="w-10 h-10 bg-slate-700 rounded-xl" />
          <div className="space-y-1.5">
            <div className="w-20 h-4 bg-slate-700 rounded-md" />
            <div className="w-12 h-3 bg-slate-800 rounded-md" />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="w-full h-11 bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-800/80">
        <div className="w-full h-11 bg-slate-800/60 rounded-2xl" />
        <div className="w-full h-14 bg-slate-800/80 rounded-2xl flex items-center space-x-3 px-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="w-24 h-3 bg-slate-700 rounded-md" />
            <div className="w-16 h-2.5 bg-slate-800 rounded-md" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SkeletonStaffSidebar;