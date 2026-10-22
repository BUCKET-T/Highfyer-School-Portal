import React from 'react';
import { motion } from 'framer-motion';

// Import your student hero image
import smilingBoyImage from '../../../assets/backiee-188651-landscape.jpg'; 

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
      ease: [0.215, 0.61, 0.355, 1], // Custom smooth cubic-bezier
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92, x: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.3,
    },
  },
};

const HeroSection = () => {
  return (
    <section className="relative bg-brand-navy pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      {/* Background Decorative Gradient Layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-navy via-[#1b3152] to-brand-navy opacity-90" />

      {/* Decorative Floating Glowing Orbs for Depth */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Text & CTAs */}
          <motion.div 
            className="md:col-span-6 space-y-6 md:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Pink Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <span className="bg-brand-coral text-white text-xs md:text-sm font-bold px-5 md:px-6 py-2 rounded-full uppercase tracking-wider shadow-sm">
                Admissions Open for 2026/2027
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Planting the <br />
              <span className="text-brand-blue">Seed of Greatness</span>
            </motion.h1>

            {/* Descriptive Text */}
            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg text-slate-300 max-w-lg leading-relaxed font-normal"
            >
              Providing exceptional early childhood education in a nurturing environment that fosters curiosity, creativity, and confidence.
            </motion.p>

            {/* Call-to-Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
            >
              {/* Enroll Now -> Redirects to Contact section */}
              <motion.a 
                href="#contact" 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center space-x-2 bg-brand-blue hover:bg-blue-600 text-white font-semibold px-10 py-3 rounded-xl shadow-button hover:shadow-lg transition-colors duration-200"
              >
                Enroll Now
              </motion.a>

              {/* Our Philosophy Button -> Smooth scrolls to #philosophy */}
              <motion.a 
                href="#philosophy"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center space-x-2 border-2 border-white/80 hover:bg-white/10 text-white font-medium px-10 py-3 rounded-xl transition-colors duration-200"
              >
                Our Philosophy
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column: Animated Student Image */}
          <motion.div 
            className="md:col-span-6 relative flex justify-end"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-lg">
              <img 
                src={smilingBoyImage} 
                alt="Smiling student in uniform with tie" 
                className="w-full h-auto rounded-3xl shadow-dropdown border border-slate-700/50 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;