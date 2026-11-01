import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Upload, 
  FileText, 
  Check, 
  ChevronDown, 
  Save, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

const CurriculumManager = () => {
  // Filter & Selection States
  const [selectedGrade, setSelectedGrade] = useState('Grade 1');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  // Form States for Mock Curriculum Data
  const [learningObjectives, setLearningObjectives] = useState([
    'Understanding Place Values (Ones, Tens, Hundreds)',
    'Basic Addition and Subtraction within 100',
    'Introduction to Simple Fractions (1/2, 1/4)'
  ]);
  const [newObjective, setNewObjective] = useState('');
  const [pdfFileName, setPdfFileName] = useState('Grade_1_Mathematics_Term1_Guide.pdf');
  
  // UI & Notification States
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(false);

  // Custom Dropdown Open States
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  // Options Lists
  const gradeOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const termOptions = ['Term 1', 'Term 2', 'Term 3'];
  const subjectOptions = [
    'Mathematics', 
    'English Language', 
    'Basic Science & Tech', 
    'Social Studies', 
    'Agricultural Science', 
    'Creative & Cultural Arts'
  ];

  // Add new objective to mock list
  const handleAddObjective = (e) => {
    e.preventDefault();
    if (!newObjective.trim()) return;
    setLearningObjectives([...learningObjectives, newObjective.trim()]);
    setNewObjective('');
  };

  // Remove objective from list
  const handleRemoveObjective = (indexToRemove) => {
    setLearningObjectives(learningObjectives.filter((_, idx) => idx !== indexToRemove));
  };

  // Mock Save Handler for UI Testing
  const handleSaveCurriculum = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setNotification(true);
      setTimeout(() => setNotification(false), 3000);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Top Header Banner Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center">
              <BookOpen size={22} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Curriculum Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 pt-2">
            Configure learning objectives, syllabus modules, and downloadable curriculum guides for Grade 1 through Grade 6.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-700"
            >
              <CheckCircle2 size={16} />
              <span>Curriculum Updated Successfully!</span>
            </motion.div>
          )}

          <button
            onClick={handleSaveCurriculum}
            disabled={saving}
            className="bg-[#121B2D] hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-slate-900/20 transition-all cursor-pointer flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Curriculum'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Custom Web-Based Dropdowns for Grade, Term, and Subject */}
      <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Grade Filter Dropdown */}
        <div className="relative text-left space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT GRADE LEVEL</label>
          <button
            type="button"
            onClick={() => {
              setIsGradeDropdownOpen(!isGradeDropdownOpen);
              setIsTermDropdownOpen(false);
              setIsSubjectDropdownOpen(false);
            }}
            className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer shadow-inner"
          >
            <span className="flex items-center space-x-2">
              <Sparkles size={14} className="text-sky-500" />
              <span>{selectedGrade}</span>
            </span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isGradeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isGradeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
              >
                {gradeOptions.map((grade, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedGrade(grade);
                      setIsGradeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedGrade === grade ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{grade}</span>
                    {selectedGrade === grade && <Check size={14} className="text-sky-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Term Filter Dropdown */}
        <div className="relative text-left space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ACADEMIC TERM</label>
          <button
            type="button"
            onClick={() => {
              setIsTermDropdownOpen(!isTermDropdownOpen);
              setIsGradeDropdownOpen(false);
              setIsSubjectDropdownOpen(false);
            }}
            className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer shadow-inner"
          >
            <span>{selectedTerm}</span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isTermDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isTermDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
              >
                {termOptions.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedTerm(term);
                      setIsTermDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedTerm === term ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{term}</span>
                    {selectedTerm === term && <Check size={14} className="text-sky-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="relative text-left space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">SUBJECT AREA</label>
          <button
            type="button"
            onClick={() => {
              setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
              setIsGradeDropdownOpen(false);
              setIsTermDropdownOpen(false);
            }}
            className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer shadow-inner"
          >
            <span>{selectedSubject}</span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isSubjectDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
              >
                {subjectOptions.map((subj, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(subj);
                      setIsSubjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSubject === subj ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{subj}</span>
                    {selectedSubject === subj && <Check size={14} className="text-sky-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Main Content Area: Objectives & Attachment Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Learning Objectives Builder */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Term Learning Objectives</h3>
              <p className="text-xs font-medium text-slate-500 pt-0.5">Define key learning goals for teachers and parents to track.</p>
            </div>
            <span className="px-3 py-1 bg-sky-50 text-sky-600 text-xs font-extrabold rounded-full">
              {learningObjectives.length} Topic Modules
            </span>
          </div>

          {/* Add Objective Input Form */}
          <form onSubmit={handleAddObjective} className="flex items-center space-x-3">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="e.g. Master multiplication tables from 1 to 12"
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 shadow-inner focus:outline-none"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0"
            >
              <Plus size={16} />
              <span>Add Topic</span>
            </button>
          </form>

          {/* Objectives List */}
          <div className="space-y-3 pt-2">
            {learningObjectives.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-400">No learning objectives defined for this term yet.</p>
              </div>
            ) : (
              learningObjectives.map((objective, index) => (
                <div 
                  key={index}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-sky-200 transition-colors"
                >
                  <div className="flex items-start space-x-3 text-left">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-sky-600 text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 leading-relaxed pt-0.5">{objective}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(index)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                    title="Remove Objective"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Column: PDF Syllabus Attachment & Quick Preview */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Syllabus Upload Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
            <div className="flex items-center space-x-2.5">
              <FileText size={18} className="text-sky-500" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">PDF Syllabus Attachment</h3>
            </div>

            <p className="text-xs font-medium text-slate-500 text-left">
              Attach a complete printable syllabus PDF for parents and educators to download.
            </p>

            {pdfFileName ? (
              <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl text-left space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                    <FileText size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-black text-slate-900 truncate">{pdfFileName}</h4>
                    <span className="text-[10px] font-extrabold text-emerald-600 flex items-center space-x-1 pt-0.5">
                      <CheckCircle2 size={12} />
                      <span>Attached & Ready</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => alert('Simulated document preview')}
                    className="flex-1 bg-white hover:bg-slate-50 text-sky-600 border border-slate-200 text-center py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    View Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfFileName('')}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Remove PDF"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 hover:border-sky-400 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors space-y-2 bg-slate-50/50">
                <Upload size={24} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Click to upload PDF Syllabus</span>
                <span className="text-[10px] font-medium text-slate-400">PDF up to 10MB</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files[0]) setPdfFileName(e.target.files[0].name);
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Quick Context Summary Card */}
          <div className="bg-[#121B2D] p-6 rounded-3xl text-white shadow-xl space-y-3 text-left">
            <h4 className="text-xs font-black text-sky-400 uppercase tracking-widest">UI Preview Mode</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              This module runs locally with mockup states so you can fine-tune your spacing, custom dropdowns, and button micro-interactions freely.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CurriculumManager;