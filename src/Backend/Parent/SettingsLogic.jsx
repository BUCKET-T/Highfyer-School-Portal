import { useState, useEffect } from 'react';
import  supabase  from '../../config/supabaseClient';

export const useSettingsLogic = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields directly bound to `public.profiles` schema
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

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Preference toggles
  const [largerText, setLargerText] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Derive 2-letter initials directly from student's full name
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
          // Fetch from public.profiles table matching logged-in user id or email
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, grade, parent_guardian, email, phone, home_address, avatar_url')
            .or(`id.eq.${user.id},email.eq.${user.email}`)
            .single();

          if (data && !error) {
            setProfileData({
              id: data.id || user.id,
              full_name: data.full_name || '',
              grade: data.grade || '',
              parent_guardian: data.parent_guardian || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              home_address: data.home_address || '',
              avatar_url: data.avatar_url || null,
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

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 300 * 1024) {
        alert('File size exceeds maximum limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          parent_guardian: profileData.parent_guardian,
          email: profileData.email,
          phone: profileData.phone,
          home_address: profileData.home_address,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileData.id);

      if (error) throw error;

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profiles table:', err);
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
    profileData, handleInputChange,
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
    handleSaveSettings,
    handlePasswordChange,
  };
};