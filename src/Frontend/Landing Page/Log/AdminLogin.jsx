import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import Shared Spinner Loader
import Spinner from '../../Shared/loaders/Spinner';

// Import logo asset
import schoolLogo from '../../../assets/logo.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('ojotee346@gmail.com');
  const [password, setPassword] = useState('********');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login verification delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin/dashboard');
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-100"
      >
        {/* Left Form Section (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            {/* Header Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                Management Login
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Enter your administrative credentials to manage portal operations
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5 pt-2">
              
              {/* Admin ID / Work Email */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider">
                  ADMIN ID / WORK EMAIL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    className="w-full bg-sky-50/50 border border-slate-200 focus:border-sky-500 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm font-bold text-brand-navy placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Please contact the IT Super Administrator to reset your admin credentials.')}
                    className="text-[11px] sm:text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-sky-50/50 border border-slate-200 focus:border-sky-500 rounded-2xl pl-11 pr-11 py-3.5 text-xs sm:text-sm font-bold text-brand-navy placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.962 8.962 0 012.122-.382c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-4.276-4.276a3 3 0 10-4.243-4.243" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-400 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                  Remember me on this workstation
                </label>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-extrabold py-4 rounded-2xl text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Spinner size="sm" />
                    
                  </div>
                ) : (
                  <span>Login to Admin Portal</span>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Right Dark Branding Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-[#121B2D] text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 relative overflow-hidden">
          
          {/* Top School Logo Header */}
          <div className="flex items-center space-x-3 z-10">
            <img
              src={schoolLogo}
              alt="HighFlyer Logo"
              className="w-10 h-10 object-contain "
            />
            <div>
              <h3 className="text-sm font-black tracking-tight text-white leading-none">HighFlyer</h3>
              <p className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest pt-1">ADMIN CENTRAL</p>
            </div>
          </div>

          {/* Center Content & Features */}
          <div className="space-y-5 z-10 my-auto py-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              School Management & Executive Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Full administrative authority to manage user accounts, oversee academic result approvals, and broadcast directives.
            </p>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-6 h-6 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-200">User Account Oversight & Roles</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-200">Academic Approvals & Term Controls</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="z-10 pt-4 border-t border-slate-800">
            <p className="text-[11px] font-bold text-slate-400">
             © {new Date().getFullYear()} HighFlyer Kiddies Academy
            </p>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default AdminLogin;