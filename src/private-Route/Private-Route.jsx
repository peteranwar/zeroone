// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/layout';
import { usePermission } from '../constants';

function PrivateRoute({ permission, children }) {
  const auth = localStorage.getItem('token');

  // Optional: If you're checking permissions
  const { haveAccess } = usePermission();

  console.log('permission xx',permission)
  if (permission && !haveAccess(permission)) {
    return <Navigate to="/" />;
  }

  if (!auth || auth === 'null') {
    return <Navigate to='/login' replace />;
  }

  return <Layout>{children}</Layout>;
}

export default PrivateRoute;
