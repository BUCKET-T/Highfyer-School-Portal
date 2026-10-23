import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import Logo Asset
import schoolLogo from '../../../assets/logo.png';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Desktop collapse state
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Logout confirmation modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Navigation Items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/parent/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'My Courses',
      path: '/parent/courses',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: 'Assignments',
      path: '/parent/assignments',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: 'Results',
      path: '/parent/results',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Feed',
      path: '/parent/feed',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
  ];

  const sidebarContent = (isCollapsedView) => (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Top Header: Hamburger Toggle & Logo */}
      <div className="space-y-6">
        <div className={`flex items-center ${isCollapsedView ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl p-1.5 flex items-center justify-center flex-shrink-0">
              <img src={schoolLogo} alt="Highflyer Logo" className="w-full h-full object-contain" />
            </div>

            {!isCollapsedView && (
              <div className="flex flex-col overflow-hidden transition-all duration-300">
                <span className="text-base font-extrabold tracking-tight text-white leading-none truncate">
                  Highflyer
                </span>
                <span className="text-[10px] font-semibold text-brand-sky uppercase tracking-wider pt-1 truncate">
                  Student Portal
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden md:block p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none"
            title={isCollapsedView ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 pt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center transition-all duration-200 cursor-pointer ${
                    isCollapsedView
                      ? `justify-center w-12 h-12 mx-auto ${
                          isActive
                            ? 'bg-brand-blue text-white rounded-full shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl'
                        }`
                      : `w-full space-x-3 px-4 py-3.5 rounded-2xl font-semibold text-sm ${
                          isActive
                            ? 'bg-brand-blue text-white shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                    {item.icon}
                  </span>

                  {!isCollapsedView && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>

                {/* Floating Label Tooltip */}
                {isCollapsedView && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl border border-slate-700">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <div className="relative group">
          <Link
            to="/parent/settings"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center transition-all duration-200 cursor-pointer ${
              isCollapsedView
                ? `justify-center w-12 h-12 mx-auto ${
                    location.pathname === '/parent/settings'
                      ? 'bg-brand-blue text-white rounded-full shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl'
                  }`
                : `w-full space-x-3 px-4 py-3 rounded-2xl font-semibold text-sm ${
                    location.pathname === '/parent/settings'
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            {!isCollapsedView && <span className="truncate">Settings</span>}
          </Link>

          {isCollapsedView && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl border border-slate-700">
              Settings
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="relative group">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center text-brand-coral hover:bg-brand-coral/10 transition-all duration-200 cursor-pointer ${
              isCollapsedView
                ? 'justify-center w-12 h-12 mx-auto rounded-xl'
                : 'w-full space-x-3 px-4 py-3 rounded-2xl font-semibold text-sm'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0 text-brand-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>

            {!isCollapsedView && <span className="truncate">Logout</span>}
          </button>

          {isCollapsedView && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-brand-coral text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between bg-brand-navy px-4 py-3 text-white shadow-md sticky top-0 z-30 w-full">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-sm tracking-tight">Highflyer Portal</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop Sidebar (Strictly fixed viewport height and non-expanding) */}
      <aside
        className={`hidden md:flex bg-brand-navy h-screen py-6 transition-all duration-300 ease-in-out flex-col justify-between select-none shadow-xl z-30 sticky top-0 flex-shrink-0 ${
          isDesktopCollapsed ? 'w-20 px-3' : 'w-64 px-6'
        }`}
      >
        {sidebarContent(isDesktopCollapsed)}
      </aside>

      {/* Mobile Slide-out Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-40"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 bg-brand-navy py-6 px-6 z-50 shadow-2xl flex flex-col justify-between"
            >
              {sidebarContent(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 z-10 space-y-6 text-left"
            >
              <div className="w-14 h-14 bg-brand-coral/10 text-brand-coral rounded-2xl flex items-center justify-center shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-brand-navy text-left">Confirm Logout</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed text-left">
                  Are you sure you want to log out of your parent portal session? You will need to sign in again to access ward details.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutModal(false);
                    navigate('/parent/login');
                  }}
                  className="w-full bg-brand-coral hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;