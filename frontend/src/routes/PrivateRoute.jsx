/**
 * PrivateRoute - Protects routes that require authentication
 *
 * TEACHING NOTE:
 * If the user is not logged in, redirect them to /login.
 * We also pass the current location so after login we can redirect back.
 * <Outlet /> renders the child route component if auth passes.
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not authenticated: redirect to login, remember where they were going
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated: render the child route
  return <Outlet />;
};

export default PrivateRoute;
