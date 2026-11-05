import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssignmentsLogic } from '../../../Backend/Staff/AssignmentsLogic';
import SkeletonAssignments from '../../Shared/Staff/SkeletonAssignments';

const ManageAssignments = () => {
  const {
    filteredAssignments,
    isLoading,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    selectedStatusFilter,
    setSelectedStatusFilter,
    showStatusDropdown,
    setShowStatusDropdown,
    statusOptions,
    curriculumSubjects,
    showCreateModal,
    setShowCreateModal,
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
    activeTasksCount,
    completedTasksCount,
    showToast,
    toastMessage
  } = useAssignmentsLogic();

  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
        setShowNewTaskSubjectDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowStatusDropdown, setShowNewTaskSubjectDropdown]);

  if (isLoading) {
    return <SkeletonAssignments />;
  }

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
              Publish homework tasks for manual in-person submissions.
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

        {/* Search & Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="relative w-36 sm:w-40">
              <button
                type="button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
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

        {/* Metric Cards Grid (2 Cards now: Active Tasks & Completed Archives) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          
          <div className="bg-[#2B6CB0] text-white p-6 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
            <svg className="absolute -right-4 -bottom-6 w-36 h-36 text-white/10 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">ACTIVE TASKS</span>
            <h2 className="text-4xl font-black">{activeTasksCount}</h2>
            <p className="text-xs font-semibold text-sky-100">Students submit in person</p>
          </div>

          <div className="bg-[#1A202C] text-white p-6 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
            <svg className="absolute -right-4 -bottom-6 w-36 h-36 text-white/10 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">COMPLETED / ARCHIVED</span>
            <h2 className="text-4xl font-black">{completedTasksCount}</h2>
            <p className="text-xs font-semibold text-slate-300">Past homework assignments</p>
          </div>

        </div>

        {/* Recent Assignments List Section */}
        <div className="space-y-4 text-left">
          <h2 className="text-lg sm:text-xl font-black text-brand-navy">Published Tasks</h2>

          {filteredAssignments.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3">
              <p className="text-sm font-extrabold text-slate-400">No homework tasks found.</p>
              <p className="text-xs font-medium text-slate-400">Click "Create New Task" above to publish assignments for manual collection.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${item.subjectTagColor}`}>{item.subject}</span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${item.statusTagColor}`}>{item.status}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-brand-navy">{item.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-extrabold text-rose-500 block">{item.dueText}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.createdText}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Guidelines & Instructions:</span>
                    <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap">{item.guidelines}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-extrabold text-slate-500">Mode: In-Person Submission</span>
                    <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-xl">Collect physically from students</span>
                  </div>
                </div>
              ))}
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
                <h3 className="text-lg font-black text-brand-navy">Publish Homework Task</h3>
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
                  <div className="space-y-1.5 text-left relative">
                    <label className="text-xs font-black text-slate-600 uppercase">Subject</label>
                    <button
                      type="button"
                      onClick={() => setShowNewTaskSubjectDropdown(!showNewTaskSubjectDropdown)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs font-extrabold text-brand-navy flex items-center justify-between cursor-pointer"
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
                  <button type="button" onClick={() => setShowCreateModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold px-5 py-3 rounded-2xl text-xs cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md cursor-pointer disabled:opacity-50 flex items-center space-x-2">
                    {isSubmitting && (
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    )}
                    <span>{isSubmitting ? 'Publishing...' : 'Publish Task'}</span>
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Alert */}
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