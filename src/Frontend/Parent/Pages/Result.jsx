import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useResultLogic } from '../../../Backend/Parent/ResultLogic';
import SkeletonResult from '../../Shared/loaders/SkeletonResult';

// Custom Tooltip Component for Recharts Bar Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 space-y-1 text-xs">
        <p className="font-extrabold text-brand-navy">{data.fullName}</p>
        <p className="text-slate-500 font-medium">C.A Score: <span className="font-bold text-brand-navy">{data.caScore}/30</span></p>
        <p className="text-slate-500 font-medium">Exam Score: <span className="font-bold text-brand-navy">{data.examScore}/70</span></p>
        <p className="text-brand-blue font-extrabold pt-0.5">Total: {data.cumulative}% ({data.grade})</p>
      </div>
    );
  }
  return null;
};

const Results = () => {
  const {
    currentWard,
    isLoading,
    isDataLoading,
    termOptions,
    selectedTerm,
    setSelectedTerm,
    termGrades,
    classPositionText,
    cumulativeAverage,
  } = useResultLogic();

  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);

  if (isLoading || !currentWard) {
    return <SkeletonResult />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/60 min-h-screen">
      
      {/* Top Header Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-brand-sky/20 text-brand-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Academic Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              Review continuous assessment, exam scores, and performance graphs for {currentWard.full_name}.
            </p>
          </div>
        </div>

        {/* Term Selector & Ward Badge (Side-by-side on PC) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 xl:justify-end flex-shrink-0">
          
          {/* Custom Web UI Term Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsTermDropdownOpen(!isTermDropdownOpen)}
              className="w-full sm:w-auto flex items-center justify-between space-x-3 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">VIEWING SESSION</p>
                <p className="text-xs sm:text-sm font-extrabold text-brand-navy pt-1">
                  {selectedTerm ? `${selectedTerm.term_name}, ${selectedTerm.session_name}` : 'Select Term'}
                </p>
              </div>
              <motion.svg
                animate={{ rotate: isTermDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            {/* Framer Motion Popover Menu */}
            <AnimatePresence>
              {isTermDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsTermDropdownOpen(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 space-y-1 max-h-64 overflow-y-auto"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1 sticky top-0 bg-white z-10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Term Session
                      </span>
                    </div>

                    {termOptions.map((option) => {
                      const isSelected = selectedTerm?.id === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSelectedTerm(option);
                            setIsTermDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-brand-blue/10 border border-brand-blue/30 text-brand-navy font-bold'
                              : 'hover:bg-slate-50 border border-transparent text-slate-600 font-medium'
                          }`}
                        >
                          <span className="text-xs">{option.label}</span>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-brand-blue ring-4 ring-brand-blue/20 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Ward Badge */}
          <div className="flex items-center justify-between sm:justify-start space-x-2 bg-slate-100/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/60 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WARD:</span>
            <span className="text-xs font-extrabold text-white bg-brand-navy px-2.5 py-0.5 rounded-lg uppercase">
              {currentWard.full_name}
            </span>
          </div>

        </div>
      </div>

      {/* Term Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border-l-4 border-l-brand-blue shadow-sm border border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Term Cumulative Average</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-brand-navy">{cumulativeAverage}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Distinction Grade
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border-l-4 border-l-brand-navy shadow-sm border border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Term Class Position</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy">{classPositionText}</span>
            <span className="text-xs font-bold text-brand-blue bg-brand-sky/20 px-2.5 py-1 rounded-full uppercase">
              {currentWard.grade || 'Grade'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border-l-4 border-l-amber-400 shadow-sm border border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Term Result Status</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600">Verified</span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Formal Approval
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart & Detailed Results Section */}
      {isDataLoading ? (
        <SkeletonResult />
      ) : termGrades.length > 0 ? (
        <>
          {/* Recharts Bar Chart Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">
                  Subject Performance Chart ({selectedTerm ? `${selectedTerm.term_name}, ${selectedTerm.session_name}` : ''})
                </h2>
                <p className="text-xs text-slate-500 font-medium">Graphical breakdown of total percentage scores by subject</p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 flex-wrap">
                {termGrades.map((sub) => (
                  <span key={sub.id} className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: sub.fill }}></span>
                    <span>{sub.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={termGrades} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontWeight: 600, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                  <Bar dataKey="cumulative" radius={[12, 12, 0, 0]} barSize={42}>
                    {termGrades.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Single Term Grade Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden space-y-4">
            <div className="p-6 sm:p-8 pb-4 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">Subject Scores & Grade Breakdown</h2>
              <p className="text-xs text-slate-500 font-medium">
                Individual score report for {selectedTerm ? `${selectedTerm.term_name}, ${selectedTerm.session_name}` : ''}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="py-4 px-6">Subject Title</th>
                    <th className="py-4 px-6 text-center">C.A Score (30%)</th>
                    <th className="py-4 px-6 text-center">Exam Score (70%)</th>
                    <th className="py-4 px-6 text-center">Cumulative (100%)</th>
                    <th className="py-4 px-6 text-center">Total Grade</th>
                    <th className="py-4 px-6">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-600">
                  {termGrades.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-extrabold text-brand-navy">{sub.fullName}</td>
                      <td className="py-4 px-6 text-center font-semibold text-slate-600">{sub.caScore} / 30</td>
                      <td className="py-4 px-6 text-center font-semibold text-slate-600">{sub.examScore} / 70</td>
                      <td className="py-4 px-6 text-center font-extrabold text-brand-blue">{sub.cumulative}%</td>
                      <td className="py-4 px-6 text-center">
                        <span className="bg-brand-blue/10 text-brand-blue font-extrabold px-3 py-1 rounded-xl">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-600">{sub.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Empty State for Newly Registered or Term Without Results */
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-brand-sky/20 text-brand-blue rounded-3xl flex items-center justify-center shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-extrabold text-brand-navy">No Result Records Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {currentWard?.full_name} has no recorded assessments for <span className="font-bold text-brand-navy">{selectedTerm ? `${selectedTerm.term_name}, ${selectedTerm.session_name}` : 'this term'}</span> yet. This is common for newly registered pupils until continuous assessments or exam scores are published by teachers.
            </p>
          </div>
        </div>
      )}

      {/* Class Teacher Assessment */}
      <div className="bg-brand-navy text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold">Class Teacher's Assessment</h3>
          <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wider">{currentWard.grade || 'Grade'}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium italic leading-relaxed">
          "An exceptional term performance! {currentWard.full_name} shows brilliant cognitive growth across all learning areas and consistent participation."
        </p>
        <div className="pt-2 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center font-bold text-xs text-white">
            BA
          </div>
          <div>
            <p className="text-xs font-bold text-white">Ms. Beatrice Adewale</p>
            <p className="text-[10px] font-semibold text-slate-400">Class Educator, Highflyer Kiddies Academy</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Results;