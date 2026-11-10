import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../../config/supabaseClient';

export const useParentDashboardLogic = () => {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [currentWard, setCurrentWard] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [classEducator, setClassEducator] = useState(null);
  const [liveGrades, setLiveGrades] = useState([]);
  const [liveAssignments, setLiveAssignments] = useState([]);
  const [liveAttendance, setLiveAttendance] = useState(95);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    try {
      const storedChildren = localStorage.getItem('parent_children');
      const storedSelectedId = localStorage.getItem('selected_parent_child');

      if (storedChildren) {
        const parsedChildren = JSON.parse(storedChildren);
        setWards(parsedChildren);

        if (parsedChildren.length > 0) {
          const active = parsedChildren.find((w) => w.id === storedSelectedId) || parsedChildren[0];
          setCurrentWard(active);
        }
      } else {
        navigate('/parent/login');
      }
    } catch (err) {
      console.error('Error loading parent session data:', err);
      navigate('/parent/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Fetch live metrics when active ward changes
  useEffect(() => {
    const fetchWardMetrics = async () => {
      if (!currentWard) return;
      setIsDataLoading(true);

      try {
        // 1. Fetch Class Educator based on currentWard's grade
        if (currentWard.grade) {
          const { data: educatorData } = await supabaseClient
            .from('profiles')
            .select('full_name, avatar_url, role_title, email')
            .eq('role', 'educator')
            .ilike('assigned_classes', `%${currentWard.grade}%`)
            .maybeSingle();

          setClassEducator(educatorData || null);
        } else {
          setClassEducator(null);
        }

        // 2. Fetch Student Grades for this ward
        const { data: gradesData } = await supabaseClient
          .from('student_grades')
          .select('*')
          .eq('pupil_id', currentWard.id);

        setLiveGrades(gradesData || []);

        // 3. Fetch Assignments matching the ward's grade level
        if (currentWard.grade) {
          const { data: assignmentsData } = await supabaseClient
            .from('assignments')
            .select('*')
            .ilike('grade_level', `%${currentWard.grade}%`)
            .eq('status', 'ACTIVE');

          setLiveAssignments(assignmentsData || []);
        } else {
          setLiveAssignments([]);
        }

        // 4. Fetch Attendance records if available
        const { data: attendanceData } = await supabaseClient
          .from('attendance')
          .select('*')
          .eq('pupil_id', currentWard.id);

        if (attendanceData && attendanceData.length > 0) {
          const presentCount = attendanceData.filter(a => a.status === 'PRESENT' || a.is_present).length;
          const calculatedRate = Math.round((presentCount / attendanceData.length) * 100);
          setLiveAttendance(calculatedRate);
        }

      } catch (err) {
        console.error('Error fetching live ward metrics:', err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchWardMetrics();
  }, [currentWard]);

  const handleSelectWard = (wardId) => {
    const selected = wards.find((w) => w.id === wardId);
    if (selected) {
      setCurrentWard(selected);
      localStorage.setItem('selected_parent_child', selected.id);
    }
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      localStorage.removeItem('parent_children');
      localStorage.removeItem('selected_parent_child');
      localStorage.clear();
      navigate('/parent/login');
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  // Helper to extract initials (e.g., "Mercy Ojo" -> "MO")
  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const overallProgress = liveGrades.length > 0
    ? Math.round(liveGrades.reduce((acc, curr) => acc + (Number(curr.total_score) || 0), 0) / liveGrades.length)
    : 0;

  return {
    wards,
    currentWard,
    isDropdownOpen,
    setIsDropdownOpen,
    isLoading,
    isDataLoading,
    classEducator,
    liveGrades,
    liveAssignments,
    liveAttendance,
    overallProgress,
    handleSelectWard,
    handleLogout,
    getInitials,
  };
};