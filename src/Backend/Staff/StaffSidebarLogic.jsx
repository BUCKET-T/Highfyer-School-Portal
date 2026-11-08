import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../../config/supabaseClient';

export const useStaffSidebarLogic = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [userProfile, setUserProfile] = useState(null);
  const [hasNewFeed, setHasNewFeed] = useState(false);
  const [hasApprovedGrades, setHasApprovedGrades] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initSidebar = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      let profile = null;

      if (user) {
        const { data } = await supabaseClient
          .from('profiles')
          .select('id, full_name, role, role_title, grade, avatar_url')
          .eq('id', user.id)
          .maybeSingle();
        profile = data;
      }

      // Fallback if exact user ID match fails
      if (!profile) {
        const { data: educatorRows } = await supabaseClient
          .from('profiles')
          .select('id, full_name, role, role_title, grade, avatar_url')
          .eq('role', 'educator')
          .limit(1);
        if (educatorRows && educatorRows.length > 0) {
          profile = educatorRows[0];
        }
      }

      if (profile) {
        setUserProfile(profile);
      }

      // Check for Staff Feed (School Broadcasts) unread status
      const userIdKey = user?.id || profile?.id || 'default';
      const { data: broadcasts } = await supabaseClient
        .from('school_broadcasts')
        .select('created_at')
        .or('target_audience.ilike.%Staff%,target_audience.ilike.%All%')
        .order('created_at', { ascending: false })
        .limit(1);

      if (broadcasts && broadcasts.length > 0) {
        const lastViewedFeed = sessionStorage.getItem(`staff_feed_viewed_${userIdKey}`);
        if (!lastViewedFeed || new Date(broadcasts[0].created_at) > new Date(lastViewedFeed)) {
          setHasNewFeed(true);
        }
      }

      // Check for Gradebook (Approved Grades) unread status
      if (profile?.id) {
        const { data: approvals } = await supabaseClient
          .from('academic_approvals')
          .select('reviewed_at, status')
          .eq('educator_id', profile.id)
          .eq('status', 'APPROVED')
          .order('reviewed_at', { ascending: false })
          .limit(1);

        if (approvals && approvals.length > 0 && approvals[0].reviewed_at) {
          const lastViewedGrades = sessionStorage.getItem(`staff_grades_viewed_${profile.id}`);
          if (!lastViewedGrades || new Date(approvals[0].reviewed_at) > new Date(lastViewedGrades)) {
            setHasApprovedGrades(true);
          }
        }
      }
    } catch (err) {
      console.error('Error initializing sidebar:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initSidebar();
  }, [initSidebar]);

  const handleFeedClick = () => {
    setHasNewFeed(false);
    setIsMobileOpen(false);
    if (userProfile?.id) {
      sessionStorage.setItem(`staff_feed_viewed_${userProfile.id}`, new Date().toISOString());
    }
  };

  const handleGradebookClick = () => {
    setHasApprovedGrades(false);
    setIsMobileOpen(false);
    if (userProfile?.id) {
      sessionStorage.setItem(`staff_grades_viewed_${userProfile.id}`, new Date().toISOString());
    }
  };

  const handleConfirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await supabaseClient.auth.signOut();
      navigate('/staff/login');
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return {
    userProfile,
    hasNewFeed,
    hasApprovedGrades,
    isLoading,
    isMobileOpen,
    setIsMobileOpen,
    showLogoutModal,
    setShowLogoutModal,
    handleFeedClick,
    handleGradebookClick,
    handleConfirmLogout,
  };
};