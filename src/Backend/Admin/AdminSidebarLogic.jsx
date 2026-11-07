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
  const [isLoading, setIsLoading] = useState(true);

  const fetchSidebarData = useCallback(async () => {
    try {
      // 1. Fetch Admin Profile Details
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

      // 2. Check for Pending Academic Approvals
// 2. Check for Pending Academic Approvals
      const { data: recentApprovals, error: approvalErr } = await supabaseClient
        .from('academic_approvals')
        .select('submitted_at, status')
        .ilike('status', 'PENDING')
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (approvalErr) {
        console.error("Supabase approval fetch error:", approvalErr.message);
      }

      if (recentApprovals && recentApprovals.length > 0) {
        const latestApprovalTime = new Date(recentApprovals[0].submitted_at).getTime();
        const storedViewedTime = localStorage.getItem('approvals_viewed_at');
        const viewedApprovalTime = storedViewedTime ? new Date(storedViewedTime).getTime() : 0;

        setHasPendingApprovals(latestApprovalTime > viewedApprovalTime);
      } else {
        setHasPendingApprovals(false);
      }

      // 3. Check for Recent School Broadcasts
      const { data: recentBroadcasts } = await supabaseClient
        .from('school_broadcasts')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (recentBroadcasts && recentBroadcasts.length > 0) {
        const latestBroadcastTime = new Date(recentBroadcasts[0].created_at).getTime();
        const viewedBroadcastTime = localStorage.getItem('broadcasts_viewed_at') 
          ? new Date(localStorage.getItem('broadcasts_viewed_at')).getTime() 
          : 0;

        setHasNewBroadcast(latestBroadcastTime > viewedBroadcastTime);
      } else {
        setHasNewBroadcast(false);
      }

    } catch (err) {
      console.error('Error loading sidebar data:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSidebarData();

    // Set up Supabase Realtime channel to listen for new submissions instantly
    const channel = supabaseClient
      .channel('admin-sidebar-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_approvals' },
        () => {
          fetchSidebarData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'school_broadcasts' },
        () => {
          fetchSidebarData();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [fetchSidebarData]);

  // Handlers to clear dots when components are opened
  const handleOpenApprovals = () => {
    setHasPendingApprovals(false);
    localStorage.setItem('approvals_viewed_at', new Date().toISOString());
  };

  const handleOpenBroadcasts = () => {
    setHasNewBroadcast(false);
    localStorage.setItem('broadcasts_viewed_at', new Date().toISOString());
  };

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
    handleOpenApprovals,
    handleOpenBroadcasts,
    handleLogout,
    isLoading
  };
};