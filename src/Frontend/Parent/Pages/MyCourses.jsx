import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample Course Data with Modules & Syllabus Details
const initialCourses = [
  {
    id: 'course-1',
    title: 'Junior Mathematics',
    description: 'Mastering numbers, logic, and spatial awareness.',
    iconBg: 'bg-sky-100 text-sky-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    modules: [
      {
        id: 'm1',
        number: 'MODULE 1',
        title: 'Number Sense & Counting',
        description: 'Understanding numbers 1-100, place value, and basic counting patterns.',
        status: 'active',
      },
      {
        id: 'm2',
        number: 'MODULE 2',
        title: 'Addition & Subtraction',
        description: 'Introduction to sums and differences using visual aids and number lines.',
        status: 'active',
      },
      {
        id: 'm3',
        number: 'COMING SOON',
        title: 'Geometry & Shapes',
        description: 'Identifying 2D and 3D shapes in our daily environment.',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Vocational Studies',
    description: 'Discovering practical skills, safety rules, and foundational craftsmanship.',
    iconBg: 'bg-emerald-100 text-emerald-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    modules: [
      {
        id: 'm4',
        number: 'MODULE 1',
        title: 'Home & Workplace Safety',
        description: 'Recognizing safety signs, avoiding home hazards, and simple emergency steps.',
        status: 'active',
      },
      {
        id: 'm5',
        number: 'MODULE 2',
        title: 'Tools & Simple Crafts',
        description: 'Hands-on practice with safe classroom tools and craft projects.',
        status: 'active',
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Verbal Reasoning',
    description: 'Enhancing critical thinking, word relationships, and problem solving.',
    iconBg: 'bg-purple-100 text-purple-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    modules: [
      {
        id: 'm6',
        number: 'MODULE 1',
        title: 'Alphabetical Ordering & Codes',
        description: 'Arranging words efficiently and decoding fun letter patterns.',
        status: 'active',
      },
      {
        id: 'm7',
        number: 'MODULE 2',
        title: 'Synonyms & Word Pairs',
        description: 'Connecting words with similar meanings and completing logical analogies.',
        status: 'active',
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Creative Arts',
    description: 'Expressing imagination through various artistic media and design.',
    iconBg: 'bg-amber-100 text-amber-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    modules: [
      {
        id: 'm8',
        number: 'MODULE 1',
        title: 'Color Theory & Mixing',
        description: 'Understanding primary and secondary colors through painting exercises.',
        status: 'active',
      },
      {
        id: 'm9',
        number: 'MODULE 2',
        title: 'Paper Crafts & Origami',
        description: 'Developing fine motor skills with paper folding and collage creations.',
        status: 'active',
      },
    ],
  },
];

const MyCourses = () => {
  // Expanded Course ID state (defaults to Junior Mathematics)
  const [expandedCourseId, setExpandedCourseId] = useState('course-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle expansion for course card
  const toggleCourse = (id) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  // Filter courses based on search query
  const filteredCourses = initialCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/60 min-h-screen">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-brand-sky/20 text-brand-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Course Outlines
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              Explore what we are learning this term.
            </p>
          </div>
        </div>

        {/* Search Bar & Grade Tag */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Subject Search Input */}
          <div className="relative flex-1 sm:w-64">
            <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-2xl text-xs sm:text-sm font-medium text-brand-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto bg-slate-100/80 px-3.5 py-2.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VIEWING FOR:</span>
            <span className="text-xs font-extrabold text-white bg-brand-navy px-2.5 py-0.5 rounded-lg">
              GRADE 1 GOLD
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Course Cards Accordion List */}
      <div className="space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 hover:border-slate-200"
              >
                {/* Course Header Bar (Clickable to Expand/Collapse) */}
                <button
                  type="button"
                  onClick={() => toggleCourse(course.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3.5 sm:p-4 rounded-2xl ${course.iconBg} shadow-inner flex-shrink-0`}>
                      {course.icon}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">{course.title}</h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">{course.description}</p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 rounded-xl text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Expandable Module Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {course.modules.map((mod) => (
                          <div
                            key={mod.id}
                            className={`p-5 rounded-2xl border transition-all ${
                              mod.status === 'upcoming'
                                ? 'bg-white/60 border-dashed border-slate-200/90'
                                : 'bg-white border-slate-100 shadow-sm'
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${
                                mod.status === 'upcoming' ? 'text-brand-blue' : 'text-slate-400'
                              }`}
                            >
                              {mod.number}
                            </span>
                            <h3 className="font-extrabold text-brand-navy text-sm sm:text-base leading-snug mb-1">
                              {mod.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {mod.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          /* Empty Search Results Fallback */
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-brand-navy">No Subjects Found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              We couldn't find any course outline matching "{searchQuery}". Try searching for another subject.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyCourses;