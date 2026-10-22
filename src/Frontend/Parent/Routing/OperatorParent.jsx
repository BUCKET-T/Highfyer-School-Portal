import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Parent Portal views
import LoginEffect from '../../Landing Page/Log/LoginEffect';

const OperatorParent = () => {
  return (
    <Routes>
      {/* Default redirect to login page */}
      <Route path="/" element={<Navigate to="login" replace />} />
      
      {/* Parent Portal Routes */}
      <Route path="login" element={<LoginEffect />} />

      <Route 
        path="dashboard" 
        element={
          <div className="p-8 text-center text-xl font-bold text-brand-navy">
            Parent Dashboard & Child Academic Progress
          </div>
        } 
      />

      {/* Fallback for unmapped parent paths */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default OperatorParent;