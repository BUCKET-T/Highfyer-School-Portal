import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParentDashboardLogic } from '../../../Backend/Parent/ParentDashboardLogic';
import SkeletonDashboard from '../../Shared/loaders/SkeletonDashboard';

const Dashboard = () => {
  const {
    wards,
    currentWard,
    isDropdownOpen,
    setIsDropdownOpen,
    isLoading,
    classEducator,
    liveGrades,
    liveAssignments,
    liveAttendance,
    overallProgress,
    handleSelectWard,
    getInitials,
  } = useParentDashboardLogic();

  if (isLoading || !currentWard) {
    return <SkeletonDashboard />;
  }

  const badges = currentWard.badges || [
    { id: 'b1', name: 'SUPERSTAR', icon: '★', bg: 'bg-amber-400 text-white' },
    { id: 'b2', name: 'KINDNESS', icon: '♥', bg: 'bg-pink-500 text-white' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-slate-50/60 min-h-screen">
      
      {/* Top Header Banner & Ward Switcher */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Greeting & Portal Info */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-sky/20 text-brand-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-navy tracking-tight">
              Hello, {currentWard.full_name || 'Parent'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              Highflyer Kiddies Academy Parent Portal
            </p>
          </div>
        </div>

        {/* Right Action Bar: Multi-Ward Dropdown Switcher */}
        <div className="flex items-center justify-end space-x-3 pt-2 md:pt-0 border-t border-slate-100 md:border-none">
          <div className="relative">
            <button
              type="button"
              onClick={() => wards.length > 1 && setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center space-x-2.5 sm:space-x-3 bg-white border border-slate-200/80 p-1.5 sm:p-2 pr-3 sm:pr-4 rounded-2xl shadow-sm transition-all ${
                wards.length > 1 ? 'hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/30' : 'cursor-default'
              }`}
            >
              {currentWard.avatar_url ? (
                <img
                  src={currentWard.avatar_url}
                  alt={currentWard.full_name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-brand-blue/80 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center font-extrabold text-xs ring-2 ring-brand-blue/80 flex-shrink-0">
                  {getInitials(currentWard.full_name)}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-bold text-brand-navy leading-tight">{currentWard.full_name}</p>
                <p className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider pt-0.5">{currentWard.grade || currentWard.role_title || 'Pupil'}</p>
              </div>

              {wards.length > 1 && (
                <motion.svg
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4 text-slate-400 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              )}
            </button>

            {/* Dropdown Popover */}
            <AnimatePresence>
              {isDropdownOpen && wards.length > 1 && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 sm:right-0 left-auto mt-2 w-[calc(100vw-2rem)] sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Ward Account
                      </span>
                      <span className="text-[10px] font-bold text-brand-blue bg-brand-sky/20 px-2 py-0.5 rounded-full">
                        {wards.length} Linked
                      </span>
                    </div>

                    {wards.map((ward) => (
                      <button
                        key={ward.id}
                        type="button"
                        onClick={() => handleSelectWard(ward.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                          ward.id === currentWard.id
                            ? 'bg-brand-blue/10 border border-brand-blue/30'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {ward.avatar_url ? (
                            <img src={ward.avatar_url} alt={ward.full_name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-brand-navy text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                              {getInitials(ward.full_name)}
                            </div>
                          )}
                          <div className="text-left">
                            <p className="text-xs font-bold text-brand-navy">{ward.full_name}</p>
                            <p className="text-[10px] font-medium text-slate-500">{ward.grade || ward.role_title || 'Pupil'}</p>
                          </div>
                        </div>

                        {ward.id === currentWard.id && (
                          <div className="w-2 h-2 rounded-full bg-brand-blue ring-4 ring-brand-blue/20" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-3xl border-l-4 border-l-brand-blue shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Academic Performance</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-brand-navy">{overallProgress}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {liveGrades.length} Subjects
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-blue h-full rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-l-4 border-l-brand-navy shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Class Assignments</p>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-brand-navy">{liveAssignments.length}</span>
            <p className="text-xs font-medium text-slate-500">Active tasks for {currentWard.grade || 'class'}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-l-4 border-l-brand-coral shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Daily Attendance</p>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-brand-navy">{liveAttendance}%</span>
            <p className="text-xs font-semibold text-brand-coral">
              {liveAttendance >= 90 ? 'Elite Attendance Badge' : 'Good Standing'}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-l-4 border-l-amber-400 shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Honor Points</p>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-brand-navy">450</span>
            <p className="text-xs font-medium text-slate-500">Badge Rank: <span className="font-bold text-brand-navy">Highflyer</span></p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-extrabold text-brand-navy">Active Assignments & Tasks</h2>
              <p className="text-xs text-slate-500 font-medium">Classwork and homework assigned for {currentWard.grade || 'Grade'}</p>
            </div>
          </div>

          {liveAssignments.length > 0 ? (
            <div className="space-y-4">
              {liveAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider border bg-brand-blue/10 text-brand-blue border-brand-blue/20">
                      {assignment.subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-brand-navy">{assignment.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{assignment.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center space-y-4 py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-extrabold text-brand-navy">No Active Assignments</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  There are no active homework tasks or assignments posted for {currentWard.full_name || 'Ward'} at this moment.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-brand-navy text-white p-6 rounded-3xl shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Recent Badges</h3>
              <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wider">Term 3</span>
            </div>

            <div className="flex items-center justify-around gap-2">
              {badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-2xl ${badge.bg} flex items-center justify-center text-xl shadow-inner`}>
                    {badge.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-lg font-extrabold text-brand-navy">Teacher's Remarks</h3>
            <div className="flex items-start space-x-3">
              {classEducator?.avatar_url ? (
                <img src={classEducator.avatar_url} alt={classEducator.full_name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                  {getInitials(classEducator?.full_name || 'Class Educator')}
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-bold text-brand-navy">
                  {classEducator?.full_name || 'Class Educator'}
                </p>
                <p className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider">
                  {currentWard.grade || 'Teacher'}
                </p>
                <p className="text-xs text-slate-600 font-medium italic leading-relaxed pt-1">
                  "{currentWard.medical_notes ? `Medical Notes: ${currentWard.medical_notes}` : 'Doing wonderfully well in class activities. Keep up the great spirit!'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;