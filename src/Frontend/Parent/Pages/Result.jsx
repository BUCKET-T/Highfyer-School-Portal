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

// Single Term Session Options
const termOptions = [
  { id: 'term-1', key: 'First Term', label: 'First Term, 2026/2027 Academic Session' },
  { id: 'term-2', key: 'Second Term', label: 'Second Term, 2025/2026 Academic Session' },
  { id: 'term-3', key: 'Third Term', label: 'Third Term, 2025/2026 Academic Session' },
];

// Term Results Data
const termResultsData = {
  'First Term': {
    termTitle: 'First Term (2026/2027)',
    cumulativeAverage: '85.0%',
    classPosition: '3rd out of 28 Pupils',
    classGrade: 'Grade 1 Gold',
    teacherRemarks: 'An exceptional term performance! Chidi shows brilliant cognitive growth across all learning areas, especially in mathematics and logical reasoning.',
    subjects: [
      { id: 'sub-1', name: 'Junior Math', fullName: 'Junior Mathematics', caScore: 26, examScore: 61, cumulative: 87, grade: 'A', remark: 'Excellent', fill: '#0EA5E9' },
      { id: 'sub-2', name: 'Vocational', fullName: 'Vocational Studies', caScore: 25, examScore: 58, cumulative: 83, grade: 'A', remark: 'Very Good', fill: '#10B981' },
      { id: 'sub-3', name: 'Verbal Reas.', fullName: 'Verbal Reasoning', caScore: 27, examScore: 63, cumulative: 90, grade: 'A+', remark: 'Outstanding', fill: '#A855F7' },
      { id: 'sub-4', name: 'Creative Arts', fullName: 'Creative Arts', caScore: 24, examScore: 56, cumulative: 80, grade: 'A', remark: 'Very Good', fill: '#F59E0B' },
    ],
  },
  'Second Term': {
    termTitle: 'Second Term (2025/2026)',
    cumulativeAverage: '80.5%',
    classPosition: '5th out of 28 Pupils',
    classGrade: 'Grade 1 Gold',
    teacherRemarks: 'Good discipline and attentiveness. Encouraged to practice more word problems in verbal reasoning.',
    subjects: [
      { id: 'sub-1', name: 'Junior Math', fullName: 'Junior Mathematics', caScore: 24, examScore: 57, cumulative: 81, grade: 'A', remark: 'Very Good', fill: '#0EA5E9' },
      { id: 'sub-2', name: 'Vocational', fullName: 'Vocational Studies', caScore: 23, examScore: 55, cumulative: 78, grade: 'B+', remark: 'Good', fill: '#10B981' },
      { id: 'sub-3', name: 'Verbal Reas.', fullName: 'Verbal Reasoning', caScore: 24, examScore: 58, cumulative: 82, grade: 'A', remark: 'Very Good', fill: '#A855F7' },
      { id: 'sub-4', name: 'Creative Arts', fullName: 'Creative Arts', caScore: 25, examScore: 52, cumulative: 77, grade: 'B+', remark: 'Good', fill: '#F59E0B' },
    ],
  },
  'Third Term': {
    termTitle: 'Third Term (2025/2026)',
    cumulativeAverage: '82.0%',
    classPosition: '4th out of 28 Pupils',
    classGrade: 'Grade 1 Gold',
    teacherRemarks: 'Consistent effort shown throughout the session. Great improvement in creative projects and class participation.',
    subjects: [
      { id: 'sub-1', name: 'Junior Math', fullName: 'Junior Mathematics', caScore: 25, examScore: 59, cumulative: 84, grade: 'A', remark: 'Very Good', fill: '#0EA5E9' },
      { id: 'sub-2', name: 'Vocational', fullName: 'Vocational Studies', caScore: 24, examScore: 56, cumulative: 80, grade: 'A', remark: 'Very Good', fill: '#10B981' },
      { id: 'sub-3', name: 'Verbal Reas.', fullName: 'Verbal Reasoning', caScore: 25, examScore: 60, cumulative: 85, grade: 'A', remark: 'Excellent', fill: '#A855F7' },
      { id: 'sub-4', name: 'Creative Arts', fullName: 'Creative Arts', caScore: 26, examScore: 58, cumulative: 84, grade: 'A', remark: 'Excellent', fill: '#F59E0B' },
    ],
  },
};

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
  const [selectedTermKey, setSelectedTermKey] = useState('First Term');
  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);

  const currentTermData = termResultsData[selectedTermKey] || termResultsData['First Term'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/60 min-h-screen">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
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
              Review continuous assessment, exam scores, and performance graphs.
            </p>
          </div>
        </div>

        {/* Custom Term Selector & Ward Badge */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Custom Web UI Term Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTermDropdownOpen(!isTermDropdownOpen)}
              className="flex items-center space-x-3 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">VIEWING SESSION</p>
                <p className="text-xs sm:text-sm font-extrabold text-brand-navy pt-1">{currentTermData.termTitle}</p>
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
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 space-y-1"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Term Session
                      </span>
                    </div>

                    {termOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSelectedTermKey(option.key);
                          setIsTermDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                          option.key === selectedTermKey
                            ? 'bg-brand-blue/10 border border-brand-blue/30 text-brand-navy font-bold'
                            : 'hover:bg-slate-50 border border-transparent text-slate-600 font-medium'
                        }`}
                      >
                        <span className="text-xs">{option.label}</span>
                        {option.key === selectedTermKey && (
                          <div className="w-2 h-2 rounded-full bg-brand-blue ring-4 ring-brand-blue/20" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Ward Badge */}
          <div className="flex items-center space-x-2 bg-slate-100/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WARD:</span>
            <span className="text-xs font-extrabold text-white bg-brand-navy px-2.5 py-0.5 rounded-lg">
              CHIDI OKORO
            </span>
          </div>
        </div>
      </div>

      {/* Term Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border-l-4 border-l-brand-blue shadow-sm border border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Term Cumulative Average</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-brand-navy">{currentTermData.cumulativeAverage}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Distinction Grade
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border-l-4 border-l-brand-navy shadow-sm border border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Term Class Position</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-brand-navy">{currentTermData.classPosition}</span>
            <span className="text-xs font-bold text-brand-blue bg-brand-sky/20 px-2.5 py-1 rounded-full">
              {currentTermData.classGrade}
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

      {/* Recharts Bar Chart Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">Subject Performance Chart ({selectedTermKey})</h2>
            <p className="text-xs text-slate-500 font-medium">Graphical breakdown of total percentage scores by subject</p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-bold text-slate-400">
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span><span>Math</span></span>
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span><span>Vocational</span></span>
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span><span>Verbal</span></span>
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span><span>Arts</span></span>
          </div>
        </div>

        {/* Responsive Recharts Container */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentTermData.subjects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontWeight: 600, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="cumulative" radius={[12, 12, 0, 0]} barSize={42}>
                {currentTermData.subjects.map((entry, index) => (
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
          <p className="text-xs text-slate-500 font-medium">Individual score report for {currentTermData.termTitle}</p>
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
              {currentTermData.subjects.map((sub) => (
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

      {/* Class Teacher Assessment */}
      <div className="bg-brand-navy text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold">Class Teacher's Assessment</h3>
          <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wider">{currentTermData.classGrade}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium italic leading-relaxed">
          "{currentTermData.teacherRemarks}"
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