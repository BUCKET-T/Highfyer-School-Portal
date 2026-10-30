import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  Send, 
  Paperclip, 
  ChevronDown, 
  CheckCircle2, 
  History, 
  FileText,
  X,
  Plus
} from 'lucide-react';

const SchoolBroadcasts = () => {
  // Form States
  const [targetAudience, setTargetAudience] = useState('All Staff Members');
  const [category, setCategory] = useState('Urgent Directive');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  // Custom Dropdown States
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const audienceOptions = [
    'All Staff Members',
    'Academic Staff Only',
    'Operations & Admin',
    'Parent Feed (Portal)'
  ];

  const categoryOptions = [
    'Urgent Directive',
    'Policy Update',
    'School Event',
    'General News'
  ];

  // Recent Broadcasts History State
  const [broadcastsList, setBroadcastsList] = useState([
    {
      id: 1,
      title: 'Mid-Term Break Update',
      category: 'Urgent Directive',
      audience: 'All Staff Members',
      date: 'May 14, 2024',
      content: 'Please be reminded that the mid-term break commences on Friday. All academic staff are required to submit their finalized gradebooks prior to departure.',
      file: 'MidTerm_Guidelines_2024.pdf'
    },
    {
      id: 2,
      title: 'New Security Protocols at Gate 2',
      category: 'Policy Update',
      audience: 'Operations & Admin',
      date: 'May 10, 2024',
      content: 'Effective next Monday, all visitors must present verified government-issued identification before entering the administrative block.',
      file: null
    }
  ]);

  // Handle Push Broadcast
  const handlePushBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both the broadcast title and message content.');
      return;
    }

    const newBroadcast = {
      id: broadcastsList.length + 1,
      title: title,
      category: category,
      audience: targetAudience,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: content,
      file: attachedFile ? attachedFile.name : null
    };

    setBroadcastsList([newBroadcast, ...broadcastsList]);
    setTitle('');
    setContent('');
    setAttachedFile(null);
    alert('Broadcast published successfully and pushed to the staff feed!');
  };

  // Handle simulated file attachment
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds the 10MB limit.');
        return;
      }
      setAttachedFile(file);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Top Header Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            School Broadcasts
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 pt-1">
            Communicate official directives and school-wide updates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-sky-50 border border-sky-100 text-sky-600 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2">
            <Megaphone size={16} />
            <span>Staff Feed Active</span>
          </div>
        </div>
      </div>

      {/* Compose Announcement Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
        
        {/* Card Title & Description */}
        <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-[#121B2D] text-white flex items-center justify-center font-bold shadow-md">
            <Plus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Compose Announcement</h3>
            <p className="text-xs font-medium text-slate-500">This message will appear in the Staff Feed instantly.</p>
          </div>
        </div>

        <form onSubmit={handlePushBroadcast} className="space-y-6">
          
          {/* Target Audience & Category Dropdowns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Target Audience Custom Dropdown */}
            <div className="space-y-2 relative text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Target Audience
              </label>
              
              <button
                type="button"
                onClick={() => {
                  setIsAudienceDropdownOpen(!isAudienceDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                }}
                className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer shadow-inner"
              >
                <span>{targetAudience}</span>
                <motion.div animate={{ rotate: isAudienceDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} className="text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isAudienceDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                  >
                    {audienceOptions.map((aud, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTargetAudience(aud);
                          setIsAudienceDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                          targetAudience === aud ? 'bg-rose-500 text-white font-black' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{aud}</span>
                        {targetAudience === aud && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Custom Dropdown */}
            <div className="space-y-2 relative text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Category
              </label>
              
              <button
                type="button"
                onClick={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                  setIsAudienceDropdownOpen(false);
                }}
                className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer shadow-inner"
              >
                <span>{category}</span>
                <motion.div animate={{ rotate: isCategoryDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} className="text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                  >
                    {categoryOptions.map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                          category === cat ? 'bg-rose-500 text-white font-black' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat}</span>
                        {category === cat && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Broadcast Title */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Broadcast Title
            </label>
            <input
              type="text"
              placeholder="e.g. End of Term Resumption Notice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Message Content */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Message Content
            </label>
            <textarea
              rows="5"
              placeholder="Type your official announcement here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl p-4 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner resize-none"
            />
          </div>

          {/* Attachment & Push Broadcast Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            
            {/* File Attachment Section */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <label className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold px-5 py-3.5 rounded-2xl text-xs border border-slate-200 transition-all cursor-pointer flex items-center space-x-2 shadow-sm">
                <Paperclip size={16} className="text-slate-500" />
                <span>ATTACH PDF/FILES</span>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.png,.jpg" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>

              {attachedFile ? (
                <div className="flex items-center space-x-2 bg-sky-50 text-sky-700 px-3 py-2 rounded-xl text-xs font-bold border border-sky-100">
                  <span className="truncate max-w-[150px]">{attachedFile.name}</span>
                  <button type="button" onClick={() => setAttachedFile(null)} className="text-sky-500 hover:text-rose-500">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] font-medium text-slate-400 italic">Max file size: 5MB</span>
              )}
            </div>

            {/* Push Broadcast Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-8 py-4 rounded-2xl text-xs sm:text-sm shadow-xl shadow-slate-900/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Send size={16} />
              <span>Push Broadcast</span>
            </button>

          </div>

        </form>
      </div>

      {/* Recent History Section */}
      <div className="space-y-4 pt-4 text-left">
        <div className="flex items-center space-x-2 px-2">
          <History size={18} className="text-slate-500" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent History</h3>
        </div>

        <div className="space-y-4">
          {broadcastsList.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="bg-sky-50 text-sky-600 text-[10px] font-extrabold px-3 py-1 rounded-full">
                    {item.audience.toUpperCase()}
                  </span>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-extrabold px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">{item.date}</span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900">{item.title}</h4>
                <p className="text-xs sm:text-sm font-medium text-slate-600 pt-1 leading-relaxed">{item.content}</p>
              </div>

              {item.file && (
                <div className="flex items-center space-x-2 pt-2">
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex items-center space-x-2 text-xs font-bold text-slate-700">
                    <FileText size={14} className="text-sky-500" />
                    <span>{item.file}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SchoolBroadcasts;