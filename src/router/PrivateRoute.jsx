import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ children, requiredRole }) {
  const { user, loading, getUserRole } = useAuth();

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && getUserRole() !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}