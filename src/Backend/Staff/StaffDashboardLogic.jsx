import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useStaffDashboardLogic = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [assignedClasses, setAssignedClasses] = useState([]);
  
  const [totalStudents, setTotalStudents] = useState(0);
  const [todayAttendancePercent, setTodayAttendancePercent] = useState(0);
  const [pendingGradesCount, setPendingGradesCount] = useState(0);
  const [upcomingLessonsCount, setUpcomingLessonsCount] = useState(0);

  const [pendingGradingList, setPendingGradingList] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // 1. Initial Load: Fetch Profile & Assigned Classes
  const initStaffProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      let prof = null;

      if (user) {
        const { data } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        prof = data;
      }

      if (!prof) {
        const { data: educatorRows } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('role', 'educator')
          .limit(1);
        if (educatorRows && educatorRows.length > 0) {
          prof = educatorRows[0];
        }
      }

      if (prof) {
        setUserProfile(prof);

        // Parse assigned classes list from database
        let classesList = [];
        const rawSource = prof.assigned_classes || prof.grade;

        if (Array.isArray(rawSource)) {
          classesList = rawSource;
        } else if (typeof rawSource === 'string') {
          classesList = rawSource.split(',').map(c => c.trim()).filter(Boolean);
        }

        if (classesList.length === 0) {
          classesList = ['Grade 6'];
        }

        setAssignedClasses(classesList);

        // Check for saved active class in localStorage
        const savedClass = localStorage.getItem('selected_staff_class');
        if (savedClass && classesList.includes(savedClass)) {
          setSelectedClass(savedClass);
        } else {
          setSelectedClass(classesList[0]);
          localStorage.setItem('selected_staff_class', classesList[0]);
        }
      }
    } catch (err) {
      console.error('Error initializing staff profile:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Fetch Data for currently selectedClass
  const fetchClassMetrics = useCallback(async (currentClass) => {
    if (!currentClass) return;
    const todayDate = new Date().toISOString().split('T')[0];

    try {
      // Fetch Total Students in Selected Class
      const { count: studentCount, error: studentErr } = await supabaseClient
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'pupil')
        .ilike('grade', `%${currentClass}%`);

      if (!studentErr) setTotalStudents(studentCount || 0);

      // Fetch Today's Attendance Percentage for Selected Class
      const { data: attData } = await supabaseClient
        .from('attendance')
        .select('status')
        .eq('date', todayDate)
        .ilike('class_name', `%${currentClass}%`);

      if (attData && attData.length > 0) {
        const presentOrLate = attData.filter(a => 
          a.status.toLowerCase() === 'present' || a.status.toLowerCase() === 'late'
        ).length;
        setTodayAttendancePercent(Math.round((presentOrLate / attData.length) * 100));
      } else {
        setTodayAttendancePercent(0);
      }

      // Fetch Pending Draft Grades for Selected Class
      const { data: draftGrades, error: draftErr } = await supabaseClient
        .from('student_grades')
        .select('subject, term, academic_session, is_finalized')
        .eq('is_finalized', false)
        .ilike('class_name', `%${currentClass}%`);

      if (draftErr) console.error('Error fetching draft grades:', draftErr.message);

      const uniqueDraftSubjects = draftGrades 
        ? Array.from(new Set(draftGrades.map(g => g.subject)))
        : [];

      setPendingGradesCount(uniqueDraftSubjects.length);

      const mappedPendingGrades = uniqueDraftSubjects.map((subj, idx) => ({
        id: `draft-${idx}`,
        subject: subj.toUpperCase(),
        subjectTagColor: 'bg-sky-100 text-sky-700 border-sky-200',
        initialLetter: subj.charAt(0).toUpperCase(),
        title: `${subj} Gradebook Draft`,
        dueDateTag: 'DRAFT SAVED',
        dueTagColor: 'text-amber-600 bg-amber-50 border-amber-200',
        submittedCount: studentCount || 1,
        totalCount: studentCount || 1,
        progressPercent: 100,
      }));

      setPendingGradingList(mappedPendingGrades);

      // Fetch Schedule/Timetable for Selected Class
      const { data: scheduleData } = await supabaseClient
        .from('schedules')
        .select('*')
        .ilike('class_name', `%${currentClass}%`)
        .order('start_time', { ascending: true });

      if (scheduleData && scheduleData.length > 0) {
        setUpcomingLessonsCount(scheduleData.length);
        setTodaySchedule(scheduleData.map(s => ({
          time: s.start_time || '08:30 AM',
          title: s.subject_name || s.title,
          subtitle: s.topic || 'Class Session',
          classTag: currentClass,
          badgeBg: 'bg-sky-100 text-sky-700'
        })));
      } else {
        setUpcomingLessonsCount(0);
        setTodaySchedule([]);
      }

    } catch (err) {
      console.error('Error loading class metrics:', err.message);
    }
  }, []);

  useEffect(() => {
    initStaffProfile();
  }, [initStaffProfile]);

  useEffect(() => {
    if (selectedClass) {
      fetchClassMetrics(selectedClass);
    }
  }, [selectedClass, fetchClassMetrics]);

  // Handle Class Switcher Select
  const handleClassSelect = (className) => {
    setShowClassDropdown(false);
    if (className !== selectedClass) {
      setSelectedClass(className);
      localStorage.setItem('selected_staff_class', className);
    }
  };

  return {
    userProfile,
    selectedClass,
    assignedClasses,
    totalStudents,
    todayAttendancePercent,
    pendingGradesCount,
    upcomingLessonsCount,
    pendingGradingList,
    todaySchedule,
    isLoading,
    showClassDropdown,
    setShowClassDropdown,
    showNotifications,
    setShowNotifications,
    handleClassSelect,
  };
};