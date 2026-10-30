import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Mail, 
  X, 
  FileSpreadsheet,
  ChevronDown,
  CheckCircle2,
  MoreHorizontal,
  Phone,
  Home,
  AlertCircle
} from 'lucide-react';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('All Accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserType, setNewUserType] = useState('pupil'); // 'pupil' or 'staff'

  // Full Details Modal State
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);

  // Custom Dropdown States
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [selectedStaffRole, setSelectedStaffRole] = useState('Senior Educator');

  const staffRoleOptions = [
    'Senior Educator',
    'Admin Assistant',
    'Principal'
  ];

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    parentName: '',
    phone: '',
    homeAddress: '',
    medicalNotes: '',
  });

  // Initial Mock Users Database
  const [usersList, setUsersList] = useState([
    {
      id: 1,
      name: 'James Doe',
      email: 'j.doe@highflyer.edu',
      roleType: 'Staff',
      roleTitle: 'SENIOR EDUCATOR',
      status: 'Active',
      lastActivity: '12 MINS AGO',
      avatarBg: 'from-sky-400 to-indigo-500',
      parentName: 'N/A (Staff Member)',
      phone: '+234 801 John Doe',
      homeAddress: '14 Admiralty Way, Lekki Phase 1, Lagos',
      medicalNotes: 'None recorded (Adult Staff)',
    },
    {
      id: 2,
      name: 'Chidi Okoro',
      email: 'okoro.fam@gmail.com',
      roleType: 'Pupil',
      roleTitle: 'GRADE 1 GOLD',
      status: 'Active',
      lastActivity: '2 HOURS AGO',
      avatarBg: 'from-pink-400 to-rose-500',
      parentName: 'Mr. & Mrs. Okoro',
      phone: '+234 803 987 6543',
      homeAddress: '8 Freedom Way, Lekki Phase 1, Lagos',
      medicalNotes: 'Mild Peanut Allergy / Inhaler required on sports days',
    },
    {
      id: 3,
      name: 'Sarah Smith',
      email: 's.smith@highflyer.edu',
      roleType: 'Staff',
      roleTitle: 'ADMIN ASST.',
      status: 'Inactive',
      lastActivity: '3 DAYS AGO',
      avatarBg: 'from-amber-400 to-orange-500',
      parentName: 'N/A (Staff Member)',
      phone: '+234 802 Jane Doe',
      homeAddress: '22 Campbell Street, Lagos Island',
      medicalNotes: 'None recorded (Adult Staff)',
    },
    {
      id: 4,
      name: 'Zainab Musa',
      email: 'musa.p@outlook.com',
      roleType: 'Pupil',
      roleTitle: 'GRADE 1',
      status: 'Active',
      lastActivity: 'JUST NOW',
      avatarBg: 'from-emerald-400 to-teal-500',
      parentName: 'Alhaji Ibrahim Musa',
      phone: '+234 805 111 2233',
      homeAddress: '12 Ozumba Mbadiwe Ave, Victoria Island',
      medicalNotes: 'Asthmatic - Carry nebulizer in backpack',
    },
  ]);

  // Toggle Account Status
  const toggleStatus = (id) => {
    setUsersList(usersList.map(user => {
      if (user.id === id) {
        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  // Handle Form Submit for New User
  const handleCreateUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: usersList.length + 1,
      name: formData.fullName,
      email: formData.email,
      roleType: newUserType === 'pupil' ? 'Pupil' : 'Staff',
      roleTitle: newUserType === 'pupil' ? 'GRADE 1 GOLD' : selectedStaffRole.toUpperCase(),
      status: 'Active',
      lastActivity: 'JUST NOW',
      avatarBg: 'from-sky-500 to-indigo-600',
      parentName: newUserType === 'pupil' ? (formData.parentName || 'Not Provided') : 'N/A (Staff Member)',
      phone: formData.phone || (newUserType === 'pupil' ? '+234 803 000 0000' : '+234 801 John Doe'),
      homeAddress: newUserType === 'pupil' ? (formData.homeAddress || 'Lagos, Nigeria') : 'HighFlyer Staff Quarters',
      medicalNotes: newUserType === 'pupil' ? (formData.medicalNotes || 'None recorded') : 'None recorded (Adult Staff)',
    };

    setUsersList([newUser, ...usersList]);
    setIsAddModalOpen(false);
    setFormData({
      fullName: '',
      email: '',
      parentName: '',
      phone: '',
      homeAddress: '',
      medicalNotes: '',
    });
  };

  // Filter Logic
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Staff Only') return matchesSearch && user.roleType === 'Staff';
    if (activeTab === 'Pupils & Parents') return matchesSearch && user.roleType === 'Pupil';
    if (activeTab === 'Admins') return matchesSearch && user.roleTitle.includes('ADMIN');
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Top Header Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 pt-1">
            Manage, onboard, and audit all school portal accounts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert('CSV Directory template downloaded successfully.')}
            className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-sm border border-slate-200 transition-all cursor-pointer flex items-center space-x-2"
          >
            <FileSpreadsheet size={16} className="text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-slate-900/20 transition-all cursor-pointer flex items-center space-x-2"
          >
            <UserPlus size={16} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-2 max-w-fit">
        {['All Accounts', 'Staff Only', 'Pupils & Parents', 'Admins'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#121B2D] text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar & User Directory */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {filteredUsers.length} Users Found
            </span>
          </div>
        </div>

        {/* User Database Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-4">User Profile</th>
                <th className="py-4 px-4">System Role</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Activity</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#F8FAFC' }}
                  className="transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${user.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-md flex-shrink-0`}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{user.name}</h4>
                        <p className="text-[11px] font-medium text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        user.roleType === 'Staff' ? 'bg-sky-50 text-sky-600' : 'bg-pink-50 text-pink-600'
                      }`}>
                        {user.roleType}
                      </span>
                      <p className="text-xs font-black text-slate-700 tracking-tight">{user.roleTitle}</p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                      <span className="text-xs font-bold text-slate-500">{user.lastActivity}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => alert(`Opening email composer for ${user.email}`)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </button>

                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          user.status === 'Active' 
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => setSelectedUserForDetails(user)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="View Full Information"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Information Modal */}
      <AnimatePresence>
        {selectedUserForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedUserForDetails.avatarBg} text-white font-extrabold text-sm flex items-center justify-center shadow-md`}>
                    {selectedUserForDetails.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedUserForDetails.name}</h3>
                    <p className="text-xs font-bold text-sky-600">{selectedUserForDetails.roleTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUserForDetails(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Type</p>
                    <p className="text-xs font-bold text-slate-800 pt-0.5">{selectedUserForDetails.roleType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Status</p>
                    <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      selectedUserForDetails.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {selectedUserForDetails.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-xs font-bold text-slate-800">{selectedUserForDetails.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact Phone</p>
                      <p className="text-xs font-bold text-slate-800">{selectedUserForDetails.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Home size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Address / Location</p>
                      <p className="text-xs font-bold text-slate-800">{selectedUserForDetails.homeAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <AlertCircle size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Additional Notes</p>
                      <p className="text-xs font-bold text-slate-700">{selectedUserForDetails.medicalNotes}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                  onClick={() => setSelectedUserForDetails(null)}
                  className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-6 py-2.5 rounded-2xl text-xs shadow-lg transition-all cursor-pointer"
                >
                  Close Details
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 my-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-md flex-shrink-0 z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Onboard New Account</h3>
                  <p className="text-xs font-medium text-slate-500">Create access credentials for pupils or staff members.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setNewUserType('pupil')}
                    className={`py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      newUserType === 'pupil' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Pupil & Parent Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUserType('staff')}
                    className={`py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      newUserType === 'staff' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Staff / Educator Account
                  </button>
                </div>

                <form onSubmit={handleCreateUser} id="onboardUserForm" className="space-y-4">
                  
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {newUserType === 'pupil' ? 'PUPIL FULL NAME' : 'STAFF FULL NAME'}
                    </label>
                    <input
                      type="text"
                      placeholder={newUserType === 'pupil' ? 'e.g. John Doe' : 'e.g. Jane Doe'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {newUserType === 'pupil' ? 'PARENT / CONTACT EMAIL' : 'WORK EMAIL ADDRESS'}
                    </label>
                    <input
                      type="email"
                      placeholder={newUserType === 'pupil' ? 'parent@example.com' : 'janedoe@highflyer.edu'}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none shadow-inner"
                    />
                  </div>

                  {newUserType === 'pupil' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PARENT / GUARDIAN</label>
                          <input
                            type="text"
                            placeholder="e.g. Mr. Doe"
                            value={formData.parentName}
                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CONTACT PHONE</label>
                          <input
                            type="tel"
                            placeholder="e.g. +234 803 000 0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">HOME ADDRESS</label>
                        <input
                          type="text"
                          placeholder="e.g. Arepo, Ogun State"
                          value={formData.homeAddress}
                          onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MEDICAL NOTES CATEGORY</label>
                        <input
                          type="text"
                          placeholder="e.g. Peanut Allergy / Asthmatic / None"
                          value={formData.medicalNotes}
                          onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800"
                        />
                      </div>
                    </>
                  ) : (
                    /* Staff Section with Phone Number & Role Selection */
                    <>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">STAFF PHONE NUMBER</label>
                        <input
                          type="tel"
                          placeholder="e.g. +234 803 000 Doe"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none shadow-inner"
                        />
                      </div>

                      <div className="space-y-1.5 text-left relative">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">STAFF POSITION / ROLE</label>
                        
                        <button
                          type="button"
                          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                          className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>{selectedStaffRole}</span>
                          <motion.div animate={{ rotate: isRoleDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={16} className="text-slate-400" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isRoleDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 6, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                            >
                              {staffRoleOptions.map((role, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedStaffRole(role);
                                    setIsRoleDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                                    selectedStaffRole === role ? 'bg-sky-50 text-sky-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{role}</span>
                                  {selectedStaffRole === role && <CheckCircle2 size={14} className="text-sky-500" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  )}

                </form>
              </div>

              <div className="p-6 border-t border-slate-100 flex items-center justify-end space-x-3 bg-slate-50/80 backdrop-blur-md flex-shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="onboardUserForm"
                  className="bg-[#121B2D] hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-lg transition-all cursor-pointer"
                >
                  {newUserType === 'pupil' ? 'Save Pupil Record' : 'Save Staff Account'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserManagement;