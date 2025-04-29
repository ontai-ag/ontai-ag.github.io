import React, { useEffect, useState } from 'react';
import { useAppAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui-custom/Card';
import { CustomButton } from '@/components/ui-custom/Button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase, Agent, AgentCategory } from '@/integrations/supabase/client';
import { agentService } from '@/services/agentService';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle, XCircle, MessageSquare, User } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const categoryLabels = {
  'text-generation': 'Text Generation',
  'image-generation': 'Image Generation',
  'data-analysis': 'Data Analysis',
  'conversational-ai': 'Conversational AI',
  'code-generation': 'Code Generation',
  'translation': 'Translation',
  'other': 'Other'
};

const AdminDashboard = () => {
  const { userRole, isAuthenticated, user } = useAppAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pendingAgents, setPendingAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    developers: 0,
    activeAgents: 0,
    totalRevenue: 0
  });
  
  // Dialog states
  const [viewAgentDialog, setViewAgentDialog] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [feedback, setFeedback] = useState('');
  
  // Check if the user is authorized to access this page
  useEffect(() => {
    if (isAuthenticated && userRole !== 'admin') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, userRole, navigate]);

  // Fetch pending agents
  useEffect(() => {
    const fetchPendingAgents = async () => {
      try {
        setIsLoading(true);
        
        // Get all pending agents
        const agents = await agentService.getAgents({ status: 'pending' });
        setPendingAgents(agents);
        
        // Also fetch platform stats
        await fetchStats();
      } catch (error: any) {
        console.error('Error fetching pending agents:', error);
        toast({
          title: 'Error',
          description: 'Could not load pending agents. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && userRole === 'admin') {
      fetchPendingAgents();
    }
  }, [isAuthenticated, userRole, toast]);

  // Fetch platform stats
  const fetchStats = async () => {
    try {
      // Get total users count (from profiles)
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;
      
      // Get developers count
      const { count: developers, error: devsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'developer');
      
      if (devsError) throw devsError;
      
      // Get active agents count
      const { count: activeAgents, error: agentsError } = await supabase
        .from('ai_agents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      
      if (agentsError) throw agentsError;
      
      // Set the stats
      setStats({
        totalUsers: totalUsers || 0,
        developers: developers || 0,
        activeAgents: activeAgents || 0,
        totalRevenue: 0 // This would be integrated with a payment system
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // View agent details
  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setViewAgentDialog(true);
  };

  // Open feedback dialog
  const handleOpenFeedback = (agent: Agent) => {
    setSelectedAgent(agent);
    setFeedback('');
    setFeedbackDialog(true);
  };

  // Approve agent
  const handleApproveAgent = async (agentId: string) => {
    try {
      // Use agentService to update the agent status
      const success = await agentService.updateAgent(agentId, { status: 'approved' });

      if (!success) {
        throw new Error("Failed to update agent status");
      }

      // Update UI
      setPendingAgents(pendingAgents.filter(agent => agent.id !== agentId));
      
      // Update stats
      await fetchStats();
      
      toast({
        title: 'Agent Approved',
        description: 'The agent has been approved and is now public.',
      });
      
      // Close dialog if open
      setViewAgentDialog(false);
    } catch (error: any) {
      console.error('Error approving agent:', error);
      toast({
        title: 'Error',
        description: 'Could not approve the agent. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Reject agent
  const handleRejectAgent = async (agentId: string, feedbackText?: string) => {
    try {
      // Use agentService to update the agent status
      const success = await agentService.updateAgent(agentId, { status: 'rejected' });

      if (!success) {
        throw new Error("Failed to update agent status");
      }

      // Update UI
      setPendingAgents(pendingAgents.filter(agent => agent.id !== agentId));
      
      toast({
        title: 'Agent Rejected',
        description: feedbackText 
          ? 'The agent has been rejected with feedback.' 
          : 'The agent has been rejected.',
      });
      
      // Close dialogs
      setViewAgentDialog(false);
      setFeedbackDialog(false);
    } catch (error: any) {
      console.error('Error rejecting agent:', error);
      toast({
        title: 'Error',
        description: 'Could not reject the agent. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!selectedAgent) return;
    
    // In a real system, you would store this feedback in a database
    // and possibly send a notification to the developer
    console.log('Feedback for agent:', selectedAgent.id, feedback);
    
    // For now, we'll just reject with feedback
    await handleRejectAgent(selectedAgent.id, feedback);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Role: <span className="font-medium capitalize">{userRole}</span>
              </span>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <User size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <p className="text-gray-600 mb-4">
                View and manage users and their roles.
              </p>
              <CustomButton variant="primary" size="sm">
                Manage Users
              </CustomButton>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Agent Moderation</h2>
              <p className="text-gray-600 mb-4">
                Review and approve new AI agents submitted by developers.
              </p>
              <CustomButton 
                variant="primary" 
                size="sm"
                as="button"
                onClick={() => document.getElementById('pending-approvals')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {pendingAgents.length > 0 
                  ? `${pendingAgents.length} Pending Approval${pendingAgents.length !== 1 ? 's' : ''}`
                  : 'No Pending Approvals'}
              </CustomButton>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
              <p className="text-gray-600 mb-4">
                Configure platform settings and features.
              </p>
              <CustomButton variant="primary" size="sm">
                Edit Settings
              </CustomButton>
            </Card>
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-sm text-gray-500">Developers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.developers}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-sm text-gray-500">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAgents}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            <CustomButton variant="outline" size="sm">
              View Detailed Analytics
            </CustomButton>
          </Card>

          <div id="pending-approvals" className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Pending Approvals</h2>
            <CustomButton variant="ghost" size="sm" as={Link} to="/admin/agents">
              View All Agents
            </CustomButton>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : pendingAgents.length > 0 ? (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Developer</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{categoryLabels[agent.category as keyof typeof categoryLabels] || agent.category}</TableCell>
                      <TableCell>{agent.user_id.slice(0, 8)}...</TableCell>
                      <TableCell>{new Date(agent.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[agent.status as keyof typeof statusColors]}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewAgent(agent)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleApproveAgent(agent.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectAgent(agent.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleOpenFeedback(agent)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Feedback
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No pending approvals</p>
              <CustomButton variant="outline" size="sm">
                View All Agents
              </CustomButton>
            </div>
          )}

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

      {/* View Agent Dialog */}
      <Dialog open={viewAgentDialog} onOpenChange={setViewAgentDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          
          {selectedAgent && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{selectedAgent.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1">{categoryLabels[selectedAgent.category as keyof typeof categoryLabels] || selectedAgent.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pricing</h3>
                  <p className="mt-1 capitalize">{selectedAgent.pricing_model} 
                    {selectedAgent.hourly_rate ? ` - $${selectedAgent.hourly_rate}/hr` : ''}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                  <p className="mt-1">{new Date(selectedAgent.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{selectedAgent.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Input Format</h3>
                  <p className="mt-1">{selectedAgent.input_format}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Output Format</h3>
                  <p className="mt-1">{selectedAgent.output_format}</p>
                </div>
              </div>
              
              {selectedAgent.api_endpoint && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">API Endpoint</h3>
                  <p className="mt-1">{selectedAgent.api_endpoint}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setViewAgentDialog(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={() => selectedAgent && handleRejectAgent(selectedAgent.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button 
                variant="secondary"
                onClick={() => {
                  setViewAgentDialog(false);
                  selectedAgent && handleOpenFeedback(selectedAgent);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Send Feedback
              </Button>
              <Button 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => selectedAgent && handleApproveAgent(selectedAgent.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onOpenChange={setFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              {selectedAgent && (
                <>Provide feedback to the developer about their agent "{selectedAgent.name}".</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your feedback here..."
              className="min-h-[100px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim()}
            >
              Send Feedback & Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
