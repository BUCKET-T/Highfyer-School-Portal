import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssignmentsLogic } from '../../../Backend/Staff/AssignmentsLogic';

const ManageAssignments = () => {
  const {
    filteredAssignments,
    isLoading,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    selectedStatusFilter,
    setSelectedStatusFilter,
    setShowSubjectDropdown,
    showStatusDropdown,
    setShowStatusDropdown,
    curriculumSubjects,
    statusOptions,
    showCreateModal,
    setShowCreateModal,
    showReviewModal,
    setShowReviewModal,
    activeReviewTask,
    handleOpenReview,
    taskSubmissions,
    isLoadingSubmissions,
    newTaskTitle,
    setNewTaskTitle,
    newTaskSubject,
    setNewTaskSubject,
    showNewTaskSubjectDropdown,
    setShowNewTaskSubjectDropdown,
    newTaskDueDate,
    setNewTaskDueDate,
    newTaskGuidelines,
    setNewTaskGuidelines,
    handleCreateTask,
    handleGradeSubmission,
    activeTasksCount,
    gradingQueueCount,
    completedTasksCount,
    showToast,
    toastMessage
  } = useAssignmentsLogic();

  // Close dropdowns on outside click
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
        setShowStatusDropdown(false);
        setShowNewTaskSubjectDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSubjectDropdown, setShowStatusDropdown, setShowNewTaskSubjectDropdown]);

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100 text-left">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Assignment Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              Create, review, and grade homework tasks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="bg-[#1B253B] hover:bg-slate-800 text-white font-extrabold px-5 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 shadow-md transition-all cursor-pointer self-start md:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Task</span>
          </button>
        </div>

{/* Search & Custom Web UI Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search assignments by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-brand-navy focus:outline-none focus:border-sky-500 transition-all shadow-sm"
            />
          </div>

          {/* Status Filter Only */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            
            {/* Status Filter Dropdown */}
            <div className="relative w-36 sm:w-40">
              <button
                type="button"
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                }}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-brand-navy flex items-center justify-between transition-all cursor-pointer shadow-sm"
              >
                <span className="truncate">{selectedStatusFilter}</span>
                <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showStatusDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40 flex flex-col space-y-1"
                  >
                    {statusOptions.map((stat) => (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => {
                          setSelectedStatusFilter(stat);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                          selectedStatusFilter === stat ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>


        {/* Dynamic Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          
          {/* Active Tasks Card */}
          <div className="bg-[#2B6CB0] text-white p-6 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">ACTIVE TASKS</span>
              <svg className="w-5 h-5 text-sky-300 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black">{isLoading ? '...' : activeTasksCount}</h2>
            <p className="text-xs font-semibold text-sky-100 flex items-center space-x-1 cursor-pointer hover:underline">
              <span>View active submissions</span>
              <span>↗</span>
            </p>
          </div>

          {/* Grading Queue Card */}
          <div className="bg-[#ED64A6] text-white p-6 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-100">GRADING QUEUE</span>
              <svg className="w-5 h-5 text-pink-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black">{isLoading ? '...' : gradingQueueCount}</h2>
            <p className="text-xs font-semibold text-pink-100 flex items-center space-x-1 cursor-pointer hover:underline">
              <span>Start grading session</span>
              <span>↗</span>
            </p>
          </div>

          {/* Completed Card */}
          <div className="bg-[#1A202C] text-white p-6 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">COMPLETED</span>
              <svg className="w-5 h-5 text-emerald-400 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-black">{isLoading ? '...' : completedTasksCount}</h2>
            <p className="text-xs font-semibold text-slate-300 flex items-center space-x-1 cursor-pointer hover:underline">
              <span>View archives</span>
              <span>↗</span>
            </p>
          </div>

        </div>

        {/* Recent Assignments List Section */}
        <div className="space-y-4 text-left">
          <h2 className="text-lg sm:text-xl font-black text-brand-navy">Recent Assignments</h2>

          {isLoading ? (
            /* Skeleton Loading State */
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="space-y-3 flex-1 w-full">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-full md:w-48"></div>
                  <div className="h-10 bg-slate-200 rounded-xl w-24"></div>
                </div>
              ))}
            </div>
          ) : filteredAssignments.length === 0 ? (
            /* Empty State */
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3">
              <p className="text-sm font-extrabold text-slate-400">No homework assignments found.</p>
              <p className="text-xs font-medium text-slate-400">Click "Create New Task" above to publish your first homework activity.</p>
            </div>
          ) : (
            /* Dynamic Assignments Cards */
            <div className="space-y-4">
              {filteredAssignments.map((item) => {
                const progressPct = item.totalCount > 0 ? Math.round((item.submittedCount / item.totalCount) * 100) : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:border-slate-200"
                  >
                    {/* Left Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${item.subjectTagColor}`}>
                          {item.subject}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${item.statusTagColor}`}>
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-brand-navy truncate">
                        {item.title}
                      </h3>

                      <div className="flex items-center space-x-4 text-[11px] font-bold text-slate-400">
                        <span className="flex items-center space-x-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                          <span>{item.createdText}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-rose-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <span>{item.dueText}</span>
                        </span>
                      </div>
                    </div>

                    {/* Middle Submissions Progress */}
                    <div className="w-full md:w-64 space-y-1.5 flex-shrink-0">
                      <div className="flex justify-between text-[11px] font-extrabold text-slate-400">
                        <span>SUBMISSIONS</span>
                        <span>{item.submittedCount}/{item.totalCount}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3 self-end md:self-center flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenReview(item)}
                        className="bg-white hover:bg-slate-50 text-brand-navy border border-slate-200 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                      >
                        Review
                      </button>
                      
                      <button
                        type="button"
                        className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                        title="More Options"
                      >
                        •••
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Create New Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 z-10 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-brand-navy">Create New Homework Task</h3>
                <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-black text-slate-600 uppercase">Task Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Fractions & Word Problems"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Subject Selection Dropdown */}
                  <div className="space-y-1.5 text-left relative">
                    <label className="text-xs font-black text-slate-600 uppercase">Subject</label>
                    <button
                      type="button"
                      onClick={() => setShowNewTaskSubjectDropdown(!showNewTaskSubjectDropdown)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs font-extrabold text-brand-navy flex items-center justify-between transition-all cursor-pointer shadow-sm"
                    >
                      <span>{newTaskSubject}</span>
                      <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showNewTaskSubjectDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {showNewTaskSubjectDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 flex flex-col space-y-1 max-h-48 overflow-y-auto"
                        >
                          {curriculumSubjects.map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                setNewTaskSubject(sub);
                                setShowNewTaskSubjectDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                                newTaskSubject === sub ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-black text-slate-600 uppercase">Due Date</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-black text-slate-600 uppercase">Guidelines & Instructions</label>
                  <textarea
                    rows="3"
                    placeholder="Provide step-by-step instructions for pupils..."
                    value={newTaskGuidelines}
                    onChange={(e) => setNewTaskGuidelines(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold px-5 py-3 rounded-2xl text-xs transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Task'}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Submissions Modal */}
      <AnimatePresence>
        {showReviewModal && activeReviewTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 z-10 space-y-6 text-left">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-md">{activeReviewTask.subject}</span>
                  <h3 className="text-lg font-black text-brand-navy pt-1">{activeReviewTask.title}</h3>
                </div>
                <button type="button" onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Guidelines & Instructions</h4>
                <p className="text-xs font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {activeReviewTask.guidelines}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Submissions Overview</h4>
                  <span className="text-xs font-extrabold text-sky-600">{activeReviewTask.submittedCount} of {activeReviewTask.totalCount} Submitted</span>
                </div>

                {isLoadingSubmissions ? (
                  <div className="p-8 text-center text-xs font-extrabold text-slate-400">Loading student submissions...</div>
                ) : taskSubmissions.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs font-extrabold text-slate-400">
                    No pupil submissions turned in yet.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {taskSubmissions.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-3">
                          {sub.avatar ? (
                            <img src={sub.avatar} alt={sub.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center">
                              {sub.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-extrabold text-brand-navy block">{sub.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{sub.submissionText}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] font-bold text-slate-500">{sub.status}</span>
                          <input
                            type="number"
                            max="10"
                            min="0"
                            placeholder="Score"
                            defaultValue={sub.score}
                            onBlur={(e) => e.target.value && handleGradeSubmission(sub.id, e.target.value)}
                            className="w-14 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-sky-600 text-center focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
              >
                Close Review
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast Notification Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1B253B] text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3"
          >
            <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black text-xs">
              ✓
            </div>
            <span className="text-xs font-extrabold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageAssignments;