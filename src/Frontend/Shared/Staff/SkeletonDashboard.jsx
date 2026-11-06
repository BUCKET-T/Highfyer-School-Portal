import React from 'react';

const SkeletonDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 gap-4">
        <div className="space-y-2 w-full md:w-1/3">
          <div className="w-48 h-8 bg-slate-200 rounded-xl" />
          <div className="w-64 h-4 bg-slate-200 rounded-md" />
        </div>
        <div className="w-full md:w-64 h-12 bg-slate-200 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
            <div className="w-24 h-4 bg-slate-200 rounded-md" />
            <div className="w-16 h-8 bg-slate-200 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="w-40 h-6 bg-slate-200 rounded-md" />
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-white rounded-3xl border border-slate-100" />
          ))}
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-64 bg-white rounded-3xl border border-slate-100" />
          <div className="h-32 bg-slate-900 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonDashboard;