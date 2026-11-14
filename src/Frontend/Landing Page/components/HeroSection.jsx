import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabaseClient from '../../../config/supabaseClient';

// Import your student hero image
import smilingBoyImage from '../../../assets/Hero section shot.jfif'; 

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const HeroSection = () => {
  const [activeSession, setActiveSession] = useState('2026/2027');

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('academic_sessions')
          .select('session_name')
          .eq('is_active', true)
          .maybeSingle();

        if (!error && data && data.session_name) {
          setActiveSession(data.session_name);
        }
      } catch (err) {
        console.error('Failed to fetch active academic session:', err);
      }
    };

    fetchActiveSession();
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-navy">
      {/* Background Image with Object Cover */}
      <div className="absolute inset-0 z-0">
        <img 
          src={smilingBoyImage} 
          alt="HighFlyer Kiddies Academy background" 
          className="w-full h-full object-cover object-center"
        />
        {/* Multi-layered Gradient Overlay for High Contrast and Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/85 to-brand-navy/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-brand-navy/40" />
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none z-10" />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-20 md:py-28">
        <div className="max-w-3xl space-y-6 md:space-y-8">
          
          <motion.div 
            className="space-y-6 md:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Dynamic Pink Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <span className="bg-brand-coral text-white text-xs md:text-sm font-bold px-5 md:px-6 py-2 rounded-full uppercase tracking-wider shadow-md">
                Admissions Open for {activeSession}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              Planting the <br />
              <span className="text-brand-blue drop-shadow-sm">Seed of Greatness</span>
            </motion.h1>

            {/* Descriptive Text */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed font-normal"
            >
              Providing exceptional early childhood education in a nurturing environment that fosters curiosity, creativity, and confidence.
            </motion.p>

            {/* Call-to-Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
            >
              <motion.a 
                href="#contact" 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center space-x-2 bg-brand-blue hover:bg-blue-600 text-white font-semibold px-10 py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-center"
              >
                Enroll Now
              </motion.a>

              <motion.a 
                href="#philosophy"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center space-x-2 border-2 border-white/80 hover:bg-white/10 text-white font-medium px-10 py-3.5 rounded-xl transition-all duration-200 text-center backdrop-blur-sm"
              >
                Our Philosophy
              </motion.a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;