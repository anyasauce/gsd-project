import React from 'react';
import { AuthProvider, useAuth } from './pages/context/AuthContext';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Toaster } from './components/ui/sonner';


const AppContent: React.FC = () => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <p className="text-center mt-20">Checking login status...</p>;
  }

  return (
    <div className="min-h-screen">
      {user ? <Dashboard /> : <Login />}
      <Toaster />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}