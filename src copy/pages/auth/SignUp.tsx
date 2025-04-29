
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui-custom/Button';
import { Card } from '@/components/ui-custom/Card';
import { useToast } from '@/hooks/use-toast';
import { Github, Mail, AlertCircle, UserPlus } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'user' | 'developer'>('user');

  const handleSignUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Store role in user metadata so it's used for profile creation
      console.log(`Signing up with role: ${userType}`);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: userType, // This will be used when creating the profile
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful!",
        description: "Welcome to Ontai. Please check your email to verify your account.",
      });
      
      // For development, we'll redirect to dashboard directly
      // In production, you'd wait for email verification
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'An error occurred during sign up');
      toast({
        title: "Sign up failed",
        description: error.message || 'Please check your details and try again',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithProvider = async (provider: 'github' | 'google') => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error(`Error signing up with ${provider}:`, error);
      setError(error.message || `An error occurred during ${provider} sign up`);
      toast({
        title: `${provider} sign up failed`,
        description: error.message || 'Please try again later',
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/sign-in"
              className="font-medium text-primary hover:text-primary/80"
            >
              sign in to an existing account
            </Link>
          </p>
        </div>
        
        <Card className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSignUpWithEmail} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <div>
              <Label>Account Type</Label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <Button
                  type="button"
                  variant={userType === 'user' ? 'default' : 'outline'}
                  onClick={() => setUserType('user')}
                  className="w-full"
                >
                  User
                </Button>
                <Button
                  type="button"
                  variant={userType === 'developer' ? 'default' : 'outline'}
                  onClick={() => setUserType('developer')}
                  className="w-full"
                >
                  Developer
                </Button>
              </div>
            </div>
            
            <CustomButton
              type="submit"
              fullWidth
              loading={loading}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Create Account
            </CustomButton>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSignUpWithProvider('google')}
                disabled={loading}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSignUpWithProvider('github')}
                disabled={loading}
                className="w-full"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
