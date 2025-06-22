import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? (
    <div>{children}</div>
  ) : (
    <Navigate to='/admin/login' />
  );
};

export default AdminProtectedRoute;
