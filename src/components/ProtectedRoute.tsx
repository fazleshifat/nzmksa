import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from './BottomNav/BottomNav';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}

export function ProtectedNoNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}