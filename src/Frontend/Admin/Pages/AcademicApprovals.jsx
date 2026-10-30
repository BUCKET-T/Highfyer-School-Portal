import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Eye, 
  X, 
  FileText,
  AlertTriangle,
  Award
} from 'lucide-react';

const AcademicApprovals = () => {
  const [activeTab, setActiveTab] = useState('Pending Review');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(null);

  // Initial Mock Submissions Database
  const [submissionsList, setSubmissionsList] = useState([
    {
      id: 1,
      teacherName: 'Mr. James Doe',
      className: 'Grade 1 Gold',
      subject: 'Junior Mathematics & Quantitative',
      term: 'Term 1, 2024 Session',
      totalPupils: 32,
      submissionDate: 'Oct 28, 2026',
      status: 'Pending',
      averageScore: '78.4%',
    },
    {
      id: 2,
      teacherName: 'Mrs. Sarah Connor',
      className: 'Primary 3 Blue',
      subject: 'Basic Science & Technology',
      term: 'Term 1, 2024 Session',
      totalPupils: 28,
      submissionDate: 'Oct 27, 2026',
      status: 'Pending',
      averageScore: '81.2%',
    },
    {
      id: 3,
      teacherName: 'Mr. Kofi Mensah',
      className: 'Grade 5 Emerald',
      subject: 'English Language & Literature',
      term: 'Term 1, 2024 Session',
      totalPupils: 30,
      submissionDate: 'Oct 25, 2026',
      status: 'Approved',
      averageScore: '74.9%',
    },
    {
      id: 4,
      teacherName: 'Ms. Amara Nwachukwu',
      className: 'Kindergarten 2',
      subject: 'Early Numeracy & Motor Skills',
      term: 'Term 1, 2024 Session',
      totalPupils: 25,
      submissionDate: 'Oct 24, 2026',
      status: 'Approved',
      averageScore: '88.5%',
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

  // Handle Reset Score Sheet Action
  const handleResetScoreSheet = (id) => {
    setSubmissionsList(submissionsList.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: 'Reset / Returned' };
      }
      return sub;
    }));
    setShowResetConfirm(null);
    setSelectedSubmission(null);
  };

  // Filter Logic
  const filteredSubmissions = submissionsList.filter(sub => {
    const matchesSearch = sub.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.subject.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Pending Review') return matchesSearch && sub.status === 'Pending';
    if (activeTab === 'Approved Reports') return matchesSearch && sub.status === 'Approved';
    if (activeTab === 'Reset History') return matchesSearch && sub.status === 'Reset / Returned';
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Top Header Card Container */}
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
            <span>{submissionsList.filter(s => s.status === 'Pending').length} Pending Submissions</span>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-2 max-w-fit">
        {['Pending Review', 'Approved Reports', 'Reset History', 'All Submissions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#121B2D] text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar & Submissions Table */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by teacher, class, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {filteredSubmissions.length} Records Found
            </span>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-4">Educator & Class</th>
                <th className="py-4 px-4">Subject / Term</th>
                <th className="py-4 px-4">Class Average</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
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
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0">
                        {sub.teacherName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{sub.teacherName}</h4>
                        <p className="text-[11px] font-bold text-sky-600 truncate">{sub.className} ({sub.totalPupils} Pupils)</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-800">{sub.subject}</p>
                      <p className="text-[10px] font-medium text-slate-400">{sub.term}</p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl text-xs font-black">
                      <Award size={14} />
                      <span>{sub.averageScore}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      sub.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {sub.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>

                      {sub.status === 'Pending' && (
                        <button
                          onClick={() => handleApprove(sub.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection & Approval Modal */}
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
                    <p className="text-xs font-bold text-sky-600">{selectedSubmission.className} • Submitted by {selectedSubmission.teacherName}</p>
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
                    <p className="text-xs font-bold text-slate-800 pt-0.5">{selectedSubmission.totalPupils} Pupils</p>
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