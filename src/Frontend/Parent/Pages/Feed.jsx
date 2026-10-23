import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Announcements & School Updates Feed Data
const feedPosts = [
  {
    id: 'post-1',
    title: 'Upcoming Inter-House Sports Competition 2026',
    category: 'Sports & Wellness',
    categoryStyle: 'bg-sky-100 text-sky-700 border-sky-200',
    date: 'OCTOBER 24, 2026',
    author: 'Sports Committee & Admin',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    summary: 'Our annual Inter-House Sports competition is set for Friday. All pupils are required to attend in their house jerseys!',
    content: 'We are thrilled to invite all parents and guardians to our annual Inter-House Sports Competition. Pupils should arrive in their house jerseys by 8:00 AM. Refreshments will be available, and special parent races have been scheduled! Let us come together to support our young athletes.',
    isImportant: true,
  },
  {
    id: 'post-2',
    title: 'Mid-Term Break Holiday & Resumption Notice',
    category: 'Academic Calendar',
    categoryStyle: 'bg-amber-100 text-amber-700 border-amber-200',
    date: 'OCTOBER 18, 2026',
    author: 'School Administration',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    summary: 'School will be closed for the mid-term holiday from October 29th to November 2nd. Classes resume promptly on Monday.',
    content: 'Please be informed that Highflyer Kiddies Academy will observe its First Term Mid-Term Break starting Thursday, October 29th. Boarding pupils and day students will resume full academic activities on Monday, November 3rd. Parents are advised to review mid-term homework assignments via the portal.',
    isImportant: false,
  },
  {
    id: 'post-3',
    title: 'STEM & Vocational Crafts Exhibition Highlights',
    category: 'School Events',
    categoryStyle: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    date: 'OCTOBER 12, 2026',
    author: 'Ms. Beatrice Adewale',
    authorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    summary: 'Our Grade 1 pupils put together incredible vocational safety models and art displays this week.',
    content: 'Our pupils showcased remarkable creativity during the STEM & Crafts exhibition. From safety warning badge displays in Vocational Studies to color-mixing paintings in Creative Arts, we are extremely proud of their active participation and teamwork!',
    isImportant: false,
  },
  {
    id: 'post-4',
    title: 'Parent-Teacher Consultations & Health Safety Guidelines',
    category: 'Health & Safety',
    categoryStyle: 'bg-purple-100 text-purple-700 border-purple-200',
    date: 'OCTOBER 05, 2026',
    author: 'School Nurse & Admin',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    summary: 'Important guidelines for upcoming parent consultations and seasonal flu preventative measures.',
    content: 'As we approach the mid-term evaluations, individual time slots for parent-teacher consultations have been dispatched. Additionally, please ensure your wards bring clean water bottles daily as part of our health precautions.',
    isImportant: false,
  },
];

const categories = ['ALL', 'Sports & Wellness', 'Academic Calendar', 'School Events', 'Health & Safety'];

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostModal, setSelectedPostModal] = useState(null);

  // Filter posts by category and search term
  const filteredPosts = feedPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'ALL' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/60 min-h-screen">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              School Feed & Announcements
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              Stay up to date with official circulars, event updates, and academy notices.
            </p>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-64">
          <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search feed updates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-2xl text-xs sm:text-sm font-medium text-brand-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all"
          />
        </div>
      </div>

      {/* Category Pill Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-brand-navy text-white shadow-md'
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed List Section */}
      <div className="space-y-5">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-white p-6 sm:p-8 rounded-3xl shadow-sm border transition-all hover:shadow-md ${
                post.isImportant ? 'border-brand-blue ring-1 ring-brand-blue/30' : 'border-slate-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${post.categoryStyle}`}>
                    {post.category}
                  </span>
                  {post.isImportant && (
                    <span className="bg-brand-coral/10 text-brand-coral border border-brand-coral/30 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold">
                      URGENT NOTICE
                    </span>
                  )}
                </div>
                <span className="text-xs font-extrabold text-slate-400">{post.date}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy leading-snug mb-2">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                {post.summary}
              </p>

              {/* Author & Read More Bar */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{post.author}</p>
                    <p className="text-[10px] font-semibold text-slate-400">Highflyer Official Bulletin</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPostModal(post)}
                  className="text-xs font-extrabold text-brand-blue hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Read Full Notice</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          /* Empty Feed Fallback */
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center space-y-3 py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-brand-navy">No Announcements Found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              We couldn't find any feed notices matching your search or selected category.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Full Announcement Modal */}
      <AnimatePresence>
        {selectedPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPostModal(null)}
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 z-10 space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider border ${selectedPostModal.categoryStyle}`}>
                  {selectedPostModal.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPostModal(null)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedPostModal.date}</p>
                <h3 className="text-xl font-extrabold text-brand-navy leading-snug">
                  {selectedPostModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-2">
                  {selectedPostModal.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={selectedPostModal.authorAvatar} alt="Author" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{selectedPostModal.author}</p>
                    <p className="text-[10px] font-semibold text-slate-400">Issued by Highflyer Admin</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPostModal(null)}
                  className="bg-brand-navy hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Close Notice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Feed;