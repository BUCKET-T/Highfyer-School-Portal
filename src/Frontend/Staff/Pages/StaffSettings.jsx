import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StaffSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Form States
  const [fullName, setFullName] = useState('Mr. James Doe');
  const [email, setEmail] = useState('james.doe@highflyerkiddies.edu.ng');
  const [phone, setPhone] = useState('+234 802 333 4444');
  const [roleTitle, setRoleTitle] = useState('Senior Educator (Grade 1 Gold)');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  // Success Modal State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setToastMessage('Changes successfully saved and updated!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      setToastMessage('Staff avatar updated successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Bar */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
            Manage your educator profile, security credentials, and portal preferences.
          </p>
        </div>

        {/* Main Settings Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Sidebar Navigation (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-2">
            
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-3 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-sky-50 text-sky-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile Settings</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-3 transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-sky-50 text-sky-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Notifications</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-3 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-sky-50 text-sky-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Privacy & Security</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-3 transition-all cursor-pointer ${
                activeTab === 'theme'
                  ? 'bg-sky-50 text-sky-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <span>Theme Options</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-3 transition-all cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-sky-50 text-sky-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Help & Support</span>
            </button>

          </div>

          {/* Right Content Area (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            
            {/* TAB 1: PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-8">
                
                {/* Staff Avatar Uploader Section (Centered & Moderate for both Mobile & Desktop) */}
                <div className="space-y-5 border-b border-slate-100 pb-8 text-center sm:text-left">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-brand-navy">Staff Profile Picture</h2>
                    <p className="text-xs text-slate-500 font-medium pt-0.5">
                      Current active photo displayed across the staff portal header.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:space-x-5">
                    <div className="relative inline-block">
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-sky-100 shadow-inner"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-1 right-1 w-9 h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all"
                        title="Upload Custom Image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-black text-brand-navy">{fullName}</h4>
                      <p className="text-xs font-bold text-sky-600">{roleTitle}</p>
                      <p className="text-[11px] text-slate-400 font-medium max-w-xs">Click the camera icon to upload a custom image (PNG, JPG, WEBP max 300kb).</p>
                    </div>
                  </div>
                </div>

                {/* Personal Details Form Section */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-brand-navy">Personal Details</h3>
                    <p className="text-xs text-slate-500 font-medium pt-0.5">
                      Update your educator credentials and contact phone.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">FULL NAME</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-brand-navy focus:outline-none focus:border-sky-500 transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PORTAL EMAIL</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-brand-navy focus:outline-none focus:border-sky-500 transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CONTACT PHONE</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-brand-navy focus:outline-none focus:border-sky-500 transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ROLE & DESIGNATION</label>
                      <input
                        type="text"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-brand-navy focus:outline-none focus:border-sky-500 transition-all shadow-inner"
                      />
                    </div>

                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            )}

            {/* TAB 2: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleSave} className="space-y-6 text-left">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-brand-navy">Notification Preferences</h2>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Choose how you would like to receive administrative alerts and attendance reminders.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-brand-navy">Email Notifications</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Receive term C.A deadline reminders and school bulletins.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifEmail}
                      onChange={(e) => setNotifEmail(e.target.checked)}
                      className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-brand-navy">Push Notifications</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Instant browser alerts for parent messages and homework submissions.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifPush}
                      onChange={(e) => setNotifPush(e.target.checked)}
                      className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-brand-navy">SMS Alerts</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Emergency announcements sent directly to your phone number.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifSms}
                      onChange={(e) => setNotifSms(e.target.checked)}
                      className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
                    />
                  </div>

                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Update Preferences
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: PRIVACY & SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleSave} className="space-y-6 text-left">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-brand-navy">Privacy & Security</h2>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Update your staff portal password and manage active login sessions.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CURRENT PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-brand-navy focus:outline-none focus:border-sky-500 shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">NEW PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-brand-navy focus:outline-none focus:border-sky-500 shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CONFIRM NEW PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-brand-navy focus:outline-none focus:border-sky-500 shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: THEME OPTIONS */}
            {activeTab === 'theme' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-brand-navy">Theme & Display Options</h2>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Customize your staff portal interface appearance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 bg-sky-50 border-2 border-sky-400 rounded-2xl space-y-2 cursor-pointer">
                    <h4 className="text-sm font-black text-brand-navy">Light Mode (Default)</h4>
                    <p className="text-xs text-slate-500">Clean high-contrast daytime interface for classroom use.</p>
                  </div>

                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                    <h4 className="text-sm font-black text-white">Dark Mode (Coming Soon)</h4>
                    <p className="text-xs text-slate-400">Easy on the eyes for evening lesson planning.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HELP & SUPPORT */}
            {activeTab === 'help' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-brand-navy">Help & Support Desk</h2>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Contact HighFlyer Kiddies Academy technical support for portal issues.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-brand-navy">IT Administrator Contact</h4>
                    <p className="text-xs text-slate-600 font-medium">Email: <span className="font-bold text-sky-600">support@highflyerkiddies.edu.ng</span></p>
                    <p className="text-xs text-slate-600 font-medium">Helpline: <span className="font-bold text-sky-600">+234 800 HIGHFLYER</span></p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage('Support ticket submitted successfully!');
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      className="bg-[#1B253B] hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                    >
                      Submit Support Ticket
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Success Toast Notification Modal */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1B253B] text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3"
          >
            <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black text-xs">
              ✓
            </div>
            <span className="text-xs font-extrabold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StaffSettings;