import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStaffSidebarLogic } from '../../../Backend/Staff/StaffSidebarLogic';
import SkeletonStaffSidebar from '../../Shared/Staff/SkeletonStaffSidebar';

// Import school logo asset relative to component depth
import schoolLogo from '../../../assets/logo.png';

const StaffSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const {
    userProfile,
    hasNewFeed,
    hasApprovedGrades,
    isLoading,
    isMobileOpen,
    setIsMobileOpen,
    showLogoutModal,
    setShowLogoutModal,
    handleFeedClick,
    handleGradebookClick,
    handleConfirmLogout,
  } = useStaffSidebarLogic();

  if (isLoading) {
    return <SkeletonStaffSidebar />;
  }

  const rawFullName = userProfile?.full_name || 'Staff Member';
  
  // Robust fallback: uses role_title if available; otherwise formats role and grade nicely
  const roleTitle = userProfile?.role_title || 
    (userProfile?.grade ? `EDUCATOR (${userProfile.grade})` : userProfile?.role?.toUpperCase() || 'Educator');

  const avatarUrl = userProfile?.avatar_url || '';

  const educatorInitials = rawFullName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/staff/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Attendance',
      path: '/staff/attendance',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      name: 'Gradebook',
      path: '/staff/gradebook',
      hasBadge: hasApprovedGrades,
      onClick: handleGradebookClick,
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      name: 'Assignments',
      path: '/staff/assignments',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: 'Class Roster',
      path: '/staff/roster',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Staff Feed',
      path: '/staff/feed',
      hasBadge: hasNewFeed,
      onClick: handleFeedClick,
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 5c1.657 0 3 1.343 3 3v1c0 1.657-1.343 3-3 3S3 10.657 3 9V8c0-1.657 1.343-3 3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 14c-3.314 0-6 2.686-6 6h12c0-3.314-2.686-6-6-6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 8h8M15 12h6M17 16h4" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      path: '/staff/settings',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const SidebarContent = ({ forceExpanded = false }) => {
    const collapsed = isCollapsed && !forceExpanded;

    return (
      <div className={`flex flex-col h-full justify-between ${collapsed ? 'p-3 items-center' : 'p-5'} text-slate-300 overflow-x-hidden`}>
        <div className="space-y-6 w-full">
          <div className={`flex items-center ${collapsed ? 'justify-center flex-col space-y-3' : 'space-x-3 justify-between'} px-1 pt-2`}>
            <div className="flex items-center space-x-3 overflow-hidden">
              <img src={schoolLogo} alt="Highflyer Academy Logo" className="w-10 h-10 object-contain flex-shrink-0" />
              {!collapsed && (
                <div className="whitespace-nowrap overflow-hidden">
                  <h2 className="text-base font-extrabold text-white tracking-tight leading-none">Highflyer</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">STAFF PORTAL</p>
                </div>
              )}
            </div>

            {!forceExpanded && (
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none flex-shrink-0"
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>

          <nav className="space-y-2 w-full">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else setIsMobileOpen(false);
                }}
                title={collapsed ? item.name : ''}
                className={({ isActive }) =>
                  `flex items-center justify-between ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-2xl text-sm font-extrabold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3.5'}`}>
                  {item.icon}
                  {!collapsed && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
                </div>

                {item.hasBadge && (
                  <span
                    className={`w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse flex-shrink-0 ${
                      collapsed ? 'absolute top-2 right-2 ring-2 ring-[#1B253B]' : 'ml-2 ring-2 ring-[#1B253B]'
                    }`}
                    title="New Update"
                  />
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={`space-y-4 pt-6 border-t border-slate-800/80 w-full ${collapsed ? 'flex flex-col items-center' : ''}`}>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            title={collapsed ? 'Logout' : ''}
            className={`w-full flex items-center ${collapsed ? 'justify-center px-0 py-3' : 'space-x-3.5 px-4 py-3'} rounded-2xl text-sm font-extrabold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span className="whitespace-nowrap overflow-hidden">Logout</span>}
          </button>

          {!collapsed && (
            <button
              type="button"
              onClick={() => navigate('/staff/settings')}
              className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 p-3.5 rounded-2xl flex items-center space-x-3.5 shadow-sm w-full overflow-hidden text-left transition-all cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-sky-400 bg-sky-500 shadow-sm flex-shrink-0 flex items-center justify-center font-black text-white text-xs">
                {avatarUrl && avatarUrl.trim() !== '' ? (
                  <img src={avatarUrl} alt={rawFullName} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  educatorInitials
                )}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-white truncate">{rawFullName}</h4>
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider truncate">{roleTitle}</p>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '256px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-[#1B253B] h-screen fixed left-0 top-0 z-30 border-r border-slate-800 shadow-xl flex-shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      <div className="lg:hidden bg-white text-brand-navy p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <img src={schoolLogo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-sm tracking-tight text-brand-navy">Highflyer Staff Portal</span>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-600 hover:text-brand-navy focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="relative w-64 bg-[#1B253B] h-full z-10 shadow-2xl"
            >
              <SidebarContent forceExpanded={true} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogoutModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-800">End Staff Session?</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Are you sure you want to log out of your Staff portal session? You will need to sign in again to access ward details.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => setShowLogoutModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl text-xs transition-all cursor-pointer">Cancel</button>
                <button type="button" onClick={handleConfirmLogout} className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer">Log Out</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StaffSidebar;