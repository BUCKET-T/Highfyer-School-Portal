import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import supabaseClient from './supabaseClient';

export const ProtectedRoute = ({ allowedRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        
        if (sessionError || !session) {
          setIsAuthenticated(false);
          setIsAuthorized(false);
          return;
        }

        setIsAuthenticated(true);

        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('role, role_title, is_active')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError || !profile || profile.is_active === false) {
          await supabaseClient.auth.signOut();
          setIsAuthorized(false);
          return;
        }

        const userRole = (profile.role || '').toLowerCase();
        const roleTitle = (profile.role_title || '').toLowerCase();

        // Role verification logic
        if (allowedRole === 'educator') {
          if (userRole !== 'educator') {
            setIsAuthorized(false);
            return;
          }
        } else if (allowedRole === 'admin') {
          const isAdmin = 
            userRole === 'admin' || 
            userRole === 'super_admin' || 
            roleTitle.includes('admin') || 
            roleTitle.includes('principal');
          if (!isAdmin) {
            setIsAuthorized(false);
            return;
          }
        } else if (allowedRole === 'pupil') {
          if (userRole !== 'pupil') {
            setIsAuthorized(false);
            return;
          }
        } else if (allowedRole && userRole !== allowedRole.toLowerCase()) {
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error('Route protection error:', err);
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
    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
};