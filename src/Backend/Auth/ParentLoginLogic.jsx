import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../../config/supabaseClient';

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
      // 1. Clear stale parent session and multi-child cache from previous logins
      localStorage.removeItem('selected_parent_child');
      localStorage.removeItem('parent_children');
      localStorage.clear();

      // 2. Sign out any existing session
      await supabaseClient.auth.signOut();

      let parentProfile = null;

      // 3. Attempt standard Supabase Auth login
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: emailOrId,
        password: password,
      });

      if (!authError && authData?.user) {
        const { data: prof } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();
        parentProfile = prof;
      } else {
        // 4. Fallback check for temp_password users in profiles table
        const { data: profileMatches, error: profileErr } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('email', emailOrId)
          .eq('temp_password', password)
          .maybeSingle();

        if (profileErr || !profileMatches) {
          throw new Error(authError?.message || 'Invalid credentials. Please check your parent ID/email and password.');
        }

        parentProfile = profileMatches;
      }

      // 5. Query and cache all children linked to this parent
      if (parentProfile) {
        const parentName = parentProfile.full_name;
        const parentEmail = parentProfile.email;

        let query = supabaseClient
          .from('profiles')
          .select('id, full_name, grade, avatar_url, roll_number')
          .eq('role', 'pupil');

        if (parentName) {
          query = query.ilike('parent_guardian', `%${parentName}%`);
        } else if (parentEmail) {
          query = query.ilike('parent_guardian', `%${parentEmail}%`);
        }

        const { data: children, error: childErr } = await query;

        if (!childErr && children && children.length > 0) {
          localStorage.setItem('parent_children', JSON.stringify(children));
          localStorage.setItem('selected_parent_child', children[0].id);
        } else {
          localStorage.setItem('parent_children', JSON.stringify([]));
        }
      }

      showToast('Login successful! Redirecting to parent portal...', 'success');
      setTimeout(() => {
        navigate('/parent/dashboard');
      }, 1200);

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