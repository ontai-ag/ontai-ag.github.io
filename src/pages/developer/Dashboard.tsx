
import React from 'react';
import { useAppAuth } from '../../contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui-custom/Card';
import { CustomButton } from '@/components/ui-custom/Button';
import { Link } from 'react-router-dom';
import { Plus, List, BarChart, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DeveloperDashboard = () => {
  const { userRole, userMetadata, signOut } = useAppAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">My AI Agents</h2>
              <p className="text-gray-600 mb-4">
                Manage, edit, and monitor your AI agents.
              </p>
              <div className="flex flex-col space-y-2">
                <CustomButton 
                  variant="primary" 
                  size="sm"
                  as={Link}
                  to="/developer/manage-agents"
                  leftIcon={<List className="h-4 w-4" />}
                >
                  View All Agents
                </CustomButton>
                <CustomButton 
                  variant="outline" 
                  size="sm"
                  as={Link}
                  to="/developer/create-agent"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Create New Agent
                </CustomButton>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <p className="text-gray-600 mb-4">
                View usage statistics, earnings, and performance metrics.
              </p>
              <CustomButton 
                variant="primary" 
                size="sm"
                leftIcon={<BarChart className="h-4 w-4" />}
              >
                View Analytics
              </CustomButton>
            </Card>
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
            </div>
            <CustomButton 
              variant="outline" 
              size="sm"
              leftIcon={<DollarSign className="h-4 w-4" />}
            >
              View Earnings Details
            </CustomButton>
          </Card>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <CustomButton variant="ghost" size="sm">
              View All
            </CustomButton>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No recent activity</p>
            <CustomButton 
              variant="outline" 
              size="sm"
              as={Link}
              to="/developer/create-agent"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create Your First AI Agent
            </CustomButton>
          </div>

          <div className="mt-8">
            <CustomButton 
              variant="link" 
              size="sm" 
              as={Link} 
              to="/dashboard"
              leftIcon={<span>←</span>}
            >
              Back to User Dashboard
            </CustomButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeveloperDashboard;
