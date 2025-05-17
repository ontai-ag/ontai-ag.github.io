
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '@/services/authService';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui-custom/Button';
import { Card } from '@/components/ui-custom/Card';
import { useToast } from '@/hooks/use-toast';
import { Github, Mail, AlertCircle, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Existing state for email/password sign-up (will be used later or for actual registration after invite)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState(''); // Can be reused for invite request name
  const [userType, setUserType] = useState<'user' | 'developer'>('user'); // Part of old flow
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for invite flow
  const [showInviteCodeModal, setShowInviteCodeModal] = useState(false);
  const [showRequestInviteModal, setShowRequestInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [requestName, setRequestName] = useState(''); // For invite request form
  const [requestEmail, setRequestEmail] = useState(''); // For invite request form
  const [requestReason, setRequestReason] = useState(''); // Optional reason
  const [inviteRequestLoading, setInviteRequestLoading] = useState(false);
  const [inviteRequestError, setInviteRequestError] = useState<string | null>(null);
  const [inviteRequestSuccessMessage, setInviteRequestSuccessMessage] = useState<string | null>(null);

  // States for previous verification/success flow (might be adjusted or removed)
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Placeholder for Google Apps Script URL
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAI4e65xy0O1knl_122NMmiTH7ZE58O1fL4q2Jlg4qFCEgPVzGTC4SE8IThacw4Ceu/exec';

  const handleOpenInviteCodeModal = () => {
    setError(null); // Clear previous errors
    setInviteRequestError(null);
    setInviteRequestSuccessMessage(null);
    setShowInviteCodeModal(true);
  };

  const handleOpenRequestInviteModal = () => {
    setShowInviteCodeModal(false);
    setShowRequestInviteModal(true);
  };

  const handleInviteCodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // TODO: Implement actual invite code verification logic here
    // For now, simulate a check and then potentially show the original registration form or navigate
    setTimeout(() => {
      setLoading(false);
      if (inviteCode === 'VALID_CODE') { // Example: a dummy valid code
        toast({
          title: t('auth.invite.codeValidTitle'),
          description: t('auth.invite.codeValidDescription'),
        });
        setShowInviteCodeModal(false);
        // Here you might show the original registration form or proceed to a specific step
        // For now, let's just close the modal. The user would then need to be guided to the actual sign up.
        // Or, we could set a state to show the original form:
        // setRegistrationStep('enterDetails'); 
      } else {
        setError(t('auth.invite.codeInvalidError'));
        toast({
          title: t('auth.invite.codeInvalidTitle'),
          description: t('auth.invite.codeInvalidError'),
          variant: 'destructive',
        });
      }
    }, 1000);
  };

  const handleInviteRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteRequestLoading(true);
    setInviteRequestError(null);
    setInviteRequestSuccessMessage(null);

    if (!requestName || !requestEmail) {
      setInviteRequestError(t('auth.invite.requestFormErrorRequiredFields'));
      setInviteRequestLoading(false);
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestEmail)) {
      setInviteRequestError(t('auth.invite.requestFormErrorInvalidEmail'));
      setInviteRequestLoading(false);
      return;
    }

    try {
      // В режиме no-cors мы не можем прочитать тело ответа или статус
      // Поэтому предполагаем, что отправка прошла успешно, если не возникло исключение
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for cross-origin requests to Apps Script
        cache: 'no-cache',
        headers: {
          'Content-Type': 'text/plain', // Изменено на text/plain для лучшей совместимости с no-cors
        },
        redirect: 'follow', // Следовать за перенаправлениями
        body: JSON.stringify({ 
          name: requestName, 
          email: requestEmail, 
          reason: requestReason 
        }),
      });

      // В режиме no-cors мы не можем прочитать тело ответа или статус
      // Поэтому предполагаем, что отправка прошла успешно, если не возникло исключение
      setInviteRequestSuccessMessage(t('auth.invite.requestSuccessMessage'));
      toast({
        title: t('auth.invite.requestSuccessTitle'),
        description: t('auth.invite.requestSuccessMessage'),
      });
      setRequestName('');
      setRequestEmail('');
      setRequestReason('');
      setShowRequestInviteModal(false);
    } catch (err: any) {
      console.error('Error submitting invite request:', err);
      const errorMessage = err.message || t('auth.invite.requestGenericError');
      setInviteRequestError(errorMessage);
      toast({
        title: t('auth.invite.requestFailedTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setInviteRequestLoading(false);
    }
  };

  // Original sign-up and verify functions (will be triggered differently now or removed/refactored)
  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Здесь будет логика верификации кода
      setPendingVerification(false);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error verifying code:', err);
      const errorMessage = err.message || t('auth.signUp.verificationError');
      setError(errorMessage);
      toast({
        title: t('auth.signUp.verificationFailedTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(email, password);
      
      toast({
        title: t('auth.signUp.successTitle'),
        description: t('auth.signUp.successDescription'),
      });
      
      // После успешной регистрации выполняем вход
      await authService.signInWithPassword(email, password);
      
      // Немедленный редирект на dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Error signing up:', err);
      const errorMessage = err.message || t('auth.signUp.genericError');
      setError(errorMessage);
      toast({
        title: t('auth.signUp.failedTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleSignUpWithProvider = async (provider: 'oauth_github' | 'oauth_google') => {
  //   if (!isLoaded) return;
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     await signUp.authenticateWithRedirect({
  //       strategy: provider,
  //       redirectUrl: '/sso-callback',
  //       redirectUrlComplete: '/dashboard',
  //     });
  //     // OAuth flow will redirect the user, no further client-side action needed here for success
  //   } catch (err: any) {
  //     console.error(`Error signing up with ${provider}:`, JSON.stringify(err, null, 2));
  //     const errorMessage = err.errors?.[0]?.message || t('auth.signUp.providerGenericError', { provider: provider.replace('oauth_', '') });
  //     setError(errorMessage);
  //     toast({
  //       title: t('auth.signUp.providerFailedTitle', { provider: provider.replace('oauth_', '') }),
  //       description: errorMessage,
  //       variant: 'destructive',
  //     });
  //     setLoading(false); // Only set loading to false on error, as success redirects
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8"> {/* Removed 'relative' */}
        {/* Header with Back Button and Centered Logo */}
        <div className="flex items-center w-full">
          <Link to="/" className="text-gray-500 hover:text-primary">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex-grow flex justify-center">
            <img src="59e843a5-7fb2-4c2d-adac-cd2ce6413ee1.png" alt="Logo" className="h-12 w-auto" /> {/* Adjusted logo height */}
          </div>
          {/* Spacer for visual balance to center the logo correctly */}
          <div className="w-10" /> {/* Corresponds to size="icon" button width (2.5rem = 40px) */}
        </div>

        {/* Title and Subtitle Section */}
        <div className="text-center"> {/* Removed pt-12 */}
          <h2 className="text-3xl font-extrabold text-foreground-900">
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
          
          <div className="text-center text-sm text-muted-foreground mb-4">
            {t('auth.signUp.waitlistNotice1')}
          </div>
          <div className="text-center text-sm text-muted-foreground mb-4">
            {t('auth.signUp.waitlistNotice2')}
          </div>
          <CustomButton
            type="button"
            fullWidth
            onClick={handleOpenInviteCodeModal}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            {t('auth.signUp.joinButton')}{/* Changed from 'Create Account' */}
          </CustomButton>

          {/* Invite Code Modal */}
          <Dialog open={showInviteCodeModal} onOpenChange={setShowInviteCodeModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('auth.invite.codeModalTitle')}</DialogTitle>
                
                <DialogDescription>
                  {t('auth.invite.codeModalDescription2')}
                </DialogDescription>

                <DialogDescription>
                  {t('auth.invite.codeModalDescription')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInviteCodeCheck} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <div>
                  <Label htmlFor="inviteCode">{t('auth.invite.codeLabel')}</Label>
                  <InputOTP
                    maxLength={6} // Adjust max length as needed for your invite code
                    value={inviteCode}
                    onChange={(value) => setInviteCode(value)}
                    className="mt-4 flex justify-center text-2xl" // Added classes for centering and size
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <div className="mx-2">-</div> {/* Separator */}
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <CustomButton type="submit" fullWidth loading={loading}>
                  {t('auth.invite.checkCodeButton')}
                </CustomButton>
              </form>
              <div className="mt-4 text-center text-sm">
                {t('auth.invite.noCodePrompt')}{' '}
                <Button variant="link" className="p-0 h-auto" onClick={handleOpenRequestInviteModal}>
                  {t('auth.invite.requestInviteLink')}
                </Button>
              </div>
              {/* <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    {t('common.close')}
                  </Button>
                </DialogClose>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>

          {/* Request Invite Modal */}
          <Dialog open={showRequestInviteModal} onOpenChange={setShowRequestInviteModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('auth.invite.requestModalTitle')}</DialogTitle>
                <DialogDescription>
                  {t('auth.invite.requestModalDescription')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInviteRequestSubmit} className="space-y-4">
                {inviteRequestError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{inviteRequestError}</p>
                  </div>
                )}
                {inviteRequestSuccessMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                    {inviteRequestSuccessMessage}
                  </div>
                )}
                <div>
                  <Label htmlFor="requestName">{t('auth.invite.requestNameLabel')}</Label>
                  <Input
                    id="requestName"
                    type="text"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    required
                    className="mt-1"
                    placeholder={t('auth.invite.requestNamePlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="requestEmail">{t('auth.invite.requestEmailLabel')}</Label>
                  <Input
                    id="requestEmail"
                    type="email"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    required
                    className="mt-1"
                    placeholder={t('auth.invite.requestEmailPlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="requestReason">{t('auth.invite.requestReasonLabel')}</Label>
                  <Input // Changed from Textarea for simplicity, can be Textarea if available and preferred
                    id="requestReason"
                    type="text"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    className="mt-1"
                    placeholder={t('auth.invite.requestReasonPlaceholder')}
                  />
                </div>
                <CustomButton type="submit" fullWidth loading={inviteRequestLoading}>
                  {t('auth.invite.sendRequestButton')}
                </CustomButton>
              </form>
              {/* <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    {t('common.close')}
                  </Button>
                </DialogClose>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>
          
          {/* The original registration form, pendingVerification, and registrationSuccess sections are removed from direct view. */}
          {/* They might be conditionally rendered later based on invite code validation or other logic. */}

          {/* Commented out or removed original form and provider buttons */}
          {/* {!pendingVerification && !registrationSuccess && (
          <form onSubmit={handleSignUpWithEmail} className="space-y-4">
            ...
          </form>
          )} */}
          {/* ... other commented out sections ... */}

        </Card>
      </div>
    </div>
  );
};

export default SignUp;
