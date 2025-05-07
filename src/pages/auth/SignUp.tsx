
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import
// import { supabase } from '@/integrations/supabase/client'; // TODO: [SUPABASE_REMOVAL] Use AuthContext for auth operations
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui-custom/Button';
import { Card } from '@/components/ui-custom/Card';
import { useToast } from '@/hooks/use-toast';
import { Github, Mail, AlertCircle, UserPlus } from 'lucide-react';

const SignUp = () => {
  const { t } = useTranslation(); // Initialize t function
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
      // const { data, error } = await supabase.auth.signUp({ // TODO: [SUPABASE_REMOVAL] Replace with AuthContext.signUp
      // TEMPORARY: Simulate error as supabase is removed
      const { data, error } = { data: null, error: new Error('Supabase client removed. Use AuthContext.') };
      
      if (error) throw error;
      
      toast({
        title: t('auth.signUp.successTitle'),
        description: t('auth.signUp.successDescription'),
      });
      
      // For development, we'll redirect to dashboard directly
      // In production, you'd wait for email verification
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing up:', error);
      const errorMessage = error.message || t('auth.signUp.genericError');
      setError(errorMessage);
      toast({
        title: t('auth.signUp.failedTitle'),
        description: errorMessage,
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
      // const { data, error } = await supabase.auth.signInWithOAuth({ // TODO: [SUPABASE_REMOVAL] Replace with AuthContext.signInWithOAuth
      // TEMPORARY: Simulate error as supabase is removed
      const { data, error } = { data: null, error: new Error('Supabase client removed. Use AuthContext.') };
      // TODO: [SUPABASE_REMOVAL] The following lines were part of the original Supabase call and are now removed
      // provider,
      // options: {
      //   redirectTo: `${window.location.origin}/dashboard`,
      //   queryParams: {
      //     access_type: 'offline',
      //     prompt: 'consent',
      //   },
      // },
      // });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error(`Error signing up with ${provider}:`, error);
      const errorMessage = error.message || t('auth.signUp.providerGenericError', { provider });
      setError(errorMessage);
      toast({
        title: t('auth.signUp.providerFailedTitle', { provider }),
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="59e843a5-7fb2-4c2d-adac-cd2ce6413ee1.png" alt="Logo" className="mx-auto mb-4 h-16 w-auto" /> {/* Предполагаемый путь и размер */} 
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('auth.signUp.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.signUp.or')}{' '}
            <Link
              to="/sign-in"
              className="font-medium text-primary hover:text-primary/80"
            >
              {t('auth.signUp.signInLink')}
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
              <Label htmlFor="fullName">{t('auth.signUp.fullNameLabel')}</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1"
                placeholder={t('auth.signUp.fullNamePlaceholder')}
              />
            </div>
            
            <div>
              <Label htmlFor="email">{t('auth.signUp.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder={t('auth.signUp.emailPlaceholder')}
              />
            </div>
            
            <div>
              <Label htmlFor="password">{t('auth.signUp.passwordLabel')}</Label>
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
                {t('auth.signUp.passwordHint')}
              </p>
            </div>
            
            <div>
              <Label>{t('auth.signUp.accountTypeLabel')}</Label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <Button
                  type="button"
                  variant={userType === 'user' ? 'default' : 'outline'}
                  onClick={() => setUserType('user')}
                  className="w-full"
                >
                  {t('auth.signUp.userTypeUser')}
                </Button>
                <Button
                  type="button"
                  variant={userType === 'developer' ? 'default' : 'outline'}
                  onClick={() => setUserType('developer')}
                  className="w-full"
                >
                  {t('auth.signUp.userTypeDeveloper')}
                </Button>
              </div>
            </div>
            
            <CustomButton
              type="submit"
              fullWidth
              loading={loading}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              {t('auth.signUp.createAccountButton')}
            </CustomButton>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('auth.signUp.orContinueWith')}</span>
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
                {/* SVG for Google Icon */}
                {t('auth.signUp.googleButton')}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSignUpWithProvider('github')}
                disabled={loading}
                className="w-full"
              >
                <Github className="w-5 h-5 mr-2" />
                {t('auth.signUp.githubButton')}
              </Button>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-primary"
            >
              {t('auth.backToHome')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
