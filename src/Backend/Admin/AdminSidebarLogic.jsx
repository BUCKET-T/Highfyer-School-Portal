import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useSidebarLogic = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin Director',
    roleTitle: 'SUPER ADMIN',
    avatar: ''
  });
  const [hasPendingApprovals, setHasPendingApprovals] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSidebarData = useCallback(async () => {
    try {
      // 1. Resolve Active Admin UUID (Picks active_admin_id from login or auth.uid())
      const storedAdminId = sessionStorage.getItem('active_admin_id');
      let targetUserId = storedAdminId;

      if (!targetUserId) {
        const { data: authData } = await supabaseClient.auth.getUser();
        targetUserId = authData?.user?.id;
      }

      // 2. Fetch Admin Profile Details by explicit ID match
      if (targetUserId) {
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('full_name, role_title, role, avatar_url')
          .eq('id', targetUserId)
          .maybeSingle();

        if (profileData && !profileError) {
          setAdminProfile({
            name: profileData.full_name || 'Admin Director',
            roleTitle: (profileData.role_title || profileData.role || 'SUPER ADMIN').toUpperCase(),
            avatar: profileData.avatar_url || ''
          });
        }
      }

      // 3. Check for Pending Academic Approvals (Strict live count check)
      const { count, error: approvalErr } = await supabaseClient
        .from('academic_approvals')
        .select('*', { count: 'exact', head: true })
        .ilike('status', 'PENDING');

      if (approvalErr) {
        console.error("Supabase approval fetch error:", approvalErr.message);
      }

      // Display badge indicator only if there are pending approvals awaiting review
      setHasPendingApprovals(count !== null && count > 0);

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
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [fetchSidebarData]);

  // Handlers
  const handleOpenApprovals = () => {
    // Optional: Keep or clear depending on your UI navigation workflow
  };

  // Secure Logout Handler
  const handleLogout = async (navigate) => {
    try {
      sessionStorage.removeItem('active_admin_id');
      await supabaseClient.auth.signOut();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err.message);
      sessionStorage.removeItem('active_admin_id');
      navigate('/admin/login');
    }
  };

  return {
    adminProfile,
    hasPendingApprovals,
    handleOpenApprovals,
    handleLogout,
    isLoading
  };
};