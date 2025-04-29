import React, { useEffect } from 'react';
import { useAppAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui-custom/Card';
import { CustomButton } from '@/components/ui-custom/Button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { userRole, hasRole, updateRole, userMetadata, signOut, getDashboardPath } = useAppAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user should be redirected to a different dashboard
  useEffect(() => {
    console.log("Dashboard component mounted, current role:", userRole);
    
    // Get the dashboard path based on role
    const dashboardPath = getDashboardPath();
    console.log("Determined dashboard path:", dashboardPath);
    
    // Redirect if not on the correct dashboard
    if (dashboardPath !== '/dashboard') {
      console.log("Redirecting to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
    }
  }, [userRole, navigate, getDashboardPath]);

  const becomeDeveloper = async () => {
    try {
      await updateRole('developer');
      toast({
        title: "Role Updated",
        description: "You are now a developer!",
      });
      // Redirect to developer dashboard after role change
      navigate('/developer');
    } catch (error) {
      console.error('Error upgrading to developer role:', error);
      toast({
        title: "Update Failed",
        description: "Failed to upgrade to developer role",
        variant: "destructive",
      });
    }
  };

  // Only render if the user should be on this dashboard
  if (userRole !== 'user') {
    console.log("User role is not 'user', not rendering Dashboard");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Role: <span className="font-medium capitalize">{userRole}</span>
              </span>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={userMetadata?.avatar_url || ''} />
                  <AvatarFallback>{userMetadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <CustomButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                >
                  Sign Out
                </CustomButton>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">My Account</h2>
              <p className="text-gray-600 mb-4">
                Manage your profile and account settings.
              </p>
              <CustomButton variant="primary" size="sm">
                Account Settings
              </CustomButton>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Usage History</h2>
              <p className="text-gray-600 mb-4">
                View your past activities and usage of AI agents.
              </p>
              <CustomButton variant="primary" size="sm">
                View History
              </CustomButton>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Billing</h2>
              <p className="text-gray-600 mb-4">
                Manage your payment methods and view invoices.
              </p>
              <CustomButton variant="primary" size="sm">
                Billing Settings
              </CustomButton>
            </Card>
          </div>

          {userRole === 'user' && (
            <div className="mt-8">
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <h2 className="text-xl font-semibold mb-4">Become a Developer</h2>
                <p className="text-gray-600 mb-4">
                  Want to create and publish your own AI agents? Upgrade to a developer account!
                </p>
                <CustomButton variant="primary" size="sm" onClick={becomeDeveloper}>
                  Upgrade to Developer
                </CustomButton>
              </Card>
            </div>
          )}

          {hasRole(['developer', 'admin']) && (
            <div className="mt-8">
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
                <h2 className="text-xl font-semibold mb-4">Developer Dashboard</h2>
                <p className="text-gray-600 mb-4">
                  Manage your AI agents, view analytics, and track earnings.
                </p>
                <CustomButton 
                  variant="primary" 
                  size="sm" 
                  as={Link} 
                  to="/developer"
                >
                  Go to Developer Dashboard
                </CustomButton>
              </Card>
            </div>
          )}

          {hasRole('admin') && (
            <div className="mt-8">
              <Card className="p-6 bg-gradient-to-r from-amber-50 to-red-50 border-amber-100">
                <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
                <p className="text-gray-600 mb-4">
                  Manage users, moderate content, and overview platform analytics.
                </p>
                <CustomButton 
                  variant="primary" 
                  size="sm" 
                  as={Link} 
                  to="/admin"
                >
                  Go to Admin Dashboard
                </CustomButton>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
