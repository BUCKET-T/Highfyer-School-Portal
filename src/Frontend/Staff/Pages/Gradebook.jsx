import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGradebookLogic } from '../../../Backend/Staff/GradebookLogic';

const Gradebook = () => {
  const {
    selectedSubject,
    setSelectedSubject,
    showSubjectDropdown,
    setShowSubjectDropdown,
    curriculumSubjects,
    filteredGrades,
    isLoading,
    isSavingDraft,
    isFinalizing,
    searchQuery,
    setSearchQuery,
    subjectAverage,
    topPerformer,
    approvalStatus,
    isApprovedOrSubmitted,
    currentTerm,
    academicSession,
    isScoreEntryOpen,
    showDraftModal,
    setShowDraftModal,
    showExportModal,
    setShowExportModal,
    showFinalizeModal,
    setShowFinalizeModal,
    showToast,
    toastMessage,
    handleScoreChange,
    handleRemarksChange,
    handleSaveDraft,
    handleFinalizeGrades,
    handleExportCSV
  } = useGradebookLogic();

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSubjectDropdown]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 animate-pulse space-y-6">
        <div className="h-24 bg-white rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="h-28 bg-white rounded-3xl" />
          <div className="h-28 bg-white rounded-3xl" />
          <div className="h-28 bg-slate-800 rounded-3xl" />
        </div>
        <div className="h-96 bg-white rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100 relative text-left">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-md uppercase">Session: {academicSession}</span>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase">{currentTerm}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight pt-1">
              Gradebook
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              C.A (30%) & Exam (70%) Management
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <button
              type="button"
              disabled={!isScoreEntryOpen}
              onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-brand-navy flex items-center justify-between transition-all cursor-pointer shadow-sm"
            >
              <span>{selectedSubject}</span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {showSubjectDropdown && isScoreEntryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-40 max-h-56 overflow-y-auto"
                >
                  <div className="px-3.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 text-left">
                    Select Subject
                  </div>
                  {curriculumSubjects.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(sub);
                        setShowSubjectDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-extrabold transition-colors cursor-pointer ${
                        selectedSubject === sub ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MAIN BODY AREA SWITCH */}
        {!isScoreEntryOpen ? (
          
          /* CLOSED SCORE ENTRY WINDOW EMPTY STATE */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-3xl flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                Score Entry Window Closed
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                The score upload window for {currentTerm} ({academicSession}) has been closed by school administration. Grade entry, drafts, and submissions are disabled.
              </p>
            </div>

            <div className="pt-2">
              <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-extrabold inline-flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Status: Locked by Administration</span>
              </span>
            </div>
          </motion.div>

        ) : (

          /* ACTIVE GRADEBOOK DASHBOARD & TABLE */
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              
              {/* Subject Average */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SUBJECT AVERAGE</p>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">↑ Active</span>
                </div>
                <h2 className="text-3xl font-black text-brand-navy">{subjectAverage}%</h2>
              </div>

              {/* Top Performer */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">TOP PERFORMER</p>
                {topPerformer ? (
                  <div className="flex items-center space-x-3 pt-1">
                    {topPerformer.avatarUrl ? (
                      <img
                        src={topPerformer.avatarUrl}
                        alt={topPerformer.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        {topPerformer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-black text-brand-navy">{topPerformer.name}</h4>
                      <p className="text-xs font-bold text-sky-600">Score: {topPerformer.total} / 100</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-bold pt-2">No student records available</p>
                )}
              </div>

              {/* Status & Finalize Card */}
              <div className="bg-[#1B253B] text-white p-6 rounded-3xl shadow-md flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider">STATUS ({currentTerm})</p>
                  <h3 className="text-base font-black">{approvalStatus}</h3>
                </div>
                <button
                  type="button"
                  disabled={isApprovedOrSubmitted || isFinalizing}
                  onClick={handleFinalizeGrades}
                  className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2"
                >
                  {isFinalizing && (
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  <span>{isFinalizing ? 'Submitting...' : isApprovedOrSubmitted ? 'Locked' : 'Finalize Grades'}</span>
                </button>
              </div>

            </div>

            {/* Grade Entry Table Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 space-y-6">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Filter by pupil name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-brand-navy focus:outline-none focus:border-sky-500 transition-all"
                  />
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Export</span>
                  </button>

                  <button
                    type="button"
                    disabled={isApprovedOrSubmitted || isSavingDraft}
                    onClick={handleSaveDraft}
                    className="bg-[#1B253B] hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                  >
                    {isSavingDraft ? (
                      <svg className="animate-spin w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    )}
                    <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
                  </button>
                </div>

              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-4">PUPIL NAME</th>
                      <th className="py-4 px-4">C.A (30)</th>
                      <th className="py-4 px-4">EXAM (70)</th>
                      <th className="py-4 px-4">TOTAL (100)</th>
                      <th className="py-4 px-4">GRADE</th>
                      <th className="py-4 px-4">REMARKS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGrades.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-xs font-extrabold text-slate-400">
                          No pupil grade records found.
                        </td>
                      </tr>
                    ) : (
                      filteredGrades.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              {item.avatarUrl ? (
                                <img
                                  src={item.avatarUrl}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                                  {item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-extrabold text-brand-navy">{item.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400">{item.rollNo}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              disabled={isApprovedOrSubmitted}
                              value={item.caScore}
                              onChange={(e) => handleScoreChange(item.id, 'caScore', e.target.value)}
                              className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-brand-navy text-center focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner disabled:opacity-60"
                            />
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max="70"
                              disabled={isApprovedOrSubmitted}
                              value={item.examScore}
                              onChange={(e) => handleScoreChange(item.id, 'examScore', e.target.value)}
                              className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-brand-navy text-center focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner disabled:opacity-60"
                            />
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="text-base font-black text-brand-navy">{item.total}</span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black ${
                              item.letterGrade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                              item.letterGrade === 'B' ? 'bg-sky-100 text-sky-700' :
                              item.letterGrade === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {item.letterGrade}
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <input
                              type="text"
                              disabled={isApprovedOrSubmitted}
                              value={item.remarks}
                              onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 w-56 sm:w-64 focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner disabled:opacity-60"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}

      </div>

      {/* Save Draft Modal */}
      <AnimatePresence>
        {showDraftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDraftModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 z-10 text-center space-y-4">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-brand-navy">Draft Saved!</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedSubject} gradebook entries saved as draft for {currentTerm} ({academicSession}).</p>
              </div>
              <button type="button" onClick={() => setShowDraftModal(false)} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Okay
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExportModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 z-10 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-brand-navy">Export Successful</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedSubject} score sheet exported as CSV.</p>
              </div>
              <button type="button" onClick={() => setShowExportModal(false)} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Finalize Modal */}
      <AnimatePresence>
        {showFinalizeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFinalizeModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 z-10 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-navy text-white rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-brand-navy">Submitted for Approval!</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedSubject} grades for {currentTerm} have been locked and submitted to admin.</p>
              </div>
              <button type="button" onClick={() => setShowFinalizeModal(false)} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Okay
              </button>
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

export default Gradebook;