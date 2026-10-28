import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Core Subject Pending Submissions Data
const initialPendingGrading = [
  {
    id: 'grade-1',
    subject: 'JUNIOR MATHEMATICS',
    subjectTagColor: 'bg-sky-100 text-sky-700 border-sky-200',
    initialLetter: 'M',
    title: 'Math: Shape Detective Challenge',
    dueDateTag: 'TODAY',
    dueTagColor: 'text-rose-500 bg-rose-50 border-rose-200',
    submittedCount: 8,
    totalCount: 32,
    progressPercent: (8 / 32) * 100,
  },
  {
    id: 'grade-2',
    subject: 'VERBAL REASONING',
    subjectTagColor: 'bg-purple-100 text-purple-700 border-purple-200',
    initialLetter: 'V',
    title: 'Verbal: Synonyms & Antonyms Exercise',
    dueDateTag: 'TOMORROW',
    dueTagColor: 'text-amber-600 bg-amber-50 border-amber-200',
    submittedCount: 18,
    totalCount: 32,
    progressPercent: (18 / 32) * 100,
  },
  {
    id: 'grade-3',
    subject: 'VOCATIONAL STUDIES',
    subjectTagColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    initialLetter: 'V',
    title: 'Vocational: Home Safety Inspection Diary',
    dueDateTag: 'IN 2 DAYS',
    dueTagColor: 'text-slate-500 bg-slate-100 border-slate-200',
    submittedCount: 14,
    totalCount: 32,
    progressPercent: (14 / 32) * 100,
  },
  {
    id: 'grade-4',
    subject: 'CREATIVE ARTS',
    subjectTagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    initialLetter: 'C',
    title: 'Arts: Secondary Color Mixing Painting',
    dueDateTag: 'IN 3 DAYS',
    dueTagColor: 'text-slate-500 bg-slate-100 border-slate-200',
    submittedCount: 22,
    totalCount: 32,
    progressPercent: (22 / 32) * 100,
  },
];

// Today's Teaching Schedule
const todaySchedule = [
  {
    time: '08:30 AM',
    title: 'Junior Mathematics',
    subtitle: 'Counting 1–50 & Shapes',
    classTag: 'Grade 1 Gold',
    badgeBg: 'bg-sky-100 text-sky-700',
  },
  {
    time: '10:00 AM',
    title: 'Recess',
    subtitle: 'Playground Supervision Duty',
    classTag: 'All Grades',
    badgeBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    time: '11:30 AM',
    title: 'Verbal Reasoning',
    subtitle: 'Word Pairs & Vocabulary',
    classTag: 'Grade 1 Gold',
    badgeBg: 'bg-sky-100 text-sky-700',
  },
  {
    time: '01:30 PM',
    title: 'Creative Arts',
    subtitle: 'Color Wheel Practical',
    classTag: 'Grade 1 Gold',
    badgeBg: 'bg-sky-100 text-sky-700',
  },
];

const assignedClasses = [
  'Grade 1 Gold',
  'Grade 2 Blue',
  'Grade 3 Emerald',
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Grade 1 Gold');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showRedirectNotice, setShowRedirectNotice] = useState(false);

  // Close dropdown on outside click
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowClassDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Class Toggle with Redirection back to Grade 1 Gold
  const handleClassSelect = (className) => {
    setShowClassDropdown(false);
    if (className !== 'Grade 1 Gold') {
      setSelectedClass(className);
      setShowRedirectNotice(true);
      setTimeout(() => {
        setSelectedClass('Grade 1 Gold');
        setShowRedirectNotice(false);
      }, 1800);
    } else {
      setSelectedClass('Grade 1 Gold');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Welcome Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Morning, Mr. James!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              Here's what's happening in <span className="font-extrabold text-brand-blue">{selectedClass}</span> today.
            </p>
          </div>

          {/* Class Account Switcher & Action Tools */}
          <div className="flex items-center flex-wrap gap-3">
            
            {/* Custom Web UI Class Switcher Dropdown */}
            <div className="relative w-48 sm:w-56">
              <button
                type="button"
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs font-extrabold text-brand-navy flex items-center justify-between transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span>{selectedClass}</span>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showClassDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showClassDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-40"
                  >
                    <div className="px-3.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Switch Assigned Class
                    </div>
                    {assignedClasses.map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleClassSelect(cls)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-extrabold transition-colors cursor-pointer ${
                          selectedClass === cls
                            ? 'bg-sky-50 text-sky-600'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cls} {cls !== 'Grade 1 Gold' && <span className="text-[10px] text-amber-500 font-bold ml-1">(Demo Sample Only)</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New Assignment Primary Button */}
            <button
              type="button"
              onClick={() => navigate('/staff/assignments')}
              className="bg-[#1B253B] hover:bg-slate-800 text-white font-extrabold px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Assign</span>
            </button>

            {/* Notification Bell Icon */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-100 hover:bg-slate-200/80 rounded-2xl flex items-center justify-center text-slate-600 transition-all cursor-pointer relative"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Active Badge */}
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full absolute top-2.5 right-2.5 ring-2 ring-white" />
              </button>

              {/* Dropdown Notification Box */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-black text-brand-navy">Staff Alerts</h4>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">2 New</span>
                    </div>
                    <div className="space-y-2 text-left">
                      <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                        <p className="text-xs font-bold text-brand-navy">Staff Meeting at 3:30 PM</p>
                        <p className="text-[10px] text-slate-500 font-medium">Auditorium — Sports Day Planning Agenda.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                        <p className="text-xs font-bold text-brand-navy">Term C.A Submission Deadline</p>
                        <p className="text-[10px] text-slate-500 font-medium">Please submit Grade 1 Gold C.A scores by Friday.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Teacher Avatar Icon */}
            <button
              type="button"
              onClick={() => navigate('/staff/settings')}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-sky-400 p-0.5 bg-white shadow-sm transition-all hover:scale-105 cursor-pointer flex-shrink-0"
              title="Teacher Profile"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Mr. James Doe"
                className="w-full h-full rounded-xl object-cover"
              />
            </button>

          </div>
        </div>

        {/* Redirect Notice Banner when clicking non-default classes */}
        <AnimatePresence>
          {showRedirectNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-bold flex items-center space-x-3 shadow-sm"
            >
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Demo record sets are currently initialized for <strong>Grade 1 Gold</strong>. Redirecting you back to your active account dataset...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metric Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Total Students */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-slate-300">↗</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">TOTAL STUDENTS</p>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">32</h2>
            </div>
          </div>

          {/* Today Attendance */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-300">↗</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">TODAY ATTENDANCE</p>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">94%</h2>
            </div>
          </div>

          {/* Pending Grades */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-slate-300">↗</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">PENDING GRADES</p>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">12</h2>
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-slate-300">↗</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">UPCOMING LESSONS</p>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">3</h2>
            </div>
          </div>

        </div>

        {/* Main Grid: Pending Grading List (Left) + Today's Schedule & Staff Note (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Pending Grading Queue (8 cols) */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-brand-navy">Pending Grading</h2>
              <button
                type="button"
                onClick={() => navigate('/staff/assignments')}
                className="text-xs font-extrabold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
              >
                View all queue
              </button>
            </div>

            <div className="space-y-4">
              {initialPendingGrading.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 transition-all hover:border-slate-200"
                >
                  {/* Left Side: Avatar Box & Details */}
                  <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 font-black text-lg sm:text-xl flex-shrink-0 shadow-inner">
                      {item.initialLetter}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${item.subjectTagColor}`}>
                          {item.subject}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${item.dueTagColor}`}>
                          {item.dueDateTag}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-brand-navy truncate">
                        {item.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1 w-full max-w-md">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400">
                          <span>Completion Progress</span>
                          <span>{item.submittedCount}/{item.totalCount} submitted</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/staff/gradebook')}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-sky-500/20 self-end sm:self-center cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    Grade Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Today's Schedule & Staff Note (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Today's Schedule Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base sm:text-lg font-black text-brand-navy">Today's Schedule</h2>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-100">
                {todaySchedule.map((item, idx) => (
                  <div key={idx} className="relative pl-8 space-y-1">
                    {/* Timeline Dot */}
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 bg-sky-500 rounded-full ring-4 ring-white" />
                    
                    <span className="text-[11px] font-extrabold text-sky-600 uppercase">
                      {item.time}
                    </span>
                    
                    <h4 className="text-sm font-extrabold text-brand-navy">
                      {item.title}
                    </h4>
                    
                    <p className="text-xs text-slate-500 font-medium">
                      {item.subtitle}
                    </p>

                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold ${item.badgeBg}`}>
                      {item.classTag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Note Bulletin Widget */}
            <div className="bg-[#1B253B] text-white p-5 sm:p-6 rounded-3xl shadow-md space-y-3 border border-slate-800">
              <div className="flex items-center space-x-2 text-sky-400">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-xs font-black uppercase tracking-wider">STAFF NOTE</span>
              </div>

              <p className="text-xs font-semibold text-slate-300 leading-relaxed italic">
                "Staff meeting in the auditorium today at 3:30 PM. Agenda: Sports Day planning & Term C.A submissions."
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;