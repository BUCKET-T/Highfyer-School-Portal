import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import supabaseClient from './supabaseClient';

export const ProtectedRoute = ({ allowedRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        console.log('--- PROTECTED ROUTE CHECK ---');
        console.log('Target allowedRole:', allowedRole);

        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        
        if (sessionError || !session) {
          console.warn('Auth session failed or missing:', sessionError);
          setIsAuthenticated(false);
          setIsAuthorized(false);
          return;
        }

        console.log('Session found for user ID:', session.user.id);
        setIsAuthenticated(true);

        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('role, role_title, is_active')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error from Supabase:', profileError);
        }

        console.log('Fetched profile record:', profile);

        if (profileError || !profile || profile.is_active === false) {
          console.warn('Profile invalid or inactive. Signing out.');
          await supabaseClient.auth.signOut();
          setIsAuthorized(false);
          return;
        }

        const userRole = (profile.role || '').toLowerCase();
        const roleTitle = (profile.role_title || '').toLowerCase();
        console.log('Normalized userRole:', userRole, '| Normalized roleTitle:', roleTitle);

        // Role verification logic
        let authorized = false;
        if (allowedRole === 'educator') {
          authorized = userRole === 'educator';
        } else if (allowedRole === 'admin') {
          authorized = 
            userRole === 'admin' || 
            userRole === 'super_admin' || 
            roleTitle.includes('admin') || 
            roleTitle.includes('principal');
        } else if (allowedRole === 'pupil') {
          authorized = userRole === 'pupil';
        } else if (allowedRole === 'parent') {
          authorized = ['educator', 'guardian', 'pupil'].includes(userRole);
        } else if (allowedRole) {
          authorized = userRole === allowedRole.toLowerCase();
        }

        console.log('Authorization check result:', authorized);
        setIsAuthorized(authorized);

      } catch (err) {
        console.error('Route protection unexpected error:', err);
        setIsAuthenticated(false);
        setIsAuthorized(false);
      }
    };

    verifyAccess();
  }, [allowedRole]);

  if (isAuthenticated === null || isAuthorized === null) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <p style={{ fontFamily: 'sans-serif', color: '#64748b', fontSize: '15px' }}>Verifying security credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAuthorized) {
    let loginPath = '/parent/login';
    if (allowedRole === 'educator') {
      loginPath = '/staff/login';
    } else if (allowedRole === 'admin') {
      loginPath = '/admin/login';
    }
    console.warn(`Access denied. Redirecting to: ${loginPath}`);
    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
};