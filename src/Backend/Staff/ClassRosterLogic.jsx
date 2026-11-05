import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useClassRosterLogic = () => {
  const [pupils, setPupils] = useState([]);
  const [educatorClass, setEducatorClass] = useState('Grade 6');
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
  const [newGrade, setNewGrade] = useState('GRADE 6');

  // Helper for generating initials avatar text
  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Fetch educator profile and filter pupils strictly matching the educator's assigned grade
  const fetchClassData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Get currently authenticated educator
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      let targetGradeKey = 'GRADE 6';
      let assignedClassName = 'Grade 6';

      if (user) {
        const { data: educatorProfile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (educatorProfile) {
          // Check educator's grade or notes for target grade
          const searchSource = `${educatorProfile.grade || ''} ${educatorProfile.medical_notes || ''} ${educatorProfile.role_title || ''}`;
          const match = searchSource.match(/Grade\s*(\d+)/i);
          if (match) {
            targetGradeKey = `GRADE ${match[1]}`.toUpperCase();
            assignedClassName = `Grade ${match[1]}`;
          }
        }
      }

      setEducatorClass(assignedClassName);

      // 2. Fetch all profiles from Supabase
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;

      if (data) {
        // 3. Strict filtering: Must be role 'pupil' or 'student' AND match the target grade column
        const filteredStudents = data.filter(item => {
          const isPupilRole = item.role === 'pupil' || item.role === 'student' || (!item.role && item.parent_guardian);
          if (!isPupilRole) return false;

          const studentGrade = (item.grade || item.role_title || '').toUpperCase();
          return studentGrade.includes(targetGradeKey);
        });

        const formattedPupils = filteredStudents.map((item, index) => {
          const rawGrade = item.grade || item.role_title || targetGradeKey;
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
  }, [fetchClassData]);

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
      const newPupilData = {
        full_name: newName,
        role: 'pupil',
        grade: newGrade.toUpperCase(),
        role_title: newGrade.toUpperCase(),
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
        const rawGrade = added.grade || added.role_title || newGrade;
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