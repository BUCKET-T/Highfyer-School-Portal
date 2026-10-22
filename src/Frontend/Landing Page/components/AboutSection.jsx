import React from 'react';
import { motion } from 'framer-motion';

// Replace with the path to your Proprietress image in your assets folder
import proprietressImage from '../../../assets/1773713-3840x2160-desktop-4k-bmw-m4-background-photo.jpg';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const cardRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const valueCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const coreValues = [
  {
    id: 'safe-env',
    title: 'Safe & Secure Environment',
    desc: 'Child-friendly facilities with strict safety protocols and constant supervision.',
    badgeColor: 'bg-blue-50 text-brand-blue',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'caring-staff',
    title: 'Dedicated Educators',
    desc: 'Passionate and qualified teachers focused on individual child attention.',
    badgeColor: 'bg-rose-50 text-brand-coral',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'individual-focus',
    title: 'Tailored Learning',
    desc: 'Small class sizes that allow personalized growth and discovery for every student.',
    badgeColor: 'bg-sky-50 text-brand-navy',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-brand-sky/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-coral/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto space-y-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs md:text-sm font-bold text-brand-blue uppercase tracking-widest bg-brand-sky/40 px-4 py-1.5 rounded-full inline-block">
            About HighFlyer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
            Planting the Seed of Greatness <br className="hidden sm:inline" />
            <span className="text-brand-blue">Since 2021</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed pt-2">
            Founded with a vision for transformative early childhood education, HighFlyer Kiddies Academy has grown into a vibrant community where curiosity meets excellence.
          </p>
        </motion.div>

        {/* Main Grid: School History & Founder Profile */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          
          {/* Left Column: Our Story Card */}
          <motion.div 
            variants={cardLeftVariants}
            className="lg:col-span-7 bg-slate-50 border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-brand-navy text-white px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                <span>Est. 2021</span>
                <span>•</span>
                <span className="text-brand-sky">Emerging with Excellence</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy leading-snug">
                Small Enough to Care, Big Enough to Inspire
              </h3>

              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  HighFlyer Kiddies Academy was established in 2021 with a clear mandate: to create a safe, nurturing, and high-quality learning environment for nursery and elementary pupils.
                </p>
                <p>
                  While we are an emerging institution with an intimate school size, our small class settings allow us to deliver personalized attention to every child. We take pride in building close-knit relationships with parents, ensuring each pupil's unique talents and character are cultivated.
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 mt-8">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand-blue">2021</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Founded</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand-navy">100%</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Child Focus</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand-coral">1:1</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Care Ratio</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Founder / Proprietress Card */}
          <motion.div 
            variants={cardRightVariants}
            className="lg:col-span-5 bg-brand-navy text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Proprietress Image */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-brand-sky/40 shadow-lg mx-auto sm:mx-0 bg-slate-800">
                <img 
                  src={proprietressImage} 
                  alt="Proprietress / Founder of HighFlyer Kiddies Academy" 
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div>
                <span className="text-brand-coral text-xs font-bold uppercase tracking-widest block mb-1">
                  School Proprietress & Founder
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Welcome from the Proprietress
                </h3>
              </div>

              <blockquote className="text-slate-200 text-sm sm:text-base leading-relaxed italic border-l-2 border-brand-blue pl-4">
                "Our commitment is rooted in love, discipline, and discovery. Every child who walks through our doors is given the personal guidance needed to plant their seed of greatness."
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-white">Proprietress</span>
                <span className="text-xs text-brand-sky font-medium">HighFlyer Kiddies Academy</span>
              </div>
              <a 
                href="mailto:omololaojo71@gmail.com"
                className="text-xs font-semibold text-white bg-brand-blue hover:bg-blue-600 px-4 py-2 rounded-xl transition-colors"
              >
                Reach Out
              </a>
            </div>
          </motion.div>

        </motion.div>

        {/* Core Values Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {coreValues.map((value) => (
            <motion.div
              key={value.id}
              variants={valueCardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-start space-x-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${value.badgeColor}`}>
                {value.icon}
              </div>
              <div>
                <h4 className="text-lg font-bold text-brand-navy mb-1">{value.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;