import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Router, navigate } from './components/Router';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Cars } from './pages/Cars';
import { V2GMarketplace } from './pages/V2GMarketplace';
import { useEffect } from 'react';

function AppRoutes() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const currentPath = window.location.hash.slice(1);
      if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
        navigate('/dashboard');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <Router
      routes={{
        '/': <Landing />,
        '/login': <Login />,
        '/register': <Register />,
        '/dashboard': user ? <Dashboard /> : <Login />,
        '/cars': user ? <Cars /> : <Login />,
        '/v2g': user ? <V2GMarketplace /> : <Login />,
      }}
      defaultRoute="/"
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
