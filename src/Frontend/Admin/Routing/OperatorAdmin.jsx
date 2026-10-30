import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import AdminLogin from src/Frontend/Landing Page/Log/AdminLogin.jsx
import AdminLogin from '../../Landing Page/Log/AdminLogin';

// Import Admin Sidebar Layout
import AdminSidebar from '../Components/AdminSidebar';

// Import Admin Dashboard Page
import AdminDashboard from '../Pages/AdminDashboard';
import UserManagement from '../Pages/UserManagement';

const OperatorAdmin = () => {
  return (
    <Routes>
      {/* Default Route -> Redirect to login */}
      <Route path="/" element={<Navigate to="login" replace />} />

      {/* Standalone Admin Login Route (Full Screen, No Sidebar) */}
      <Route path="login" element={<AdminLogin />} />

      {/* Internal Admin Routes (Wrapped with Admin Sidebar Layout) */}
      <Route
        path="*"
        element={
          <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 overflow-x-hidden">
            {/* Left Navigation Sidebar / Mobile Top Header */}
            <AdminSidebar />

            {/* Main Dynamic View Area */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <Routes>
                {/* Admin Dashboard */}
                <Route path="dashboard" element={<AdminDashboard />} />

                {/* User Management Placeholder */}
                <Route path="users" element={<UserManagement />} />


                {/* Academic Approvals Placeholder */}
                <Route
                  path="approvals"
                  element={
                    <div className="p-8 text-center text-xl font-bold text-brand-navy">
                      Academic Approvals & Gradebook Review
                    </div>
                  }
                />

                {/* School Broadcasts Placeholder */}
                <Route
                  path="broadcasts"
                  element={
                    <div className="p-8 text-center text-xl font-bold text-brand-navy">
                      School Broadcasts & Directives Hub
                    </div>
                  }
                />

                {/* System Settings Placeholder */}
                <Route
                  path="settings"
                  element={
                    <div className="p-8 text-center text-xl font-bold text-brand-navy">
                      Calendar Configuration & System Settings
                    </div>
                  }
                />

                {/* Internal Fallback Redirect */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
};

export default OperatorAdmin;