import React, { Suspense, lazy } from 'react'; // 1. Import Suspense & lazy
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Import Loader icon
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';

import MainLayout from './components/MainLayout';

// 2. Lazy Load Pages (Instead of standard imports)
const HomePage = lazy(() => import('./pages/HomePage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PlannerPage = lazy(() => import('./pages/PlannerPage'));
const FindProfessionalPage = lazy(() => import('./pages/FindProfessionalPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 3. Create a Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
    <p className="mt-4 text-sm font-medium text-slate-500">Loading...</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        
        {/* 4. Wrap Routes in Suspense */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/planner" element={<MainLayout><PlannerPage /></MainLayout>} />
            <Route path="/find-professionals" element={<MainLayout><FindProfessionalPage /></MainLayout>} />
            
            {/* Standalone Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

      </AuthProvider>
    </Router>
  );
}

export default App;