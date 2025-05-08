import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clipboard, Upload, DollarSign, CreditCard, AlertCircle, Bell } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
// import { supabase } from '@/integrations/supabase/client'; // TODO: [SUPABASE_REMOVAL] Client import removed, use services
// import type { AgentWithUIDetails, NotificationChannel, OutputFormat } from '@/integrations/supabase/client'; // Added OutputFormat for taskService
import KaspiPayment from '@/components/payment/KaspiPayment';
import NotificationPreferences from '@/components/tasks/NotificationPreferences';
import { useAppAuth } from '@/contexts/AuthContext';
import { taskService } from '@/services/taskService';
import { paymentService } from '@/services/paymentService';

const taskFormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Task description must be at least 10 characters.",
  }),
  additionalInfo: z.string().optional(),
  attachment: z.any().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const TaskSubmission = () => {
  const { user } = useAppAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAgent, setSelectedAgent] = useState<AgentWithUIDetails | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [notificationChannel, setNotificationChannel] = useState<NotificationChannel>('email');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [paymentFailed, setPaymentFailed] = useState<boolean>(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      prompt: "",
      additionalInfo: "",
    },
  });

  useEffect(() => {
    if (location.state?.agent) {
      setSelectedAgent(location.state.agent);
      
      calculatePrice(location.state.agent, "");
    } else {
      toast({
        title: "No agent selected",
        description: "Please select an agent from the marketplace first.",
        variant: "destructive",
      });
      navigate('/marketplace');
    }
  }, [location.state, navigate, toast]);

  const calculatePrice = (agent: AgentWithUIDetails, prompt: string) => {
    if (!agent) return 0;
    
    let price = 0;
    const wordCount = prompt.trim().split(/\s+/).length;

    switch (agent.pricing_model) {
      case 'free':
        price = 0;
        break;
      case 'pay-per-use':
        price = agent.price || agent.hourly_rate || 0.99;
        break;
      case 'subscription':
        price = agent.price || agent.hourly_rate || 9.99;
        break;
      case 'custom':
        price = ((agent.price || agent.hourly_rate || 0.5) * Math.max(1, wordCount / 100));
        break;
      default:
        price = agent.price || agent.hourly_rate || 0.99;
    }
    
    if (fileUploaded) {
      price += 0.5;
    }
    
    price = Math.round(price * 100) / 100;
    setEstimatedPrice(price);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUploaded(true);
      setFileName(file.name);
      
      if (selectedAgent) {
        calculatePrice(selectedAgent, form.getValues().prompt);
      }
    }
  };

  const prompt = form.watch('prompt');
  useEffect(() => {
    if (selectedAgent) {
      calculatePrice(selectedAgent, prompt);
    }
  }, [prompt, selectedAgent]);

  const onSubmit = async (data: TaskFormValues) => {
    if (!selectedAgent) {
      toast({
        title: "No agent selected",
        description: "Please select an agent to process your task.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit tasks.",
        variant: "destructive",
      });
      navigate('/sign-in', { state: { returnUrl: '/task-submission', agent: selectedAgent } });
      return;
    }

    setIsSubmitting(true);
    setPaymentFailed(false);
    
    try {
      // TODO: [SUPABASE_REMOVAL] Direct Supabase call replaced by taskService.createTask
      const taskCreationParams = {
        userId: user.id,
        agentId: selectedAgent.id,
        prompt: data.prompt,
        additionalInfo: data.additionalInfo || null,
        attachmentUrl: null, // TODO: Handle actual file upload URL for attachmentUrl
        price: estimatedPrice,
        notificationChannel: notificationChannel,
        outputFormat: 'text' as OutputFormat, // TODO: Make this configurable or derive from agent
        maxRevisions: selectedAgent.max_revisions || 3, // Assuming agent might have max_revisions, or default to 3
      };
      const createdTask = await taskService.createTask(taskCreationParams);

      if (!createdTask) {
        // taskService.createTask returns null on error and logs it internally
        throw new Error("Task creation failed. Please check logs or try again.");
      }
      
      setTaskId(createdTask.id);
      setShowPayment(true);
      
    } catch (error) {
      console.error("Error submitting task:", error);
      toast({
        title: "Error submitting task",
        description: "There was a problem submitting your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!user || !selectedAgent || !taskId) return;
    
    try {
      const updated = await paymentService.updateTaskPaymentStatus(taskId, 'completed');
      
      if (!updated) {
        throw new Error("Failed to update payment status");
      }
      
      await taskService.startTaskProcessing(taskId);
      
      toast({
        title: "Task submitted successfully",
        description: "Your task has been submitted and will be processed shortly.",
      });
      
      navigate('/dashboard', { state: { newTaskId: taskId } });
    } catch (error) {
      console.error("Error handling payment success:", error);
      toast({
        title: "Error updating task",
        description: "Payment processed but we couldn't update your task status. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentFailed = async () => {
    if (!taskId) return;
    
    try {
      await paymentService.updateTaskPaymentStatus(taskId, 'failed');
      setPaymentFailed(true);
      
      toast({
        title: "Payment failed",
        description: "Your payment could not be processed. Please try again or use a different payment method.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  };

  if (!selectedAgent) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 page-transition">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const agentImage = selectedAgent.image || "https://via.placeholder.com/150";
  const basePrice = selectedAgent.price || selectedAgent.hourly_rate || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16 page-transition">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Submit Your Task</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                  <CardDescription>
                    Provide details about what you'd like {selectedAgent.name} to do
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Task Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your task in detail..." 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Be specific about what you want the AI agent to accomplish.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Information (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any context or specific requirements..." 
                                className="min-h-[80px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="attachment"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Attachments (Optional)</FormLabel>
                            <FormControl>
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-center w-full">
                                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                      <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        PDF, DOC, JPG, PNG (MAX. 10MB)
                                      </p>
                                    </div>
                                    <input 
                                      id="file-upload" 
                                      type="file" 
                                      className="hidden"
                                      onChange={handleFileChange}
                                      {...field}
                                    />
                                  </label>
                                </div>
                                {fileUploaded && (
                                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
                                    <span className="text-sm truncate max-w-[250px]">{fileName}</span>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => {
                                        setFileUploaded(false);
                                        setFileName('');
                                        calculatePrice(selectedAgent, prompt);
                                      }}
                                      className="h-6 w-6 p-0"
                                    >
                                      <span className="sr-only">Remove</span>
                                      <AlertCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
                          <h3 className="font-medium">Notification Preferences</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Choose how you'd like to be notified about task status updates:
                        </p>
                        <NotificationPreferences 
                          value={notificationChannel}
                          onChange={setNotificationChannel}
                        />
                      </div>
                      
                      {!showPayment && !paymentFailed && (
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Continue to Payment"}
                        </Button>
                      )}
                      
                      {paymentFailed && (
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                        >
                          Try Payment Again
                        </Button>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Task Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Selected Agent</h3>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full bg-cover bg-center" 
                        style={{ backgroundImage: `url(${agentImage})` }}
                      />
                      <div>
                        <p className="font-semibold">{selectedAgent.name}</p>
                        <p className="text-sm text-gray-500">{selectedAgent.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Pricing Details</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Base price</span>
                        <span className="text-sm">${basePrice.toFixed(2)}</span>
                      </div>
                      {fileUploaded && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">File processing</span>
                          <span className="text-sm">$0.50</span>
                        </div>
                      )}
                      {selectedAgent.pricing_model === 'custom' && prompt.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Task complexity</span>
                          <span className="text-sm">
                            ${(estimatedPrice - basePrice - (fileUploaded ? 0.5 : 0)).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Estimated Price</span>
                    <span className="text-lg">${estimatedPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <p className="flex items-center text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {selectedAgent.pricing_model === 'free' ? (
                        "This agent is free to use"
                      ) : selectedAgent.pricing_model === 'subscription' ? (
                        "Monthly subscription"
                      ) : (
                        "Pay only for what you use"
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>
                    Complete your payment to submit the task
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KaspiPayment 
                    amount={estimatedPrice}
                    onSuccess={handlePaymentSuccess}
                    onFailed={handlePaymentFailed}
                  />
                </CardContent>
              </Card>
              
              <div className="mt-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Clipboard className="mr-2 h-4 w-4" />
                      Task Submission Help
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Tips for effective tasks:</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>Be specific about what you want the agent to do</li>
                        <li>Provide clear examples or references if needed</li>
                        <li>Set clear expectations for the output format</li>
                        <li>Upload relevant documents if they help explain your needs</li>
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TaskSubmission;
