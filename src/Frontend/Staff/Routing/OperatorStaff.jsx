import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Staff Sidebar Component
import StaffSidebar from '../Components/StaffSidebar';

// Import Staff Pages
import StaffDashboard from '../Pages/StaffDashboard';

// Import Staff Login View
import LoginEffect from '../../Landing Page/Log/LoginEffect';

// Layout wrapper for authenticated staff pages (Includes persistent StaffSidebar)
const StaffLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50/60">
      {/* Persistent Staff Sidebar */}
      <StaffSidebar />

      {/* Main Content Viewport (Padded left on desktop for fixed sidebar width) */}
      <main className="flex-1 lg:pl-64 w-full min-w-0 transition-all">
        <Outlet />
      </main>
    </div>
  );
};

const OperatorStaff = () => {
  return (
    <Routes>
      {/* Default route redirects to staff dashboard or login */}
      <Route path="/" element={<Navigate to="dashboard" replace />} />

      {/* Standalone Login Route (No Sidebar) */}
      <Route path="login" element={<LoginEffect />} />

      {/* Authenticated Staff Portal Layout Group */}
      <Route element={<StaffLayout />}>
        <Route path="dashboard" element={<StaffDashboard />} />
        
        {/* Placeholder routes for upcoming staff pages */}
        <Route path="attendance" element={<div className="p-8 font-extrabold text-brand-navy">Attendance Page</div>} />
        <Route path="gradebook" element={<div className="p-8 font-extrabold text-brand-navy">Gradebook Page</div>} />
        <Route path="assignments" element={<div className="p-8 font-extrabold text-brand-navy">Manage Assignments Page</div>} />
        <Route path="roster" element={<div className="p-8 font-extrabold text-brand-navy">Class Roster Page</div>} />
        <Route path="feed" element={<div className="p-8 font-extrabold text-brand-navy">Staff Feed Page</div>} />
        <Route path="settings" element={<div className="p-8 font-extrabold text-brand-navy">Staff Settings Page</div>} />
      </Route>

      {/* Fallback for unmapped staff paths */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default OperatorStaff;