import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login'
}) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 text-sm text-slate-600 shadow-soft-card">
          Checking your session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin/orders' : '/'} replace />;
  }

  return children;
}
