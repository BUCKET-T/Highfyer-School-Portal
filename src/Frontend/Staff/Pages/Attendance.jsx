import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Common Quick Remark Suggestions for Primary Pupils
const presetRemarksList = [
  'Bus delayed',
  'Medical checkup',
  'Family event',
  'Traffic delay',
  'Excusable absence',
  'Illness / Fever',
];

// Initial Pupil Register Data
const initialPupils = [
  {
    id: 1,
    name: 'Chidi Okoro',
    rollNo: 'G1-001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'present',
    remarks: '',
  },
  {
    id: 2,
    name: 'Amara Nwosu',
    rollNo: 'G1-002',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'late',
    remarks: 'Bus delayed',
  },
  {
    id: 3,
    name: 'Tobi Adeyemi',
    rollNo: 'G1-003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'absent',
    remarks: 'Medical checkup',
  },
  {
    id: 4,
    name: 'Zainab Musa',
    rollNo: 'G1-004',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'present',
    remarks: '',
  },
  {
    id: 5,
    name: 'Kofi Mensah',
    rollNo: 'G1-005',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'present',
    remarks: '',
  },
  {
    id: 6,
    name: 'Fatima Bello',
    rollNo: 'G1-006',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'excused',
    remarks: 'Family event',
  },
];

const Attendance = () => {
  const [pupils, setPupils] = useState(initialPupils);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showStatusFilterDropdown, setShowStatusFilterDropdown] = useState(false);
  const [activePresetDropdownId, setActivePresetDropdownId] = useState(null);
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Close custom dropdowns on outside click
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActivePresetDropdownId(null);
        setShowStatusFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status Change Handler
  const handleStatusChange = (id, newStatus) => {
    setPupils(prev =>
      prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  // Editable Remarks Change Handler
  const handleRemarksChange = (id, newRemarks) => {
    setPupils(prev =>
      prev.map(p => (p.id === id ? { ...p, remarks: newRemarks } : p))
    );
  };

  // Clear Remarks Handler
  const handleClearRemarks = (id) => {
    setPupils(prev =>
      prev.map(p => (p.id === id ? { ...p, remarks: '' } : p))
    );
  };

  // Filtered pupils
  const filteredPupils = pupils.filter(pupil => {
    const matchesSearch = pupil.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pupil.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pupil.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || pupil.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Dynamic Metrics
  const totalCount = pupils.length;
  const presentCount = pupils.filter(p => p.status === 'present').length;
  const lateCount = pupils.filter(p => p.status === 'late').length;
  const absentCount = pupils.filter(p => p.status === 'absent').length;
  const attendancePercentage = Math.round(((presentCount + lateCount) / totalCount) * 100);

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Pupil Register
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              Grade 1 Gold • <span className="font-extrabold text-brand-blue">Thursday, May 15, 2024</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowSummaryModal(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 border border-slate-200 shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Summary</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              Submit Register
            </button>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <p className="text-[10px] sm:text-xs font-extrabold text-emerald-600 uppercase tracking-wider">PRESENT</p>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">{presentCount}</h2>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <p className="text-[10px] sm:text-xs font-extrabold text-amber-600 uppercase tracking-wider">LATE</p>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">{lateCount}</h2>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <p className="text-[10px] sm:text-xs font-extrabold text-rose-500 uppercase tracking-wider">ABSENT</p>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">{absentCount}</h2>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <p className="text-[10px] sm:text-xs font-extrabold text-sky-600 uppercase tracking-wider">ATTENDANCE %</p>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">{attendancePercentage}%</h2>
          </div>
        </div>

        {/* Main Attendance Register Table Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 space-y-6">
          
          {/* Search & Filter Toolbar */}
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
                placeholder="Search pupils or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-brand-navy focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>

            {/* Custom Web UI Status Filter Dropdown */}
            <div className="relative w-full sm:w-48">
              <button
                type="button"
                onClick={() => setShowStatusFilterDropdown(!showStatusFilterDropdown)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-slate-700 flex items-center justify-between transition-all cursor-pointer"
              >
                <span>{statusFilter}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showStatusFilterDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showStatusFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-30"
                  >
                    {['All Status', 'Present', 'Late', 'Absent', 'Excused'].map((statusOption) => (
                      <button
                        key={statusOption}
                        type="button"
                        onClick={() => {
                          setStatusFilter(statusOption);
                          setShowStatusFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                          statusFilter === statusOption
                            ? 'bg-sky-50 text-sky-600 font-black'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Pupils Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4">PUPIL NAME</th>
                  <th className="py-4 px-4">ROLL NO.</th>
                  <th className="py-4 px-4">MARK STATUS</th>
                  <th className="py-4 px-4">EDITABLE REMARKS</th>
                  <th className="py-4 px-4 text-right">FINAL STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPupils.map((pupil) => {
                  const isPresetOpen = activePresetDropdownId === pupil.id;

                  return (
                    <tr key={pupil.id} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* Pupil Name & Avatar */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={pupil.avatar}
                            alt={pupil.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                          <span className="text-sm font-extrabold text-brand-navy">
                            {pupil.name}
                          </span>
                        </div>
                      </td>

                      {/* Roll No */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs font-bold text-slate-500">
                        {pupil.rollNo}
                      </td>

                      {/* Mark Status Toggles */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          
                          {/* Present Toggle */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(pupil.id, 'present')}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              pupil.status === 'present'
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title="Mark Present"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>

                          {/* Absent Toggle */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(pupil.id, 'absent')}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              pupil.status === 'absent'
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title="Mark Absent"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>

                          {/* Late Toggle */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(pupil.id, 'late')}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              pupil.status === 'late'
                                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title="Mark Late"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <circle cx="12" cy="12" r="9" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                            </svg>
                          </button>

                          {/* Excused Toggle */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(pupil.id, 'excused')}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              pupil.status === 'excused'
                                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title="Mark Excused"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </button>

                        </div>
                      </td>

                      {/* Custom Web-UI Editable Remarks & Vertical Dropdown Presets */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Type reason or select preset..."
                              value={pupil.remarks}
                              onChange={(e) => handleRemarksChange(pupil.id, e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-brand-navy w-44 sm:w-52 focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                            />
                            {pupil.remarks && (
                              <button
                                type="button"
                                onClick={() => handleClearRemarks(pupil.id)}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                title="Clear Note"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* Custom Web UI Preset Dropdown Toggle Button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setActivePresetDropdownId(isPresetOpen ? null : pupil.id)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl px-3 py-2 text-xs font-extrabold flex items-center space-x-1 transition-all cursor-pointer"
                              title="Quick Preset Reasons"
                            >
                              <span>Presets</span>
                              <svg className={`w-3 h-3 transition-transform duration-200 ${isPresetOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {/* Custom Animated Vertical Dropdown Menu */}
                            <AnimatePresence>
                              {isPresetOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40 flex flex-col space-y-1"
                                >
                                  <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    Select Preset Note
                                  </div>
                                  {presetRemarksList.map((preset, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        handleRemarksChange(pupil.id, preset);
                                        setActivePresetDropdownId(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors cursor-pointer"
                                    >
                                      {preset}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                        </div>
                      </td>

                      {/* Final Action Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        {pupil.status === 'present' && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase">
                            PRESENT
                          </span>
                        )}
                        {pupil.status === 'late' && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200 uppercase">
                            LATE
                          </span>
                        )}
                        {pupil.status === 'absent' && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-500 border border-rose-200 uppercase">
                            ABSENT
                          </span>
                        )}
                        {pupil.status === 'excused' && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-sky-50 text-sky-600 border border-sky-200 uppercase">
                            EXCUSED
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Submit Success Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 z-10 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-brand-navy">Register Saved & Submitted!</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Grade 1 Gold attendance register with customized remarks has been successfully submitted.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
              >
                Okay, Thanks
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download Summary Modal */}
      <AnimatePresence>
        {showSummaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSummaryModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 z-10 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-brand-navy">Summary Downloaded</h3>
                <p className="text-xs text-slate-500 font-medium">
                  PDF attendance report for Grade 1 Gold including adjusted remarks has been downloaded.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Attendance;