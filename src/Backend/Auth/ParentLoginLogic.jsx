import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  supabaseClient  from '../../config/supabaseClient';

export const useParentLoginLogic = () => {
  const navigate = useNavigate();
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    // Auto-dismiss error toasts after 4 seconds
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
      // 1. Check public.profiles first (supports shared parent emails & pupil profiles)
      const { data: profileMatches, error: profileErr } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('email', emailOrId)
        .eq('temp_password', password);

      if (!profileErr && profileMatches && profileMatches.length > 0) {
        showToast('Login successful! Redirecting to parent portal...', 'success');
        setTimeout(() => {
          navigate('/parent/dashboard');
        }, 1200);
        return;
      }

      // 2. Fallback to standard Supabase Auth signInWithPassword
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: emailOrId,
        password: password,
      });

      if (error) throw error;

      if (data?.user) {
        showToast('Login successful! Redirecting to parent portal...', 'success');
        setTimeout(() => {
          navigate('/parent/dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error('Parent login error:', err.message);
      showToast(err.message || 'Invalid credentials. Please check your parent ID/email and password.', 'error');
      setIsLoading(false);
    }
  };

  return {
    emailOrId,
    setEmailOrId,
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