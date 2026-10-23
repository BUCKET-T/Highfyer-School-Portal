import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Staff Sidebar Component
import StaffSidebar from '../Components/StaffSidebar';

// Import Staff Pages
import StaffDashboard from '../Pages/StaffDashboard';
import Attendance from '../Pages/Attendance';
import Gradebook from '../Pages/Gradebook';

// Import Staff Login View
import LoginEffect from '../../Landing Page/Log/LoginEffect';

// Layout wrapper for authenticated staff pages (Manages collapsible sidebar state)
const StaffLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 w-full overflow-x-hidden">
      {/* Persistent Staff Sidebar (Handles both desktop fixed aside and mobile sticky header) */}
      <StaffSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Viewport (Full width on mobile, dynamic left padding on desktop) */}
      <main className={`w-full ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'} min-h-screen transition-all duration-300`}>
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
        <Route path="attendance" element={<Attendance />} />
        <Route path="gradebook" element={<Gradebook />} />
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