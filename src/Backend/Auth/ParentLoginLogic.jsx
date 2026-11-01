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
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Check your existing public.profiles table (matching your pre-existing columns)
      const { data: profileMatches, error: profileErr } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('email', emailOrId) // Matches your email field if added, or fallback to full_name
        .eq('temp_password', password);

      if (!profileErr && profileMatches && profileMatches.length > 0) {
        navigate('/parent/dashboard');
        return;
      }

      // 2. Fallback to standard Supabase Auth signInWithPassword
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: emailOrId,
        password: password,
      });

      if (error) throw error;

      if (data?.user) {
        navigate('/parent/dashboard');
      }
    } catch (err) {
      console.error('Parent login error:', err.message);
      setErrorMsg(err.message || 'Invalid credentials. Please check your details.');
    } finally {
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
    errorMsg,
    handleSubmit,
  };
};