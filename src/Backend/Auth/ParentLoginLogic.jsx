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
      // 1. Clear stale cache
      localStorage.removeItem('selected_parent_child');
      localStorage.removeItem('parent_children');
      localStorage.clear();

      await supabaseClient.auth.signOut();

      let parentProfile = null;

      // 2. Authenticate credentials via Supabase Auth
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
        // Fallback check for temp_password users
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

      if (!parentProfile) {
        throw new Error('User profile record not found.');
      }

      // 3. Query linked pupils securely via the relational junction table
      const { data: links, error: linkErr } = await supabaseClient
        .from('parent_pupil_links')
        .select('pupil_id')
        .eq('parent_id', parentProfile.id);

      if (linkErr) {
        throw new Error('Failed to verify linked ward records.');
      }

      let matchedChildren = [];
      if (links && links.length > 0) {
        const pupilIds = links.map(l => l.pupil_id);
        const { data: pupils, error: pupilErr } = await supabaseClient
          .from('profiles')
          .select('id, full_name, grade, avatar_url, roll_number, parent_guardian, role')
          .in('id', pupilIds)
          .eq('role', 'pupil');

        if (!pupilErr && pupils) {
          matchedChildren = pupils;
        }
      }

      // 4. Strict Enforcement: Block unlinked emails completely
      if (!matchedChildren || matchedChildren.length === 0) {
        throw new Error('Access denied: This email is not linked to any registered pupil ward.');
      }

      // Cache verified child records
      localStorage.setItem('parent_children', JSON.stringify(matchedChildren));
      localStorage.setItem('selected_parent_child', matchedChildren[0].id);

      showToast('Login successful! Redirecting to parent portal...', 'success');
      setTimeout(() => {
        navigate('/parent/dashboard');
      }, 1200);

    } catch (err) {
      console.error('Parent login error:', err.message);
      showToast(err.message || 'Invalid credentials or unlinked account.', 'error');
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