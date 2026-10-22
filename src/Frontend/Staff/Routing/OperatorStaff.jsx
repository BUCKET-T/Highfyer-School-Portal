import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Staff Login View
import LoginEffect from '../../Landing Page/Log/LoginEffect';

const OperatorStaff = () => {
  return (
    <Routes>
      {/* Default route redirects to staff login */}
      <Route path="/" element={<Navigate to="login" replace />} />

      {/* Staff Portal Routes */}
      <Route path="login" element={<LoginEffect />} />

      <Route 
        path="dashboard" 
        element={
          <div className="p-8 text-center text-xl font-bold text-brand-navy">
            Staff Dashboard & Roster Management
          </div>
        } 
      />

      {/* Fallback for unmapped staff paths */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default OperatorStaff;