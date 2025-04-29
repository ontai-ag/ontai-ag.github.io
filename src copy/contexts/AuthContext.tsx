
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
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

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Found session' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed, event:', event, 'session:', session ? 'exists' : 'null');
        
        if (event === 'SIGNED_OUT' || isSigningOut) {
          // Clear all user state
          setSession(null);
          setUser(null);
          setUserRole('user');
          setUserMetadata(null);
          
          if (isSigningOut) {
            console.log('Sign-out process in progress, redirecting to home page');
            window.location.href = '/';
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
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
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      
      // Use the role from user metadata if available, otherwise default to 'user'
      const role = (user.user_metadata?.role as UserRole) || 'user';
      console.log('Creating profile with role:', role);
      
      const { data, error } = await (supabase as any)
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            full_name: fullName,
            role: role 
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user profile:', error);
        return;
      }

      // Set user metadata after creating profile
      if (data) {
        console.log('Profile created successfully:', data);
        const profileData = data as unknown as ProfileData;
        setUserRole(profileData.role as UserRole);
        setUserMetadata(profileData);
      }
      
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  // Function to fetch user profile from our profiles table
  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user ID:', user.id);
      // Cast the entire Supabase client to any to bypass TypeScript checking
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        // If no rows found, create a profile
        if (error.code === 'PGRST116') {
          console.log('No profile found, creating one...');
          await createUserProfile();
          return;
        }
        
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        console.log('Profile data fetched:', data);
        // Use type assertion to tell TypeScript about the expected structure
        const profileData = data as unknown as ProfileData;
        setUserRole(profileData.role as UserRole);
        setUserMetadata(profileData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
      // Cast the entire Supabase client to any to bypass TypeScript checking
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ role: role })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to update user role:', error);
        toast({
          title: "Role Update Failed",
          description: "There was an error updating your role. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      
      // Update local state
      setUserRole(role);
      
      // Refetch the user profile to get updated data
      await fetchUserProfile();
      
      toast({
        title: "Role Updated",
        description: `Your role has been updated to ${role}.`,
      });
    } catch (error) {
      console.error('Failed to update user role:', error);
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
      
      // Clear local and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear auth state in our React app
      setUser(null);
      setSession(null);
      setUserRole('user');
      setUserMetadata(null);
      
      // Now try to sign out with Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        throw error;
      }
      
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
