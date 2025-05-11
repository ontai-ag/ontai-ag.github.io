
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Session {
  token: string;
  user: User;
}
import { useToast } from '@/hooks/use-toast';

// Define our roles
export type UserRole = 'user' | 'developer' | 'admin';

// Interface for the profile data
interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
}

// Interface for the auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userRole: UserRole;
  userMetadata: ProfileData | null;
  user: User | null;
  session: Session | null;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  updateRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  getDashboardPath: () => string;
}

// Default auth context
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  userRole: 'user',
  userMetadata: null,
  user: null,
  session: null,
  hasRole: () => false,
  updateRole: async () => {},
  signOut: async () => {},
  getDashboardPath: () => '/dashboard',
};

// Create the context
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [userMetadata, setUserMetadata] = useState<ProfileData | null>(null);
  const { toast } = useToast();

  // This flag helps prevent auto sign-in after sign-out
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // Skip session check if we're in the process of signing out
    if (isSigningOut) {
      console.log('Skipping session check during sign-out process');
      return;
    }

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // Инициализируем authService
        authService.init();

        if (authService.isAuthenticated()) {
          // Получаем данные текущего пользователя
          const userData = await authService.getCurrentUser();
          const sessionData = {
            token: authService.getToken() || '',
            user: userData
          };
          
          console.log('Initial session check: Found session');
          setSession(sessionData);
          setUser(userData);
        } else {
          console.log('Initial session check: No session');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // В случае ошибки сбрасываем состояние
        setSession(null);
        setUser(null);
        setUserRole('user');
        setUserMetadata(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [isSigningOut]);

  // Fetch the user's profile when user changes
  useEffect(() => {
    if (user) {
      console.log('User detected, fetching profile for user ID:', user.id);
      fetchUserProfile();
    } else {
      console.log('No user, resetting role and metadata');
      setUserRole('user');
      setUserMetadata(null);
    }
  }, [user]);

  // Function to create a user profile if it doesn't exist
  const createUserProfile = async () => {
    if (!user) return;

    try {
      console.log('Creating user profile for:', user.id);
      const fullName = user.email?.split('@')[0] || 'User';
      
      // Используем роль по умолчанию 'user'
      const role = 'user';
      console.log('Creating profile with role:', role);
      
      // TODO: Implement profile creation through REST API
      const profileData: ProfileData = {
        id: user.id,
        full_name: fullName,
        avatar_url: null,
        role: role
      };
      
      setUserRole(role);
      setUserMetadata(profileData);
      console.log('Profile created successfully:', profileData);
      
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user ID:', user.id);
      const userData = await authService.getCurrentUser();
      
      // Создаем профиль на основе данных пользователя
      const profileData: ProfileData = {
        id: userData.id,
        full_name: userData.email.split('@')[0],
        avatar_url: null,
        role: userData.role as UserRole
      };
      
      console.log('Profile data fetched:', profileData);
      setUserRole(profileData.role);
      setUserMetadata(profileData);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Если профиль не найден, создаем новый
      await createUserProfile();
    }
  };

  // Function to check if user has a specific role
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    // Convert single role to array for consistent handling
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    
    return rolesToCheck.includes(userRole);
  };

  // Function to determine the appropriate dashboard path based on role
  const getDashboardPath = (): string => {
    console.log("getDashboardPath called, current role:", userRole);
    
    if (userRole === 'admin') {
      return '/admin';
    } else if (userRole === 'developer') {
      return '/developer';
    } else {
      return '/dashboard';
    }
  };

  // Function to update user role
  const updateRole = async (role: UserRole): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // TODO: Implement role update through REST API
      // Временно обновляем только локальное состояние
      setUserRole(role);
      
      if (userMetadata) {
        const updatedMetadata = { ...userMetadata, role };
        setUserMetadata(updatedMetadata);
      }
      
      toast({
        title: "Role Updated",
        description: `Your role has been updated to ${role}.`,
      });
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({
        title: "Role Update Failed",
        description: "There was an error updating your role. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Completely redesigned sign out function to be more robust
  const signOut = async () => {
    try {
      console.log('Signing out user...');
      setIsSigningOut(true);
      
      // Clear all cookies that might contain auth data
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Используем authService для выхода
      authService.logout();
      
      // Clear auth state in our React app
      setUser(null);
      setSession(null);
      setUserRole('user');
      setUserMetadata(null);
      
      console.log('User signed out successfully');
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });

      // Force navigate to sign-in page
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Exception during sign out:', error);
      
      // Even if there's an error, force reset all auth-related state
      setUser(null);
      setSession(null);
      setUserRole('user');
      setUserMetadata(null);
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully, but there was an issue with the server.",
        variant: "destructive",
      });
      
      // Force navigate to sign-in page
      window.location.href = '/sign-in';
    } finally {
      setIsSigningOut(false);
    }
  };

  // Build the context value
  const contextValue: AuthContextType = {
    isAuthenticated: !!user,
    isLoading,
    userId: user?.id || null,
    userRole,
    userMetadata,
    user,
    session,
    hasRole,
    updateRole,
    signOut,
    getDashboardPath,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAppAuth = () => useContext(AuthContext);
