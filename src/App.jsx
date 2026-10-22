import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './Frontend/Landing Page/utils/ScrollToTop';
import Operator from './Frontend/Routing/Operator';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Operator />
    </Router>
  );
}