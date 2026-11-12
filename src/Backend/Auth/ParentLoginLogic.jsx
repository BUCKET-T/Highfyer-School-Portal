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
      localStorage.removeItem('selected_parent_child');
      localStorage.removeItem('parent_children');
      localStorage.clear();

      await supabaseClient.auth.signOut();

      let parentProfile = null;

      // 1. Authenticate credentials via Supabase Auth or temp password fallback
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
        const { data: profileMatches, error: profileErr } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('email', emailOrId)
          .eq('temp_password', password);

        if (profileErr || !profileMatches || profileMatches.length === 0) {
          throw new Error(authError?.message || 'Invalid credentials. Please check your parent ID/email and password.');
        }

        parentProfile = profileMatches.find(p => p.is_active === false) || profileMatches[0];
      }

      if (!parentProfile) {
        throw new Error('User profile record not found.');
      }

      const lookupEmail = parentProfile.email || emailOrId;

      // 2. Fetch ALL pupil wards sharing this parent email FIRST
      let { data: matchedChildren, error: queryErr } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('email', lookupEmail)
        .eq('role', 'pupil');

      // 3. Fallback to RPC junction table if direct email query yields nothing
      if (queryErr || !matchedChildren || matchedChildren.length === 0) {
        const { data: rpcChildren, error: rpcErr } = await supabaseClient
          .rpc('get_parent_wards', { p_parent_id: parentProfile.id });

        if (!rpcErr && rpcChildren && rpcChildren.length > 0) {
          matchedChildren = rpcChildren;
        }
      }

      // 4. Strict Enforcement: Block if parent account is deactivated
      if (parentProfile.is_active === false) {
        await supabaseClient.auth.signOut();
        throw new Error('This parent account has been deactivated by school management.');
      }

      // 5. Strict Enforcement: Block if any linked pupil ward is deactivated
      const hasDeactivatedWard = matchedChildren && matchedChildren.some(child => child.is_active === false);
      if (hasDeactivatedWard) {
        await supabaseClient.auth.signOut();
        throw new Error('Access denied: One or more linked pupil wards have been deactivated.');
      }

      // 6. Strict Enforcement: Block if no linked pupils found
      if (!matchedChildren || matchedChildren.length === 0) {
        throw new Error('Access denied: This email is not linked to any registered pupil ward.');
      }

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