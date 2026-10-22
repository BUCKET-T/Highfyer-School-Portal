import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import modular login components
import ParentLogin from './ParentLogin';
import StaffLogin from './StaffLogin';

const LoginEffect = () => {
  const location = useLocation();
  const isStaffRoute = location.pathname.includes('/staff');
  
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile fallback: standard render without 3D flip effect
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
          {isStaffRoute ? <StaffLogin /> : <ParentLogin />}
        </div>
      </div>
    );
  }

  // PC 3D Card-Flip / Door-Swing Transition (Zero text-mirroring bugs)
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 [perspective:1400px]">
      <div className="w-full max-w-4xl relative min-h-[580px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={isStaffRoute ? 'staff' : 'parent'}
            initial={{ rotateY: isStaffRoute ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isStaffRoute ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 24 }}
            className="w-full bg-white shadow-2xl rounded-3xl overflow-hidden"
          >
            {isStaffRoute ? <StaffLogin /> : <ParentLogin />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginEffect;