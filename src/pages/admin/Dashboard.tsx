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
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card">
              <div className="flex items-center p-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.totalUsers}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-card">
              <div className="flex items-center p-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Developers</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.developers}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-card">
              <div className="flex items-center p-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 mr-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.activeAgents}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-card">
              <div className="flex items-center p-4">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200 mr-4">
                  {/* Replace with appropriate icon if revenue is tracked */}
                  <MessageSquare className="h-6 w-6" /> 
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-semibold text-foreground">${stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Pending Agents Table */}
          <Card className="bg-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Pending Agent Approvals</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : pendingAgents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-foreground">Agent Name</TableHead>
                      <TableHead className="text-foreground">Category</TableHead>
                      <TableHead className="text-foreground">Developer</TableHead>
                      <TableHead className="text-foreground">Submitted</TableHead>
                      <TableHead className="text-right text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAgents.map((agent) => (
                      <TableRow key={agent.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{agent.name}</TableCell>
                        <TableCell className="text-muted-foreground">{categoryLabels[agent.category as keyof typeof categoryLabels] || agent.category}</TableCell>
                        <TableCell className="text-muted-foreground">{agent.developer_name || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(agent.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewAgent(agent)}>View</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleOpenFeedback(agent)}>Reject</Button>
                            <Button variant="default" size="sm" onClick={() => handleApproveAgent(agent.id)}>Approve</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">No Pending Agents</h3>
                  <p className="text-muted-foreground">There are currently no agents awaiting approval.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />

      {/* View Agent Dialog */}
      <Dialog open={viewAgentDialog} onOpenChange={setViewAgentDialog}>
        <DialogContent className="sm:max-w-[600px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Agent Details: {selectedAgent?.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Review the details of this agent before taking action.
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium text-muted-foreground">Name</span>
                <span className="col-span-3 text-foreground">{selectedAgent.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium text-muted-foreground">Category</span>
                <span className="col-span-3 text-foreground">{categoryLabels[selectedAgent.category as keyof typeof categoryLabels] || selectedAgent.category}</span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-right font-medium text-muted-foreground pt-1">Description</span>
                <p className="col-span-3 text-foreground text-sm">{selectedAgent.description}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium text-muted-foreground">Pricing</span>
                <span className="col-span-3 text-foreground capitalize">{selectedAgent.pricing_model}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium text-muted-foreground">Developer</span>
                <span className="col-span-3 text-foreground">{selectedAgent.developer_name || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium text-muted-foreground">Submitted</span>
                <span className="col-span-3 text-foreground">{new Date(selectedAgent.created_at).toLocaleString()}</span>
              </div>
              {/* Add more fields as needed, e.g., API endpoint, documentation link */} 
            </div>
          )}
          <DialogFooter className="border-t border-border pt-4">
            <Button variant="outline" onClick={() => setViewAgentDialog(false)}>Close</Button>
            <Button variant="destructive" onClick={() => { setViewAgentDialog(false); handleOpenFeedback(selectedAgent!); }}>Reject</Button>
            <Button variant="default" onClick={() => handleApproveAgent(selectedAgent!.id)}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onOpenChange={setFeedbackDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Reject Agent: {selectedAgent?.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Provide feedback to the developer explaining why the agent was rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="Enter rejection feedback here..." 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] bg-input text-foreground border-border"
            />
          </div>
          <DialogFooter className="border-t border-border pt-4">
            <Button variant="outline" onClick={() => setFeedbackDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleRejectAgent(selectedAgent!.id, feedback)}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
