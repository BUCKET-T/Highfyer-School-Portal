import React from 'react';

const SkeletonDashboard = () => {
  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 bg-slate-50 min-h-screen animate-pulse select-none">
      
      {/* Top Greeting & User Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex-shrink-0" />
          <div className="space-y-2">
            <div className="w-48 h-6 bg-slate-200 rounded-lg" />
            <div className="w-64 h-4 bg-slate-100 rounded-md" />
          </div>
        </div>

        <div className="flex items-center space-x-4 self-end sm:self-center">
          {/* Notification Bell Placeholder */}
          <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          
          {/* Student Profile Widget */}
          <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <div className="w-9 h-9 bg-slate-200 rounded-xl" />
            <div className="space-y-1">
              <div className="w-24 h-3.5 bg-slate-200 rounded-md" />
              <div className="w-16 h-2.5 bg-slate-100 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-6 rounded-3xl shadow-sm space-y-4 border border-slate-100">
            <div className="w-28 h-3.5 bg-slate-200 rounded-md uppercase tracking-wider" />
            <div className="flex items-baseline justify-between">
              <div className="w-16 h-8 bg-slate-300 rounded-lg" />
              <div className="w-12 h-5 bg-slate-100 rounded-full" />
            </div>
            <div className="w-32 h-3 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>

      {/* Middle Section: Continuing Courses & Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Continuing Courses Section (Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="w-36 h-5 bg-slate-200 rounded-md" />
            <div className="w-16 h-4 bg-slate-100 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map((course) => (
              <div key={course} className="bg-white p-6 rounded-3xl shadow-sm space-y-4 border border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="space-y-2">
                  <div className="w-36 h-5 bg-slate-200 rounded-md" />
                  <div className="w-48 h-3.5 bg-slate-100 rounded-md" />
                </div>
                <div className="pt-4 flex justify-between items-center border-t border-slate-50">
                  <div className="w-16 h-6 bg-slate-100 rounded-full" />
                  <div className="w-20 h-4 bg-slate-200 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Achievements Card (Span 4 - Dark Navy Theme) */}
        <div className="lg:col-span-4 bg-brand-navy p-6 rounded-3xl shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="w-36 h-4 bg-slate-700/60 rounded-md" />
            <div className="w-28 h-6 bg-slate-700/80 rounded-md" />
          </div>

          <div className="grid grid-cols-3 gap-3 py-4">
            {[1, 2, 3].map((badge) => (
              <div key={badge} className="h-24 bg-slate-800/60 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 bg-slate-700/60 rounded-xl" />
                <div className="w-12 h-2.5 bg-slate-700/40 rounded-md" />
              </div>
            ))}
          </div>

          <div className="w-full h-11 bg-slate-800 rounded-xl" />
        </div>

      </div>

    </div>
  );
};

export default SkeletonDashboard;