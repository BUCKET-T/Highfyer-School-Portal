import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useSidebarLogic = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin Director',
    roleTitle: 'SUPER ADMIN',
    avatar: ''
  });
  const [hasPendingApprovals, setHasPendingApprovals] = useState(false);
  const [hasNewBroadcast, setHasNewBroadcast] = useState(false);

  const fetchSidebarData = useCallback(async () => {
    try {
      // 1. Fetch Admin Profile Details (Name, Role Title, Avatar)
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('full_name, role_title, role, avatar_url')
        .limit(1)
        .single();

      if (profileData && !profileError) {
        setAdminProfile({
          name: profileData.full_name || 'Admin Director',
          roleTitle: (profileData.role_title || profileData.role || 'SUPER ADMIN').toUpperCase(),
          avatar: profileData.avatar_url || ''
        });
      }

      // 2. Check for Pending Academic Approvals (Grade approval requests)
      const { count: approvalsCount, error: approvalsError } = await supabaseClient
        .from('academic_approvals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (!approvalsError && approvalsCount !== null && approvalsCount > 0) {
        setHasPendingApprovals(true);
      } else {
        setHasPendingApprovals(false);
      }

      // 3. Check for Recent School Broadcasts (within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recentBroadcasts } = await supabaseClient
        .from('school_broadcasts')
        .select('id')
        .gte('created_at', twentyFourHoursAgo)
        .limit(1);

      if (recentBroadcasts && recentBroadcasts.length > 0) {
        setHasNewBroadcast(true);
      } else {
        setHasNewBroadcast(false);
      }

    } catch (err) {
      console.error('Error loading sidebar data:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  // Secure Logout Handler
  const handleLogout = async (navigate) => {
    try {
      await supabaseClient.auth.signOut();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err.message);
      navigate('/admin/login');
    }
  };

  return {
    adminProfile,
    hasPendingApprovals,
    hasNewBroadcast,
    handleLogout
  };
};