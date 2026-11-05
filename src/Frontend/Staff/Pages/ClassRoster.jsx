import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClassRosterLogic } from '../../../Backend/Staff/ClassRosterLogic';
import SkeletonClassRoster from '../../Shared/Staff/SkeletonClassRoster';
import Spinner from '../../Shared/loaders/Spinner';

const ClassRoster = () => {
  const {
    educatorClass,
    isLoading,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    isAlphabetical,
    setIsAlphabetical,
    showAddModal,
    setShowAddModal,
    showExportModal,
    setShowExportModal,
    showProfileModal,
    setShowProfileModal,
    activePupil,
    setActivePupil,
    newName,
    setNewName,
    newParent,
    setNewParent,
    newPhone,
    setNewPhone,
    newEmail,
    setNewEmail,
    newAddress,
    setNewAddress,
    newMedical,
    setNewMedical,
    newGrade,
    setNewGrade,
    sortedPupils,
    handleAddPupil
  } = useClassRosterLogic();

  if (isLoading) {
    return <SkeletonClassRoster />;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar Patented to Educator's Assigned Class */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100 text-left">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Class Roster
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              Directory of {educatorClass} Pupils & Guardians
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 border border-slate-200 shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Directory</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-[#1B253B] hover:bg-slate-800 text-white font-extrabold px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              + Add New Pupil
            </button>
          </div>
        </div>

        {/* Search & Sort Toolbar */}
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
              placeholder="Search students by name, ID, or parent contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-brand-navy focus:outline-none focus:border-sky-500 shadow-sm transition-all"
            />
          </div>

          {/* Group / Alphabetical Sort Toggle */}
          <button
            type="button"
            onClick={() => setIsAlphabetical(!isAlphabetical)}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer shadow-sm ${
              isAlphabetical ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isAlphabetical ? 'Sorted Alphabetically (A–Z)' : 'Group by Alpha'}
          </button>

        </div>

        {/* Pupil Profiles Directory Cards List */}
        <div className="space-y-6 text-left">
          {sortedPupils.length > 0 ? (
            sortedPupils.map((pupil) => (
              <div
                key={pupil.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6 transition-all hover:border-slate-200"
              >
                
                {/* Left: Avatar / Initials & Name */}
                <div className="flex items-center space-x-5 flex-shrink-0 xl:w-60">
                  {pupil.avatar ? (
                    <img
                      src={pupil.avatar}
                      alt={pupil.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-sky-100 shadow-inner flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-400 text-white font-black text-xl sm:text-2xl flex items-center justify-center border-4 border-sky-100 shadow-inner flex-shrink-0">
                      {pupil.initials}
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                      {pupil.name}
                    </h3>
                    <p className="text-xs font-bold text-sky-600">
                      {pupil.gradeDisplay}
                    </p>
                    
                    {/* Action Message / Profile Icons */}
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePupil(pupil);
                          setShowProfileModal(true);
                        }}
                        className="w-9 h-9 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        title="Direct Message Parent"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePupil(pupil);
                          setShowProfileModal(true);
                        }}
                        className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        title="View Full Pupil Profile"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Middle: Contact Info Grid (Optimized spacing for email length) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1 xl:px-4">
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PARENT/GUARDIAN</p>
                    <p className="text-xs sm:text-sm font-extrabold text-brand-navy">{pupil.parentGuardian}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CONTACT PHONE</p>
                    <p className="text-xs sm:text-sm font-extrabold text-brand-navy flex items-center space-x-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      <span>{pupil.contactPhone}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CONTACT EMAIL</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 break-all">{pupil.contactEmail}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">HOME ADDRESS</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">{pupil.homeAddress}</p>
                  </div>

                </div>

                {/* Right: Emergency & Medical Notes Boxes (Width reduced for email breathing room) */}
                <div className="flex flex-col sm:flex-row xl:flex-col gap-3 flex-shrink-0 xl:w-60">
                  
                  {/* Emergency Box */}
                  <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 space-y-1 flex-1">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider flex items-center space-x-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      <span>EMERGENCY</span>
                    </p>
                    <p className="text-xs font-bold text-slate-800">{pupil.emergencyContact}</p>
                  </div>

                  {/* Medical Notes Box */}
                  <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3.5 space-y-1 flex-1">
                    <p className="text-[10px] font-black text-sky-600 uppercase tracking-wider flex items-center space-x-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                      <span>MEDICAL NOTES</span>
                    </p>
                    <p className="text-xs font-black text-brand-navy">{pupil.medicalNotes}</p>
                  </div>

                </div>

              </div>
            ))
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <h3 className="text-base font-black text-brand-navy">No pupils found</h3>
              <p className="text-xs text-slate-500 font-medium">No pupil records match "{searchQuery}" for {educatorClass}.</p>
            </div>
          )}
        </div>

      </div>

      {/* Add New Pupil Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 z-10 space-y-6 text-left">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-brand-navy">Add New Pupil Record</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
              </div>

              <form onSubmit={handleAddPupil} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Pupil Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. David Adeleke"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Grade Level</label>
                    <input
                      type="text"
                      placeholder="e.g. GRADE 6"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Parent / Guardian</label>
                    <input
                      type="text"
                      placeholder="e.g. Mr. Adeleke"
                      value={newParent}
                      onChange={(e) => setNewParent(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +234 803 000 0000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Contact Email</label>
                    <input
                      type="email"
                      placeholder="e.g. parent@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Home Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Lekki Phase 1, Lagos"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Medical Notes Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Peanut Allergy / Asthmatic / None"
                      value={newMedical}
                      onChange={(e) => setNewMedical(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold px-5 py-3 rounded-2xl text-xs transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#1B253B] hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2"
                  >
                    {isSubmitting && <Spinner size="sm" />}
                    <span>{isSubmitting ? 'Saving Record...' : 'Save Pupil Record'}</span>
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Directory Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExportModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 z-10 text-center space-y-4">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-brand-navy">Directory Exported</h3>
                <p className="text-xs text-slate-500 font-medium">Class roster and medical summary spreadsheet downloaded.</p>
              </div>
              <button type="button" onClick={() => setShowExportModal(false)} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pupil Profile & Messaging Modal */}
      <AnimatePresence>
        {showProfileModal && activePupil && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfileModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 z-10 space-y-5 text-left">
              
              <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
                {activePupil.avatar ? (
                  <img src={activePupil.avatar} alt={activePupil.name} className="w-16 h-16 rounded-full object-cover border-2 border-sky-400" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-rose-400 text-white font-black text-lg flex items-center justify-center border-2 border-sky-400">
                    {activePupil.initials}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-black text-brand-navy">{activePupil.name}</h3>
                  <p className="text-xs font-bold text-sky-600">{activePupil.gradeDisplay}</p>
                  <p className="text-[11px] font-semibold text-slate-400">Guardian: {activePupil.parentGuardian}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Send Direct Message to Parent</h4>
                <textarea
                  rows="3"
                  placeholder={`Write a quick update regarding ${activePupil.name}...` }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-brand-navy focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowProfileModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold px-5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="button" onClick={() => setShowProfileModal(false)} className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-2.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                  Send Message
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ClassRoster;