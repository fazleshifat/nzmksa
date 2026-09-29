import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from './BottomNav/BottomNav';

export default function ProtectedRoute() {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normal user routes only
  if (role !== 'user') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}

// ============================================================================
// ADMIN ROUTE
// ============================================================================

export function AdminRoute() {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    role !== 'admin' &&
    role !== 'superadmin'
  ) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

// ============================================================================
// SUPER ADMIN ROUTE
// ============================================================================

export function SuperAdminRoute() {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'superadmin') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

// ============================================================================
// PROTECTED ROUTE WITHOUT BOTTOM NAV
// ============================================================================

export function ProtectedNoNav() {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return null;
  }

  // Normal user pages
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'user') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}