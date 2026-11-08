import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../../config/supabaseClient';

export const useAdminLoginLogic = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToast({ message: '', type: '', visible: false });

    try {
      // 1. Wipe previous session items to avoid active ID collisions
      sessionStorage.removeItem('active_admin_id');

      // 2. Authenticate first with standard Supabase Auth
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: adminEmail,
        password: password,
      });

      let userId = authData?.user?.id;

      // 3. Fallback check for temporary password match in profiles
      if (authError || !userId) {
        const { data: profileMatch, error: profileErr } = await supabaseClient
          .from('profiles')
          .select('*')
          .ilike('email', adminEmail.trim())
          .eq('temp_password', password)
          .maybeSingle();

        if (profileErr || !profileMatch) {
          throw new Error('Invalid credentials. Please check your admin email and password.');
        }
        userId = profileMatch.id;
      }

      // 4. Fetch all profile rows associated with this user ID or email
      const { data: profiles, error: profQueryErr } = await supabaseClient
        .from('profiles')
        .select('*')
        .or(`id.eq.${userId},email.ilike.${adminEmail.trim()}`);

      if (profQueryErr || !profiles || profiles.length === 0) {
        throw new Error('User profile record not found.');
      }

      // 5. Filter specifically for the administrative record
      const adminProfile = profiles.find((p) => {
        const r = (p.role || '').toLowerCase();
        const t = (p.role_title || '').toLowerCase();
        return r === 'admin' || r.includes('admin') || t.includes('admin') || t.includes('assistant');
      });

      if (!adminProfile) {
        await supabaseClient.auth.signOut();
        throw new Error('Access Denied: This account lacks administrative privileges.');
      }

      // 6. Store active admin ID to bind sidebar and settings views
      sessionStorage.setItem('active_admin_id', adminProfile.id);

      showToast('Login successful! Redirecting to admin central...', 'success');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1200);

    } catch (err) {
      console.error('Admin login error:', err.message);
      showToast(err.message || 'Invalid credentials. Please check your admin email and password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    adminEmail,
    setAdminEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    toast,
    handleLogin,
  };
};