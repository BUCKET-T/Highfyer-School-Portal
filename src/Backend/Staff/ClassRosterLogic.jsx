import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useClassRosterLogic = () => {
  const [pupils, setPupils] = useState([]);
  const [educatorClass, setEducatorClass] = useState(() => {
    return localStorage.getItem('selected_staff_class') || 'Grade 3';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAlphabetical, setIsAlphabetical] = useState(false);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activePupil, setActivePupil] = useState(null);

  // New Pupil Form State
  const [newName, setNewName] = useState('');
  const [newParent, setNewParent] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newMedical, setNewMedical] = useState('');
  const [newGrade, setNewGrade] = useState(() => {
    return localStorage.getItem('selected_staff_class') || 'GRADE 3';
  });

  // Helper for generating initials avatar text
  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Sync class dynamically if switched elsewhere in the session
  useEffect(() => {
    const handleStorageChange = () => {
      const storedClass = localStorage.getItem('selected_staff_class');
      if (storedClass && storedClass !== educatorClass) {
        setEducatorClass(storedClass);
        setNewGrade(storedClass.toUpperCase());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [educatorClass]);

  // Fetch pupils strictly matching the global active class
  const fetchClassData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Authentication required.');

      const activeClass = localStorage.getItem('selected_staff_class') || 'Grade 3';
      setEducatorClass(activeClass);
      setNewGrade(activeClass.toUpperCase());

      // Fetch all profiles from Supabase
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;

      if (data) {
        // Strict filtering: Must be role 'pupil' or 'student' AND match active class
        const filteredStudents = data.filter(item => {
          const isPupilRole = item.role === 'pupil' || item.role === 'student' || (!item.role && item.parent_guardian);
          if (!isPupilRole) return false;

          const studentGrade = (item.grade || item.role_title || '').toUpperCase();
          return studentGrade.includes(activeClass.toUpperCase());
        });

        const formattedPupils = filteredStudents.map((item, index) => {
          const rawGrade = item.grade || item.role_title || activeClass;
          const gradeClean = rawGrade.replace(/\s*\(.*\)/, '').trim().toUpperCase();

          return {
            id: item.id,
            name: item.full_name || 'Unnamed Pupil',
            gradeDisplay: `${gradeClean.includes('GRADE') ? gradeClean : 'GRADE ' + gradeClean} / ${index + 1}`,
            initials: getInitials(item.full_name),
            avatar: item.avatar_url || null,
            parentGuardian: item.parent_guardian || 'Parent / Guardian',
            contactPhone: item.phone || '+234 803 000 0000',
            contactEmail: item.email || 'guardian@example.com',
            homeAddress: item.home_address || 'Lagos, Nigeria',
            emergencyContact: item.emergency_contact || 'Emergency Contact on file',
            medicalNotes: item.medical_notes || 'None',
          };
        });

        setPupils(formattedPupils);
      }
    } catch (err) {
      console.error('Error fetching filtered class roster:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData, educatorClass]);

  // Filter and sort pupils based on search & alphabetical options
  const filteredPupils = pupils.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.gradeDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.parentGuardian.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactPhone.includes(searchQuery)
  );

  const sortedPupils = isAlphabetical
    ? [...filteredPupils].sort((a, b) => a.name.localeCompare(b.name))
    : filteredPupils;

  // Handle Add Pupil Form Submission
  const handleAddPupil = async (e) => {
    e.preventDefault();
    if (!newName || !newParent) return;

    setIsSubmitting(true);
    try {
      const activeClass = localStorage.getItem('selected_staff_class') || educatorClass;

      const newPupilData = {
        full_name: newName,
        role: 'pupil',
        grade: activeClass.toUpperCase(),
        role_title: activeClass.toUpperCase(),
        parent_guardian: newParent,
        phone: newPhone || '+234 800 000 0000',
        email: newEmail || 'guardian@example.com',
        home_address: newAddress || 'Lagos, Nigeria',
        medical_notes: newMedical || 'None',
        is_active: true
      };

      const { data, error } = await supabaseClient
        .from('profiles')
        .insert([newPupilData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const added = data[0];
        const rawGrade = added.grade || added.role_title || activeClass;
        const gradeClean = rawGrade.replace(/\s*\(.*\)/, '').trim().toUpperCase();

        const formattedNew = {
          id: added.id,
          name: added.full_name,
          gradeDisplay: `${gradeClean} / ${pupils.length + 1}`,
          initials: getInitials(added.full_name),
          avatar: added.avatar_url || null,
          parentGuardian: added.parent_guardian,
          contactPhone: added.phone,
          contactEmail: added.email,
          homeAddress: added.home_address,
          emergencyContact: 'Emergency Contact on file',
          medicalNotes: added.medical_notes,
        };
        setPupils([formattedNew, ...pupils]);
      }

      setShowAddModal(false);
      setNewName('');
      setNewParent('');
      setNewPhone('');
      setNewEmail('');
      setNewAddress('');
      setNewMedical('');
    } catch (err) {
      console.error('Error inserting pupil:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    pupils,
    educatorClass,
    isLoading,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    isAlphabetical,
    setIsAlphabetical,
    showAddModal,
    setShowAddModal,
    showExportModal,
    setShowExportModal,
    showProfileModal,
    setShowProfileModal,
    activePupil,
    setActivePupil,
    newName,
    setNewName,
    newParent,
    setNewParent,
    newPhone,
    setNewPhone,
    newEmail,
    setNewEmail,
    newAddress,
    setNewAddress,
    newMedical,
    setNewMedical,
    newGrade,
    setNewGrade,
    sortedPupils,
    filteredPupils,
    handleAddPupil
  };
};