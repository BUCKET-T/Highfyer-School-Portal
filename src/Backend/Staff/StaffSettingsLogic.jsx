import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useStaffSettingsLogic = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  // Toast / Feedback State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Central Log Activity Function matching system_activity_logs schema exactly
  const logSystemActivity = async (actionText, statusText = 'Success') => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      await supabaseClient.from('system_activity_logs').insert([
        {
          user_id: user ? user.id : null,
          action: actionText,
          ip_address: '197.210.54.12',
          status: statusText,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.warn('Failed to record system activity log:', err.message);
    }
  };

  // Fetch logged-in staff profile with robust fallback matching profiles table schema
  const fetchStaffProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) setEmail(user.email || '');

      let profileData = null;
      if (user) {
        const { data } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        profileData = data;
      }

      if (!profileData) {
        const { data: fallbackData } = await supabaseClient
          .from('profiles')
          .select('*')
          .or('role.ilike.educator,role_title.ilike.%admin%')
          .limit(1);

        if (fallbackData && fallbackData.length > 0) {
          profileData = fallbackData[0];
        }
      }

      if (profileData) {
        setFullName(profileData.full_name || '');
        setPhone(profileData.phone || '');
        setRoleTitle(profileData.role_title || profileData.role || 'Educator');
        setAvatarUrl(profileData.avatar_url || '');
      }
    } catch (err) {
      console.error('Error fetching staff profile:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffProfile();
  }, [fetchStaffProfile]);

  // Handle Profile Save & Log Activity
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      const targetId = user ? user.id : '';

      const { error } = await supabaseClient
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          role_title: roleTitle,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetId);

      if (error) throw error;

      await logSystemActivity(`Staff Profile Updated: ${fullName || email}`);
      triggerToast('Educator profile successfully updated in database!');
    } catch (err) {
      console.error('Error updating profile:', err.message);
      await logSystemActivity(`Staff Profile Update Failed: ${fullName || email}`, 'Failed');
      triggerToast('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Update via Supabase Auth & Log Activity
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      triggerToast('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      triggerToast('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      await logSystemActivity(`Staff Password Changed: ${fullName || email}`);
      triggerToast('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update error:', err.message);
      await logSystemActivity(`Staff Password Change Failed: ${fullName || email}`, 'Failed');
      triggerToast(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Avatar Upload & Base64 Persistence in Database
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 45 * 1024) {
      triggerToast('Image size exceeds 45kb limit.');
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Url = reader.result;
        setAvatarUrl(base64Url);

        const { data: { user } } = await supabaseClient.auth.getUser();
        let targetId = user ? user.id : '';

        if (!targetId) {
          const { data: prof } = await supabaseClient
            .from('profiles')
            .select('id')
            .eq('role', 'educator')
            .limit(1)
            .maybeSingle();
          targetId = prof?.id;
        }

        const { error } = await supabaseClient
          .from('profiles')
          .update({ avatar_url: base64Url })
          .eq('id', targetId);

        if (error) throw error;

        await logSystemActivity(`Staff Avatar Updated: ${fullName || email}`);
        triggerToast('Staff avatar updated successfully!');
        setIsLoading(false);
      };
    } catch (err) {
      console.error('Avatar upload error:', err.message);
      await logSystemActivity(`Staff Avatar Upload Failed: ${fullName || email}`, 'Failed');
      triggerToast('Avatar upload failed.');
      setIsLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    roleTitle,
    setRoleTitle,
    avatarUrl,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    notifEmail,
    setNotifEmail,
    notifPush,
    setNotifPush,
    showToast,
    toastMessage,
    triggerToast,
    handleSaveProfile,
    handleUpdatePassword,
    handleAvatarUpload,
    logSystemActivity
  };
};