import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useAdminDashboardLogic = () => {
  const [activeSessionText, setActiveSessionText] = useState('Loading Session...');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  // Metrics States
  const [totalPupils, setTotalPupils] = useState(0);
  const [activeStaff, setActiveStaff] = useState(0);
  const [adminAvatar, setAdminAvatar] = useState('');
  const [adminName, setAdminName] = useState('Admin Director');

  // Broadcast Notification Pink Dot State
  const [hasUnreadBroadcasts, setHasUnreadBroadcasts] = useState(false);

  // Live Staff Activity Audit Logs State
  const [staffActivities, setStaffActivities] = useState([]);

  // Portal Traffic Derived Chart Points
  const [trafficData, setTrafficData] = useState([10, 15, 20, 25, 30, 40, 60]);

  // Fetch real-time metrics, active session, broadcast check, and system activity logs from Supabase
  const fetchDashboardData = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      // 1. Check for Recent Updates in school_broadcasts (within the last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recentBroadcasts, error: broadcastError } = await supabaseClient
        .from('school_broadcasts')
        .select('id, created_at')
        .gte('created_at', twentyFourHoursAgo)
        .limit(1);

      if (!broadcastError && recentBroadcasts && recentBroadcasts.length > 0) {
        setHasUnreadBroadcasts(true);
      } else {
        setHasUnreadBroadcasts(false);
      }

      // 2. Fetch live system activity logs from Supabase
      const { data: logsData, error: logsError } = await supabaseClient
        .from('system_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (!logsError && logsData && logsData.length > 0) {
        const formattedLogs = logsData.map((log, index) => ({
          id: log.id || index,
          name: log.action ? log.action.split(' ')[0] + ' (Admin)' : 'System User',
          action: log.action || 'Performed system operation',
          time: log.created_at ? getTimeAgo(log.created_at) : 'RECENT',
          avatarBg: getAvatarColor(index)
        }));
        setStaffActivities(formattedLogs);
        deriveTrafficGraph(logsData);
      } else {
        setStaffActivities([
          { id: 1, name: 'Admin Director', action: 'System initialized successfully', time: 'JUST NOW', avatarBg: 'from-sky-400 to-indigo-500' }
        ]);
      }

      // 3. Fetch Currently Active Academic Session (Explicitly filtered by is_active = true)
      const { data: sessionData, error: sessionError } = await supabaseClient
        .from('academic_sessions')
        .select('session_name, term_name')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!sessionError && sessionData && sessionData.length > 0) {
        const active = sessionData[0];
        setActiveSessionText(`${active.term_name || 'Term 1'}, ${active.session_name || ''}`);
      } else {
        setActiveSessionText('Term 1, 2025/2026 Session');
      }

      // 4. Fetch Logged-in Admin Profile Avatar & Full Name for Greeting & Avatar View
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        const { data: userProfile, error: userProfileError } = await supabaseClient
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('email', user.email)
          .single();

        if (!userProfileError && userProfile) {
          if (userProfile.full_name) setAdminName(userProfile.full_name);
          if (userProfile.avatar_url) setAdminAvatar(userProfile.avatar_url);
        }
      }

      // Fallback if auth user lookup fails: grab the first profile row
      if (!adminName || adminName === 'Admin Director') {
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('full_name, avatar_url')
          .limit(1);

        if (!profileError && profileData && profileData.length > 0) {
          if (profileData[0].avatar_url) setAdminAvatar(profileData[0].avatar_url);
          if (profileData[0].full_name) setAdminName(profileData[0].full_name);
        }
      }

      // 5. Strictly separate Total Pupils and Active Staff from profiles table
      const { data: profilesData, error: profilesError } = await supabaseClient
        .from('profiles')
        .select('role, role_title');

      if (!profilesError && profilesData) {
        let pupilCount = 0;
        let staffCount = 0;

        profilesData.forEach((profile) => {
          const roleVal = (profile.role || '').toLowerCase();
          const titleVal = (profile.role_title || '').toLowerCase();

          if (roleVal.includes('student') || roleVal.includes('pupil') || titleVal.includes('student') || titleVal.includes('pupil')) {
            pupilCount++;
          } else if (roleVal.includes('educator') || roleVal.includes('admin') || roleVal.includes('teacher') || titleVal.includes('admin') || titleVal.includes('grade')) {
            staffCount++;
          }
        });

        setTotalPupils(pupilCount);
        setActiveStaff(staffCount);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err.message);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [adminName]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper function to format relative time
  const getTimeAgo = (dateString) => {
    const diffMins = Math.floor((new Date() - new Date(dateString)) / (1000 * 60));
    if (diffMins < 1) return 'JUST NOW';
    if (diffMins < 60) return `${diffMins} MINS AGO`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} HOUR${diffHours > 1 ? 'S' : ''} AGO`;
    return `${Math.floor(diffHours / 24)} DAYS AGO`;
  };

  // Helper for dynamic avatar gradients
  const getAvatarColor = (index) => {
    const palettes = [
      'from-sky-400 to-indigo-500',
      'from-pink-400 to-rose-500',
      'from-amber-400 to-orange-500',
      'from-emerald-400 to-teal-500'
    ];
    return palettes[index % palettes.length];
  };

  // Derive weekly traffic based on log activity
  const deriveTrafficGraph = (logs) => {
    const dayCounts = [5, 5, 5, 5, 5, 5, 5];
    logs.forEach(log => {
      if (log.created_at) {
        const date = new Date(log.created_at);
        let dayIdx = date.getDay() - 1;
        if (dayIdx === -1) dayIdx = 6;
        dayCounts[dayIdx] += 25;
      }
    });
    setTrafficData(dayCounts);
  };

  return {
    activeSessionText,
    isLoadingLogs,
    totalPupils,
    activeStaff,
    adminAvatar,
    adminName,
    hasUnreadBroadcasts,
    staffActivities,
    trafficData
  };
};