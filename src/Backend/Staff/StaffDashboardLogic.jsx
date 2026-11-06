import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useStaffDashboardLogic = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedClass, setSelectedClass] = useState('Grade 6');
  const [assignedClasses, setAssignedClasses] = useState(['Grade 6']);
  
  const [totalStudents, setTotalStudents] = useState(0);
  const [todayAttendancePercent, setTodayAttendancePercent] = useState(0);
  const [pendingGradesCount, setPendingGradesCount] = useState(0);
  const [upcomingLessonsCount, setUpcomingLessonsCount] = useState(0);

  const [pendingGradingList, setPendingGradingList] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRedirectNotice, setShowRedirectNotice] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      let activeClass = 'Grade 6';
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
        if (prof.medical_notes && prof.medical_notes.includes('Grade')) {
          const match = prof.medical_notes.match(/Grade\s*\d+/i);
          if (match) activeClass = match[0];
        } else if (prof.grade) {
          activeClass = prof.grade;
        }
        setSelectedClass(activeClass);
        setAssignedClasses([activeClass, 'Grade 3', 'Grade 5']);
      }

      const todayDate = new Date().toISOString().split('T')[0];

      // 1. Fetch Total Students in Educator's Class
      const { count: studentCount, error: studentErr } = await supabaseClient
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'pupil')
        .ilike('grade', `%${activeClass}%`);

      if (!studentErr) setTotalStudents(studentCount || 0);

      // 2. Fetch Today's Attendance Percentage
      const { data: attData } = await supabaseClient
        .from('attendance')
        .select('status')
        .eq('date', todayDate)
        .eq('class_name', activeClass);

      if (attData && attData.length > 0) {
        const presentOrLate = attData.filter(a => 
          a.status.toLowerCase() === 'present' || a.status.toLowerCase() === 'late'
        ).length;
        setTodayAttendancePercent(Math.round((presentOrLate / attData.length) * 100));
      } else {
        setTodayAttendancePercent(0);
      }

      // 3. Fetch Pending Grades (Draft subjects from student_grades where is_finalized = false)
      const { data: draftGrades, error: draftErr } = await supabaseClient
        .from('student_grades')
        .select('subject, term, academic_session, is_finalized')
        .eq('is_finalized', false);

      if (draftErr) console.error('Error fetching draft grades:', draftErr.message);

      // Extract unique subjects saved as draft
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

      // 4. Fetch Schedule/Timetable
      const { data: scheduleData } = await supabaseClient
        .from('schedules')
        .select('*')
        .ilike('class_name', `%${activeClass}%`)
        .order('start_time', { ascending: true });

      if (scheduleData && scheduleData.length > 0) {
        setUpcomingLessonsCount(scheduleData.length);
        setTodaySchedule(scheduleData.map(s => ({
          time: s.start_time || '08:30 AM',
          title: s.subject_name || s.title,
          subtitle: s.topic || 'Class Session',
          classTag: activeClass,
          badgeBg: 'bg-sky-100 text-sky-700'
        })));
      } else {
        setUpcomingLessonsCount(0);
        setTodaySchedule([]);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleClassSelect = (className) => {
    setShowClassDropdown(false);
    const activeDefault = selectedClass;

    if (className !== activeDefault) {
      setSelectedClass(className);
      setShowRedirectNotice(true);
      setTimeout(() => {
        setSelectedClass(activeDefault);
        setShowRedirectNotice(false);
      }, 1800);
    } else {
      setSelectedClass(activeDefault);
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
    showRedirectNotice,
    handleClassSelect,
  };
};