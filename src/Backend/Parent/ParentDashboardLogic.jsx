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
  const [liveAttendance, setLiveAttendance] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchSessionWards = async () => {
      try {
        const storedChildren = localStorage.getItem('parent_children');
        const storedSelectedId = localStorage.getItem('selected_parent_child');

        const { data: authData } = await supabaseClient.auth.getUser();
        const userEmail = authData?.user?.email;

        if (userEmail) {
          const { data: linkedWards, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('email', userEmail)
            .eq('role', 'pupil');

          if (!error && linkedWards && linkedWards.length > 0) {
            setWards(linkedWards);
            localStorage.setItem('parent_children', JSON.stringify(linkedWards));

            const active = linkedWards.find((w) => w.id === storedSelectedId) || linkedWards[0];
            setCurrentWard(active);
            localStorage.setItem('selected_parent_child', active.id);
          } else if (storedChildren) {
            const parsedChildren = JSON.parse(storedChildren);
            setWards(parsedChildren);
            if (parsedChildren.length > 0) {
              const active = parsedChildren.find((w) => w.id === storedSelectedId) || parsedChildren[0];
              setCurrentWard(active);
            }
          } else {
            navigate('/parent/login');
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
    };

    fetchSessionWards();
  }, [navigate]);

  // Fetch live metrics when active ward changes
  useEffect(() => {
    const fetchWardMetrics = async () => {
      if (!currentWard) return;
      setIsDataLoading(true);

      try {
        // 1. Fetch Class Educator based on currentWard's grade
        if (currentWard.grade) {
          const cleanGrade = currentWard.grade.trim();
          const { data: educatorData } = await supabaseClient
            .from('profiles')
            .select('*')
            .ilike('assigned_classes', `%${cleanGrade}%`)
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

        // 4. Fetch Attendance records for this ward (cumulative calculation per term)
        const { data: attendanceData } = await supabaseClient
          .from('attendance')
          .select('*')
          .eq('pupil_id', currentWard.id);

        if (attendanceData && attendanceData.length > 0) {
          // You can filter by term if needed (e.g. .eq('term', 'Term 3'))
          const totalDays = attendanceData.length;
          const presentDays = attendanceData.filter(
            (a) => a.status === 'PRESENT' || a.status === 'Present' || a.is_present === true
          ).length;

          const cumulativeRate = Math.round((presentDays / totalDays) * 100);
          setLiveAttendance(cumulativeRate);
        } else {
          setLiveAttendance(0); // Resets to 0% if no attendance records exist for the term
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
