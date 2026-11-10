import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyCourseLogic } from '../../../Backend/Parent/MyCourseLogic';
import SkeletonMyCourse from '../../Shared/loaders/SkeletonMyCourse';

const MyCourses = () => {
  const {
    currentWard,
    isLoading,
    isDataLoading,
    courses,
    selectedTerm,
    setSelectedTerm,
    searchQuery,
    setSearchQuery,
    expandedCourseId,
    toggleCourse,
  } = useMyCourseLogic();

  if (isLoading || !currentWard) {
    return <SkeletonMyCourse />;
  }

  const terms = ['Term 1', 'Term 2', 'Term 3'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-slate-50/60 min-h-screen">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-brand-sky/20 text-brand-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Course Outlines
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              Explore what we are learning this term.
            </p>
          </div>
        </div>

        {/* Search Bar & Static Grade Badge */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Subject Search Input */}
          <div className="relative flex-1 sm:w-64">
            <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-2xl text-xs sm:text-sm font-medium text-brand-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all"
            />
          </div>

          {/* Static Active Ward / Grade Indicator */}
          <div className="flex items-center space-x-2 self-start sm:self-auto bg-slate-100/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VIEWING FOR:</span>
            <span className="text-xs font-extrabold text-white bg-brand-navy px-2.5 py-1 rounded-lg uppercase">
              {currentWard.grade || currentWard.full_name || 'Pupil'}
            </span>
          </div>
        </div>
      </div>

      {/* Term Selector Bar */}
      <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-0.5 px-2">
          <h3 className="text-sm font-extrabold text-brand-navy">Select Academic Term</h3>
          <p className="text-[11px] text-slate-500 font-medium">Viewing curriculum schedule for {currentWard.full_name} ({currentWard.grade || 'Grade'})</p>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl">
          {terms.map((term) => (
            <button
              key={term}
              onClick={() => setSelectedTerm(term)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                selectedTerm === term
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Course Cards Accordion List */}
      <div className="space-y-4">
        {isDataLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 h-24 animate-pulse" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          courses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 hover:border-slate-200"
              >
                {/* Course Header Bar (Clickable to Expand/Collapse) */}
                <button
                  type="button"
                  onClick={() => toggleCourse(course.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-sky/20 text-brand-blue shadow-inner flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">{course.subject_name || 'Subject'}</h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">Grade Level: {course.grade} • {course.term || selectedTerm}</p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 rounded-xl text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Expandable Weekly Topics Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6"
                    >
                      {course.weekly_topics && typeof course.weekly_topics === 'object' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(course.weekly_topics).map(([weekKey, topicData]) => (
                            <div
                              key={weekKey}
                              className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all space-y-2"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider block text-brand-blue bg-brand-sky/20 px-2 py-0.5 rounded w-fit">
                                {weekKey.replace('_', ' ').toUpperCase()}
                              </span>
                              <h3 className="font-extrabold text-brand-navy text-sm sm:text-base leading-snug">
                                {topicData.title || 'Weekly Module'}
                              </h3>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                {topicData.description || topicData.summary || 'Topic details outlined for this week.'}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic text-center py-4">No weekly topics outlined yet for this subject.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          /* Empty Search/Curricular Results Fallback */
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-brand-navy">No Courses Found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              We couldn't find any course curricula for {currentWard.full_name} ({currentWard.grade || 'Grade'}) during {selectedTerm}.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyCourses;