import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Megaphone, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

// School Logo asset
import schoolLogo from '../../../assets/logo.png';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: 'users', icon: Users },
    { name: 'Academic Approvals', path: 'approvals', icon: ClipboardCheck, hasNotification: true },
    { name: 'School Broadcasts', path: 'broadcasts', icon: Megaphone },
  ];

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full p-4 sm:p-5 select-none overflow-x-hidden">
      {/* Top Section: Branding & Toggle */}
      <div className="space-y-6">
        
        {/* Header Branding */}
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'flex-col space-y-4' : 'justify-between'}`}>
          {(!isCollapsed || isMobile) ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src={schoolLogo}
                alt="HighFlyer Logo"
                className="w-10 h-10 object-contain  "
              />
              <div className="whitespace-nowrap">
                <h1 className="text-sm font-black tracking-tight text-white leading-none">
                  Highflyer
                </h1>
                <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest pt-1">
                  ADMIN CENTRAL
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3 w-full">
              <img
                src={schoolLogo}
                alt="Logo"
                className="w-10 h-10 object-contain bg-white/10 p-1 rounded-xl border border-white/15 flex-shrink-0"
              />
            </div>
          )}

          {/* Desktop Collapse / Expand Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Menu size={18} />
            </button>
          )}

          {/* Mobile Close Drawer Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center ${
                    isCollapsed && !isMobile ? 'justify-center px-0 py-3.5' : 'px-3.5 py-3'
                  } rounded-2xl text-xs sm:text-sm font-bold transition-all group ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
                title={isCollapsed && !isMobile ? item.name : undefined}
              >
                <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                  <IconComponent size={20} />
                </div>

                {(!isCollapsed || isMobile) && (
                  <span className="ml-3 truncate tracking-wide">{item.name}</span>
                )}

                {/* Pink Notification Dot */}
                {item.hasNotification && (
                  <span
                    className={`absolute ${
                      isCollapsed && !isMobile ? 'top-2 right-3' : 'right-4'
                    } w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-[#121B2D] animate-pulse`}
                    title="New pending items"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Settings & Profile */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <NavLink
          to="settings"
          onClick={() => isMobile && setIsMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center ${
              isCollapsed && !isMobile ? 'justify-center px-0 py-3.5' : 'px-3.5 py-3'
            } rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              isActive
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`
          }
          title={isCollapsed && !isMobile ? 'System Settings' : undefined}
        >
          <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
            <Settings size={20} />
          </div>
          {(!isCollapsed || isMobile) && <span className="ml-3 truncate">System Settings</span>}
        </NavLink>

        {/* Admin Profile Card */}
        <div className="pt-2">
          {(!isCollapsed || isMobile) ? (
            <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between shadow-inner">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow">
                  AD
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-black text-white truncate">Admin Director</h4>
                  <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider">SUPER ADMIN</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3 pb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow" title="Admin Director">
                AD
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar with Smooth Framer Motion Width Transition */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '88px' : '280px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-[#121B2D] text-slate-300 h-screen sticky top-0 border-r border-slate-800/80 shadow-xl z-20 flex-shrink-0"
      >
        {sidebarContent(false)}
      </motion.aside>

      {/* Mobile Sticky Header Bar */}
      <div className="lg:hidden w-full bg-[#121B2D] text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src={schoolLogo}
            alt="Logo"
            className="w-9 h-9 object-contain "
          />
          <div>
            <h2 className="text-xs font-black tracking-tight leading-none text-white">Highflyer</h2>
            <p className="text-[9px] font-extrabold text-sky-400 uppercase tracking-wider pt-0.5">ADMIN CENTRAL</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Slide-out Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative w-72 max-w-full bg-[#121B2D] text-slate-300 h-full shadow-2xl z-10 flex flex-col"
            >
              {sidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;