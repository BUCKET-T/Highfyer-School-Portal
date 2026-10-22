import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Admin Portal views/pages here as you build them
// import AdminDashboard from '../pages/AdminDashboard';

const OperatorAdmin = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />

      {/* Admin Portal Routes */}
      <Route 
        path="dashboard" 
        element={
          <div className="p-8 text-center text-xl font-bold text-brand-navy">
            Administrator Command Center & Roster Verification
          </div>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default OperatorAdmin;