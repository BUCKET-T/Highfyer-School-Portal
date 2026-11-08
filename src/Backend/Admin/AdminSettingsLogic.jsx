import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useAdminSettingsLogic = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  // Profile Form States
  const [profile, setProfile] = useState({
    fullName: '',
    portalEmail: '',
    phone: '',
    roleTitle: '',
    avatar: ''
  });

  // Academic Session & Settings States
  const [settings, setSettings] = useState({
    activeSession: '2024/2025 Academic Session',
    currentTerm: 'Term 1',
    termStartDate: '',
    termEndDate: '',
    scoreEntryWindow: true,
    parentResultPortal: false
  });

  // Password Change States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  // Custom Dropdown State for Term
  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);

  // Clean term options
  const termOptions = ['Term 1', 'Term 2', 'Term 3'];

  // Live System Activity Logs State
  const [systemActivityLogs, setSystemActivityLogs] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  }, []);

  // Helper: Resolve active admin UUID
  const getActiveAdminId = useCallback(async () => {
    const activeAdminId = sessionStorage.getItem('active_admin_id');
    if (activeAdminId) return activeAdminId;

    const { data: authData } = await supabaseClient.auth.getUser();
    return authData?.user?.id || null;
  }, []);

  // Fetch System Activity Logs from Supabase
  const fetchActivityLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabaseClient
        .from('system_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSystemActivityLogs(data || []);
    } catch (err) {
      console.error('Error fetching activity logs:', err.message);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  // Fetch initial profile & active academic session data from Supabase
  const fetchAdminData = useCallback(async () => {
    try {
      const targetUserId = await getActiveAdminId();
      if (!targetUserId) return;

      // Fetch Profile strictly by active admin ID
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .maybeSingle();

      if (profileData && !profileError) {
        setProfile({
          fullName: profileData.full_name || '',
          portalEmail: profileData.email || '',
          phone: profileData.phone || '',
          roleTitle: profileData.role_title || profileData.role || '',
          avatar: profileData.avatar_url || ''
        });
      }

      // Fetch Active Academic Session
      const { data: sessionData, error: sessionError } = await supabaseClient
        .from('academic_sessions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionData && !sessionError) {
        setSettings((prev) => ({
          ...prev,
          activeSession: sessionData.session_name || prev.activeSession,
          currentTerm: sessionData.term_name || prev.currentTerm,
          termStartDate: sessionData.start_date || '',
          termEndDate: sessionData.end_date || '',
          scoreEntryWindow: sessionData.score_entry_open ?? true,
          parentResultPortal: sessionData.parent_portal_open ?? false
        }));
      }
    } catch (err) {
      console.error('Error fetching admin settings:', err.message);
    }
  }, [getActiveAdminId]);

  useEffect(() => {
    fetchAdminData();
    fetchActivityLogs();
  }, [fetchAdminData, fetchActivityLogs]);

  // Handle Avatar Image Upload with Raised Threshold (45KB)
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 45 * 1024) {
      showToast('Image file size must not exceed 45KB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Avatar = reader.result;
      setProfile((prev) => ({ ...prev, avatar: base64Avatar }));

      try {
        const targetUserId = await getActiveAdminId();
        if (targetUserId) {
          await supabaseClient
            .from('profiles')
            .update({ avatar_url: base64Avatar })
            .eq('id', targetUserId);
          showToast('Avatar updated successfully!');
        }
      } catch (err) {
        console.error('Error saving avatar:', err.message);
        showToast('Failed to save avatar.', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to record new audit log into system_activity_logs
  const logSystemActivity = async (actionMessage, status = 'Success') => {
    try {
      await supabaseClient.from('system_activity_logs').insert([
        {
          action: actionMessage,
          ip_address: '197.210.54.12',
          status: status,
          created_at: new Date()
        }
      ]);
      fetchActivityLogs();
    } catch (err) {
      console.error('Failed to log activity:', err.message);
    }
  };

  // Save Configurations to Supabase
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const targetUserId = await getActiveAdminId();
      if (!targetUserId) {
        throw new Error('Active admin session not found.');
      }

      // 1. Update profiles table strictly by ID
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
          email: profile.portalEmail,
          avatar_url: profile.avatar,
          updated_at: new Date()
        })
        .eq('id', targetUserId);

      if (profileError) throw profileError;

      // 2. Deactivate all existing academic sessions first to guarantee single active record
      const { error: deactivateError } = await supabaseClient
        .from('academic_sessions')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactivateError) throw deactivateError;

      // 3. Check if this session & term combination already exists in the table
      const { data: existingSession, error: fetchErr } = await supabaseClient
        .from('academic_sessions')
        .select('id')
        .eq('session_name', settings.activeSession)
        .eq('term_name', settings.currentTerm)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      let sessionError;
      if (existingSession) {
        // Update the existing record and set it to active
        const { error } = await supabaseClient
          .from('academic_sessions')
          .update({
            start_date: settings.termStartDate || null,
            end_date: settings.termEndDate || null,
            score_entry_open: settings.scoreEntryWindow,
            parent_portal_open: settings.parentResultPortal,
            is_active: true
          })
          .eq('id', existingSession.id);
        sessionError = error;
      } else {
        // Insert a brand new active record for this session and term
        const { error } = await supabaseClient
          .from('academic_sessions')
          .insert({
            session_name: settings.activeSession,
            term_name: settings.currentTerm,
            start_date: settings.termStartDate || null,
            end_date: settings.termEndDate || null,
            score_entry_open: settings.scoreEntryWindow,
            parent_portal_open: settings.parentResultPortal,
            is_active: true
          });
        sessionError = error;
      }

      if (sessionError) throw sessionError;

      await logSystemActivity('System Settings & Session Timing Updated');
      showToast('System configuration saved successfully!');
      
      // Refresh admin data state
      fetchAdminData();
    } catch (err) {
      console.error('Save error:', err.message);
      showToast(err.message || 'Failed to update settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Update
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      setPasswordStatus({ type: 'error', message: 'Please enter your current password.' });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      await logSystemActivity('Admin Account Password Changed', 'Secured');

      setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordStatus(null), 4000);
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err.message || 'Failed to update password.' });
    }
  };

  return {
    activeTab, setActiveTab,
    isSaving, isLoadingLogs, toast,
    profile, setProfile,
    settings, setSettings,
    passwordData, setPasswordData,
    showCurrentPassword, setShowCurrentPassword,
    showNewPassword, setShowNewPassword,
    showConfirmPassword, setShowConfirmPassword,
    passwordStatus,
    isTermDropdownOpen, setIsTermDropdownOpen,
    termOptions,
    systemActivityLogs,
    handleAvatarUpload,
    handleSave,
    handlePasswordChangeSubmit
  };
};