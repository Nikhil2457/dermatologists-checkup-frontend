import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
/**
 * ProtectedRoute for role-based access
 * @param {ReactNode} children - The component to render if access is allowed
 * @param {string} requiredRole - The role required to access this route (e.g., 'patient', 'dermatologist')
 * @param {string} redirectTo - The path to redirect to if access is denied
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = '/' }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  useEffect(() => {
    // Only show the toast if not coming directly from signup
    const justSignedUp = sessionStorage.getItem('justSignedUp');
    if ((!token || role !== requiredRole) && !justSignedUp) {
      if (requiredRole === 'patient') {
        toast.error('You are not logged in with patient credentials.');
      } else if (requiredRole === 'dermatologist') {
        toast.error('You are not logged in with dermatologist credentials.');
      } else {
        toast.error('You are not authorized to access this page.');
      }
    }
    // Clear the flag after first redirect
    if (justSignedUp) {
      sessionStorage.removeItem('justSignedUp');
    }
    // eslint-disable-next-line
  }, [token, role, requiredRole, location.pathname]);

  if (!token || role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute; 