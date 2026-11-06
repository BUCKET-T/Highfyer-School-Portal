import React from 'react';

const SkeletonAttendance = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 animate-pulse space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-2 w-full md:w-1/3">
          <div className="w-32 h-4 bg-slate-200 rounded-md" />
          <div className="w-64 h-8 bg-slate-200 rounded-xl" />
        </div>
        <div className="w-full md:w-48 h-12 bg-slate-200 rounded-2xl" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-2">
            <div className="w-20 h-3 bg-slate-200 rounded-md" />
            <div className="w-16 h-8 bg-slate-200 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-64 h-11 bg-slate-200 rounded-2xl" />
          <div className="w-40 h-11 bg-slate-200 rounded-2xl" />
        </div>
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-16 bg-slate-100 rounded-2xl w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonAttendance;