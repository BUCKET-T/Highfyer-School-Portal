import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useSettingsLogic = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    id: '',
    full_name: '',
    role: 'pupil',
    grade: '',
    parent_guardian: '',
    email: '',
    phone: '',
    home_address: '',
    avatar_url: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const getInitials = (nameStr) => {
    if (!nameStr) return 'WD';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      let targetChild = null;

      // 1. Check cached selected child ID from localStorage
      const selectedChildId = localStorage.getItem('selected_parent_child');
      if (selectedChildId) {
        const { data: cachedChild } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', selectedChildId)
          .maybeSingle();

        if (cachedChild) {
          targetChild = cachedChild;
        }
      }

      // 2. Fallback to localStorage parent_children array
      if (!targetChild) {
        const storedChildren = localStorage.getItem('parent_children');
        if (storedChildren) {
          const parsedChildren = JSON.parse(storedChildren);
          const validPupil = parsedChildren.find(c => c.role === 'pupil' || c.grade);
          if (validPupil) {
            targetChild = validPupil;
          } else if (parsedChildren.length > 0) {
            targetChild = parsedChildren[0];
          }
        }
      }

      // 3. Fallback to matching actual pupil record in profiles table
      if (!targetChild) {
        const { data: allPupils } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('role', 'pupil')
          .limit(1);

        if (allPupils && allPupils.length > 0) {
          targetChild = allPupils[0];
        }
      }

      if (targetChild) {
        // Cache the exact ID so refresh always loads this record
        localStorage.setItem('selected_parent_child', targetChild.id);

        setProfileData({
          id: targetChild.id,
          full_name: targetChild.full_name || '',
          role: targetChild.role || 'pupil',
          grade: targetChild.grade || '',
          parent_guardian: targetChild.parent_guardian || '',
          email: targetChild.email || '',
          phone: targetChild.phone || '',
          home_address: targetChild.home_address || '',
          avatar_url: targetChild.avatar_url || '',
        });
      }
    } catch (err) {
      console.error('Error fetching settings profile:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleCustomAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 45 * 1024) {
      triggerToast('Image size exceeds 45kb limit.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Url = reader.result;
          setProfileData((prev) => ({ ...prev, avatar_url: base64Url }));

          let targetId = profileData.id || localStorage.getItem('selected_parent_child');
          if (!targetId) {
            const { data: allPupils } = await supabaseClient
              .from('profiles')
              .select('id')
              .eq('role', 'pupil')
              .limit(1);
            targetId = allPupils?.[0]?.id;
          }

          if (!targetId) {
            triggerToast('Error: No profile ID found for update.', 'error');
            return;
          }

          const { error } = await supabaseClient
            .from('profiles')
            .update({
              full_name: profileData.full_name,
              role: profileData.role || 'pupil',
              grade: profileData.grade,
              parent_guardian: profileData.parent_guardian,
              email: profileData.email,
              phone: profileData.phone,
              home_address: profileData.home_address,
              avatar_url: base64Url,
              updated_at: new Date().toISOString()
            })
            .eq('id', targetId);

          if (error) throw error;

          triggerToast('Avatar successfully updated and saved!', 'success');
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 3000);
        } catch (err) {
          console.error('Avatar update error:', err.message);
          triggerToast(`Failed to save avatar: ${err.message}`, 'error');
        } finally {
          setIsSaving(false);
        }
      };

      reader.onerror = () => {
        triggerToast('Failed to read image file.', 'error');
        setIsSaving(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Avatar upload setup error:', err.message);
      triggerToast('Avatar upload failed.', 'error');
      setIsSaving(false);
    }
  };

  const handleSaveAvatarOnly = async (e) => {
    e.preventDefault();
    let targetId = profileData.id || localStorage.getItem('selected_parent_child');
    if (!targetId) {
      const { data: allPupils } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('role', 'pupil')
        .limit(1);
      targetId = allPupils?.[0]?.id;
    }

    if (!targetId) {
      triggerToast('Error: No profile ID found.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          role: profileData.role || 'pupil',
          grade: profileData.grade,
          parent_guardian: profileData.parent_guardian,
          email: profileData.email,
          phone: profileData.phone,
          home_address: profileData.home_address,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetId);

      if (error) throw error;

      triggerToast('Avatar saved successfully!', 'success');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile avatar:', err.message);
      triggerToast(`Failed to save avatar: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      triggerToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      triggerToast('Password updated successfully!', 'success');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
      triggerToast(err.message || 'Failed to update password.', 'error');
    }
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    profileData,
    getInitials,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    passwordSuccess,
    passwordError,
    pushNotifs,
    setPushNotifs,
    emailNotifs,
    setEmailNotifs,
    darkMode,
    setDarkMode,
    savedSuccess,
    showToast,
    toastMessage,
    toastType,
    triggerToast,
    handleCustomAvatarUpload,
    handleSaveAvatarOnly,
    handlePasswordChange,
  };
};