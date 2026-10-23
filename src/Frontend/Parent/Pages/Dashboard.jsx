import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample Wards (Children) Data for Custom Web UI Selector
const mockWards = [
  {
    id: 'ward-1',
    name: 'Chidi Okoro',
    grade: 'GRADE 1 GOLD',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    stats: {
      overallProgress: 88,
      progressGrowth: '+5%',
      pendingAssignments: 3,
      attendance: 96,
      attendanceBadge: 'Elite Attendance Badge',
      meritPoints: 450,
      rank: 'Highflyer',
    },
    announcements: [
      {
        id: 'ann-1',
        title: 'Inter-House Sports Competition',
        date: 'Oct 24, 2026',
        category: 'Sports & Wellness',
        categoryStyle: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
        content: 'All pupils are required to come in their respective house jerseys on Friday. Parents are warmly invited to attend.',
      },
      {
        id: 'ann-2',
        title: 'Mid-Term Break Notice',
        date: 'Oct 18, 2026',
        category: 'Academic Calendar',
        categoryStyle: 'bg-brand-coral/10 text-brand-coral border-brand-coral/20',
        content: 'School will be closed for the mid-term holiday from October 29th to November 2nd. Classes resume promptly on Monday, Nov 3rd.',
      },
    ],
    teacherNote: {
      author: 'Ms. Beatrice Adewale',
      role: 'Class Teacher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      message: 'Great job on your science project, Chidi! Your model of Mars was very detailed. Keep planting those seeds of greatness!',
    },
    badges: [
      { id: 'b1', name: 'SUPERSTAR', icon: '★', bg: 'bg-amber-400 text-white' },
      { id: 'b2', name: 'KINDNESS', icon: '♥', bg: 'bg-pink-500 text-white' },
      { id: 'b3', name: 'SPEED', icon: '⚡', bg: 'bg-sky-400 text-white' },
    ],
  },
  {
    id: 'ward-2',
    name: 'Amara Okoro',
    grade: 'NURSERY 2 RUBY',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    stats: {
      overallProgress: 92,
      progressGrowth: '+8%',
      pendingAssignments: 1,
      attendance: 98,
      attendanceBadge: 'Star Attendance Badge',
      meritPoints: 520,
      rank: 'Top Explorer',
    },
    announcements: [],
    teacherNote: {
      author: 'Mrs. Florence Uche',
      role: 'Nursery Lead Educator',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      message: 'Amara sang all the phonics rhymes perfectly today! Super proud of her active participation in class activities.',
    },
    badges: [
      { id: 'b4', name: 'HELPFUL', icon: '🤝', bg: 'bg-emerald-500 text-white' },
      { id: 'b5', name: 'SUPERSTAR', icon: '★', bg: 'bg-amber-400 text-white' },
    ],
  },
];

const Dashboard = () => {
  const [selectedWardId, setSelectedWardId] = useState('ward-1');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get active selected child data
  const currentWard = mockWards.find((w) => w.id === selectedWardId) || mockWards[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-slate-50/60 min-h-screen">
      
      {/* Top Header Banner & Custom Web UI Ward Switcher */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Avatar & Greeting */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-sky/20 text-brand-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-navy tracking-tight">
              Hello, {currentWard.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              Welcome back to Highflyer Kiddies Academy!
            </p>
          </div>
        </div>

        {/* Right Action Bar: Notification & Custom Web Dropdown */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 md:pt-0 border-t border-slate-100 md:border-none">
          
          {/* Notification Button */}
          <button 
            type="button" 
            className="relative p-2.5 sm:p-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors cursor-pointer focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-coral rounded-full ring-2 ring-white"></span>
          </button>

          {/* Custom Web UI Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2.5 sm:space-x-3 bg-white hover:bg-slate-50 border border-slate-200/80 p-1.5 sm:p-2 pr-3 sm:pr-4 rounded-2xl shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              <img
                src={currentWard.avatar}
                alt={currentWard.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-brand-blue/80 flex-shrink-0"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-brand-navy leading-tight">{currentWard.name}</p>
                <p className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider pt-0.5">{currentWard.grade}</p>
              </div>
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
            </button>

            {/* Custom Popover Container */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Ward Account
                      </span>
                      <span className="text-[10px] font-bold text-brand-blue bg-brand-sky/20 px-2 py-0.5 rounded-full">
                        {mockWards.length} Registered
                      </span>
                    </div>

                    {mockWards.map((ward) => (
                      <button
                        key={ward.id}
                        type="button"
                        onClick={() => {
                          setSelectedWardId(ward.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                          ward.id === selectedWardId
                            ? 'bg-brand-blue/10 border border-brand-blue/30'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={ward.avatar} alt={ward.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                          <div className="text-left">
                            <p className="text-xs font-bold text-brand-navy">{ward.name}</p>
                            <p className="text-[10px] font-medium text-slate-500">{ward.grade}</p>
                          </div>
                        </div>

                        {ward.id === selectedWardId && (
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

      {/* Top 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Academic Progress */}
        <div className="bg-white p-5 rounded-3xl border-l-4 border-l-brand-blue shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Academic Performance</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-brand-navy">{currentWard.stats.overallProgress}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {currentWard.stats.progressGrowth} ↑
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-blue h-full rounded-full" style={{ width: `${currentWard.stats.overallProgress}%` }} />
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-white p-5 rounded-3xl border-l-4 border-l-brand-navy shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Class Assignments</p>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-brand-navy">{currentWard.stats.pendingAssignments}</span>
            <p className="text-xs font-medium text-slate-500">Pending submissions</p>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white p-5 rounded-3xl border-l-4 border-l-brand-coral shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Daily Attendance</p>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-brand-navy">{currentWard.stats.attendance}%</span>
            <p className="text-xs font-semibold text-brand-coral">{currentWard.stats.attendanceBadge}</p>
          </div>
        </div>

        {/* Merit Points */}
        <div className="bg-white p-5 rounded-3xl border-l-4 border-l-amber-400 shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Honor Points</p>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-brand-navy">{currentWard.stats.meritPoints}</span>
            <p className="text-xs font-medium text-slate-500">Badge Rank: <span className="font-bold text-brand-navy">{currentWard.stats.rank}</span></p>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Recent Announcements Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-extrabold text-brand-navy">Recent Announcements</h2>
              <p className="text-xs text-slate-500 font-medium">Important circulars and notices from administration</p>
            </div>
            {currentWard.announcements.length > 0 && (
              <button className="text-xs font-bold text-brand-blue hover:underline cursor-pointer">
                View All Circulars
              </button>
            )}
          </div>

          {/* Conditional Rendering: Announcement List OR Fallback Empty State */}
          {currentWard.announcements && currentWard.announcements.length > 0 ? (
            <div className="space-y-4">
              {currentWard.announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3 transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider border self-start ${ann.categoryStyle}`}>
                      {ann.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{ann.date}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-brand-navy">{ann.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback View (When no announcements exist) */
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100/80 text-center flex flex-col items-center justify-center space-y-4 py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-extrabold text-brand-navy">No New Announcements</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  There are no recent circulars or school notices posted for {currentWard.name.split(' ')[0]} at this moment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Achievements & Teacher Notes */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Badges & Merit Stars */}
          <div className="bg-brand-navy text-white p-6 rounded-3xl shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Recent Badges</h3>
              <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wider">Term 1</span>
            </div>

            <div className="flex items-center justify-around gap-2">
              {currentWard.badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-2xl ${badge.bg} flex items-center justify-center text-xl shadow-inner`}>
                    {badge.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{badge.name}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl text-xs tracking-wide transition-all cursor-pointer">
              VIEW ALL BADGES
            </button>
          </div>

          {/* Educator's Note */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-lg font-extrabold text-brand-navy">Teacher's Remarks</h3>

            <div className="flex items-start space-x-3">
              <img
                src={currentWard.teacherNote.avatar}
                alt={currentWard.teacherNote.author}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="space-y-1">
                <p className="text-xs font-bold text-brand-navy">{currentWard.teacherNote.author}</p>
                <p className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider">{currentWard.teacherNote.role}</p>
                <p className="text-xs text-slate-600 font-medium italic leading-relaxed pt-1">
                  "{currentWard.teacherNote.message}"
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