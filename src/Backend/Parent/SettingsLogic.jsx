import { useState, useEffect } from 'react';
import  supabase  from '../../config/supabaseClient';

export const useSettingsLogic = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    id: '',
    full_name: '',
    grade: '',
    parent_guardian: '',
    email: '',
    phone: '',
    home_address: '',
    avatar_url: null,
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [largerText, setLargerText] = useState(false);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        // 1. Read the selected child ID stored during login in localStorage
        const selectedChildId = localStorage.getItem('selected_parent_child');
        let targetChild = null;

        if (selectedChildId) {
          const { data: cachedChild } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', selectedChildId)
            .maybeSingle();

          if (cachedChild) {
            targetChild = cachedChild;
          }
        }

        // 2. Fallback check: If no localStorage cache, check array of parent_children
        if (!targetChild) {
          const storedChildren = localStorage.getItem('parent_children');
          if (storedChildren) {
            const parsedChildren = JSON.parse(storedChildren);
            if (parsedChildren && parsedChildren.length > 0) {
              targetChild = parsedChildren[0];
            }
          }
        }

        // 3. Direct override fallback for educator ojotee346@gmail.com
        if (!targetChild) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email === 'ojotee346@gmail.com' || localStorage.getItem('parent_children')) {
            const { data: mercyRecord } = await supabase
              .from('profiles')
              .select('*')
              .eq('full_name', 'Mercy Ojo')
              .maybeSingle();
            if (mercyRecord) targetChild = mercyRecord;
          }
        }

        if (targetChild) {
          setProfileData({
            id: targetChild.id,
            full_name: targetChild.full_name || '',
            grade: targetChild.grade || '',
            parent_guardian: targetChild.parent_guardian || '',
            email: targetChild.email || '',
            phone: targetChild.phone || '',
            home_address: targetChild.home_address || '',
            avatar_url: targetChild.avatar_url || null,
          });
        }
      } catch (err) {
        console.error('Error loading profile settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('File size exceeds 500KB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatarOnly = async (e) => {
    e.preventDefault();
    if (!profileData.id) {
      alert('Error: No profile ID found to update.');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileData.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Update affected 0 rows. Check RLS policies.');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile avatar:', err.message || err);
      alert(`Failed to save avatar: ${err.message || 'Check console.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (oldPassword && newPassword) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;

        setPasswordSuccess(true);
        setOldPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordSuccess(false), 3000);
      } catch (err) {
        setPasswordError(err.message || 'Failed to update password.');
      }
    }
  };

  return {
    activeTab, setActiveTab,
    isLoading, isSaving,
    profileData,
    getInitials,
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    showOldPassword, setShowOldPassword,
    showNewPassword, setShowNewPassword,
    passwordSuccess, passwordError,
    largerText, setLargerText,
    pushNotifs, setPushNotifs,
    emailNotifs, setEmailNotifs,
    darkMode, setDarkMode,
    savedSuccess,
    handleCustomAvatarUpload,
    handleSaveAvatarOnly,
    handlePasswordChange,
  };
};