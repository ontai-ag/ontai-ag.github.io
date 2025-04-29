
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, signOut, userRole, updateRole } = useAppAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

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
    { name: 'Home', href: '/' },
    { name: 'AI Marketplace', href: '/agents' },
  ];

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/dashboard';
    if (userRole === 'admin') return '/admin';
    if (userRole === 'developer') return '/developer';
    return '/dashboard';
  };

  // Function to become admin for development purposes
  const becomeAdmin = () => {
    console.log('Admin access attempted');
    
    toast({
      title: "Admin Access",
      description: "Attempting to gain admin access...",
    });

    updateRole('admin')
      .then(() => {
        console.log('Role updated to admin successfully');
        toast({
          title: "Admin Access Granted",
          description: "You now have admin privileges. Redirecting to admin panel.",
        });
        
        // Short delay before redirecting to ensure state updates
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      })
      .catch((error) => {
        console.error('Error updating role:', error);
        toast({
          title: "Admin Access Failed",
          description: "Could not update your role. Please try again.",
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
        isScrolled || isMobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-primary">Ontai</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
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
                    : 'text-gray-700 hover:text-primary'
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
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
                    Admin Panel
                  </Button>
                )}
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
                {userRole !== 'admin' && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-70 hover:opacity-100 text-purple-800"
                    onClick={becomeAdmin}
                    title="Click to become admin (development only)"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/sign-up">Sign Up</Link>
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
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-base py-2 border-b border-gray-100',
                  location.pathname === item.href
                    ? 'text-primary font-medium'
                    : 'text-gray-700'
                )}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to={getDashboardLink()}
                className={cn(
                  'text-base py-2 border-b border-gray-100',
                  location.pathname.includes('/dashboard') ||
                  location.pathname.includes('/admin') ||
                  location.pathname.includes('/developer')
                    ? 'text-primary font-medium'
                    : 'text-gray-700'
                )}
              >
                Dashboard
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
                      Admin Panel
                    </Button>
                  )}
                  <Button className="w-full" variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                  {userRole !== 'admin' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full opacity-70 hover:opacity-100 text-purple-800"
                      onClick={becomeAdmin}
                    >
                      <Settings className="h-4 w-4 mr-1" /> Become Admin
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/sign-in">Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/sign-up">Sign Up</Link>
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
