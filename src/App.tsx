import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';

// Import Pages
import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import PlannerPage from './pages/PlannerPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import FindProfessionalPage from './pages/FindProfessionalPage';

import MainLayout from './components/MainLayout';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/planner" element={<MainLayout><PlannerPage /></MainLayout>} />
          <Route path="/find-professionals" element={<MainLayout><FindProfessionalPage /></MainLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;