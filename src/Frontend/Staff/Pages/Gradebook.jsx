import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Initial Gradebook Sample Set for Mathematics Only
const initialMathGrades = [
  {
    id: 1,
    name: 'Chidi Okoro',
    rollNo: 'G1-001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    caScore: 24, // out of 30
    examScore: 62, // out of 70
    remarks: 'Excellent performance in geometry.',
  },
  {
    id: 2,
    name: 'Amara Nwosu',
    rollNo: 'G1-002',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    caScore: 18,
    examScore: 55,
    remarks: 'Good, but needs practice with fractions.',
  },
  {
    id: 3,
    name: 'Tobi Adeyemi',
    rollNo: 'G1-003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    caScore: 21,
    examScore: 58,
    remarks: 'Consistent effort shown throughout term.',
  },
  {
    id: 4,
    name: 'Zainab Musa',
    rollNo: 'G1-004',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    caScore: 28,
    examScore: 68,
    remarks: 'Outstanding analytical math skills!',
  },
  {
    id: 5,
    name: 'Kofi Mensah',
    rollNo: 'G1-005',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    caScore: 20,
    examScore: 50,
    remarks: 'Satisfactory. Keep practicing tables.',
  },
];

const availableSubjects = [
  'Mathematics',
  'Verbal Reasoning',
  'Vocational Studies',
  'Creative Arts',
];

const Gradebook = () => {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [grades, setGrades] = useState(initialMathGrades);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showRedirectNotice, setShowRedirectNotice] = useState(false);

  // Close dropdown on outside click
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Subject Selection with Redirection to Mathematics if non-Math is picked
  const handleSubjectSelect = (subject) => {
    setShowSubjectDropdown(false);
    if (subject !== 'Mathematics') {
      setSelectedSubject(subject);
      setShowRedirectNotice(true);
      // Automatically snap back to Mathematics after 1.8 seconds
      setTimeout(() => {
        setSelectedSubject('Mathematics');
        setShowRedirectNotice(false);
      }, 1800);
    } else {
      setSelectedSubject('Mathematics');
    }
  };

  // Score handlers
  const handleScoreChange = (id, field, value) => {
    const numValue = value === '' ? '' : Number(value);
    setGrades(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: numValue };
          return updated;
        }
        return item;
      })
    );
  };

  // Remarks handler
  const handleRemarksChange = (id, newRemarks) => {
    setGrades(prev =>
      prev.map(item => (item.id === id ? { ...item, remarks: newRemarks } : item))
    );
  };

  // Calculate automated totals and letter grades
  const calculatedGrades = grades.map(item => {
    const ca = Number(item.caScore) || 0;
    const exam = Number(item.examScore) || 0;
    const total = ca + exam;

    let letterGrade = 'F';
    if (total >= 75) letterGrade = 'A';
    else if (total >= 65) letterGrade = 'B';
    else if (total >= 50) letterGrade = 'C';
    else if (total >= 40) letterGrade = 'D';

    return { ...item, total, letterGrade };
  });

  // Filtered list
  const filteredGrades = calculatedGrades.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Subject Average & Top Performer calculation
  const overallTotalSum = calculatedGrades.reduce((acc, curr) => acc + curr.total, 0);
  const subjectAverage = Math.round(overallTotalSum / calculatedGrades.length);

  const topPerformer = calculatedGrades.reduce((prev, current) =>
    (prev.total > current.total) ? prev : current
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar with Web UI Subject Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100 relative">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Gradebook
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              C.A (30%) & Exam (70%) Management
            </p>
          </div>

          {/* Custom Web UI Subject Dropdown */}
          <div className="relative w-full sm:w-64">
            <button
              type="button"
              onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-brand-navy flex items-center justify-between transition-all cursor-pointer shadow-sm"
            >
              <span>{selectedSubject}</span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {showSubjectDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-40"
                >
                  <div className="px-3.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Subject
                  </div>
                  {availableSubjects.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleSubjectSelect(sub)}
                      className={`w-full text-left px-4 py-2.5 text-xs font-extrabold transition-colors cursor-pointer ${
                        selectedSubject === sub
                          ? 'bg-sky-50 text-sky-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sub} {sub !== 'Mathematics' && <span className="text-[10px] text-amber-500 font-bold ml-1">(Demo Math Only)</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Redirect Notice Banner when clicking non-Math subjects */}
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
              <span>Record sample sets are currently active for <strong>Mathematics</strong> only. Redirecting you back to Mathematics...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Subject Average */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SUBJECT AVERAGE</p>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">↑ 2.4%</span>
            </div>
            <h2 className="text-3xl font-black text-brand-navy">{subjectAverage}%</h2>
          </div>

          {/* Top Performer */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">TOP PERFORMER</p>
            <div className="flex items-center space-x-3 pt-1">
              <img
                src={topPerformer.avatar}
                alt={topPerformer.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-black text-brand-navy">{topPerformer.name}</h4>
                <p className="text-xs font-bold text-sky-600">Score: {topPerformer.total} / 100</p>
              </div>
            </div>
          </div>

          {/* Status & Finalize */}
          <div className="bg-[#1B253B] text-white p-6 rounded-3xl shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider">STATUS</p>
              <h3 className="text-base font-black">Inputting Term 1</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowFinalizeModal(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Finalize Grades
            </button>
          </div>

        </div>

        {/* Grade Entry Table Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 space-y-6">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Bar */}
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

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Export</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDraftModal(true)}
                className="bg-[#1B253B] hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Save Draft</span>
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
                {filteredGrades.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* Pupil Name & Avatar */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <h4 className="text-sm font-extrabold text-brand-navy">{item.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400">{item.rollNo}</p>
                          </div>
                        </div>
                      </td>

                      {/* C.A Input (Max 30) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={item.caScore}
                          onChange={(e) => handleScoreChange(item.id, 'caScore', e.target.value)}
                          className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-brand-navy text-center focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                        />
                      </td>

                      {/* Exam Input (Max 70) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="70"
                          value={item.examScore}
                          onChange={(e) => handleScoreChange(item.id, 'examScore', e.target.value)}
                          className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-brand-navy text-center focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                        />
                      </td>

                      {/* Total Calculation */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-base font-black text-brand-navy">
                          {item.total}
                        </span>
                      </td>

                      {/* Letter Grade */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black ${
                          item.letterGrade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                          item.letterGrade === 'B' ? 'bg-sky-100 text-sky-700' :
                          item.letterGrade === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {item.letterGrade}
                        </span>
                      </td>

                      {/* Editable Remarks */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 w-56 sm:w-64 focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                        />
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

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
                <p className="text-xs text-slate-500 font-medium">Mathematics gradebook entries have been successfully saved as draft.</p>
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
                <p className="text-xs text-slate-500 font-medium">Mathematics score sheet exported as CSV/PDF spreadsheet.</p>
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
                <h3 className="text-lg font-black text-brand-navy">Grades Finalized!</h3>
                <p className="text-xs text-slate-500 font-medium">Term 1 Mathematics grades have been locked and submitted to the principal's office.</p>
              </div>
              <button type="button" onClick={() => setShowFinalizeModal(false)} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Okay
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gradebook;