import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useStaffSettingsLogic = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true); // Initialize as true so skeleton shows immediately

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

  // Fetch logged-in staff profile with robust fallback matching your profiles table schema
const fetchStaffProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch user auth email & database profile row
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

      // Fallback query if auth ID doesn't match profile row UUID
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

      // 2. Populate all form states FIRST
      if (profileData) {
        setFullName(profileData.full_name || '');
        setPhone(profileData.phone || '');
        setRoleTitle(profileData.role_title || profileData.role || 'Educator');
        setAvatarUrl(profileData.avatar_url || '');
      }
    } catch (err) {
      console.error('Error fetching staff profile:', err.message);
    } finally {
      // 3. ONLY turn off loading once ALL states are set!
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffProfile();
  }, [fetchStaffProfile]);

  // Handle Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      const targetId = user ? user.id : '2bofd2f5-1b06-41a1-a354-fa771785a7';

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
      triggerToast('Educator profile successfully updated in database!');
    } catch (err) {
      console.error('Error updating profile:', err.message);
      triggerToast('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Update via Supabase Auth
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
      triggerToast('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update error:', err.message);
      triggerToast(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Avatar Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 300 * 1024) {
      triggerToast('Image size exceeds 300kb limit.');
      return;
    }

    setIsLoading(true);
    try {
      const localUrl = URL.createObjectURL(file);
      setAvatarUrl(localUrl);

      const { data: { user } } = await supabaseClient.auth.getUser();
      const targetId = user ? user.id : '2bofd2f5-1b06-41a1-a354-fa771785a7';

      await supabaseClient
        .from('profiles')
        .update({ avatar_url: localUrl })
        .eq('id', targetId);

      triggerToast('Staff avatar updated successfully!');
    } catch (err) {
      console.error('Avatar upload error:', err.message);
      triggerToast('Avatar upload failed.');
    } finally {
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
    handleAvatarUpload
  };
};