import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { CustomButton } from '@/components/ui-custom/Button';
import { useToast } from '@/components/ui/use-toast';
import { useAppAuth } from '@/contexts/AuthContext';
import { agentService, CreateAgentData } from '@/services/agentService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { CategoryField, CATEGORY_OPTIONS } from '@/components/developer/agentForm/CategoryField';
import { PricingField, PRICING_OPTIONS } from '@/components/developer/agentForm/PricingField';
import { TextareaField } from '@/components/developer/agentForm/TextareaField';
import { InputField } from '@/components/developer/agentForm/InputField';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const agentFormSchema = z.object({
  name: z.string().min(3, { message: 'Agent name must be at least 3 characters' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }).max(1000),
  category: z.string().min(1, { message: 'Please select a category' }),
  inputFormat: z.string().min(3, { message: 'Input format must be at least 3 characters' }).max(500),
  outputFormat: z.string().min(3, { message: 'Output format must be at least 3 characters' }).max(500),
  pricingModel: z.string().min(1, { message: 'Please select a pricing model' }),
  hourlyRate: z.union([
    z.number().min(0, { message: 'Hourly rate must be 0 or greater' }),
    z.string().refine(val => val === '' || !isNaN(parseFloat(val)), {
      message: "Hourly rate must be a number"
    })
  ]).optional(),
  apiEndpoint: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

const CreateAgent: React.FC = () => {
  const { isAuthenticated, userRole, userId } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<string>('basics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      inputFormat: '',
      outputFormat: '',
      pricingModel: '',
      hourlyRate: '',
      apiEndpoint: '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in', { state: { from: location }, replace: true });
    } else if (userRole !== 'developer' && userRole !== 'admin') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, userRole, navigate, location]);

  const handleSubmit = async (values: AgentFormValues) => {
    try {
      console.log("Starting form submission with values:", values);
      setIsSubmitting(true);
      setSubmissionError(null);
      
      if (!userId) {
        throw new Error("No user ID found. Please sign in again.");
      }
      
      const agentData: CreateAgentData = {
        user_id: userId,
        name: values.name,
        description: values.description,
        category: values.category,
        input_format: values.inputFormat,
        output_format: values.outputFormat,
        pricing_model: values.pricingModel,
        hourly_rate: values.pricingModel === 'free' ? null : Number(values.hourlyRate) || 0,
        api_endpoint: values.apiEndpoint || null,
        status: 'pending',
      };
      
      console.log("Creating agent with data:", agentData);
      
      const result = await agentService.createAgent(agentData);
      
      if (!result) {
        throw new Error("Failed to create agent");
      }
      
      console.log("Agent submitted successfully:", result);
      setSubmissionSuccess(true);
      
      setTimeout(() => {
        toast({
          title: "Agent Submitted Successfully",
          description: "Your agent is now pending review by our team.",
        });
      }, 100);
      
    } catch (error: any) {
      console.error('Error submitting agent:', error);
      setSubmissionError(error.message || "Something went wrong. Please try again.");
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log("Submission success state updated:", submissionSuccess);
  }, [submissionSuccess]);

  const goToNextStep = () => {
    if (currentStep === 'basics') {
      const basicFields = ['name', 'description', 'category'];
      const basicFieldsValid = basicFields.every(field => !form.getFieldState(field as keyof AgentFormValues).invalid);
      
      if (basicFieldsValid) {
        setCurrentStep('technical');
      } else {
        form.trigger(basicFields as any);
      }
    } else if (currentStep === 'technical') {
      const technicalFields = ['inputFormat', 'outputFormat', 'pricingModel'];
      const technicalFieldsValid = technicalFields.every(field => !form.getFieldState(field as keyof AgentFormValues).invalid);
      
      if (technicalFieldsValid) {
        setCurrentStep('review');
      } else {
        form.trigger(technicalFields as any);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'technical') {
      setCurrentStep('basics');
    } else if (currentStep === 'review') {
      setCurrentStep('technical');
    }
  };

  console.log("Rendering view. submissionSuccess:", submissionSuccess);
  console.log("Current form errors:", form.formState.errors);

  if (submissionSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                  <CardTitle>Submission Successful</CardTitle>
                </div>
                <CardDescription>
                  Your agent has been submitted for review
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="font-semibold text-green-700 mb-2">What happens next?</h3>
                  <ul className="list-disc pl-5 space-y-1 text-green-700">
                    <li>Our team will review your agent submission within 1-3 business days</li>
                    <li>You will receive an email notification once the review is complete</li>
                    <li>If approved, your agent will be published to the marketplace</li>
                    <li>If rejected, you'll receive feedback and can make necessary changes</li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Agent Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-base">{form.getValues().name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="text-base">{CATEGORY_OPTIONS.find(cat => cat.value === form.getValues().category)?.label}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pricing</p>
                      <p className="text-base">
                        {PRICING_OPTIONS.find(option => option.value === form.getValues().pricingModel)?.label}
                        {form.getValues().pricingModel !== 'free' && form.getValues().hourlyRate && 
                          ` - $${form.getValues().hourlyRate}/hour`}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-base">{form.getValues().description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <CustomButton variant="outline" onClick={() => navigate('/developer')}>
                  Return to Dashboard
                </CustomButton>
                <CustomButton variant="primary" onClick={() => {
                  form.reset();
                  setSubmissionSuccess(false);
                  setCurrentStep('basics');
                }}>
                  Create Another Agent
                </CustomButton>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Create AI Agent</h1>
            <p className="text-gray-600">
              Use this wizard to create and register your AI agent. All submissions are subject to review before being published.
            </p>
          </div>

          <Tabs value={currentStep} className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics" disabled={isSubmitting}>
                1. Basic Information
              </TabsTrigger>
              <TabsTrigger value="technical" disabled={isSubmitting}>
                2. Technical Details
              </TabsTrigger>
              <TabsTrigger value="review" disabled={isSubmitting}>
                3. Review & Submit
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 space-y-6">
                {submissionError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {submissionError}
                    </AlertDescription>
                  </Alert>
                )}

                <TabsContent value="basics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        Provide the essential details about your AI agent
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <InputField 
                        control={form.control}
                        name="name"
                        label="Agent Name"
                        placeholder="Enter a name for your agent"
                        description="Choose a descriptive name that clearly indicates what your agent does."
                      />

                      <TextareaField 
                        control={form.control}
                        name="description"
                        label="Description"
                        placeholder="Describe what your agent does and what problem it solves"
                        description="Provide a clear description of your agent's capabilities and use cases."
                      />

                      <CategoryField control={form.control} />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <CustomButton
                        type="button"
                        onClick={goToNextStep}
                        rightIcon={<span>→</span>}
                      >
                        Next Step
                      </CustomButton>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="technical">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Details</CardTitle>
                      <CardDescription>
                        Provide technical information about how your agent works
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <TextareaField 
                        control={form.control}
                        name="inputFormat"
                        label="Input Format"
                        placeholder="Describe the format of inputs your agent accepts (e.g., JSON, text, images)"
                        description="Detail the format, structure, and any constraints for the inputs your agent requires."
                        minHeight="80px"
                      />

                      <TextareaField 
                        control={form.control}
                        name="outputFormat"
                        label="Output Format"
                        placeholder="Describe the format of outputs your agent produces"
                        description="Explain what your agent returns and in what format."
                        minHeight="80px"
                      />

                      <PricingField control={form.control} />

                      <div className="relative">
                        <InputField 
                          control={form.control}
                          name="apiEndpoint"
                          label="API Endpoint (Optional)"
                          placeholder="https://api.yourdomain.com/agent"
                          description="If your agent is hosted externally, provide the API endpoint. Leave empty if you don't have one yet."
                        />
                        <div className="mt-2 flex items-start space-x-2 text-sm text-blue-600">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p>You don't need to add an API key here. If your agent is approved, you'll be able to manage API keys in your developer dashboard.</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <CustomButton
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                        leftIcon={<span>←</span>}
                      >
                        Previous Step
                      </CustomButton>
                      <CustomButton
                        type="button"
                        onClick={goToNextStep}
                        rightIcon={<span>→</span>}
                      >
                        Next Step
                      </CustomButton>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="review">
                  <Card>
                    <CardHeader>
                      <CardTitle>Review & Submit</CardTitle>
                      <CardDescription>
                        Review your agent details before submitting for approval
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-amber-800">Important Notice</h3>
                            <p className="text-amber-700 text-sm">
                              All agent submissions will be reviewed by our team before being published to the marketplace. 
                              This process typically takes 1-3 business days.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Agent Name</h4>
                              <p className="text-base">{form.getValues().name}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Category</h4>
                              <p className="text-base">
                                {CATEGORY_OPTIONS.find(cat => cat.value === form.getValues().category)?.label || '-'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-500">Description</h4>
                            <p className="text-base">{form.getValues().description}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Technical Details</h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Input Format</h4>
                              <p className="text-base">{form.getValues().inputFormat}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Output Format</h4>
                              <p className="text-base">{form.getValues().outputFormat}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Pricing Model</h4>
                              <p className="text-base">
                                {PRICING_OPTIONS.find(option => option.value === form.getValues().pricingModel)?.label || '-'}
                                {form.getValues().pricingModel !== 'free' && form.getValues().hourlyRate && 
                                  ` - $${form.getValues().hourlyRate}/hour`}
                              </p>
                            </div>
                            {form.getValues().apiEndpoint && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">API Endpoint</h4>
                                <p className="text-base">{form.getValues().apiEndpoint}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <CustomButton
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                        leftIcon={<span>←</span>}
                      >
                        Previous Step
                      </CustomButton>
                      
                      <CustomButton
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                      </CustomButton>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateAgent;
