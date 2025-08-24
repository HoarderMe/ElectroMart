import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// roles: array of allowed roles, e.g. ['customer'], ['admin']
const ProtectedRoute = ({ roles = [], children }) => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();

  // not signed in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // if roles specified and user.role not allowed
  if (roles.length > 0 && !roles.includes(user.role)) {
    // you could redirect to a 403 page or home
    return <Navigate to="/" replace />;
  }

  // authorized
  return children;
};

export default ProtectedRoute;
