
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '@/services/authService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui-custom/Button';
import { Card } from '@/components/ui-custom/Card';
import { useToast } from '@/hooks/use-toast';
import { Github, Mail, AlertCircle } from 'lucide-react';
import { useAppAuth } from '@/contexts/AuthContext';

const SignIn = () => {
  const { t } = useTranslation(); // Добавить хук
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, getDashboardPath } = useAppAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect authenticated users to their dashboard with a delay
  // This helps prevent infinite redirect loops during sign-out/sign-in transitions
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getDashboardPath();
      console.log('User authenticated, redirecting to:', redirectPath);
      
      // Small delay to allow state to stabilize
      const redirectTimer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, getDashboardPath, navigate]);

  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      
      toast({
        title: t('auth.signIn.successTitle'),
        description: t('auth.signIn.successDescription'),
      });
      
      // Let the effect hook handle redirection
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || t('auth.signIn.genericError'));
      toast({
        title: t('auth.signIn.failedTitle'),
        description: error.message || t('auth.signIn.failedDescription'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithProvider = async (provider: 'github' | 'google') => {
    setLoading(true);
    setError(null);
    
    try {
      // Социальная аутентификация пока не реализована
      throw new Error('Социальная аутентификация временно недоступна');
      
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      setError(error.message || t('auth.signIn.providerError', { provider }));
      toast({
        title: t('auth.signIn.providerFailedTitle', { provider }),
        description: error.message || t('auth.signIn.providerFailedDescription'),
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
          <h2 className="text-3xl font-extrabold text-foreground-900">
            {t('auth.signIn.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.signIn.or')}{' '}
            <Link
              to="/sign-up"
              className="font-medium text-primary hover:text-primary/80"
            >
              {t('auth.signIn.createAccountLink')}
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
          
          <form onSubmit={handleSignInWithEmail} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('auth.signIn.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder={t('auth.signIn.emailPlaceholder')}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">{t('auth.signIn.passwordLabel')}</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.signIn.forgotPasswordLink')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <CustomButton
              type="submit"
              fullWidth
              loading={loading}
              leftIcon={<Mail className="h-4 w-4" />}
            >
              {t('auth.signIn.signInWithEmailButton')}
            </CustomButton>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('auth.signIn.orContinueWith')}</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSignInWithProvider('google')}
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
                onClick={() => handleSignInWithProvider('github')}
                disabled={loading}
                className="w-full"
              >
                <Github className="w-5 h-5 mr-2" />
                {t('auth.signIn.githubButton')}
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

export default SignIn;
