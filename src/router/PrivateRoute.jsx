import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}