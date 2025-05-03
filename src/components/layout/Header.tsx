
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Settings, Shield, Sun, Moon } from 'lucide-react'; // Add Sun and Moon
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/ui-custom/LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation(); // Initialize t function
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, signOut, userRole, updateRole } = useAppAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: t('header.home'), href: '/' },
    { name: t('header.marketplace'), href: '/marketplace' },
  ];

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/dashboard';
    if (userRole === 'admin') return '/admin';
    if (userRole === 'developer') return '/developer';
    return '/dashboard';
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Function to become admin for development purposes
  const becomeAdmin = () => {
    console.log('Admin access attempted');
    
    toast({
      title: t('toast.adminAccess.title'),
      description: t('toast.adminAccess.attempting'),
    });

    updateRole('admin')
      .then(() => {
        console.log('Role updated to admin successfully');
        toast({
          title: t('toast.adminAccess.grantedTitle'),
          description: t('toast.adminAccess.grantedDescription'),
        });
        
        // Short delay before redirecting to ensure state updates
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      })
      .catch((error) => {
        console.error('Error updating role:', error);
        toast({
          title: t('toast.adminAccess.failedTitle'),
          description: t('toast.adminAccess.failedDescription'),
          variant: "destructive",
        });
      });
  };

  // Direct navigation to admin panel
  const goToAdminPanel = () => {
    console.log('Navigating directly to admin panel');
    navigate('/admin');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled || isMobileMenuOpen ? 'bg-card shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
              <img src="59e843a5-7fb2-4c2d-adac-cd2ce6413ee1.png" alt="Ontai Logo" className="h-10" />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name} // Use translated name as key might not be ideal if names change
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                )}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to={getDashboardLink()}
                className={cn(
                  'text-sm font-medium transition-colors',
                  location.pathname.includes('/dashboard') ||
                  location.pathname.includes('/admin') ||
                  location.pathname.includes('/developer')
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                )}
              >
                {t('header.dashboard')}
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} title={t('header.toggleTheme')}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            {isAuthenticated ? (
              <>
                {userRole === 'admin' && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-purple-100 hover:bg-purple-200 text-purple-800"
                    onClick={goToAdminPanel}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    {t('header.adminPanel')}
                  </Button>
                )}
                <Button variant="outline" onClick={signOut}>
                  {t('header.signOut')}
                </Button>
                {userRole !== 'admin' && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-70 hover:opacity-100 text-purple-800"
                    onClick={becomeAdmin}
                    title={t('header.becomeAdminTooltip')}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                )}
              </>
            ) : (
              <>
                <LanguageSwitcher />
                <Button variant="ghost" asChild>
                  <Link to="/sign-in">{t('header.signIn')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/sign-up">{t('header.signUp')}</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-card px-4 pt-2 pb-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name} // Use translated name as key might not be ideal if names change
                to={item.href}
                className={cn(
                  'text-base py-2 border-b border-border',
                  location.pathname === item.href
                    ? 'text-primary font-medium'
                    : 'text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to={getDashboardLink()}
                className={cn(
                  'text-base py-2 border-b border-border',
                  location.pathname.includes('/dashboard') ||
                  location.pathname.includes('/admin') ||
                  location.pathname.includes('/developer')
                    ? 'text-primary font-medium'
                    : 'text-foreground'
                )}
              >
                {t('header.dashboard')}
              </Link>
            )}

            <div className="pt-2 space-y-3">
              {isAuthenticated ? (
                <>
                  {userRole === 'admin' && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800"
                      onClick={goToAdminPanel}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      {t('header.adminPanel')}
                    </Button>
                  )}
                  <Button className="w-full" variant="outline" onClick={signOut}>
                    {t('header.signOut')}
                  </Button>
                  {userRole !== 'admin' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full opacity-70 hover:opacity-100 text-purple-800"
                      onClick={becomeAdmin}
                    >
                      <Settings className="h-4 w-4 mr-1" /> {t('header.becomeAdmin')}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center pb-2">
                    <LanguageSwitcher />
                    <Button variant="ghost" size="icon" onClick={toggleTheme} title={t('header.toggleTheme')}>
                      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/sign-in">{t('header.signIn')}</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/sign-up">{t('header.signUp')}</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
