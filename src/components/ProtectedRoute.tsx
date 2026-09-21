import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from './BottomNav/BottomNav';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}

export function ProtectedNoNav() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
