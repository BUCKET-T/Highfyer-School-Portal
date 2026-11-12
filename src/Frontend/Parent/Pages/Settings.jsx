import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsLogic } from '../../../Backend/Parent/SettingsLogic';
import SkeletonSettings from '../../Shared/loaders/SkeletonSettings';

const Settings = () => {
  const {
    activeTab, setActiveTab,
    isLoading, isSaving,
    profileData,
    getInitials,
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    showOldPassword, setShowOldPassword,
    showNewPassword, setShowNewPassword,
    passwordSuccess, passwordError,
    pushNotifs, setPushNotifs,
    emailNotifs, setEmailNotifs,
    darkMode, setDarkMode,
    savedSuccess,
    showToast,
    toastMessage,
    toastType,
    handleCustomAvatarUpload,
    handleSaveAvatarOnly,
    handlePasswordChange,
  } = useSettingsLogic();

  if (isLoading) {
    return <SkeletonSettings />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/60 min-h-screen font-sans relative">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-xs font-extrabold flex items-center space-x-3 border ${
              toastType === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <span>{toastType === 'error' ? '✕' : '✓'}</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-brand-navy/10 text-brand-navy rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              Manage your ward picture and portal preferences.
            </p>
          </div>
        </div>

        {/* Dynamic Ward Badge */}
        <div className="flex items-center space-x-2 bg-slate-100/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/60 self-start md:self-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WARD:</span>
          <span className="text-xs font-extrabold text-white bg-brand-navy px-2.5 py-0.5 rounded-lg">
            {(profileData.full_name || 'STUDENT').toUpperCase()} - {(profileData.grade || 'N/A').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sub-Tab Navigation */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Notifications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Privacy & Security</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span>Theme Options</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'help'
                ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help & Support</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          
          {savedSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-bold">
              ✓ Avatar updated successfully!
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSaveAvatarOnly} className="space-y-8">
              
              {/* Editable Ward Avatar Section */}
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-brand-navy">Ward Profile Picture</h2>
                  <p className="text-xs text-slate-500 font-medium">Click the camera icon to upload a picture (Max 45KB). Avatar is the only editable field on this page.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                  <div className="relative group flex-shrink-0">
                    {profileData.avatar_url ? (
                      <img
                        src={profileData.avatar_url}
                        alt={profileData.full_name}
                        className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-slate-100 ring-2 ring-brand-blue/30"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-brand-navy text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-4 border-slate-100 ring-2 ring-brand-blue/30 select-none">
                        {getInitials(profileData.full_name)}
                      </div>
                    )}

                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-brand-blue hover:bg-slate-800 text-white p-2.5 rounded-full shadow-lg cursor-pointer transition-all"
                      title="Upload new picture"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h0.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleCustomAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-sm font-extrabold text-brand-navy">{profileData.full_name || 'Student Name'}</h3>
                    <p className="text-xs font-semibold text-slate-400">{profileData.grade || 'Class'} Pupil</p>
                    <p className="text-[11px] text-slate-400 font-medium pt-1">Select a local photo under 45KB to customize your avatar.</p>
                  </div>
                </div>
              </div>

              {/* Read-Only Profile Credentials Section */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-brand-navy">Personal Details (Read Only)</h3>
                  <p className="text-xs text-slate-500 font-medium">To update these official credentials, please contact the academy administration desk.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">STUDENT FULL NAME</label>
                    <input
                      type="text"
                      disabled
                      readOnly
                      value={profileData.full_name}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-brand-navy cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PARENT/GUARDIAN NAME</label>
                    <input
                      type="text"
                      disabled
                      readOnly
                      value={profileData.parent_guardian}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-brand-navy cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PARENT EMAIL</label>
                    <input
                      type="email"
                      disabled
                      readOnly
                      value={profileData.email}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-brand-navy cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CONTACT PHONE</label>
                    <input
                      type="text"
                      disabled
                      readOnly
                      value={profileData.phone}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-brand-navy cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HOME ADDRESS</label>
                    <input
                      type="text"
                      disabled
                      readOnly
                      value={profileData.home_address}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-brand-navy cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>
              </div>

              {/* Save Avatar Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-brand-navy hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
                >
                  {isSaving ? 'Saving Avatar...' : 'Save Avatar Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-brand-navy">Notification Preferences</h2>
                <p className="text-xs text-slate-500 font-medium">Choose what updates you want to receive via push and email.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-brand-navy">Push Notifications</p>
                    <p className="text-[11px] text-slate-500 font-medium">Receive real-time alerts for new assignments and announcements.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushNotifs(!pushNotifs)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${pushNotifs ? 'bg-brand-blue' : 'bg-slate-300'}`}
                  >
                    <motion.div animate={{ x: pushNotifs ? 24 : 0 }} className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-brand-navy">Email Digest</p>
                    <p className="text-[11px] text-slate-500 font-medium">Receive a weekly summary of attendance and academic performance.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${emailNotifs ? 'bg-brand-blue' : 'bg-slate-300'}`}
                  >
                    <motion.div animate={{ x: emailNotifs ? 24 : 0 }} className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-brand-navy">Privacy & Security</h2>
                <p className="text-xs text-slate-500 font-medium">Change your parent portal login password securely.</p>
              </div>

              {passwordSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-bold">
                  ✓ Password updated successfully!
                </motion.div>
              )}

              {passwordError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold">
                  {passwordError}
                </motion.div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">INPUT OLD PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full p-3 pr-10 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-2xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        {showOldPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">INPUT NEW PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full p-3 pr-10 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-2xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        {showNewPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-brand-navy hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-brand-navy">Theme Options</h2>
                <p className="text-xs text-slate-500 font-medium">Switch between light and dark visual aesthetics.</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-brand-navy">Dark Mode Appearance</p>
                  <p className="text-[11px] text-slate-500 font-medium">Optimize interface for low-light viewing.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${darkMode ? 'bg-brand-blue' : 'bg-slate-300'}`}
                >
                  <motion.div animate={{ x: darkMode ? 24 : 0 }} className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-brand-navy">Help & Support</h2>
                <p className="text-xs text-slate-500 font-medium">Need assistance? Contact academy administration.</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-brand-navy">Highflyer Kiddies Academy Help Desk</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  For support with ward accounts, grade reports, or fee payments, reach out via email at <span className="font-bold text-brand-blue">support@highflyerkiddies.edu</span> or call the school administrative line at <span className="font-bold text-brand-navy">+234 814 4564 272</span>.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;