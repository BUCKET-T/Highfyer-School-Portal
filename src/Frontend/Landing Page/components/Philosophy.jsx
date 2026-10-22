import React from 'react';
import { motion } from 'framer-motion';

const corePillars = [
  {
    id: 'nurturing',
    title: 'Nurturing Environment',
    description:
      'We create a safe, warm, and inclusive space where every child feels loved, valued, and empowered to express themselves freely.',
    icon: (
      <svg className="w-6 h-6 text-brand-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    badgeColor: 'bg-rose-50 text-brand-coral'
  },
  {
    id: 'child-centered',
    title: 'Child-Centered Learning',
    description:
      'Recognizing that every child learns differently, our play-based and inquiry-driven curriculum adapts to each student’s unique pace and interests.',
    icon: (
      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    badgeColor: 'bg-blue-50 text-brand-blue'
  },
  {
    id: 'character',
    title: 'Character & Integrity',
    description:
      'Beyond academic excellence, we instil empathy, discipline, respect, and leadership values that build a strong moral foundation for life.',
    icon: (
      <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    badgeColor: 'bg-slate-100 text-brand-navy'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const Philosophy = () => {
  return (
    <section id="philosophy" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Decorative Blur Circle */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-brand-sky/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto space-y-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.56 }}
        >
          <span className="text-sm font-bold text-brand-blue uppercase tracking-widest bg-brand-sky/50 px-4 py-1.5 rounded-full inline-block">
            Our Educational Belief
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight">
            Our Core Educational Philosophy
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed pt-2">
            At HighFlyer Kiddies Academy, we believe early childhood education is about inspiring lifelong curiosity, emotional resilience, and noble character.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {corePillars.map((pillar) => (
            <motion.div
              key={pillar.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.26 } }}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${pillar.badgeColor}`}>
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">
                {pillar.title}
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlight Quote Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-brand-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 text-center md:text-left">
              <span className="text-brand-coral font-semibold text-xs tracking-widest uppercase">
                A Message From Leadership
              </span>
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-slate-100 italic">
                "We don't just teach children how to excel academically; we teach them how to dream boldly, act kindly, and soar as confident global citizens."
              </blockquote>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Philosophy;