import React from 'react';
import { motion } from 'framer-motion';

// Replace these paths with your local uniform showcase images or assets
import boyUniformImg from '../../../assets/backiee-219805-landscape.jpg';
import girlUniformImg from '../../../assets/audi-r26-concept-7680x4320-24663.jpg'; 

// Variants for Header (Flowing in from the right)
const headerVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

// Container for Cards Grid (Staggering left-to-right entries)
const cardsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Variants for Individual Uniform Cards (Flowing in from the left)
const cardLeftVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const IdentitySection = () => {
  return (
    <section id="identity" className="py-20 md:py-28 bg-brand-navy text-white relative overflow-hidden">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Flows in from the Right */}
        <motion.div 
          className="text-center max-w-2xl mx-auto space-y-3 mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="text-xs md:text-sm font-bold text-brand-sky uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full inline-block">
            Our Identity
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Proudly Dressed for Learning
          </h2>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed pt-2">
            Our distinctive uniform builds a strong sense of belonging, equality, and pride among all our students.
          </p>
        </motion.div>

        {/* Uniform Images Showcase Grid - Cards Flow in from the Left */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch"
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Boys Uniform Card */}
          <motion.div 
            variants={cardLeftVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative bg-slate-800/60 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-900">
              <img 
                src={boyUniformImg} 
                alt="HighFlyer Boy Uniform - Plaid Shirt and Tie" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 left-4">
                <span className="bg-brand-blue/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow">
                  Boys' Academic Attire
                </span>
              </div>
            </div>
            
            <div className="p-6 bg-slate-900/80 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Smart & Disciplined Look</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Tailored check pattern shirts paired with neat navy neckties and trousers, designed for elegance, structure, and daily comfort.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Girls Uniform Card */}
          <motion.div 
            variants={cardLeftVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative bg-slate-800/60 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-900">
              <img 
                src={girlUniformImg} 
                alt="HighFlyer Girl Uniform - Plaid Pinafore Dress" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 left-4">
                <span className="bg-brand-coral/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow">
                  Girls' Academic Attire
                </span>
              </div>
            </div>

            <div className="p-6 bg-slate-900/80 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Comfortable & Elegant Fit</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Custom pleated pinafore dress crafted with durable, breathable fabrics that encourage full freedom of movement and play.
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default IdentitySection;