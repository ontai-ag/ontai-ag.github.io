
import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppAuth, UserRole } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectPath 
}) => {
  const { isAuthenticated, hasRole, isLoading, getDashboardPath, userRole } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // For debugging
  useEffect(() => {
    console.log(`ProtectedRoute at ${location.pathname}:`);
    console.log('- isAuthenticated:', isAuthenticated);
    console.log('- isLoading:', isLoading);
    console.log('- userRole:', userRole);
    console.log('- allowedRoles:', allowedRoles);
    console.log('- redirectPath:', redirectPath);
    console.log('- getDashboardPath():', getDashboardPath());

    if (allowedRoles) {
      console.log('- hasRole result:', hasRole(allowedRoles));
    }
  }, [allowedRoles, location.pathname, isAuthenticated, isLoading, userRole, redirectPath, getDashboardPath, hasRole]);

  // Show loading state while authentication is being determined
  if (isLoading) {
    console.log('ProtectedRoute: Loading state, showing spinner');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated, redirect to sign-in with the current location as redirect after login
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to sign-in');
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  if (allowedRoles && !hasRole(allowedRoles)) {
    // Show toast notification about insufficient permissions
    toast({
      title: "Access Denied",
      description: `You need ${allowedRoles.join(' or ')} permissions to access this page.`,
      variant: "destructive",
    });
    
    // Get the appropriate dashboard path based on user's role
    const path = redirectPath || getDashboardPath();
    console.log(`User does not have required role(s) ${allowedRoles}, redirecting to ${path}`);
    
    // Use a slight delay to ensure the toast is visible before redirecting
    setTimeout(() => {
      navigate(path, { replace: true });
    }, 100);
    
    // Show loading spinner while waiting for redirect
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User is authenticated and has the required role
  console.log('User has required permissions, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
