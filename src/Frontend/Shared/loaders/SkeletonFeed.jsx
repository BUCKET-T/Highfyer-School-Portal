import React from 'react';

const SkeletonFeed = () => {
  return (
    <div className="space-y-5 animate-pulse">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5"
        >
          {/* Category & Date Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-28 bg-slate-200 rounded-xl"></div>
              <div className="h-6 w-24 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </div>

          {/* Title Placeholder */}
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded-xl w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded-xl w-1/2"></div>
          </div>

          {/* Content Summary Placeholder */}
          <div className="space-y-2 pt-1">
            <div className="h-4 bg-slate-150 bg-slate-200 rounded-lg w-full"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-5/6"></div>
          </div>

          {/* Author Bar Placeholder */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
              <div className="space-y-1">
                <div className="h-3 w-28 bg-slate-200 rounded"></div>
                <div className="h-2.5 w-36 bg-slate-150 bg-slate-200 rounded"></div>
              </div>
            </div>

            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonFeed;