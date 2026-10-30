import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Activity, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  UserPlus, 
  Megaphone, 
  CalendarCheck,
  ChevronDown,
  Bell
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('Term 1, 2024 Session');
  const [showLockNotice, setShowLockNotice] = useState(false);

  // Exactly 4 Live Staff Activity Audit Logs
  const staffActivities = [
    {
      id: 1,
      name: 'Mr. James Doe',
      action: 'Uploaded Grade 1st Term Results',
      time: '12 MINS AGO',
      avatarBg: 'from-sky-400 to-indigo-500',
    },
    {
      id: 2,
      name: 'Mrs. Sarah Connor',
      action: 'Marked Daily Attendance for Primary 3',
      time: '45 MINS AGO',
      avatarBg: 'from-pink-400 to-rose-500',
    },
    {
      id: 3,
      name: 'Admin Adeleke',
      action: 'Onboarded 4 new pupil accounts',
      time: '1 HOUR AGO',
      avatarBg: 'from-amber-400 to-orange-500',
    },
    {
      id: 4,
      name: 'Mr. Kofi Mensah',
      action: 'Sent Class Broadcast to Grade 5 Parents',
      time: '2 HOURS AGO',
      avatarBg: 'from-emerald-400 to-teal-500',
    },
  ];

  const termsList = [
    { name: 'Term 1, 2024 Session', isDemo: false },
    { name: 'Term 2, 2024 Session', isDemo: true },
    { name: 'Term 3, 2024 Session', isDemo: true }
  ];

  const handleTermSelect = (termObj) => {
    setIsDropdownOpen(false);
    if (termObj.isDemo) {
      setShowLockNotice(true);
      setTimeout(() => {
        setSelectedTerm('Term 1, 2024 Session');
        setShowLockNotice(false);
      }, 1800);
    } else {
      setSelectedTerm(termObj.name);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Top Greeting & Header Bar (Fully Mobile Optimized) */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, Admin Director!
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Here's what's happening across <span className="font-extrabold text-sky-500">Highflyer Kiddies Academy</span> today.
          </p>
        </div>

        {/* Action Controls & Dropdown (Responsive wrap for mobile) */}
        <div className="flex flex-wrap items-center gap-3 relative pt-2 lg:pt-0">
          
          {/* Custom Switch Term Dropdown Pill (Matching Reference UI Style) */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between space-x-3 bg-white hover:bg-slate-50 border-2  px-4 py-2.5 rounded-full text-xs font-black text-slate-900 shadow-md transition-all cursor-pointer min-w-[210px]"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="truncate">{selectedTerm}</span>
              </div>
              <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                <ChevronDown size={16} className="text-slate-700" />
              </motion.div>
            </button>

            {/* Dropdown Menu Popup Box */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 lg:right-0 lg:left-auto mt-2 w-72 bg-white border border-slate-200 rounded-3xl shadow-2xl py-3 z-50 overflow-hidden"
                >
                  {/* Header Title */}
                  <div className="px-5 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      SWITCH TERM
                    </p>
                  </div>

                  {termsList.map((item, index) => {
                    const isSelected = item.name === selectedTerm;
                    return (
                      <button
                        key={index}
                        onClick={() => handleTermSelect(item)}
                        className={`w-full text-left px-5 py-3 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">
                          {item.name}{' '}
                          {item.isDemo && (
                            <span className="text-[10px] font-extrabold text-amber-500 ml-1">
                              (Demo Sample Only)
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell with Pink Dot */}
          <button 
            onClick={() => navigate('/admin/broadcasts')}
            className="relative p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 flex-shrink-0"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Admin Profile Mini Avatar */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
              AD
            </div>
          </div>
        </div>

        {/* Lock Notice Toast Feedback */}
        <AnimatePresence>
          {showLockNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-14 right-0 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center space-x-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Demo sample term locked. Reverting to active datasets (Term 1)...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* High-Level Metrics Grid with Hover Rise Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Total Pupils Card */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold">
              <Users size={24} />
            </div>
            <span className="text-[11px] font-extrabold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
              +12%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">TOTAL PUPILS</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight pt-1">412</h3>
          </div>
        </motion.div>

        {/* Active Staff Card */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <UserCheck size={24} />
            </div>
            <span className="text-[11px] font-extrabold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              Stable
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">ACTIVE STAFF</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight pt-1">48</h3>
          </div>
        </motion.div>

        {/* Portal Uptime Card */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-4 sm:col-span-2 lg:col-span-1 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
              <Activity size={24} />
            </div>
            <span className="text-[11px] font-extrabold px-3 py-1 bg-rose-50 text-rose-600 rounded-full">
              Optimal
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">PORTAL UPTIME</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight pt-1">99.9%</h3>
          </div>
        </motion.div>

      </div>

      {/* Main Section: Portal Traffic Graph & Staff Activity Feed with Hover Rise */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Portal Traffic Chart Card (8 Cols) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Portal Traffic</h3>
              <p className="text-xs text-slate-400 font-medium pt-0.5">Weekly active user sessions (Staff & Parents)</p>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-inner">
              <TrendingUp size={14} />
              <span>+15.4%</span>
            </div>
          </div>

          {/* Mock Wave Graph Area */}
          <div className="relative h-48 w-full flex items-end pt-6">
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] font-bold text-slate-400 px-2 pb-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <svg className="w-full h-32 overflow-visible" viewBox="0 0 700 120" fill="none">
              <path
                d="M0 90C100 70 150 30 250 45C350 60 450 15 550 100C620 110 650 115 700 118"
                stroke="#0EA5E9"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M0 90C100 70 150 30 250 45C350 60 450 15 550 100C620 110 650 115 700 118V120H0V90Z"
                fill="url(#paint0_linear)"
                fillOpacity="0.15"
              />
              <defs>
                <linearGradient id="paint0_linear" x1="350" y1="15" x2="350" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0EA5E9" />
                  <stop offset="1" stopColor="#0EA5E9" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Staff Activity Audit Logs Card (4 Cols) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Staff Activity</h3>
            <Clock size={16} className="text-slate-400" />
          </div>

          <div className="space-y-4 my-auto">
            {staffActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${activity.avatarBg} text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-md`}>
                  {activity.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 truncate">{activity.name}</h4>
                    <span className="text-[9px] font-extrabold text-slate-400 flex-shrink-0">{activity.time}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 truncate pt-0.5">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/admin/settings')}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-between border border-slate-200/60 shadow-inner"
          >
            <span>View System Logs</span>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </motion.div>

      </div>

      {/* Action Shortcut Banners Grid with Hover Rise Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        
        {/* Onboard Pupil Card */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          className="bg-[#121B2D] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
        >
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black tracking-tight">New Admission?</h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Instantly onboard new students and generate their login credentials.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="relative z-10 w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <UserPlus size={16} />
            <span>Onboard Pupil</span>
          </button>
        </motion.div>

        {/* Send Broadcast Card */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
        >
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black tracking-tight">Need to Broadcast?</h3>
            <p className="text-xs text-rose-100 font-medium leading-relaxed">
              Send urgent school-wide announcements to all staff portals instantly.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/broadcasts')}
            className="relative z-10 w-full bg-white hover:bg-slate-100 text-rose-600 font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Megaphone size={16} />
            <span>Send Broadcast</span>
          </button>
        </motion.div>

        {/* Academic Window Card */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
        >
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black tracking-tight">Academic Window</h3>
            <p className="text-xs text-sky-100 font-medium leading-relaxed">
              Current session: 2023/2024. Term 1 is actively open for score entries.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/settings')}
            className="relative z-10 w-full bg-[#121B2D] hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <CalendarCheck size={16} />
            <span>Manage Session</span>
          </button>
        </motion.div>

      </div>

    </div>
  );
};

export default AdminDashboard;