import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useAttendanceLogic = () => {
  const [pupils, setPupils] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Read active class directly from localStorage set by the Dashboard
  const [educatorClass, setEducatorClass] = useState(() => {
    return localStorage.getItem('selected_staff_class') || 'Grade 6';
  });

  const [currentTerm, setCurrentTerm] = useState('Term 1');
  const [academicSession, setAcademicSession] = useState('2025/2026');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showStatusFilterDropdown, setShowStatusFilterDropdown] = useState(false);
  const [activePresetDropdownId, setActivePresetDropdownId] = useState(null);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const presetRemarksList = [
    'Bus delayed',
    'Medical checkup',
    'Family event',
    'Traffic delay',
    'Excusable absence',
    'Illness / Fever',
  ];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Sync class dynamically if switched elsewhere in the session
  useEffect(() => {
    const handleStorageChange = () => {
      const storedClass = localStorage.getItem('selected_staff_class');
      if (storedClass && storedClass !== educatorClass) {
        setEducatorClass(storedClass);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [educatorClass]);

  // Fetch Attendance Records for current educatorClass and selectedDate
  const fetchAttendanceData = useCallback(async (isSilent = false) => {
    if (!educatorClass) return;
    if (!isSilent) setIsLoading(true);
    try {
      // Fetch active academic session and term settings
      const { data: activeSessionRecord } = await supabaseClient
        .from('academic_sessions')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      let activeTerm = 'Term 1';
      let activeSessionName = '2025/2026';
      if (activeSessionRecord) {
        if (activeSessionRecord.term_name) activeTerm = activeSessionRecord.term_name;
        if (activeSessionRecord.session_name) activeSessionName = activeSessionRecord.session_name;
      }
      setCurrentTerm(activeTerm);
      setAcademicSession(activeSessionName);

      // Fetch Pupils in selected class
      const { data: pupilProfiles, error: pupilErr } = await supabaseClient
        .from('profiles')
        .select('id, full_name, avatar_url, grade')
        .eq('role', 'pupil')
        .ilike('grade', `%${educatorClass}%`)
        .order('full_name', { ascending: true });

      if (pupilErr) throw pupilErr;

      // Fetch Attendance records for selected date & class
      const { data: existingAttendance, error: attErr } = await supabaseClient
        .from('attendance')
        .select('*')
        .eq('date', selectedDate)
        .ilike('class_name', `%${educatorClass}%`);

      if (attErr) throw attErr;

      const attMap = new Map();
      if (existingAttendance) {
        existingAttendance.forEach(a => attMap.set(a.pupil_id, a));
      }

      const combined = (pupilProfiles || []).map((pupil, index) => {
        const existing = attMap.get(pupil.id);
        return {
          id: pupil.id,
          attendanceRecordId: existing?.id || null,
          name: pupil.full_name,
          rollNo: `${educatorClass.replace(/\s+/g, '')}-${String(index + 1).padStart(3, '0')}`,
          avatar: pupil.avatar_url || null,
          status: existing?.status || 'Present',
          remarks: existing?.remarks || ''
        };
      });

      setPupils(combined);
    } catch (err) {
      console.error('Error fetching attendance:', err.message);
      triggerToast(`Failed to load attendance: ${err.message}`);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [educatorClass, selectedDate]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleStatusChange = (id, newStatus) => {
    const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
    setPupils(prev => prev.map(p => (p.id === id ? { ...p, status: formattedStatus } : p)));
  };

  const handleRemarksChange = (id, newRemarks) => {
    setPupils(prev => prev.map(p => (p.id === id ? { ...p, remarks: newRemarks } : p)));
  };

  const handleClearRemarks = (id) => {
    setPupils(prev => prev.map(p => (p.id === id ? { ...p, remarks: '' } : p)));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      for (const pupil of pupils) {
        const payload = {
          pupil_id: pupil.id,
          class_name: educatorClass,
          date: selectedDate,
          status: pupil.status,
          remarks: pupil.remarks,
          term: currentTerm,
          academic_session: academicSession,
          marked_by: user?.id || null
        };

        if (pupil.attendanceRecordId) {
          const { error } = await supabaseClient
            .from('attendance')
            .update({ status: pupil.status, remarks: pupil.remarks })
            .eq('id', pupil.attendanceRecordId);
          if (error) throw error;
        } else {
          const { data, error } = await supabaseClient
            .from('attendance')
            .insert([payload])
            .select();
          if (error) throw error;
          if (data && data[0]) pupil.attendanceRecordId = data[0].id;
        }
      }

      setShowSubmitModal(true);
      await fetchAttendanceData(true);
    } catch (err) {
      triggerToast(`Error saving attendance: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredGrades = pupils.filter(pupil => {
    const matchesSearch = pupil.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pupil.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pupil.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || pupil.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalCount = pupils.length;
  const presentCount = pupils.filter(p => p.status.toLowerCase() === 'present').length;
  const lateCount = pupils.filter(p => p.status.toLowerCase() === 'late').length;
  const absentCount = pupils.filter(p => p.status.toLowerCase() === 'absent').length;
  const excusedCount = pupils.filter(p => p.status.toLowerCase() === 'excused').length;
  const attendancePercentage = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  return {
    pupils, filteredGrades, isLoading, isSaving,
    selectedDate, setSelectedDate, educatorClass, currentTerm, academicSession,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    showStatusFilterDropdown, setShowStatusFilterDropdown,
    activePresetDropdownId, setActivePresetDropdownId,
    showSubmitModal, setShowSubmitModal, showSummaryModal, setShowSummaryModal,
    showToast, toastMessage, presetRemarksList,
    totalCount, presentCount, lateCount, absentCount, excusedCount, attendancePercentage,
    handleStatusChange, handleRemarksChange, handleClearRemarks, handleSaveAttendance
  };
};