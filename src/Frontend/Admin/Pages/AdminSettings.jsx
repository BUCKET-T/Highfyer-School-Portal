import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User,
  Calendar, 
  Shield, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  AlertTriangle,
  Camera,
  Check,
  Lock,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { useAdminSettingsLogic } from '../../../Backend/Admin/AdminSettingsLogic';
import SkeletonAdminSettings from '../../Shared/Admin/SkeletonAdminSettings';

const AdminSettings = () => {

  const {
    activeTab, setActiveTab,
    isSaving, isLoadingLogs, toast,
    profile, setProfile,
    settings, setSettings,
    passwordData, setPasswordData,
    showCurrentPassword, setShowCurrentPassword,
    showNewPassword, setShowNewPassword,
    showConfirmPassword, setShowConfirmPassword,
    passwordStatus,
    isTermDropdownOpen, setIsTermDropdownOpen,
    termOptions,
    systemActivityLogs,
    handleAvatarUpload,
    handleSave,
    handlePasswordChangeSubmit
  } = useAdminSettingsLogic();

  // Display skeleton loader during initial data fetching
  if (isLoadingLogs) {
    return <SkeletonAdminSettings />;
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Toast Notification Banner (Positioned Bottom-Right) */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl text-xs font-black flex items-center space-x-2 border ${
              toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            System Configuration & Settings
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 pt-1">
            Manage your admin profile, live academic sessions, security preferences, and activity logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-slate-900/20 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Saving...' : 'Update System'}</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Vertical Navigation System UI */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Vertical Nav System Buttons */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-2">
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-[#121B2D] text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User size={18} className={activeTab === 'profile' ? 'text-sky-400' : 'text-slate-400'} />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('session')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'session' 
                  ? 'bg-[#121B2D] text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar size={18} className={activeTab === 'session' ? 'text-sky-400' : 'text-slate-400'} />
              <span>Academic Session</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'security' 
                  ? 'bg-[#121B2D] text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Shield size={18} className={activeTab === 'security' ? 'text-sky-400' : 'text-slate-400'} />
              <span>Privacy & Security</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'activity' 
                  ? 'bg-[#121B2D] text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity size={18} className={activeTab === 'activity' ? 'text-sky-400' : 'text-slate-400'} />
              <span>System Activity</span>
            </button>

          </div>
        </div>

        {/* Right Column: Dynamic Content Card */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            
            <form onSubmit={handleSave} className="space-y-6">

              {/* SECTION 1: PROFILE SETTINGS */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <User size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-black text-slate-900">Admin Profile Details</h3>
                      <p className="text-xs font-medium text-slate-500">Update your administrator credentials and contact details in Supabase.</p>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center space-x-5">
                    <div className="relative">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.fullName}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-md flex items-center justify-center text-slate-500 font-black">
                          {profile.fullName ? profile.fullName.charAt(0) : 'A'}
                        </div>
                      )}
                      
                      <label 
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-sky-500 text-white p-2 rounded-full shadow-md hover:bg-sky-600 transition-colors cursor-pointer"
                        title="Upload Avatar (Max 30KB)"
                      >
                        <Camera size={14} />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="text-left">
                      <h4 className="text-sm font-black text-slate-900">{profile.fullName || 'Admin User'}</h4>
                      <p className="text-xs font-bold text-sky-600 uppercase tracking-wider pt-0.5">{profile.roleTitle}</p>
                      <p className="text-[11px] font-medium text-slate-400 pt-1">
                        Upload custom image (PNG, JPG — strictly max 30KB).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">FULL NAME</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 shadow-inner focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PORTAL EMAIL</label>
                      <input
                        type="email"
                        value={profile.portalEmail}
                        onChange={(e) => setProfile({ ...profile, portalEmail: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 shadow-inner focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PHONE NUMBER</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 shadow-inner focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ROLE TITLE</label>
                      <input
                        type="text"
                        value={profile.roleTitle}
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: ACADEMIC SESSION */}
              {activeTab === 'session' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Calendar size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-black text-slate-900">Session Timing & Academic Settings</h3>
                      <p className="text-xs font-medium text-slate-500">Manage term dates and active session flags in Supabase.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Active Academic Session Input */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ACTIVE ACADEMIC SESSION</label>
                      <input
                        type="text"
                        value={settings.activeSession}
                        onChange={(e) => setSettings({ ...settings, activeSession: e.target.value })}
                        placeholder="e.g., 2024/2025 Academic Session"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-800 shadow-inner focus:outline-none"
                      />
                    </div>

                    {/* Current Active Term Dropdown */}
                    <div className="space-y-2 relative text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CURRENT ACTIVE TERM</label>
                      <button
                        type="button"
                        onClick={() => setIsTermDropdownOpen(!isTermDropdownOpen)}
                        className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer shadow-inner"
                      >
                        <span>{settings.currentTerm} (Active)</span>
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
                                  setSettings({ ...settings, currentTerm: term });
                                  setIsTermDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                                  settings.currentTerm === term ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <span>{term} {settings.currentTerm === term && '(Active)'}</span>
                                {settings.currentTerm === term && <Check size={14} className="text-sky-500" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TERM START DATE</label>
                      <input
                        type="date"
                        value={settings.termStartDate}
                        onChange={(e) => setSettings({ ...settings, termStartDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 shadow-inner"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TERM END DATE</label>
                      <input
                        type="date"
                        value={settings.termEndDate}
                        onChange={(e) => setSettings({ ...settings, termEndDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 shadow-inner"
                      />
                    </div>

                  </div>

                  <div className="space-y-4 pt-4">
                    {/* Score Entry Window Toggle (Blue Pill Switch Style) */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900">Score Entry Window</h4>
                        <p className="text-[11px] font-medium text-slate-500">Allow teachers to input C.A and Exam scores into the portal.</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, scoreEntryWindow: !prev.scoreEntryWindow }))}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                          settings.scoreEntryWindow ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                            settings.scoreEntryWindow ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Parent Result Portal Toggle (Blue Pill Switch Style) */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900">Parent Result Portal</h4>
                        <p className="text-[11px] font-medium text-slate-500">Enable parents to view and download term result PDF reports.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, parentResultPortal: !prev.parentResultPortal }))}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                          settings.parentResultPortal ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                            settings.parentResultPortal ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: PRIVACY & SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Shield size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-black text-slate-900">Portal Access & Security Controls</h3>
                      <p className="text-xs font-medium text-slate-500">Update your account password securely via Supabase Auth.</p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex items-center space-x-2.5 text-slate-900">
                      <KeyRound size={18} className="text-sky-500" />
                      <h4 className="text-xs font-black uppercase tracking-wider">Change Account Password</h4>
                    </div>

                    {passwordStatus && (
                      <div className={`p-3 rounded-2xl text-xs font-extrabold flex items-center space-x-2 ${
                        passwordStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {passwordStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        <span>{passwordStatus.message}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CURRENT PASSWORD</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-white border border-slate-200 focus:border-sky-500 rounded-2xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-800 shadow-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">NEW PASSWORD</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-white border border-slate-200 focus:border-sky-500 rounded-2xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-800 shadow-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CONFIRM NEW PASSWORD</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-white border border-slate-200 focus:border-sky-500 rounded-2xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-800 shadow-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handlePasswordChangeSubmit}
                        className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer shadow-md flex items-center space-x-1.5"
                      >
                        <Lock size={14} />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: SYSTEM ACTIVITY */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Activity size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-black text-slate-900">System Activity & Audit Trail</h3>
                      <p className="text-xs font-medium text-slate-500">Monitor live security logs and platform events from Supabase.</p>
                    </div>
                  </div>

                  {isLoadingLogs ? (
                    <div className="py-12 flex items-center justify-center space-x-2 text-slate-400 text-xs font-bold">
                      <RefreshCw size={16} className="animate-spin text-sky-500" />
                      <span>Fetching audit trail...</span>
                    </div>
                  ) : systemActivityLogs.length > 0 ? (
                    <div className="space-y-3">
                      {systemActivityLogs.map((log) => (
                        <div key={log.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Clock size={18} />
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-black text-slate-900">{log.action}</h4>
                              <p className="text-[11px] font-bold text-slate-500">
                                IP: <span className="text-slate-700">{log.ip_address || '197.210.54.12'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 self-end sm:self-center">
                            <span className="text-[10px] font-bold text-slate-400">
                              {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' :
                              log.status === 'Completed' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {log.status || 'Success'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-2 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <Activity size={32} className="mx-auto text-slate-300" />
                      <h4 className="text-xs font-black text-slate-600">No Activity Logs Found</h4>
                      <p className="text-[11px] font-medium text-slate-400">Administrative events will appear here automatically when recorded.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Form Action Footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-slate-900/20 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isSaving ? 'animate-spin' : ''} />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Configuration Changes'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminSettings;