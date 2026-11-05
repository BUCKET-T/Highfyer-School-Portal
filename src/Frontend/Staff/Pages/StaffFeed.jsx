import React from 'react';
import { useStaffFeedLogic } from '../../../Backend/Staff/StaffFeedLogic';
import SkeletonStaffFeed from '../../Shared/Staff/SkeletonStaffFeed';

const StaffFeed = () => {
  const {
    upcomingMeetings,
    isLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    acknowledgedPosts,
    filteredAnnouncements,
    handleAcknowledge
  } = useStaffFeedLogic();

  if (isLoading) {
    return <SkeletonStaffFeed />;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar with Integrated Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100 text-left">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Staff Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              Directives & Bulletins from Management
            </p>
          </div>

          {/* Search Bar Input Widget */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search feed bulletins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-brand-navy focus:outline-none focus:border-sky-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Main Content Grid: Feed (Left) & Upcoming Meetings (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Feed & Announcements (8 cols) */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* Filter Tabs Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-black text-brand-navy">Latest Announcements</h2>

              <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start sm:self-auto">
                {['ALL', 'URGENT', 'SOCIAL'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeFilter === tab
                        ? 'bg-[#1B253B] text-white shadow-sm'
                        : 'text-slate-500 hover:text-brand-navy'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-5">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4 transition-all hover:border-slate-200"
                  >
                    {/* Author Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.avatar}
                          alt={item.author}
                          className="w-12 h-12 rounded-full object-cover border-2 border-sky-100"
                        />
                        <div>
                          <h4 className="text-sm font-black text-brand-navy">{item.author}</h4>
                          <p className="text-[10px] font-extrabold text-sky-600">{item.role}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        {item.timeAgo}
                      </span>
                    </div>

                    {/* Title & Badge */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${item.badgeColor}`}>
                          {item.badgeText}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-600">
                          Target: {item.targetAudience}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-brand-navy">
                        {item.title}
                      </h3>
                    </div>

                    {/* Content */}
                    <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                      {item.content}
                    </p>

                    {/* Footer Stats & Acknowledge Action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(item.id)}
                        className={`flex items-center space-x-1.5 transition-colors cursor-pointer ${
                          acknowledgedPosts[item.id] ? 'text-sky-600 font-black' : 'hover:text-brand-navy'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item.acknowledgedCount} Acknowledged</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span>{item.commentsCount} Comments</span>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400 font-bold text-xs space-y-2">
                  <p>No announcements found matching "{searchQuery}".</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Upcoming Meetings (4 cols) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base sm:text-lg font-black text-brand-navy">Upcoming Meetings</h3>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="space-y-3">
                {upcomingMeetings.map((meeting, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 transition-all hover:bg-slate-100/60">
                    <div className="flex items-center space-x-2 text-sky-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-wider">{meeting.time}</span>
                    </div>

                    <h4 className="text-sm font-extrabold text-brand-navy">{meeting.title}</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{meeting.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Management Portal Bulletin Note */}
            <div className="bg-[#1B253B] text-white p-6 rounded-3xl shadow-md space-y-3 border border-slate-800">
              <div className="flex items-center space-x-2 text-sky-400">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-black uppercase tracking-wider">PORTAL DIRECTIVE</span>
              </div>
              <p className="text-xs font-semibold text-slate-300 leading-relaxed">
                All staff directives posted by Principal Olatunji are legally binding and form part of the school's operational handbook.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default StaffFeed;