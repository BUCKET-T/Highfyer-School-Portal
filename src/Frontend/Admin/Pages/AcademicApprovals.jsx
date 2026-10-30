import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  Search, 
  CheckCircle2, 
  RotateCcw, 
  Eye, 
  X, 
  FileText,
  AlertTriangle,
  AlertCircle,
  CheckCheck,
  Filter,
  ChevronDown
} from 'lucide-react';

const AcademicApprovals = () => {
  const [activeFilter, setActiveFilter] = useState('Pending Review');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(null);

  const filterOptions = [
    'Pending Review',
    'Approved Reports',
    'Reset History',
    'All Submissions'
  ];

  // Initial Mock Submissions Database matching reference table styling
  const [submissionsList, setSubmissionsList] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      className: 'Grade 1',
      subClass: 'Gold',
      pupilsCount: 32,
      teacherName: 'Mr. James Doe',
      teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      submissionDate: 'May 14, 2024',
      averageScore: '84%',
      status: 'Pending',
      term: 'Term 1, 2024 Session',
    },
    {
      id: 2,
      subject: 'Basic Science',
      className: 'Grade 3',
      subClass: 'Silver',
      pupilsCount: 28,
      teacherName: 'Mrs. Sarah Smith',
      teacherAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      submissionDate: 'May 12, 2024',
      averageScore: '76%',
      status: 'Reviewing',
      term: 'Term 1, 2024 Session',
    },
    {
      id: 3,
      subject: 'English Language',
      className: 'Grade 5',
      subClass: 'Emerald',
      pupilsCount: 30,
      teacherName: 'Mr. Kofi Mensah',
      teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      submissionDate: 'May 10, 2024',
      averageScore: '91%',
      status: 'Approved',
      term: 'Term 1, 2024 Session',
    },
  ]);

  // Handle Approve Action
  const handleApprove = (id) => {
    setSubmissionsList(submissionsList.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: 'Approved' };
      }
      return sub;
    }));
    setSelectedSubmission(null);
  };

  // Handle Bulk Approve Action
  const handleBulkApprove = () => {
    setSubmissionsList(submissionsList.map(sub => ({
      ...sub,
      status: 'Approved'
    })));
  };

  // Handle Reset Score Sheet Action
  const handleResetScoreSheet = (id) => {
    setSubmissionsList(submissionsList.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: 'Rejected' };
      }
      return sub;
    }));
    setShowResetConfirm(null);
    setSelectedSubmission(null);
  };

  // Filter Logic based on selected filter option
  const filteredSubmissions = submissionsList.filter(sub => {
    const matchesSearch = sub.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.subject.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'Pending Review') return matchesSearch && (sub.status === 'Pending' || sub.status === 'Reviewing');
    if (activeFilter === 'Approved Reports') return matchesSearch && sub.status === 'Approved';
    if (activeFilter === 'Reset History') return matchesSearch && (sub.status === 'Rejected' || sub.status === 'Reset / Returned');
    return matchesSearch; // 'All Submissions'
  });

  const countPending = submissionsList.filter(s => s.status === 'Pending').length;
  const countReviewing = submissionsList.filter(s => s.status === 'Reviewing').length;
  const countApproved = submissionsList.filter(s => s.status === 'Approved').length;
  const countRejected = submissionsList.filter(s => s.status === 'Rejected' || s.status === 'Reset / Returned').length;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Top Header Card Container with Bulk Approve Button */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Academic Approvals & Gradebook Review
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 pt-1">
            Review educator submissions, approve term result reports, or reset score sheets.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>{countPending} Pending Submissions</span>
          </div>

          <button
            onClick={handleBulkApprove}
            className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-slate-900/20 transition-all cursor-pointer flex items-center space-x-2"
          >
            <CheckCheck size={16} />
            <span>Bulk Approve</span>
          </button>
        </div>
      </div>

      {/* Grading Window Warning Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-3xl flex items-center space-x-4 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">TERM 1 GRADING WINDOW</h4>
          <p className="text-xs font-medium text-amber-700 pt-0.5">
            The current grading window closes in 4 days. {countPending} subjects still pending approval school-wide.
          </p>
        </div>
      </div>

      {/* High-Level Status Result Cards Grid with Hover Float Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-3 cursor-pointer">
          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">PENDING</p>
          <h3 className="text-3xl font-black text-sky-500 tracking-tight">{countPending}</h3>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-3 cursor-pointer">
          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">REVIEWING</p>
          <h3 className="text-3xl font-black text-amber-500 tracking-tight">{countReviewing}</h3>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-3 cursor-pointer">
          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">APPROVED</p>
          <h3 className="text-3xl font-black text-emerald-500 tracking-tight">{countApproved}</h3>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-3 cursor-pointer">
          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">REJECTED</p>
          <h3 className="text-3xl font-black text-rose-500 tracking-tight">{countRejected}</h3>
        </motion.div>
      </div>

      {/* Submission Queue Table Card with Web UI Filter Dropdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
        
        {/* Header, Search Bar & Custom Web Filter Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ClipboardCheck size={18} className="text-sky-500" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">SUBMISSION QUEUE</h3>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search queue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Custom Web UI Filter Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-800 transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
              >
                <Filter size={14} className="text-sky-500" />
                <span>FILTER: {activeFilter.toUpperCase()}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Filter Submissions
                    </div>
                    {filterOptions.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveFilter(option);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                          activeFilter === option ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{option}</span>
                        {activeFilter === option && <CheckCircle2 size={14} className="text-sky-500" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Submission Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider pb-4">
                <th className="pb-4 px-2">Subject & Class</th>
                <th className="pb-4 px-2">Educator</th>
                <th className="pb-4 px-2">Avg. Score</th>
                <th className="pb-4 px-2">Status</th>
                <th className="pb-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.map((sub) => (
                <motion.tr 
                  key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#F8FAFC' }}
                  className="transition-colors"
                >
                  {/* Subject & Class Column */}
                  <td className="py-4 px-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">{sub.subject}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {sub.className.toUpperCase()} • {sub.subClass.toUpperCase()} • {sub.pupilsCount} PUPILS
                      </p>
                    </div>
                  </td>

                  {/* Educator Column */}
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={sub.teacherAvatar}
                        alt={sub.teacherName}
                        className="w-9 h-9 rounded-xl object-cover shadow-sm flex-shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-xs font-black text-slate-900 truncate">{sub.teacherName}</p>
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                          SUBMITTED {sub.submissionDate.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Avg Score Column */}
                  <td className="py-4 px-2">
                    <span className="text-xs font-black text-slate-900">{sub.averageScore}</span>
                  </td>

                  {/* Status Column */}
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-extrabold ${
                      sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      sub.status === 'Pending' ? 'bg-sky-100 text-sky-600' :
                      sub.status === 'Reviewing' ? 'bg-amber-100 text-amber-700' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {sub.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions Column (Review & Reset Buttons) */}
                  <td className="py-4 px-2 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm"
                      >
                        <Eye size={14} className="text-sky-500" />
                        <span>REVIEW</span>
                      </button>

                      <button
                        onClick={() => setShowResetConfirm(sub.id)}
                        className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shadow-sm"
                        title="Reset Score Sheet"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Inspection Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#121B2D] text-white flex items-center justify-center font-bold">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedSubmission.subject}</h3>
                    <p className="text-xs font-bold text-sky-600">{selectedSubmission.className} {selectedSubmission.subClass} • Submitted by {selectedSubmission.teacherName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Submission Date</p>
                    <p className="text-xs font-bold text-slate-800 pt-0.5">{selectedSubmission.submissionDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Enrolled</p>
                    <p className="text-xs font-bold text-slate-800 pt-0.5">{selectedSubmission.pupilsCount} Pupils</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Class Average Performance:</span>
                    <span className="text-emerald-600 font-black">{selectedSubmission.averageScore}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Assessment Status:</span>
                    <span className="text-slate-800">{selectedSubmission.status}</span>
                  </div>
                </div>

                {showResetConfirm === selectedSubmission.id ? (
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2 text-rose-600 font-black text-xs">
                      <AlertTriangle size={16} />
                      <span>Are you sure you want to reset this score sheet?</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600">
                      This will wipe current entries and return the gradebook back to the educator for re-evaluation.
                    </p>
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => setShowResetConfirm(null)}
                        className="px-3 py-1.5 rounded-xl bg-white text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleResetScoreSheet(selectedSubmission.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold shadow hover:bg-rose-600 cursor-pointer"
                      >
                        Confirm Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setShowResetConfirm(selectedSubmission.id)}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <RotateCcw size={14} />
                      <span>Reset Score Sheet</span>
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleApprove(selectedSubmission.id)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-lg cursor-pointer flex items-center space-x-1.5"
                      >
                        <CheckCircle2 size={16} />
                        <span>Approve Report</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AcademicApprovals;