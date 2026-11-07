import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../../config/supabaseClient';

export const useStaffLoginLogic = () => {
  const navigate = useNavigate();
  const [staffIdOrEmail, setStaffIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    if (type === 'error') {
      setTimeout(() => {
        setToast((prev) => (prev.type === 'error' ? { ...prev, visible: false } : prev));
      }, 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToast({ message: '', type: '', visible: false });

    try {
      // 1. Wipe all stale local storage items from previous logins
      localStorage.removeItem('selected_staff_class');
      localStorage.clear();

      // 2. Sign out any active Supabase session to start clean
      await supabaseClient.auth.signOut();

      let authUser = null;

      // 3. Attempt standard Supabase Auth login
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: staffIdOrEmail,
        password: password,
      });

      if (!authError && authData?.user) {
        authUser = authData.user;
      } else {
        // 4. Fallback check for temp_password users
        const { data: profileMatches, error: profileErr } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('email', staffIdOrEmail)
          .eq('temp_password', password)
          .maybeSingle();

        if (profileErr || !profileMatches) {
          throw new Error(authError?.message || 'Invalid credentials. Please check your email and password.');
        }

        authUser = profileMatches;
      }

      // 5. Fetch the authentic profile for the logged-in user ID
      const targetUserId = authUser.id;
      const { data: userProf } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .maybeSingle();

      if (userProf) {
        // Parse assigned classes for this specific user
        let classesList = [];
        const rawSource = userProf.assigned_classes || userProf.grade;

        if (Array.isArray(rawSource)) {
          classesList = rawSource;
        } else if (typeof rawSource === 'string') {
          classesList = rawSource.split(',').map((c) => c.trim()).filter(Boolean);
        }

        if (classesList.length > 0) {
          localStorage.setItem('selected_staff_class', classesList[0]);
        }
      }

      showToast('Login successful! Redirecting to staff portal...', 'success');
      setTimeout(() => {
        navigate('/staff/dashboard');
      }, 1200);

    } catch (err) {
      console.error('Staff login error:', err.message);
      showToast(err.message || 'Invalid credentials. Please check your email and password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    staffIdOrEmail,
    setStaffIdOrEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    toast,
    handleSubmit,
  };
};