
import { supabase, Task, TaskStatus, NotificationChannel, OutputFormat, TaskRevision, typeAdapters } from '@/integrations/supabase/client';

export interface CreateTaskParams {
  userId: string;
  agentId: string;
  prompt: string;
  additionalInfo?: string | null;
  attachmentUrl?: string | null;
  price: number;
  notificationChannel: NotificationChannel;
  outputFormat: OutputFormat;
  maxRevisions: number;
}

export interface TaskFilter {
  status?: TaskStatus | 'all';
  agentId?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
}

export const taskService = {
  // Create a new task
  async createTask(params: CreateTaskParams): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: params.userId,
          agent_id: params.agentId,
          prompt: params.prompt,
          additional_info: params.additionalInfo || null,
          attachment_url: params.attachmentUrl || null,
          status: 'pending',
          result: null,
          price: params.price,
          payment_status: 'completed', // Assuming payment is already processed
          notification_channel: params.notificationChannel,
          output_format: params.outputFormat,
          revision_count: 0,
          max_revisions: params.maxRevisions
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const task = typeAdapters.convertToTask(data);
      
      // Start task processing in the background
      await this.startTaskProcessing(task.id);
      
      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },
  
  // Get task by ID
  async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return typeAdapters.convertToTask(data);
    } catch (error) {
      console.error('Error fetching task:', error);
      return null;
    }
  },
  
  // Get tasks for a user with optional filtering
  async getUserTasks(userId: string, filter?: TaskFilter): Promise<Task[]> {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      
      // Apply filters
      if (filter) {
        if (filter.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }
        
        if (filter.agentId) {
          query = query.eq('agent_id', filter.agentId);
        }
        
        if (filter.fromDate) {
          query = query.gte('created_at', filter.fromDate.toISOString());
        }
        
        if (filter.toDate) {
          query = query.lte('created_at', filter.toDate.toISOString());
        }
        
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
      }
      
      // Order by creation date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []).map(task => typeAdapters.convertToTask(task));
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return [];
    }
  },
  
  // Update task notification preferences
  async updateNotificationChannel(taskId: string, channel: NotificationChannel): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ notification_channel: channel })
        .eq('id', taskId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating notification channel:', error);
      return false;
    }
  },
  
  // Start task processing
  async startTaskProcessing(taskId: string): Promise<boolean> {
    try {
      // Call the edge function to process the task
      const { error } = await supabase.functions.invoke('process-task', {
        body: { taskId },
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error starting task processing:', error);
      return false;
    }
  },
  
  // Subscribe to task status updates
  subscribeToTaskUpdates(taskId: string, callback: (task: Task) => void): (() => void) {
    const channel = supabase
      .channel(`task-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tasks',
          filter: `id=eq.${taskId}`
        },
        (payload) => {
          callback(typeAdapters.convertToTask(payload.new));
        }
      )
      .subscribe();
    
    // Return a function to unsubscribe
    return () => {
      supabase.removeChannel(channel);
    };
  },
  
  // Cancel a task
  async cancelTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'failed',
          result: 'Task was cancelled by the user.',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cancelling task:', error);
      return false;
    }
  },

  // Request a revision for a task
  async requestRevision(taskId: string, feedback: string): Promise<boolean> {
    try {
      // First check if the task has available revisions
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('revision_count, max_revisions, result')
        .eq('id', taskId)
        .single();
        
      if (taskError) throw taskError;
      
      if (!task || task.revision_count >= task.max_revisions) {
        throw new Error('Maximum number of revisions reached');
      }
      
      // Store the current result in the revisions history
      if (task.result) {
        const { error: revisionError } = await supabase
          .from('task_revisions')
          .insert({
            task_id: taskId,
            result: task.result,
            feedback: feedback
          });
          
        if (revisionError) throw revisionError;
      }
      
      // Update the task
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'processing',
          revision_count: task.revision_count + 1,
          feedback: feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Start the revision processing
      await this.startTaskProcessing(taskId);
      
      return true;
    } catch (error) {
      console.error('Error requesting revision:', error);
      return false;
    }
  },
  
  // Get revision history for a task
  async getTaskRevisions(taskId: string): Promise<TaskRevision[]> {
    try {
      const { data, error } = await supabase
        .from('task_revisions')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching task revisions:', error);
      return [];
    }
  },
  
  // Update output format
  async updateOutputFormat(taskId: string, format: OutputFormat): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ output_format: format })
        .eq('id', taskId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating output format:', error);
      return false;
    }
  }
};
