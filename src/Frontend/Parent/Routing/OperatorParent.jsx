import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Login view
import LoginEffect from '../../Landing Page/Log/LoginEffect';

// Import Sidebar component
import Sidebar from '../Components/Sidebar';

// Import Parent Portal pages
import Dashboard from '../Pages/Dashboard';
import MyCourses from '../Pages/MyCourses';
import Results from '../Pages/Result';
import Assignments from '../Pages/Assignments'; 

// Parent Layout Wrapper: Locks viewport height so sidebar stays fixed while main content scrolls independently
const ParentLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 w-full min-w-0 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const OperatorParent = () => {
  return (
    <Routes>
      {/* Default redirect to login page */}
      <Route path="/" element={<Navigate to="login" replace />} />
      
      {/* Standalone Login Route (No Sidebar) */}
      <Route path="login" element={<LoginEffect />} />

      {/* Authenticated Parent Portal (Wrapped with Responsive Layout) */}
      <Route element={<ParentLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="results" element={<Results />} />
      </Route>

      {/* Fallback for unmapped parent paths */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default OperatorParent;