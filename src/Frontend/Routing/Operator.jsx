import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Scroll Effect
import ScrollRevealSection from '../Landing Page/utils/ScrollRevealSection';

// Persistent Layout Elements
import Navbar from '../Landing Page/components/Navbar';
import Footer from '../Landing Page/components/Footer';

// Public Landing Page Sections
import HeroSection from '../Landing Page/components/HeroSection';
import AboutSection from '../Landing Page/components/AboutSection';
import IdentitySection from '../Landing Page/components/IdentitySection';
import Philosophy from '../Landing Page/components/Philosophy';
import CurriculumSection from '../Landing Page/components/CurriculumSection';
import ContactSection from '../Landing Page/components/ContactSection';

// Sub-Router Module Imports
import OperatorParent from '../../Frontend/Parent/Routing/OperatorParent';
import OperatorStaff from '../../Frontend/Staff/Routing/OperatorStaff';
import OperatorAdmin from '../../Frontend/Admin/Routing/OperatorAdmin';

// Assets
import schoolLogo from '../../assets/logo.png'; 

const Operator = () => {
  const location = useLocation();

  // Check if the current route is strictly a public page ('/' or '/about')
  const isPublicPage = location.pathname === '/' || location.pathname === '/about';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Header Navigation - Rendered ONLY on public landing/about pages */}
      {isPublicPage && <Navbar logoSrc={schoolLogo} />}

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          {/* Public Home / Landing Page */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSection />

                <ScrollRevealSection>
                  <CurriculumSection />  
                </ScrollRevealSection>

                <ScrollRevealSection>
                  <IdentitySection />
                </ScrollRevealSection>

                <ScrollRevealSection>
                  <Philosophy />
                </ScrollRevealSection>

                <ScrollRevealSection>
                  <ContactSection />
                </ScrollRevealSection>
              </>
            } 
          />

          {/* Dedicated About Page */}
          <Route 
            path="/about" 
            element={
              <div className="pt-6">
                <AboutSection />
                <Philosophy />
              </div>
            } 
          />

          {/* Modular Sub-Router Delegates */}
          <Route path="/parent/*" element={<OperatorParent />} />
          <Route path="/staff/*" element={<OperatorStaff />} />
          <Route path="/admin/*" element={<OperatorAdmin />} />
        </Routes>
      </main>

      {/* Persistent Footer - Rendered ONLY on public landing/about pages */}
      {isPublicPage && <Footer logoSrc={schoolLogo} />}
    </div>
  );
};

export default Operator;