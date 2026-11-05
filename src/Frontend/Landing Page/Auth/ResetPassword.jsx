import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import Shared Spinner Loader
import Spinner from '../../Shared/loaders/Spinner';

// Import Logo asset
import schoolLogo from '../../../assets/logo.png';
import supabaseClient from '../../../config/supabaseClient';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Verify if email exists in your database profiles table first
      const { data: profileCheck, error: profileError } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileCheck) {
        setErrorMsg('No account associated with this email address.');
        setIsLoading(false);
        return;
      }

      // 2. Trigger Supabase Auth password reset email
      const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (resetError) throw resetError;

      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err.message);
      setErrorMsg(err.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Column: Dark Navy Branding Panel */}
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
                Secure Account Recovery
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Don't worry! Resetting your password is quick and secure. Enter your registered email address and we'll send you instructions to regain access.
              </p>
            </div>
          </div>

          <div className="relative z-10 py-6 space-y-3 border-t border-slate-700/60 my-6 text-left">
            <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium text-slate-200">
              <div className="w-6 h-6 rounded-full bg-brand-blue/30 text-brand-sky flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Fast Database Verification</span>
            </div>
            <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium text-slate-200">
              <div className="w-6 h-6 rounded-full bg-brand-blue/30 text-brand-sky flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Encrypted Credential Protection</span>
            </div>
            <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium text-slate-200">
              <div className="w-6 h-6 rounded-full bg-brand-blue/30 text-brand-sky flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>24/7 Portal Support Team</span>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 text-left">
            © {new Date().getFullYear()} HighFlyer Kiddies Academy
          </div>
        </div>

        {/* Right Column: Reset Password Form / Success Screen */}
        <div className="md:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-between text-left">
          <div>
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Enter your email address to verify against database records
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleResetSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. parent@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all"
                    />
                  </div>
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
                    <span>Send Reset Instructions</span>
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
                <h3 className="text-base font-black text-slate-800">Check Your Email</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  We have verified <strong className="text-slate-800">{email}</strong> in our database and sent password recovery instructions. Please check your inbox or spam folder.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-brand-blue hover:underline pt-2 inline-block cursor-pointer"
                >
                  Try another email address
                </button>
              </motion.div>
            )}
          </div>

          <div className="pt-6 text-center border-t border-slate-100 mt-6">
            <p className="text-xs font-medium text-slate-600">
              Remembered your password?{' '}
              <Link to="/parent/login" className="font-bold text-brand-blue hover:underline cursor-pointer">
                Back to Login
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;