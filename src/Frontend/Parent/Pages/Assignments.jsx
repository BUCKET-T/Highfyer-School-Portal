import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Initial Homework Tasks Data mapped to Core Subjects
const initialTasks = [
  {
    id: 'task-1',
    subject: 'MATHS',
    subjectFull: 'Junior Mathematics',
    subjectTagColor: 'bg-sky-100 text-sky-700 border-sky-200',
    iconBg: 'bg-sky-100 text-sky-600',
    title: 'Shape Detective Challenge',
    description: 'Find 5 circles and 5 squares in your home and take photos or draw them in your workbook.',
    dueDate: 'Due Tomorrow',
    dueTime: 'BY 4:00 PM',
    status: 'pending', // pending | overdue | completed
    isArchived: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    id: 'task-2',
    subject: 'VOCATIONAL',
    subjectFull: 'Vocational Studies',
    subjectTagColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600',
    title: 'Home Safety Inspection Diary',
    description: 'Week 2: Identify 3 safety signs or hazards around the living room and draw simple warning badges.',
    dueDate: 'Due Friday',
    dueTime: 'BY 2:00 PM',
    status: 'pending',
    isArchived: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'task-3',
    subject: 'VERBAL',
    subjectFull: 'Verbal Reasoning',
    subjectTagColor: 'bg-purple-100 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-100 text-purple-600',
    title: 'Word Synonyms Worksheet',
    description: 'Match the 10 word pairs with similar meanings on page 14 of your exercise workbook.',
    dueDate: 'Overdue',
    dueTime: 'YESTERDAY',
    status: 'overdue',
    isArchived: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    id: 'task-4',
    subject: 'ARTS',
    subjectFull: 'Creative Arts',
    subjectTagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    title: 'Color Wheel Painting Project',
    description: 'Mix primary colors (Red, Blue, Yellow) to paint secondary color circles.',
    dueDate: 'Completed',
    dueTime: 'OCT 20, 2026',
    status: 'completed',
    isArchived: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

const Assignments = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' | 'ARCHIVE'
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');

  // Count summaries
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const overdueCount = tasks.filter((t) => t.status === 'overdue').length;

  // Filter tasks according to Active/Archive view
  const displayedTasks = tasks.filter((task) =>
    activeTab === 'ACTIVE' ? !task.isArchived : task.isArchived
  );

  // Handle task submission completion
  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!selectedTaskForSubmission) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskForSubmission.id
          ? { ...t, status: 'completed', isArchived: true, dueDate: 'Submitted', dueTime: 'JUST NOW' }
          : t
      )
    );

    setSelectedTaskForSubmission(null);
    setSubmissionNote('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/60 min-h-screen">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-brand-coral/10 text-brand-coral rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Assignments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              Keep up the good work, Chidi!
            </p>
          </div>
        </div>

        {/* Ward Badge */}
        <div className="flex items-center space-x-2 bg-slate-100/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/60 self-start md:self-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WARD:</span>
          <span className="text-xs font-extrabold text-white bg-brand-navy px-2.5 py-0.5 rounded-lg">
            CHIDI OKORO - GRADE 1 GOLD
          </span>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Pending Card */}
        <div className="bg-white p-6 rounded-3xl border-b-4 border-b-sky-400 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PENDING</p>
            <h2 className="text-2xl font-extrabold text-brand-navy">{pendingCount} Tasks</h2>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white p-6 rounded-3xl border-b-4 border-b-emerald-400 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">COMPLETED</p>
            <h2 className="text-2xl font-extrabold text-brand-navy">{completedCount} Tasks</h2>
          </div>
        </div>

        {/* Overdue Card */}
        <div className="bg-white p-6 rounded-3xl border-b-4 border-b-brand-coral shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-brand-coral/10 text-brand-coral rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OVERDUE</p>
            <h2 className="text-2xl font-extrabold text-brand-navy">{overdueCount} Task{overdueCount !== 1 ? 's' : ''}</h2>
          </div>
        </div>

      </div>

      {/* Weekly Tasks Section Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        
        {/* Section Header & Tab Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">Weekly Tasks</h2>

          {/* Active / Archive Pill Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ACTIVE'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-navy'
              }`}
            >
              ACTIVE
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ARCHIVE')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ARCHIVE'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-navy'
              }`}
            >
              ARCHIVE
            </button>
          </div>
        </div>

        {/* Task List Items */}
        <div className="space-y-4">
          {displayedTasks.length > 0 ? (
            displayedTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Side: Icon & Details */}
                <div className="flex items-start space-x-4">
                  <div className={`p-3.5 rounded-2xl ${task.iconBg} flex-shrink-0 mt-0.5`}>
                    {task.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase border ${task.subjectTagColor}`}>
                        {task.subject}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {task.subjectFull}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-brand-navy leading-snug">
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Right Side: Due Date & Action Button */}
                <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <p
                      className={`text-xs font-extrabold ${
                        task.status === 'overdue' ? 'text-brand-coral' : 'text-brand-navy'
                      }`}
                    >
                      {task.dueDate}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-0.5">
                      {task.dueTime}
                    </p>
                  </div>

                  {/* Submission Action Buttons */}
                  {task.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => setSelectedTaskForSubmission(task)}
                      className="bg-brand-navy hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                    >
                      Submit
                    </button>
                  )}

                  {task.status === 'overdue' && (
                    <button
                      type="button"
                      onClick={() => setSelectedTaskForSubmission(task)}
                      className="bg-brand-coral hover:bg-orange-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                    >
                      Finish Now
                    </button>
                  )}

                  {task.status === 'completed' && (
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            /* Empty State Fallback */
            <div className="bg-slate-50/50 p-10 rounded-3xl border border-slate-100 text-center flex flex-col items-center justify-center space-y-3 py-12">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-brand-navy">No {activeTab.toLowerCase()} tasks found</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                {activeTab === 'ACTIVE'
                  ? 'All pending homework tasks are currently completed! Check the Archive tab for past submissions.'
                  : 'There are no archived assignment submissions yet.'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Task Submission Modal */}
      <AnimatePresence>
        {selectedTaskForSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTaskForSubmission(null)}
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 z-10 space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase border ${selectedTaskForSubmission.subjectTagColor}`}>
                  {selectedTaskForSubmission.subject}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTaskForSubmission(null)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-brand-navy">
                  Submit Homework Task
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {selectedTaskForSubmission.title} — {selectedTaskForSubmission.description}
                </p>
              </div>

              <form onSubmit={handleConfirmSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Parent / Pupil Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                    placeholder="E.g., Chidi completed all drawing exercises on workbook page 12..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskForSubmission(null)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Confirm & Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Assignments;