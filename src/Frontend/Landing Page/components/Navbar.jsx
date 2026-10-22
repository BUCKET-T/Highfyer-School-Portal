import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ logoSrc }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About Us', to: '/about', isPageRoute: true },
    { name: 'Curriculum', href: '/#curriculum', isPageRoute: false },
    { name: 'Identity', href: '/#identity', isPageRoute: false },
    { name: 'Contact', href: '/#contact', isPageRoute: false },
  ];

  // Drawer Animation Variants
  const drawerVariants = {
    closed: {
      opacity: 0,
      y: -20,
      scaleY: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
        when: 'afterChildren',
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -15 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Name */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden bg-transparent">
              {logoSrc ? (
                <img 
                  src={logoSrc} 
                  alt="Highflyer Kiddies Academy Logo" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <svg className="w-8 h-8 text-brand-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0C9.5 13 4 11 4 6c5 0 7 3.5 8 7zm0 0c2.5 0 8-2 8-7-5 0-7 3.5-8 7z" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-brand-navy leading-tight">
                Highflyer Kiddies Academy
              </span>
              <span className="text-xs font-medium text-brand-blue tracking-wide">
                Planting the Seed of Greatness
              </span>
            </div>
          </Link>

          {/* Right-Aligned Navigation & Button */}
          <div className="hidden md:flex items-center space-x-10 bg-transparent">
            <nav className="flex items-center space-x-8 bg-transparent border-none outline-none shadow-none">
              {navLinks.map((link) => 
                link.isPageRoute ? (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="relative text-base font-semibold text-slate-700 hover:text-brand-navy transition-colors group py-1 bg-transparent"
                  >
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 ease-out group-hover:w-full"></span>
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="relative text-base font-semibold text-slate-700 hover:text-brand-navy transition-colors group py-1 bg-transparent"
                  >
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 ease-out group-hover:w-full"></span>
                  </a>
                )
              )}
            </nav>

            {/* Portal Login Action Button -> Routes to Parent Login */}
            <Link
              to="/parent/login"
              className="inline-flex items-center justify-center space-x-2 bg-brand-blue hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-button hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Portal Login</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle Navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer & Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 top-[80px] bg-brand-navy/20 backdrop-blur-sm z-40"
            />

            {/* Animated Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl px-6 pt-4 pb-6 space-y-3 z-50 origin-top overflow-hidden"
            >
              {navLinks.map((link) =>
                link.isPageRoute ? (
                  <motion.div key={link.name} variants={itemVariants}>
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-brand-blue hover:bg-brand-sky/40 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key={link.name} variants={itemVariants}>
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-brand-blue hover:bg-brand-sky/40 transition-colors"
                    >
                      {link.name}
                    </a>
                  </motion.div>
                )
              )}

              {/* Action Button inside Drawer -> Routes to Parent Login */}
              <motion.div variants={itemVariants} className="pt-2">
                <Link
                  to="/parent/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-brand-blue hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Portal Login</span>
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;