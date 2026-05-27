import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Success } from './pages/Success';
import { VerifyEmail } from './pages/VerifyEmail';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';

// Route guards
const UserProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Save pending redirect
    localStorage.setItem('swj_pending', JSON.stringify({ url: location.pathname + location.search }));
    return <Navigate to="/login" replace />;
  }

  // Check if they are pending email verification OTP
  if (user.isPendingOTP && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser } = useAuth();

  if (!adminUser) {
    return <Navigate to="/login?admin=true" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bg text-textPrimary relative">
      {/* Soft Premium Google Tonal Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-primary/5 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none" />

      <Navbar />
      
      {/* Page content wrapper */}
      <main className="flex-grow pt-16 z-10 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/success" element={<Success />} />
          <Route 
            path="/verify-email" 
            element={
              <UserProtectedRoute>
                <VerifyEmail />
              </UserProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <UserProtectedRoute>
                <Dashboard />
              </UserProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <Admin />
              </AdminProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
