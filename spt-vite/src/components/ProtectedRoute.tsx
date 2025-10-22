import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, handleAuthError } from '../lib/auth';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (!isAuthenticated()) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      const user = await getCurrentUser();
      if (user) {
        setIsAuth(true);
      } else {
        handleAuthError(); 
        setIsAuth(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [location, navigate]); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
