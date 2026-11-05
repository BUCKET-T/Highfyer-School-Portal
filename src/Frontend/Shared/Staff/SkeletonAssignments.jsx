import React from 'react';

const SkeletonAssignments = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-2">
            <div className="h-7 bg-slate-200 rounded-xl w-48"></div>
            <div className="h-4 bg-slate-100 rounded-lg w-64"></div>
          </div>
          <div className="h-12 bg-slate-200 rounded-2xl w-40"></div>
        </div>

        {/* Search & Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-12 bg-white border border-slate-200 rounded-2xl w-full sm:w-96 shadow-sm"></div>
          <div className="h-12 bg-white border border-slate-200 rounded-2xl w-36 shadow-sm"></div>
        </div>

        {/* Metric Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-200 p-6 rounded-3xl h-36 space-y-3">
              <div className="h-3 bg-slate-300 rounded w-24"></div>
              <div className="h-10 bg-slate-300 rounded w-16"></div>
              <div className="h-3 bg-slate-300 rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Recent Assignments List Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded-lg w-40"></div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-5">
                <div className="space-y-3 flex-1 w-full">
                  <div className="flex space-x-2">
                    <div className="h-5 bg-slate-200 rounded-md w-20"></div>
                    <div className="h-5 bg-slate-200 rounded-md w-16"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded-md w-48"></div>
                </div>
                <div className="w-full md:w-64 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-28"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkeletonAssignments;