import React from 'react';
import { motion } from 'framer-motion';

const curriculumData = [
  {
    id: 'cognitive',
    title: 'Cognitive Growth',
    iconBg: 'bg-blue-50 text-brand-blue',
    topBorder: 'border-t-4 border-brand-blue',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    description:
      'Age-appropriate, inquiry-based learning activities that stimulate critical thinking, problem-solving, language acquisition, and foundational STEM concepts.',
    highlights: [
      'Early Numeracy & Logical Reasoning',
      'Phonics, Literacy & Vocabulary',
      'Guided Science Exploration & Curiosity'
    ]
  },
  {
    id: 'creative',
    title: 'Creative Arts',
    iconBg: 'bg-rose-50 text-brand-coral',
    topBorder: 'border-t-4 border-brand-coral',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    description:
      'Immersive music, dance, painting, and drama programs designed to foster self-expression, confidence, fine motor control, and artistic imagination.',
    highlights: [
      'Hands-on Painting & Crafts',
      'Rhythm, Movement & Music Practice',
      'Storytelling & Expressive Drama'
    ]
  },
  {
    id: 'physical',
    title: 'Physical Play',
    iconBg: 'bg-sky-50 text-brand-navy',
    topBorder: 'border-t-4 border-brand-navy',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description:
      'Daily outdoor play and structured physical movement routines that promote healthy motor skill development, team collaboration, and physical vitality.',
    highlights: [
      'Gross & Fine Motor Skill Training',
      'Guided Team Games & Sportsmanship',
      'Outdoor Adventure & Balance Activities'
    ]
  }
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.21,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.26, 1, 0.39, 1],
    },
  },
};

const CurriculumSection = () => {
  return (
    <section id="curriculum" className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto space-y-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-bold text-brand-blue uppercase tracking-widest bg-brand-sky/40 px-4 py-1.5 rounded-full inline-block">
            Our Curriculum
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight">
            Holistic Development Program
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed pt-2">
            Designed to nurture intellect, creativity, and physical well-being through balanced, child-centered experiential learning.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {curriculumData.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${item.topBorder}`}
            >
              <div>
                {/* Icon Box */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${item.iconBg}`}>
                  {item.icon}
                </div>

                {/* Card Title */}
                <h3 className="text-2xl font-bold text-brand-navy mb-3">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Enriched Feature Bullet Points */}
                <div className="border-t border-slate-100 pt-5 space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Key Highlights
                  </span>
                  {item.highlights.map((bullet, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm font-medium text-slate-700">
                      <svg className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Subtle Badge */}
              <div className="mt-8 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-brand-blue group cursor-pointer">
                <span>Explore Subject Modules</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default CurriculumSection;