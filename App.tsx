
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import SurveyGallery from './pages/SurveyGallery';
import AdminDashboard from './pages/AdminDashboard';
import CreateTemplate from './pages/CreateTemplate';
import TakeSurvey from './pages/TakeSurvey';
import UserProfilePage from './pages/UserProfile';
import SignIn from './pages/SignIn';
import { getSessionRole } from './utils/storage';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: UserRole }> = ({ children, allowedRole }) => {
  const role = getSessionRole();
  if (!role) return <Navigate to="/signin" replace />;
  if (role !== allowedRole) return <Navigate to={role === UserRole.ADMIN ? '/admin' : '/'} replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const role = getSessionRole();
  const location = useLocation();

  if (!role && location.pathname !== '/signin') {
    return <Navigate to="/signin" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        
        {/* User Routes */}
        <Route path="/" element={
          <ProtectedRoute allowedRole={UserRole.USER}>
            <SurveyGallery />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRole={UserRole.USER}>
            <UserProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/survey/:id" element={
          <ProtectedRoute allowedRole={UserRole.USER}>
            <TakeSurvey />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole={UserRole.ADMIN}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/create" element={
          <ProtectedRoute allowedRole={UserRole.ADMIN}>
            <CreateTemplate />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default App;
