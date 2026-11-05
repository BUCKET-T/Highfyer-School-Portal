import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import Shared Spinner Loader
import Spinner from '../../Shared/loaders/Spinner';

// Import Logo asset
import schoolLogo from '../../../assets/logo.png';
import supabaseClient from '../../../config/supabaseClient';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/parent/login'); // Redirects straight to the parent login screen
      }, 2500);
    } catch (err) {
      console.error('Update password error:', err.message);
      setErrorMsg(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Column: Branding Panel */}
        <div className="md:col-span-5 bg-brand-navy p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-brand-coral/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={schoolLogo} alt="HighFlyer Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-extrabold tracking-tight text-white leading-none">HighFlyer</span>
                <span className="text-[10px] font-semibold text-brand-sky uppercase tracking-wider pt-1">Kiddies Academy</span>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Set New Password
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Your identity has been verified securely. Please enter your new password below to update your account credentials.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 text-left">
            © {new Date().getFullYear()} HighFlyer Kiddies Academy
          </div>
        </div>

        {/* Right Column: Update Password Form */}
        <div className="md:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-between text-left">
          <div>
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                New Credentials
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose a secure password for your portal account
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleUpdateSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-button hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 mt-4 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <span>Update Password</span>
                  )}
                </motion.button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3"
              >
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-base font-black text-slate-800">Password Updated Successfully!</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  Your password has been changed successfully. Redirecting you to parent login...
                </p>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UpdatePassword;