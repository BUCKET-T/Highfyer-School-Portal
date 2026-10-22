import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import schoolLogo from '../../../assets/logo.png';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 w-full h-full min-h-[580px] bg-white">
      
      {/* Left Column: Staff Form */}
      <div className="md:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-between order-2 md:order-1">
        <div>
          <div className="space-y-1 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Staff / Educator Login
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Enter your educator credentials to manage classes
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); navigate('/staff/dashboard'); }} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Staff ID / Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter Staff ID or Email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-coral focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot-password" className="text-xs font-semibold text-brand-coral hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-coral focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="rememberMeStaff"
                className="w-4 h-4 rounded border-slate-300 text-brand-coral focus:ring-brand-coral"
              />
              <label htmlFor="rememberMeStaff" className="text-xs font-semibold text-slate-600 select-none cursor-pointer">
                Remember me on this workstation
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-coral hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-button hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 mt-4 cursor-pointer"
            >
              <span>Login to Staff Portal</span>
            </motion.button>
          </form>
        </div>

        <div className="pt-8 text-center border-t border-slate-100 mt-6">
          <p className="text-xs font-medium text-slate-600">
            Parent or guardian?{' '}
            <Link to="/parent/login" className="font-bold text-brand-blue hover:underline cursor-pointer">
              Login Here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Dark Navy Staff Branding Panel */}
      <div className="md:col-span-5 bg-brand-navy p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden order-1 md:order-2">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-coral/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-md">
              <img src={schoolLogo} alt="HighFlyer Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white leading-none">HighFlyer</span>
              <span className="text-[10px] font-semibold text-brand-coral uppercase tracking-wider pt-1">Staff Portal</span>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              Educator & Staff Workspace
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Manage student rosters, submit academic assessments, and coordinate school announcements securely.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-6 space-y-3.5 border-t border-slate-700/60 my-6 md:my-0">
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium text-slate-200">
            <div className="w-6 h-6 rounded-full bg-brand-coral/30 text-brand-coral flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Gradebook & Assessment Entry</span>
          </div>
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium text-slate-200">
            <div className="w-6 h-6 rounded-full bg-brand-coral/30 text-brand-coral flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Daily Class Attendance Tracking</span>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-400">
          © {new Date().getFullYear()} HighFlyer Kiddies Academy
        </div>
      </div>

    </div>
  );
};

export default StaffLogin;