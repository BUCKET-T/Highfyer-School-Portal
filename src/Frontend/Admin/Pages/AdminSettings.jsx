import React, { useState } from 'react';
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

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'session' | 'security' | 'activity'
  const [savedNotification, setSavedNotification] = useState(false);

  // Form & Settings States
  const [profile, setProfile] = useState({
    fullName: 'Admin Director',
    portalEmail: 'admin.director@highflyerkiddies.edu.ng',
    phone: '+234 801 234 5678',
    roleTitle: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  });

  const [settings, setSettings] = useState({
    activeSession: '2023/2024 Academic Session',
    currentTerm: 'Term 1 (Active)',
    termStartDate: '2024-08-01',
    termEndDate: '2024-12-04',
    scoreEntryWindow: true,
    parentResultPortal: false,
    twoFactorAuth: true,
    automaticLogout: true, // Automatic logout after 30 mins inactivity
  });

  // Password Change States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  // Custom Dropdown States
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);

  const sessionOptions = [
    '2023/2024 Academic Session',
    '2024/2025 Academic Session',
    '2025/2026 Academic Session'
  ];

  const termOptions = [
    'Term 1 (Active)',
    'Term 2 (Upcoming)',
    'Term 3 (Upcoming)'
  ];

  // System Activity logs
  const systemActivityLogs = [
    { id: 1, action: 'Admin Login Successful', user: 'Admin Director (Super Admin)', ip: '197.210.54.12', time: '12 mins ago', status: 'Success' },
    { id: 2, action: 'Term 1 Gradebook Bulk Approved', user: 'Admin Director', ip: '197.210.54.12', time: '2 hours ago', status: 'Completed' },
    { id: 3, action: 'Automatic 30-min Inactivity Logout Triggered', user: 'System Watchdog', ip: 'Localhost', time: 'Yesterday', status: 'Secured' },
    { id: 4, action: 'New Educator Account Onboarded', user: 'Admin Assistant', ip: '197.210.54.18', time: '2 days ago', status: 'Success' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      setPasswordStatus({ type: 'error', message: 'Please enter your current password.' });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordStatus(null), 4000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Top Header Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            System Configuration & Settings
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 pt-1">
            Manage your admin profile, academic sessions, security preferences, and activity logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {savedNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2"
            >
              <CheckCircle2 size={16} />
              <span>Settings Saved Successfully!</span>
            </motion.div>
          )}

          <button
            onClick={handleSave}
            className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-slate-900/20 transition-all cursor-pointer flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Update System</span>
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
                    <div>
                      <h3 className="text-base font-black text-slate-900">Admin Profile Details</h3>
                      <p className="text-xs font-medium text-slate-500">Update your administrator credentials and contact details.</p>
                    </div>
                  </div>

                  {/* Profile Picture Card */}
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center space-x-5">
                    <div className="relative">
                      <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-sky-500 text-white p-2 rounded-full shadow-md hover:bg-sky-600 transition-colors cursor-pointer"
                        title="Upload Profile Picture"
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900">{profile.fullName}</h4>
                      <p className="text-xs font-bold text-sky-600 uppercase tracking-wider pt-0.5">{profile.roleTitle}</p>
                      <p className="text-[11px] font-medium text-slate-400 pt-1">
                        Upload custom image (PNG, JPG max 500kb).
                      </p>
                    </div>
                  </div>

                  {/* Form Input Fields */}
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
                    <div>
                      <h3 className="text-base font-black text-slate-900">Session Timing</h3>
                      <p className="text-xs font-medium text-slate-500">Manage term dates and entry windows.</p>
                    </div>
                  </div>

                  {/* Dropdowns & Date Pickers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Active Academic Session Custom Web Dropdown */}
                    <div className="space-y-2 relative text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ACTIVE ACADEMIC SESSION</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSessionDropdownOpen(!isSessionDropdownOpen);
                          setIsTermDropdownOpen(false);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer shadow-inner"
                      >
                        <span>{settings.activeSession}</span>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isSessionDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isSessionDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                          >
                            {sessionOptions.map((opt, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSettings({ ...settings, activeSession: opt });
                                  setIsSessionDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                                  settings.activeSession === opt ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <span>{opt}</span>
                                {settings.activeSession === opt && <Check size={14} className="text-sky-500" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Current Active Term Custom Web Dropdown */}
                    <div className="space-y-2 relative text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CURRENT ACTIVE TERM</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTermDropdownOpen(!isTermDropdownOpen);
                          setIsSessionDropdownOpen(false);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer shadow-inner"
                      >
                        <span>{settings.currentTerm}</span>
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
                                <span>{term}</span>
                                {settings.currentTerm === term && <Check size={14} className="text-sky-500" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Term Start Date */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TERM START DATE</label>
                      <input
                        type="date"
                        value={settings.termStartDate}
                        onChange={(e) => setSettings({ ...settings, termStartDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 shadow-inner"
                      />
                    </div>

                    {/* Term End Date */}
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

                  {/* Toggles Section */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900">Score Entry Window</h4>
                        <p className="text-[11px] font-medium text-slate-500">Allow teachers to input C.A and Exam scores into the portal.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.scoreEntryWindow}
                        onChange={(e) => setSettings({ ...settings, scoreEntryWindow: e.target.checked })}
                        className="w-6 h-6 accent-sky-500 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900">Parent Result Portal</h4>
                        <p className="text-[11px] font-medium text-slate-500">Enable parents to view and download term result PDF reports.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.parentResultPortal}
                        onChange={(e) => setSettings({ ...settings, parentResultPortal: e.target.checked })}
                        className="w-6 h-6 accent-sky-500 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Critical Window Warning Banner */}
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 rounded-3xl text-white shadow-xl space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wide">Critical Window Approaching</h4>
                        <p className="text-xs text-rose-100 pt-0.5">Once the Term is finalized, results are immutable without Super Admin override. Ensure all Academic Approvals are complete.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Term 1 Finalized and locked.')}
                      className="w-full bg-white text-rose-600 hover:bg-rose-50 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      Finalise Term 1
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 3: PRIVACY & SECURITY (With Change Password Feature) */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Portal Access & Security Controls</h3>
                      <p className="text-xs font-medium text-slate-500">Manage account credentials, two-factor auth, and session inactivity timeouts.</p>
                    </div>
                  </div>

                  {/* Change Password Card Section */}
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
                      {/* Current Password */}
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
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
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
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
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
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
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

                  {/* Security Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900">Two-Factor Auth (2FA)</h4>
                        <p className="text-[11px] font-medium text-slate-500">Require 2FA for all Staff and Admin accounts.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                        className="w-6 h-6 accent-sky-500 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900">Automatic Logout (30 Mins Inactivity)</h4>
                        <p className="text-[11px] font-medium text-slate-600">Sessions expire after 30 minutes of inactivity across all accounts.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.automaticLogout}
                        onChange={(e) => setSettings({ ...settings, automaticLogout: e.target.checked })}
                        className="w-6 h-6 accent-sky-500 rounded cursor-pointer"
                      />
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
                    <div>
                      <h3 className="text-base font-black text-slate-900">System Activity & Audit Trail</h3>
                      <p className="text-xs font-medium text-slate-500">Monitor live security logs and platform events.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {systemActivityLogs.map((log) => (
                      <div key={log.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Clock size={18} />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-black text-slate-900">{log.action}</h4>
                            <p className="text-[11px] font-bold text-slate-500">{log.user} • IP: {log.ip}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 self-end sm:self-center">
                          <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600">
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminSettings;