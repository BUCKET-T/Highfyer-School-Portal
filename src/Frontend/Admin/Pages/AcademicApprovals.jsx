import React from 'react';
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
  ChevronDown,
  Inbox
} from 'lucide-react';

// Import Custom Backend Logic Hook
import { useAcademicApprovalLogic } from '../../../Backend/Admin/AcademicApprovalLogic';

// Import Shared Spinner Loader
import Spinner from '../../Shared/loaders/Spinner';

const AcademicApprovals = () => {
  const {
    activeFilter,
    setActiveFilter,
    isFilterDropdownOpen,
    setIsFilterDropdownOpen,
    searchQuery,
    setSearchQuery,
    selectedSubmission,
    setSelectedSubmission,
    showResetConfirm,
    setShowResetConfirm,
    filterOptions,
    filteredSubmissions,
    countPending,
    countReviewing,
    countApproved,
    countRejected,
    isLoading,
    showGradingBanner,
    daysRemaining,
    handleApprove,
    handleBulkApprove,
    handleResetScoreSheet,
  } = useAcademicApprovalLogic();

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
            disabled={countPending === 0 && countReviewing === 0}
            className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-slate-900/20 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck size={16} />
            <span>Bulk Approve</span>
          </button>
        </div>
      </div>

      {/* Conditional Grading Window Warning Banner (Displays ONLY when <= 12 days to term end) */}
      {showGradingBanner && (
        <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">TERM GRADING WINDOW CLOSING SOON</h4>
            <p className="text-xs font-medium text-amber-700 pt-0.5">
              The current term grading window closes in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}. {countPending} subject assessment reports are awaiting review school-wide.
            </p>
          </div>
        </div>
      )}

      {/* High-Level Status Result Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-3">
          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">PENDING</p>
          <h3 className="text-3xl font-black text-sky-500 tracking-tight">{countPending}</h3>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-3">
          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">REVIEWING</p>
          <h3 className="text-3xl font-black text-amber-500 tracking-tight">{countReviewing}</h3>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-3">
          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">APPROVED</p>
          <h3 className="text-3xl font-black text-emerald-500 tracking-tight">{countApproved}</h3>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-3">
          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">REJECTED</p>
          <h3 className="text-3xl font-black text-rose-500 tracking-tight">{countRejected}</h3>
        </motion.div>
      </div>

      {/* Submission Queue Table Card */}
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

            {/* Filter Dropdown */}
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

        {/* Loading State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Spinner size="md" color="brand-blue" />
            <p className="text-xs font-bold text-slate-400">Loading academic submission queue...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          /* Empty State View */
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl text-slate-300 flex items-center justify-center mx-auto border border-slate-100">
              <Inbox size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">No Gradebook Submissions Found</h4>
              <p className="text-xs font-medium text-slate-400 max-w-md mx-auto">
                No academic assessment reports currently match your filter query. Records will automatically show up here as educators submit their term gradebooks.
              </p>
            </div>
          </div>
        ) : (
          /* Submission Queue Table */
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
                    <td className="py-4 px-2">
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">{sub.subject}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {sub.className.toUpperCase()}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={sub.teacherAvatar}
                          alt={sub.teacherName}
                          className="w-9 h-9 rounded-xl object-cover shadow-sm flex-shrink-0 bg-slate-100"
                        />
                        <div className="truncate">
                          <p className="text-xs font-black text-slate-900 truncate">{sub.teacherName}</p>
                          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                            SUBMITTED {sub.submissionDate.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-2">
                      <span className="text-xs font-black text-slate-900">{sub.averageScore}</span>
                    </td>

                    <td className="py-4 px-2">
                      <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-extrabold ${
                        sub.status?.toUpperCase() === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                        sub.status?.toUpperCase() === 'PENDING' ? 'bg-sky-100 text-sky-600' :
                        sub.status?.toUpperCase() === 'REVIEWING' ? 'bg-amber-100 text-amber-700' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </td>

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
        )}
      </div>

      {/* Review Modal */}
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
                    <p className="text-xs font-bold text-sky-600">
                      {selectedSubmission.className} • Submitted by {selectedSubmission.teacherName}
                    </p>
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</p>
                    <p className="text-xs font-bold text-slate-800 pt-0.5">{selectedSubmission.status}</p>
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