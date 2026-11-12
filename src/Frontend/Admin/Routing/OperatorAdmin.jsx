import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Import Security Guard
import { ProtectedRoute } from "../../../config/ProtectedRoute";

// Import AdminLogin from src/Frontend/Landing Page/Auth/AdminLogin.jsx
import AdminLogin from "../../Landing Page/Auth/AdminLogin";

// Import Admin Sidebar Layout
import AdminSidebar from "../Components/AdminSidebar";

// Import Admin Dashboard Page
import AdminDashboard from "../Pages/AdminDashboard";
import UserManagement from "../Pages/UserManagement";
import AcademicApprovals from "../Pages/AcademicApprovals";
import SchoolBroadcasts from "../Pages/SchoolBroadcasts";
import AdminSettings from "../Pages/AdminSettings";
import CurriculumManager from "../Pages/CurriculumManager";

// Admin Layout Wrapper
const AdminLayout = () => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50/60 font-sans text-slate-800 antialiased lg:flex-row">
      {/* Left Navigation Sidebar / Mobile Top Header (Fixed/Contained width) */}
      <div className="z-20 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Dynamic View Area (Scrollable Independent Content) */}
      <main className="h-full min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const OperatorAdmin = () => {
  return (
    <Routes>
      {/* Default Route -> Redirect to login */}
      <Route path="/" element={<Navigate to="login" replace />} />

      {/* Standalone Admin Login Route (Public, No Protection) */}
      <Route path="login" element={<AdminLogin />} />

      {/* Authenticated Admin Portal (Guarded by ProtectedRoute) */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="approvals" element={<AcademicApprovals />} />
          <Route path="broadcasts" element={<SchoolBroadcasts />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="curriculum" element={<CurriculumManager />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default OperatorAdmin;