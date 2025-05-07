
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Download, 
  Share2, 
  Clipboard,
  Mail,
  MessageSquare,
  Slack,
  BellOff,
  AlertTriangle,
  RotateCcw,
  History
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
// import { supabase, typeAdapters, Task, Agent, TaskRevision } from '@/integrations/supabase/client';

// TODO: [SUPABASE_REMOVAL] Define these types locally or import from a non-Supabase source
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'revision_requested';
export type NotificationChannel = 'email' | 'sms' | 'slack' | 'none';
export type OutputFormat = 'text' | 'json' | 'markdown' | 'pdf' | 'docx';

export interface Task {
  id: string;
  user_id: string;
  agent_id: string;
  prompt: string;
  additional_info?: string | null;
  attachment_url?: string | null;
  status: TaskStatus;
  result: string | null;
  price: number;
  payment_status: 'pending' | 'completed' | 'failed';
  notification_channel: NotificationChannel;
  output_format: OutputFormat;
  revision_count: number;
  max_revisions: number;
  feedback?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  // Add other necessary fields for Agent if any are used in this component
}

export interface TaskRevision {
  id: string;
  created_at: string;
  feedback: string | null;
  result: string | null;
  // Add other necessary fields for TaskRevision if any are used in this component
}

// TODO: [SUPABASE_REMOVAL] Placeholder for supabase client if needed by other logic, otherwise remove.
const supabase: any = { 
  from: (tableName: string) => ({
    select: (...args: any[]) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: new Error(`Supabase removed, called select on ${tableName}`) }),
        order: () => Promise.resolve({ data: [], error: new Error(`Supabase removed, called select on ${tableName}`) })
      }),
      order: () => Promise.resolve({ data: [], error: new Error(`Supabase removed, called select on ${tableName}`) })
    }),
  })
};

// TODO: [SUPABASE_REMOVAL] Placeholder for typeAdapters if needed by other logic, otherwise remove.
const typeAdapters = {
  convertToTask: (data: any): Task => data as Task, // This is a naive conversion, adjust as needed
  convertToAgent: (data: any): Agent => data as Agent, // This is a naive conversion, adjust as needed
};
import { useAppAuth } from '@/contexts/AuthContext';
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge';
import TaskProgressIndicator from '@/components/tasks/TaskProgressIndicator';
import OutputFormatSelector from '@/components/tasks/OutputFormatSelector';
import RevisionRequestForm from '@/components/tasks/RevisionRequestForm';
import RevisionsHistory from '@/components/tasks/RevisionsHistory';
import ReviewSection from '@/components/reviews/ReviewSection';
import { taskService } from '@/services/taskService';
import { outputFormatter } from '@/utils/outputFormatter';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [revisions, setRevisions] = useState<TaskRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // TODO: [SUPABASE_REMOVAL] Replace with new data fetching logic
        // const { data: taskData, error: taskError } = await supabase
        //   .from('tasks')
        //   .select('*')
        //   .eq('id', id)
        //   .eq('user_id', user.id)
        //   .single();
        
        // if (taskError) throw taskError;
        // if (!taskData) {
        //   setError('Task not found');
        //   return;
        // }
        
        // setTask(typeAdapters.convertToTask(taskData));
        
        // if (taskData.agent_id) {
        //   const { data: agentData, error: agentError } = await supabase
        //     .from('ai_agents')
        //     .select('*')
        //     .eq('id', taskData.agent_id)
        //     .single();
          
        //   if (agentError) throw agentError;
        //   setAgent(typeAdapters.convertToAgent(agentData));
        // }
        const fetchedTask = await taskService.getTaskById(id, user.id); // Assuming taskService is updated
        if (fetchedTask) {
          setTask(fetchedTask);
          // TODO: [SUPABASE_REMOVAL] Fetch agent details if taskService doesn't provide them
          // For now, we'll set a placeholder or leave it null
          // if (fetchedTask.agent_id) { 
          //   // const agentDetails = await agentService.getAgentById(fetchedTask.agent_id); 
          //   // setAgent(agentDetails); 
          // }
        } else {
          setError('Task not found or failed to load');
        }
        
        if (taskData.status === 'completed' && taskData.revision_count > 0) {
          fetchRevisions(id);
        }
      } catch (err) {
        console.error('Error loading task details:', err);
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskDetails();
    
    let unsubscribe: (() => void) | null = null;
    
    if (id && user) {
      unsubscribe = taskService.subscribeToTaskUpdates(id, (updatedTask) => {
        setTask(updatedTask);
        
        if (updatedTask.status === 'completed' && updatedTask.revision_count > 0) {
          fetchRevisions(id);
        }
        
        if (updatedTask.status === 'completed') {
          toast({
            title: "Task Completed",
            description: "Your task has been completed successfully",
          });
        }
      });
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id, user, toast]);

  const fetchRevisions = async (taskId: string) => {
    try {
      setRevisionsLoading(true);
      const revisionData = await taskService.getTaskRevisions(taskId);
      setRevisions(revisionData);
    } catch (err) {
      console.error('Error fetching revisions:', err);
    } finally {
      setRevisionsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = () => {
    if (!task) return <BellOff className="h-4 w-4" />;
    
    switch (task.notification_channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'slack':
        return <Slack className="h-4 w-4" />;
      default:
        return <BellOff className="h-4 w-4" />;
    }
  };
  
  const copyResultToClipboard = () => {
    if (task?.result) {
      navigator.clipboard.writeText(task.result);
      toast({
        title: "Copied to clipboard",
        description: "Task result has been copied to your clipboard",
      });
    }
  };
  
  const handleFormatChange = async (format: Task['output_format']) => {
    if (!task || !id) return;
    
    try {
      const success = await taskService.updateOutputFormat(id, format);
      
      if (success) {
        setTask({ ...task, output_format: format });
        toast({
          title: "Format updated",
          description: `Output format changed to ${format.toUpperCase()}`,
        });
      } else {
        toast({
          title: "Failed to update format",
          description: "There was an error changing the output format",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error updating output format:', err);
      toast({
        title: "Error",
        description: "Failed to update output format",
        variant: "destructive",
      });
    }
  };
  
  const downloadResult = () => {
    if (!task?.result) return;
    
    const filename = `task-${task.id.substring(0, 8)}`;
    outputFormatter.downloadTaskResult(task.result, filename, task.output_format);
    
    toast({
      title: "Download started",
      description: `Task result is being downloaded as ${task.output_format.toUpperCase()}`,
    });
  };
  
  const handleRevisionRequested = () => {
    setShowRevisionForm(false);
    toast({
      title: "Processing revision",
      description: "Your revision request is being processed",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 page-transition">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading task details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 page-transition">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || "Task not found. It may have been deleted or you don't have access to it."}
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16 page-transition">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
              <p className="text-muted-foreground mt-1">ID: {task.id}</p>
            </div>
            <TaskStatusBadge status={task.status} className="mt-2 md:mt-0" />
          </div>
          
          <TaskProgressIndicator status={task.status} className="mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{task.prompt}</p>
                  </div>
                  
                  {task.additional_info && (
                    <div>
                      <h3 className="font-medium">Additional Information</h3>
                      <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{task.additional_info}</p>
                    </div>
                  )}
                  
                  {task.attachment_url && (
                    <div>
                      <h3 className="font-medium">Attachments</h3>
                      <div className="mt-2 flex items-center p-2 bg-muted rounded">
                        <span className="text-sm truncate flex-grow">Attached file</span>
                        <Button variant="ghost" size="sm" className="ml-2">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {task.status === 'completed' && task.result && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Result</CardTitle>
                    <div className="flex items-center space-x-2">
                      <OutputFormatSelector 
                        currentFormat={task.output_format} 
                        onFormatChange={handleFormatChange}
                      />
                      <Button variant="ghost" size="sm" onClick={copyResultToClipboard} className="h-8 px-2">
                        <Clipboard className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                      {task.result}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 justify-between">
                    <div className="text-sm text-muted-foreground">
                      {task.revision_count > 0 && (
                        <span>
                          Revision {task.revision_count} of {task.max_revisions}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={downloadResult}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      
                      {task.revision_count < task.max_revisions && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => setShowRevisionForm(!showRevisionForm)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Request Revision
                        </Button>
                      )}
                      
                      {task.revision_count > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <History className="h-4 w-4 mr-1" />
                              History
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                              <DialogTitle>Revision History</DialogTitle>
                            </DialogHeader>
                            {revisionsLoading ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                              </div>
                            ) : (
                              <RevisionsHistory revisions={revisions} />
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              )}
              
              {task.status === 'completed' && user && (
                <ReviewSection 
                  taskId={task.id}
                  userId={user.id}
                  agentId={task.agent_id}
                  isTaskCompleted={task.status === 'completed'}
                />
              )}
              
              {showRevisionForm && task.status === 'completed' && (
                <Card>
                  <CardContent className="pt-6">
                    <RevisionRequestForm 
                      taskId={task.id}
                      currentRevisions={task.revision_count}
                      maxRevisions={task.max_revisions}
                      onRevisionRequested={handleRevisionRequested}
                    />
                  </CardContent>
                </Card>
              )}
              
              {task.status === 'failed' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Task Failed</AlertTitle>
                  <AlertDescription>
                    The task couldn't be processed successfully. Please try again or contact support if the issue persists.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agent && (
                    <div>
                      <h3 className="text-sm font-medium">Agent</h3>
                      <p className="text-sm mt-1">{agent.name}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium">Submitted</h3>
                    <p className="text-sm mt-1">{formatDate(task.created_at)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Last Updated</h3>
                    <p className="text-sm mt-1">{formatDate(task.updated_at)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Price</h3>
                    <p className="text-sm mt-1">${task.price.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Payment</h3>
                    <p className="text-sm mt-1 capitalize">{task.payment_status}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Output Format</h3>
                    <p className="text-sm mt-1 capitalize">{task.output_format}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Revisions</h3>
                    <p className="text-sm mt-1">
                      {task.revision_count} of {task.max_revisions} used
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Notifications</h3>
                    <div className="flex items-center mt-1">
                      {getNotificationIcon()}
                      <span className="text-sm ml-1 capitalize">{task.notification_channel === 'none' ? 'No notifications' : task.notification_channel}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
              
              <Button variant="secondary" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TaskDetails;
