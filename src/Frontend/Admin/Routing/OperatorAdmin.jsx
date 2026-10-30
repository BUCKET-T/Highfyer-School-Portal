import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import AdminLogin from src/Frontend/Landing Page/Log/AdminLogin.jsx
import AdminLogin from '../../Landing Page/Log/AdminLogin';

// Import Admin Sidebar Layout
import AdminSidebar from '../Components/AdminSidebar';

// Import Admin Dashboard Page
import AdminDashboard from '../Pages/AdminDashboard';
import UserManagement from '../Pages/UserManagement';
import AcademicApprovals from '../Pages/AcademicApprovals';
import SchoolBroadcasts from '../Pages/SchoolBroadcasts';
import AdminSettings from '../Pages/AdminSettings';

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
          <div className="flex flex-col lg:flex-row h-screen w-screen bg-slate-50/60 font-sans antialiased text-slate-800 overflow-hidden">
            {/* Left Navigation Sidebar / Mobile Top Header (Fixed/Contained width) */}
            <div className="flex-shrink-0 z-20">
              <AdminSidebar />
            </div>

            {/* Main Dynamic View Area (Scrollable Independent Content) */}
            <main className="flex-1 min-w-0 h-full overflow-y-auto">
              <Routes>
                {/* Admin Dashboard */}
                <Route path="dashboard" element={<AdminDashboard />} />

                {/* User Management */}
                <Route path="users" element={<UserManagement />} />

                {/* Academic Approvals */}
                <Route path="approvals" element={<AcademicApprovals />} />

                {/* School Broadcasts */}
                <Route path="broadcasts" element={<SchoolBroadcasts />} />

                {/* System Settings */}
                <Route path="settings" element={<AdminSettings />} />

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