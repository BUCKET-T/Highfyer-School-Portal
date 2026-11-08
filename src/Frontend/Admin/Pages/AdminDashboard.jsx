import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Bell
} from 'lucide-react';
import { useAdminDashboardLogic } from '../../../Backend/Admin/AdminDashboardLogic';
import SkeletonAdminDashboard from '../../Shared/Admin/SkeletonAdminDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    activeSessionText,
    isLoadingLogs,
    totalPupils,
    activeStaff,
    adminAvatar,
    adminName,
    hasUnreadBroadcasts,
    staffActivities,
    trafficData
  } = useAdminDashboardLogic();

  if (isLoadingLogs) {
    return <SkeletonAdminDashboard />;
  }

  // Construct SVG path dynamically from derived trafficData
  const maxTraffic = Math.max(...trafficData, 100);
  const points = trafficData.map((val, idx) => {
    const x = (idx / (trafficData.length - 1)) * 700;
    const y = 120 - (val / maxTraffic) * 100;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,120 L ${points.join(' L ')} L 700,120 Z`;

  return (
    <div className="p-3 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800 overflow-x-hidden">
      
      {/* Top Greeting & Header Bar */}
      <div className="bg-white p-4 sm:p-7 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative">
        <div className="space-y-1 text-left">
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {adminName}!
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Here's what's happening across <span className="font-extrabold text-sky-500">Highflyer Kiddies Academy</span> today.
          </p>
        </div>

        {/* Action Controls & Active Session Indicator Pill */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 pt-2 lg:pt-0">
          
          {/* Active Session Indicator Pill */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full text-xs font-black text-slate-800 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
            <span className="truncate">{activeSessionText}</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button 
              onClick={() => navigate('/admin/broadcasts')}
              className="relative p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 flex-shrink-0"
              title="Notifications"
            >
              <Bell size={18} />
              {hasUnreadBroadcasts && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Admin Profile Dynamic Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 flex-shrink-0">
              {adminAvatar ? (
                <img
                  src={adminAvatar}
                  alt={adminName}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                  {adminName ? adminName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AD'}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* High-Level Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <motion.div whileHover={{ y: -4 }} className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold"><Users size={24} /></div>
            <span className="text-[11px] font-extrabold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">Live</span>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">TOTAL PUPILS</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight pt-1">{totalPupils}</h3>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold"><UserCheck size={24} /></div>
            <span className="text-[11px] font-extrabold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">Stable</span>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">ACTIVE STAFF</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight pt-1">{activeStaff}</h3>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-4 sm:col-span-2 lg:col-span-1 text-left">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold"><Activity size={24} /></div>
            <span className="text-[11px] font-extrabold px-3 py-1 bg-rose-50 text-rose-600 rounded-full">Optimal</span>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">PORTAL UPTIME</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight pt-1">99.9%</h3>
          </div>
        </motion.div>
      </div>

      {/* Main Section: Portal Traffic Graph & Staff Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div whileHover={{ y: -2 }} className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Portal Traffic</h3>
              <p className="text-xs text-slate-400 font-medium pt-0.5">User sessions weighted dynamically by recent system activity logs</p>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-inner">
              <TrendingUp size={14} />
              <span>Active</span>
            </div>
          </div>

          <div className="relative h-48 w-full flex items-end pt-6">
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] font-bold text-slate-400 px-2 pb-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <svg className="w-full h-32 overflow-visible" viewBox="0 0 700 120" fill="none">
              <path d={pathD} stroke="#0EA5E9" strokeWidth="4" strokeLinecap="round" />
              <path d={areaD} fill="url(#paint0_linear)" fillOpacity="0.15" />
              <defs>
                <linearGradient id="paint0_linear" x1="350" y1="15" x2="350" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0EA5E9" />
                  <stop offset="1" stopColor="#0EA5E9" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-6 text-left">
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

          <button onClick={() => navigate('/admin/settings')} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-between border border-slate-200/60 shadow-inner">
            <span>View System Logs</span>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </motion.div>
      </div>

      {/* Action Shortcut Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <motion.div whileHover={{ y: -4 }} className="bg-[#121B2D] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black tracking-tight">New Admission?</h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">Instantly onboard new students and generate their login credentials.</p>
          </div>
          <button onClick={() => navigate('/admin/users')} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2">
            <UserPlus size={16} />
            <span>Onboard Pupil</span>
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black tracking-tight">Need to Broadcast?</h3>
            <p className="text-xs text-rose-100 font-medium leading-relaxed">Send urgent school-wide announcements to all staff portals instantly.</p>
          </div>
          <button onClick={() => navigate('/admin/broadcasts')} className="w-full bg-white hover:bg-slate-100 text-rose-600 font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2">
            <Megaphone size={16} />
            <span>Send Broadcast</span>
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black tracking-tight">Academic Window</h3>
            <p className="text-xs text-sky-100 font-medium leading-relaxed">Current term active and open for score entries and administrative reviews.</p>
          </div>
          <button onClick={() => navigate('/admin/settings')} className="w-full bg-[#121B2D] hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2">
            <CalendarCheck size={16} />
            <span>Manage Session</span>
          </button>
        </motion.div>
      </div>

    </div>
  );
};

export default AdminDashboard;