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
  
  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // 1. Fetch Notifications scoped to staff's assigned classes and general broadcasts
// Fetch Notifications strictly tailored to the logged-in educator and active class
  const fetchNotifications = useCallback(async (currentUserId, activeClass) => {
    try {
      // 1. General broadcasts targeted at staff (institutional news)
      const { data: broadcasts, error: broadcastErr } = await supabaseClient
        .from('school_broadcasts')
        .select('*')
        .or('target_audience.ilike.%Staff%,target_audience.ilike.%All%')
        .order('created_at', { ascending: false })
        .limit(5);

      if (broadcastErr) throw broadcastErr;

      // 2. Academic approvals strictly owned by THIS educator AND matching the active class view
      let approvalQuery = supabaseClient
        .from('academic_approvals')
        .select('*')
        .eq('educator_id', currentUserId);

      if (activeClass) {
        approvalQuery = approvalQuery.ilike('class_name', `%${activeClass}%`);
      }

      const { data: approvals, error: approvalErr } = await approvalQuery
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (approvalErr) throw approvalErr;

      const formattedBroadcasts = (broadcasts || []).map(b => ({
        id: b.id,
        title: b.title,
        message: b.content ? b.content.substring(0, 80) + '...' : 'New broadcast update.',
        time: new Date(b.created_at).toLocaleDateString(),
        rawTimestamp: b.created_at,
        type: 'broadcast'
      }));

      const formattedApprovals = (approvals || []).map(a => ({
        id: a.id,
        title: `Grade Submission: ${a.class_name} (${a.subject})`,
        message: `Status: ${a.status || 'PENDING'}`,
        time: a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : 'Recent',
        rawTimestamp: a.submitted_at || new Date().toISOString(),
        type: 'approval'
      }));

      const combined = [...formattedApprovals, ...formattedBroadcasts];
      combined.sort((a, b) => new Date(b.rawTimestamp) - new Date(a.rawTimestamp));

      setNotifications(combined);

      const sessionKey = `staff_session_viewed_${currentUserId}`;
      const lastViewed = sessionStorage.getItem(sessionKey);

      if (!lastViewed) {
        setHasUnread(combined.length > 0);
      } else {
        const hasNewerUpdates = combined.some(item => new Date(item.rawTimestamp) > new Date(lastViewed));
        setHasUnread(hasNewerUpdates);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    }
  }, []);

  // 2. Initial Load: Profile, Assigned Classes & Notifications
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

        const savedClass = localStorage.getItem('selected_staff_class');
        let activeClass = classesList[0];
        if (savedClass && classesList.includes(savedClass)) {
          activeClass = savedClass;
        } else {
          localStorage.setItem('selected_staff_class', activeClass);
        }
        setSelectedClass(activeClass);

        await fetchNotifications(prof.id, classesList);
      }
    } catch (err) {
      console.error('Error initializing staff profile:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotifications]);

  const fetchClassMetrics = useCallback(async (currentClass) => {
    if (!currentClass) return;
    const todayDate = new Date().toISOString().split('T')[0];

    try {
      const { count: studentCount, error: studentErr } = await supabaseClient
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'pupil')
        .ilike('grade', `%${currentClass}%`);

      if (!studentErr) setTotalStudents(studentCount || 0);

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

  const handleClassSelect = (className) => {
    setShowClassDropdown(false);
    if (className !== selectedClass) {
      setSelectedClass(className);
      localStorage.setItem('selected_staff_class', className);
    }
  };

  const toggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState && hasUnread && notifications.length > 0 && userProfile) {
      setHasUnread(false);
      const sessionKey = `staff_session_viewed_${userProfile.id}`;
      sessionStorage.setItem(sessionKey, new Date().toISOString());
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
    notifications,
    hasUnread,
    isLoading,
    showClassDropdown,
    setShowClassDropdown,
    showNotifications,
    setShowNotifications,
    handleClassSelect,
    toggleNotifications,
    refreshNotifications: () => userProfile && fetchNotifications(userProfile.id, assignedClasses)
  };
};