import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Initial Assignments Sample Data matching wireframe
const initialAssignments = [
  {
    id: 1,
    title: 'Shape Detective Home Activity',
    subject: 'MATHEMATICS',
    status: 'ACTIVE',
    subjectTagColor: 'bg-sky-100 text-sky-700',
    statusTagColor: 'bg-emerald-100 text-emerald-700',
    createdText: 'CREATED 2 DAYS AGO',
    dueText: 'DUE MAY 20, 2024',
    submittedCount: 24,
    totalCount: 32,
    guidelines: 'Identify 5 round and 5 rectangular household objects, sketch them, and write their names.',
  },
  {
    id: 2,
    title: 'Bean Plant Growth Diary – Week 2',
    subject: 'BASIC SCIENCE',
    status: 'DRAFT',
    subjectTagColor: 'bg-purple-100 text-purple-700',
    statusTagColor: 'bg-slate-100 text-slate-600',
    createdText: 'CREATED JUST NOW',
    dueText: 'DUE MAY 24, 2024',
    submittedCount: 0,
    totalCount: 32,
    guidelines: 'Measure seedling heights in centimeters and record water frequency.',
  },
  {
    id: 3,
    title: 'French Salutations Quiz',
    subject: 'FRENCH',
    status: 'CLOSED',
    subjectTagColor: 'bg-amber-100 text-amber-700',
    statusTagColor: 'bg-rose-100 text-rose-700',
    createdText: 'CREATED 1 WEEK AGO',
    dueText: 'DUE MAY 12, 2024',
    submittedCount: 32,
    totalCount: 32,
    guidelines: 'Match morning and evening greetings correctly.',
  },
];

const subjectOptions = ['All Subjects', 'Mathematics', 'Basic Science', 'French', 'Verbal Reasoning'];
const statusOptions = ['All Status', 'Active', 'Draft', 'Closed'];

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Web UI Filter Dropdowns
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('Subject');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Status');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeReviewTask, setActiveReviewTask] = useState(null);

  // Form state for New Task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Mathematics');
  const [showNewTaskSubjectDropdown, setShowNewTaskSubjectDropdown] = useState(false);
  
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskGuidelines, setNewTaskGuidelines] = useState('');

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
  }, []);

  // Filter assignments
  const filteredAssignments = assignments.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'Subject' || selectedSubjectFilter === 'All Subjects' || item.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();
    const matchesStatus = selectedStatusFilter === 'Status' || selectedStatusFilter === 'All Status' || item.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Handle Create New Task Submission
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDueDate) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      subject: newTaskSubject.toUpperCase(),
      status: 'ACTIVE',
      subjectTagColor: 'bg-sky-100 text-sky-700',
      statusTagColor: 'bg-emerald-100 text-emerald-700',
      createdText: 'CREATED JUST NOW',
      dueText: `DUE ${newTaskDueDate}`,
      submittedCount: 0,
      totalCount: 32,
      guidelines: newTaskGuidelines || 'Follow instructions provided by instructor.',
    };

    setAssignments([newTask, ...assignments]);
    setShowCreateModal(false);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskGuidelines('');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
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

          {/* Filters Group */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            
            {/* Subject Filter Dropdown */}
            <div className="relative w-36 sm:w-44">
              <button
                type="button"
                onClick={() => {
                  setShowSubjectDropdown(!showSubjectDropdown);
                  setShowStatusDropdown(false);
                }}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-brand-navy flex items-center justify-between transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="truncate">{selectedSubjectFilter}</span>
                </div>
                <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
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
                    className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40 flex flex-col space-y-1"
                  >
                    {subjectOptions.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          setSelectedSubjectFilter(sub);
                          setShowSubjectDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                          selectedSubjectFilter === sub ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative w-32 sm:w-36">
              <button
                type="button"
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowSubjectDropdown(false);
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

        {/* Metric Cards Grid matching Wireframe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Active Tasks Card */}
          <div className="bg-[#2B6CB0] text-white p-6 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">ACTIVE TASKS</span>
              <svg className="w-5 h-5 text-sky-300 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black">14</h2>
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
            <h2 className="text-4xl font-black">8</h2>
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
            <h2 className="text-4xl font-black">42</h2>
            <p className="text-xs font-semibold text-slate-300 flex items-center space-x-1 cursor-pointer hover:underline">
              <span>View archives</span>
              <span>↗</span>
            </p>
          </div>

        </div>

        {/* Recent Assignments List Section */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-brand-navy">Recent Assignments</h2>

          <div className="space-y-4">
            {filteredAssignments.map((item) => {
              const progressPct = Math.round((item.submittedCount / item.totalCount) * 100);

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
                      onClick={() => {
                        setActiveReviewTask(item);
                        setShowReviewModal(true);
                      }}
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
                  
                  {/* Custom Web-UI Subject Dropdown in Modal */}
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
                          className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 flex flex-col space-y-1"
                        >
                          {['Mathematics', 'Basic Science', 'French', 'Verbal Reasoning'].map((sub) => (
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
                      type="text"
                      placeholder="e.g. MAY 28, 2024"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-black text-slate-600 uppercase">Guidelines & Attachments</label>
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
                  <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                    Publish Task
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

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {[
                    { name: 'Chidi Okoro', status: 'Submitted', grade: '9/10', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
                    { name: 'Amara Nwosu', status: 'Submitted', grade: '8/10', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
                    { name: 'Tobi Adeyemi', status: 'Pending Review', grade: '—', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
                  ].map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center space-x-3">
                        <img src={sub.avatar} alt={sub.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-xs font-extrabold text-brand-navy">{sub.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-bold text-slate-500">{sub.status}</span>
                        <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">{sub.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
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

    </div>
  );
};

export default ManageAssignments;