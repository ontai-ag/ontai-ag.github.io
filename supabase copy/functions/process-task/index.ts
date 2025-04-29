
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.200.0/http/server.ts';

// Interfaces for our data
interface Task {
  id: string;
  user_id: string;
  agent_id: string;
  prompt: string;
  additional_info: string | null;
  attachment_url: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result: string | null;
  price: number;
  payment_status: 'pending' | 'completed' | 'failed';
  notification_channel: 'email' | 'sms' | 'slack' | 'none';
  output_format: 'text' | 'pdf' | 'json' | 'csv' | 'image';
  revision_count: number;
  max_revisions: number;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

interface Agent {
  id: string;
  name: string;
  api_endpoint: string | null;
}

interface User {
  id: string;
  email: string;
}

// Performance metrics tracking
interface PerformanceMetrics {
  taskId: string;
  startTime: number;
  processingTime?: number;
  status: string;
  error?: string;
}

// Constants for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Function to log performance metrics
async function logPerformanceMetrics(metrics: PerformanceMetrics): Promise<void> {
  try {
    await supabaseAdmin
      .from('system_logs')
      .insert({
        log_type: 'performance',
        task_id: metrics.taskId,
        processing_time_ms: metrics.processingTime,
        status: metrics.status,
        error_message: metrics.error || null,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error(`[METRICS_ERROR] Failed to log performance metrics: ${error.message}`);
  }
}

// Function to log security events
async function logSecurityEvent(eventType: string, details: any): Promise<void> {
  try {
    await supabaseAdmin
      .from('system_logs')
      .insert({
        log_type: 'security',
        event_type: eventType,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error(`[SECURITY_ERROR] Failed to log security event: ${error.message}`);
  }
}

// Function to process a task
async function processTask(taskId: string): Promise<{ success: boolean; message: string }> {
  const metrics: PerformanceMetrics = {
    taskId,
    startTime: performance.now(),
    status: 'started'
  };
  
  try {
    console.log(`[TASK_PROCESSING] ${new Date().toISOString()} - Processing task ${taskId}`);
    
    // Update task status to processing
    const { data: task, error: updateError } = await supabaseAdmin
      .from('tasks')
      .update({ status: 'processing' })
      .eq('id', taskId)
      .select()
      .single();
    
    if (updateError || !task) {
      const errorMsg = `Failed to update task status: ${updateError?.message || 'Task not found'}`;
      console.error(`[TASK_ERROR] ${new Date().toISOString()} - ${errorMsg}`);
      
      metrics.status = 'error';
      metrics.error = errorMsg;
      metrics.processingTime = performance.now() - metrics.startTime;
      await logPerformanceMetrics(metrics);
      
      return { success: false, message: errorMsg };
    }
    
    // Get the agent details
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('ai_agents')
      .select('id, name, api_endpoint')
      .eq('id', task.agent_id)
      .single();
    
    if (agentError || !agent) {
      const errorMsg = `Failed to fetch agent: ${agentError?.message || 'Agent not found'}`;
      console.error(`[TASK_ERROR] ${new Date().toISOString()} - ${errorMsg}`);
      
      await failTask(taskId, 'Agent not found');
      
      metrics.status = 'error';
      metrics.error = errorMsg;
      metrics.processingTime = performance.now() - metrics.startTime;
      await logPerformanceMetrics(metrics);
      
      return { success: false, message: errorMsg };
    }
    
    // Get user details for notifications
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(task.user_id);
    
    if (userError || !user) {
      console.warn(`[TASK_WARNING] ${new Date().toISOString()} - Could not fetch user details: ${userError?.message || 'User not found'}`);
      // We can still continue processing even if we can't get the user
    }
    
    // Log the task processing attempt for security monitoring
    await logSecurityEvent('task_processing', {
      taskId: task.id,
      agentId: agent.id,
      userId: task.user_id
    });
    
    // Simulate task processing with a delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a mock result based on the prompt and feedback if this is a revision
    const result = generateMockResult(task.prompt, agent.name, task.feedback, task.revision_count, task.output_format);
    
    // Update the task with the completed status and result
    const { error: completeError } = await supabaseAdmin
      .from('tasks')
      .update({
        status: 'completed',
        result: result,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
    
    if (completeError) {
      const errorMsg = `Failed to complete task: ${completeError.message}`;
      console.error(`[TASK_ERROR] ${new Date().toISOString()} - ${errorMsg}`);
      
      await failTask(taskId, 'Error while completing task');
      
      metrics.status = 'error';
      metrics.error = errorMsg;
      metrics.processingTime = performance.now() - metrics.startTime;
      await logPerformanceMetrics(metrics);
      
      return { success: false, message: errorMsg };
    }
    
    // Send notification
    if (task.notification_channel !== 'none' && user) {
      await sendNotification(task, user, agent);
    }
    
    console.log(`[TASK_SUCCESS] ${new Date().toISOString()} - Task ${taskId} processed successfully`);
    
    // Log successful completion metrics
    metrics.status = 'completed';
    metrics.processingTime = performance.now() - metrics.startTime;
    await logPerformanceMetrics(metrics);
    
    return { success: true, message: 'Task processed successfully' };
  } catch (error) {
    const errorMsg = `Error processing task: ${error.message || 'Unknown error'}`;
    console.error(`[TASK_ERROR] ${new Date().toISOString()} - ${errorMsg}`);
    
    await failTask(taskId, error.message || 'Unknown error');
    
    metrics.status = 'error';
    metrics.error = errorMsg;
    metrics.processingTime = performance.now() - metrics.startTime;
    await logPerformanceMetrics(metrics);
    
    return { success: false, message: errorMsg };
  }
}

// Helper function to mark a task as failed
async function failTask(taskId: string, reason: string): Promise<void> {
  try {
    console.log(`[TASK_FAILURE] ${new Date().toISOString()} - Marking task ${taskId} as failed: ${reason}`);
    
    await supabaseAdmin
      .from('tasks')
      .update({
        status: 'failed',
        result: `Task processing failed: ${reason}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
  } catch (error) {
    console.error(`[TASK_ERROR] ${new Date().toISOString()} - Error marking task as failed:`, error);
  }
}

// Generate a mock result for demo purposes
function generateMockResult(
  prompt: string, 
  agentName: string, 
  feedback: string | null, 
  revisionCount: number,
  outputFormat: string
): string {
  // If this is a revision, include information about the revision
  const revisionInfo = revisionCount > 0
    ? `\n\nThis is revision #${revisionCount}. Based on your feedback: "${feedback}", I've updated the response.`
    : '';
  
  // Format the result based on the requested output format
  switch (outputFormat) {
    case 'json':
      return JSON.stringify({
        response: `Result from ${agentName}:\n\nHere is the response to your prompt: "${prompt}"${revisionInfo}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.`,
        agent: agentName,
        prompt: prompt,
        revision: revisionCount,
        timestamp: new Date().toISOString()
      }, null, 2);
      
    case 'csv':
      return `prompt,agent,revision,response\n"${prompt}","${agentName}",${revisionCount},"Lorem ipsum dolor sit amet, consectetur adipiscing elit."`;
      
    case 'text':
    default:
      return `Result from ${agentName}:\n\nHere is the response to your prompt: "${prompt}"${revisionInfo}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.`;
  }
}

// Send notification via the specified channel
async function sendNotification(task: Task, user: User, agent: Agent): Promise<void> {
  const notificationMessage = `Your task "${task.prompt.substring(0, 30)}..." with agent ${agent.name} has been completed.`;
  
  switch (task.notification_channel) {
    case 'email':
      console.log(`Sending email notification to ${user.email}: ${notificationMessage}`);
      // In a real implementation, integrate with an email service
      break;
    case 'sms':
      console.log(`Sending SMS notification: ${notificationMessage}`);
      // In a real implementation, integrate with an SMS service 
      break;
    case 'slack':
      console.log(`Sending Slack notification: ${notificationMessage}`);
      // In a real implementation, integrate with Slack API
      break;
  }
}

// Server handler
serve(async (req) => {
  const requestStartTime = performance.now();
  const requestId = crypto.randomUUID();
  
  console.log(`[REQUEST_START] ${new Date().toISOString()} - Request ${requestId} received`);
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    if (req.method === 'POST') {
      console.log(`[REQUEST_PROCESSING] ${new Date().toISOString()} - Processing POST request ${requestId}`);
      
      const { taskId } = await req.json();
      
      if (!taskId) {
        const errorMsg = 'taskId is required';
        console.error(`[REQUEST_ERROR] ${new Date().toISOString()} - ${errorMsg} for request ${requestId}`);
        
        return new Response(
          JSON.stringify({ success: false, message: errorMsg }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      // Log the request for monitoring
      await logSecurityEvent('process_task_request', {
        requestId,
        taskId,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown'
      });
      
      const result = await processTask(taskId);
      
      const processingTime = performance.now() - requestStartTime;
      console.log(`[REQUEST_COMPLETE] ${new Date().toISOString()} - Request ${requestId} completed in ${processingTime.toFixed(2)}ms with status: ${result.success ? 'success' : 'error'}`);
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.success ? 200 : 500 }
      );
    } else {
      const errorMsg = 'Method not allowed';
      console.error(`[REQUEST_ERROR] ${new Date().toISOString()} - ${errorMsg} for request ${requestId} with method ${req.method}`);
      
      return new Response(
        JSON.stringify({ success: false, message: errorMsg }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      );
    }
  } catch (error) {
    const errorMsg = `Internal server error: ${error.message}`;
    console.error(`[REQUEST_ERROR] ${new Date().toISOString()} - ${errorMsg} for request ${requestId}`);
    
    // Log the error for monitoring
    await logSecurityEvent('process_task_error', {
      requestId,
      error: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ success: false, message: errorMsg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
