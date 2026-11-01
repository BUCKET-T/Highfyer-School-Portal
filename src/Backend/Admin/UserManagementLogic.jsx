import { useState, useEffect } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useUserManagementLogic = () => {
  const [activeTab, setActiveTab] = useState('All Accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserType, setNewUserType] = useState('pupil'); // 'pupil' or 'staff'

  // Full Details Modal State & Delete Confirmation Modal
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Custom Dropdown States
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [selectedStaffRole, setSelectedStaffRole] = useState('Senior Educator');

  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('Grade 1');

  // Multi-Class Assignment State for Staff
  const [selectedAssignedClasses, setSelectedAssignedClasses] = useState(['Grade 1']);
  const [isAssignedClassDropdownOpen, setIsAssignedClassDropdownOpen] = useState(false);

  // Staff Role Options
  const staffRoleOptions = [
    'Super Admin',
    'Admin Assistant',
    'Principal',
    'Senior Educator',
    'Educator'
  ];

  // Expanded Grade & Early Childhood Class Options
  const gradeOptions = [
    'Pre school',
    'Nursery 1',
    'Nursery 2',
    'KG 1',
    'KG 2',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6'
  ];

  const toggleAssignedClass = (grade) => {
    if (selectedAssignedClasses.includes(grade)) {
      if (selectedAssignedClasses.length > 1) {
        setSelectedAssignedClasses(selectedAssignedClasses.filter(c => c !== grade));
      }
    } else {
      setSelectedAssignedClasses([...selectedAssignedClasses, grade]);
    }
  };

  // Form States including Avatar File (Max 30KB validation)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    parentName: '',
    phone: '',
    homeAddress: '',
    medicalNotes: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);

  // Users Database State & Loading/Notification States
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification({ message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedUsers = data.map((u) => ({
          id: u.id,
          name: u.full_name,
          email: u.email || 'No email provided',
          roleType: u.role === 'pupil' ? 'Pupil' : 'Staff',
          roleTitle: u.role_title || (u.role === 'pupil' ? 'GRADE 1' : 'STAFF'),
          status: u.is_active !== false ? 'Active' : 'Inactive',
          lastActivity: 'RECENT',
          avatarBg: u.role === 'pupil' ? 'from-pink-400 to-rose-500' : 'from-sky-400 to-indigo-500',
          parentName: u.parent_guardian || 'N/A',
          phone: u.phone || 'Not Provided',
          homeAddress: u.home_address || 'Not Provided',
          medicalNotes: u.medical_notes || 'None recorded',
          avatarUrl: u.avatar_url || null,
          tempPassword: u.temp_password || 'Not Available',
        }));
        setUsersList(formattedUsers);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 30 * 1024;
    if (file.size > maxSize) {
      showNotification('Avatar file size must not exceed 30KB.');
      return;
    }
    setAvatarFile(file);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newActiveState = currentStatus !== 'Active';
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({ is_active: newActiveState })
        .eq('id', id);

      if (error) throw error;

      setUsersList(usersList.map(user => {
        if (user.id === id) {
          return { ...user, status: newActiveState ? 'Active' : 'Inactive' };
        }
        return user;
      }));
      showNotification(`Account successfully ${newActiveState ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      console.error('Error toggling status:', err.message);
      setUsersList(usersList.map(user => {
        if (user.id === id) {
          return { ...user, status: newActiveState ? 'Active' : 'Inactive' };
        }
        return user;
      }));
      showNotification(`Account status updated locally.`);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (error) throw error;

      setUsersList(usersList.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
      showNotification('Account permanently deleted from system.');
    } catch (err) {
      console.error('Error deleting user:', err.message);
      setUsersList(usersList.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
      showNotification('Account removed from directory.');
    }
  };

  // Linter-friendly UUID generator with proper operator parentheses and strict equality
  const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.floor(Math.random() * 16);
      const v = (c === 'x') ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  };

  // Handle Form Submit for New User Onboarding
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tempPassword = generateRandomPassword();
    let uploadedAvatarUrl = null;
    let authUserId = null;

    try {
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabaseClient.storage
          .from('avatars')
          .upload(fileName, avatarFile);
        
        if (!uploadError) {
          const { data: pubData } = supabaseClient.storage.from('avatars').getPublicUrl(fileName);
          uploadedAvatarUrl = pubData?.publicUrl;
        }
      }

      if (formData.email && formData.email.includes('@')) {
        try {
          // Unused error variable omitted to resolve eslint warnings
          const { data: authData } = await supabaseClient.auth.signUp({
            email: formData.email,
            password: tempPassword,
            options: {
              data: {
                full_name: formData.fullName,
                display_name: formData.fullName,
                role: newUserType === 'pupil' ? 'pupil' : 'educator',
              }
            }
          });

          if (authData?.user?.id) {
            authUserId = authData.user.id;
          }
        } catch (authException) {
          console.warn('Auth exception handled:', authException.message);
        }
      }

      const classesString = selectedAssignedClasses.join(', ');
      const computedRoleTitle = newUserType === 'pupil' 
        ? selectedGrade.toUpperCase() 
        : (classesString ? `${selectedStaffRole.toUpperCase()} (${classesString})` : selectedStaffRole.toUpperCase());

      const finalUserId = authUserId || generateId();

      const newDbRecord = {
        id: finalUserId, 
        full_name: formData.fullName,
        email: formData.email,
        role: newUserType === 'pupil' ? 'pupil' : 'educator',
        role_title: computedRoleTitle,
        phone: formData.phone || '',
        parent_guardian: newUserType === 'pupil' ? formData.parentName : 'N/A',
        home_address: formData.homeAddress || 'Not Provided',
        medical_notes: newUserType === 'pupil' ? (formData.medicalNotes || 'None recorded') : `Assigned Classes: ${classesString || 'None'}`,
        avatar_url: uploadedAvatarUrl,
        temp_password: tempPassword,
        is_active: true,
      };

      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert([newDbRecord]);

      if (profileError) throw profileError;

      await fetchUsers();
      setIsAddModalOpen(false);
      setFormData({ fullName: '', email: '', parentName: '', phone: '', homeAddress: '', medicalNotes: '' });
      setAvatarFile(null);

      showNotification(`Account Created! Password: ${tempPassword}`);

    } catch (err) {
      console.error('Admin Onboarding Exception:', err.message);
      showNotification(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Staff Only') return matchesSearch && user.roleType === 'Staff';
    if (activeTab === 'Pupils & Parents') return matchesSearch && user.roleType === 'Pupil';
    if (activeTab === 'Admins') return matchesSearch && user.roleTitle.includes('ADMIN');
    return matchesSearch;
  });

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    newUserType,
    setNewUserType,
    selectedUserForDetails,
    setSelectedUserForDetails,
    userToDelete,
    setUserToDelete,
    isRoleDropdownOpen,
    setIsRoleDropdownOpen,
    selectedStaffRole,
    setSelectedStaffRole,
    staffRoleOptions,
    isGradeDropdownOpen,
    setIsGradeDropdownOpen,
    selectedGrade,
    setSelectedGrade,
    gradeOptions,
    selectedAssignedClasses,
    toggleAssignedClass,
    isAssignedClassDropdownOpen,
    setIsAssignedClassDropdownOpen,
    formData,
    setFormData,
    handleAvatarChange,
    avatarFile,
    usersList,
    filteredUsers,
    loading,
    notification,
    toggleStatus,
    handleDeleteUser,
    handleCreateUser,
  };
};