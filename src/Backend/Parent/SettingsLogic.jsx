import { useState, useEffect } from 'react';
import  supabase from '../../config/supabaseClient';

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
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          let targetProfile = null;

          // 1. Try matching by exact ID or email
          const { data: directMatch } = await supabase
            .from('profiles')
            .select('*')
            .or(`id.eq.${user.id},email.eq.${user.email}`)
            .maybeSingle();

          if (directMatch) {
            targetProfile = directMatch;
          } else {
            // 2. Fallback to fetch the first pupil profile record
            const { data: pupilMatch } = await supabase
              .from('profiles')
              .select('*')
              .eq('role', 'pupil')
              .limit(1)
              .maybeSingle();

            if (pupilMatch) {
              targetProfile = pupilMatch;
            }
          }

          if (targetProfile) {
            setProfileData({
              id: targetProfile.id,
              full_name: targetProfile.full_name || '',
              grade: targetProfile.grade || '',
              parent_guardian: targetProfile.parent_guardian || '',
              email: targetProfile.email || user.email || '',
              phone: targetProfile.phone || '',
              home_address: targetProfile.home_address || '',
              avatar_url: targetProfile.avatar_url || null,
            });
          }
        }
      } catch (err) {
        console.error('Error loading parent profile from profiles table:', err);
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
        alert('File size exceeds 500KB limit. Please choose a smaller image.');
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

      if (error) {
        console.error('Supabase update error details:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Update affected 0 rows. Please check Row Level Security (RLS) policies on the profiles table.');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile avatar:', err.message || err);
      alert(`Failed to save avatar: ${err.message || 'Check console for details.'}`);
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