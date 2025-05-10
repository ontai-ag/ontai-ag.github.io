// import { supabase, Agent, AgentCategory, AgentStatus, AgentPricingModel, typeAdapters } from '@/integrations/supabase/client'; // TODO: [SUPABASE_REMOVAL] Remove Supabase client and types

// TODO: [SUPABASE_REMOVAL] Define these types locally or import from a non-Supabase source
// For now, using placeholder types. These should be properly defined or imported from your new backend/type definitions.
export type AgentCategory = 'Productivity' | 'Development' | 'Marketing' | 'Content Creation' | 'Customer Support' | 'Data Analysis' | 'Education' | 'Research' | 'Utilities' | 'Other';
export type AgentStatus = 'active' | 'inactive' | 'pending' | 'rejected';
export type AgentPricingModel = 'free' | 'pay-per-use' | 'subscription' | 'custom';

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: AgentCategory;
  input_format: string; // Consider making this a specific type/enum
  output_format: string; // Consider making this a specific type/enum
  pricing_model: AgentPricingModel;
  price?: number | null; // Added for consistency with AgentWithUIDetails
  hourly_rate?: number | null;
  api_endpoint?: string | null;
  status: AgentStatus;
  avg_rating?: number | null;
  total_reviews?: number | null;
  created_at: string;
  updated_at: string;
  // Add other fields as necessary from your actual Agent definition
}

export interface AgentWithUIDetails extends Agent {
  // UI-specific fields or extended details
  profile_picture_url?: string;
  tags?: string[];
  // Example: if it includes user profile info
  user_name?: string;
  user_avatar_url?: string;
}

export interface ProfileData {
  id: string;
  username?: string;
  avatar_url?: string;
  // Add other profile fields
}

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

export interface TaskReview {
  id: string;
  task_id: string;
  user_id: string;
  agent_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentLog {
  id: string;
  task_id: string;
  amount: number;
  status: 'succeeded' | 'failed' | 'pending';
  payment_method: string;
  transaction_id?: string | null;
  created_at: string;
}

export interface PaymentDetails {
  payment_intent_id: string;
  client_secret: string;
  amount: number;
  currency: string;
}

// TODO: [SUPABASE_REMOVAL] Placeholder for typeAdapters. This should be replaced with actual data transformation logic if needed.
const typeAdapters = {
  convertToAgent: (data: any): Agent => data as Agent, // This is a naive conversion
  // Add other adapters if they were used, e.g., convertToTask, convertToAgentWithUIDetails etc.
};

// TODO: [SUPABASE_REMOVAL] Placeholder for supabase client. This mock allows the service to function without Supabase.
// Replace with actual API calls to your new backend.
const supabase: any = { 
  from: (tableName: string) => ({ 
    select: (...args: any[]) => ({ 
      eq: (column: string, value: any) => ({
        single: async () => {
          console.warn(`[SUPABASE_REMOVAL_MOCK] supabase.from('${tableName}').select().eq('${column}', '${value}').single() called`);
          return Promise.resolve({ data: null, error: new Error(`Mock Supabase: Data not found for ${tableName}`) });
        },
        order: async () => {
          console.warn(`[SUPABASE_REMOVAL_MOCK] supabase.from('${tableName}').select().eq().order() called`);
          return Promise.resolve({ data: [], error: new Error(`Mock Supabase: Data not found for ${tableName}`) });
        }
      }),
      or: (filterString: string) => ({
        limit: async (count: number) => {
          console.warn(`[SUPABASE_REMOVAL_MOCK] supabase.from('${tableName}').select().or('${filterString}').limit(${count}) called`);
          return Promise.resolve({ data: [], error: new Error(`Mock Supabase: Data not found for ${tableName}`) });
        }
      }),
      limit: async (count: number) => {
        console.warn(`[SUPABASE_REMOVAL_MOCK] supabase.from('${tableName}').select().limit(${count}) called`);
        return Promise.resolve({ data: [], error: new Error(`Mock Supabase: Data not found for ${tableName}`) });
      }
    }),
    insert: (dataToInsert: any) => ({
      select: () => ({
        single: async () => {
          console.warn(`[SUPABASE_REMOVAL_MOCK] supabase.from('${tableName}').insert().select().single() called with:`, dataToInsert);
          // Return a mock of the inserted data, e.g., with an ID
          return Promise.resolve({ data: { id: `mock_id_${Date.now()}`, ...dataToInsert }, error: null });
        }
      })
    }),
    update: (dataToUpdate: any) => ({
      eq: async (column: string, value: any) => {
        console.warn(`[SUPABASE_REMOVAL_MOCK] supabase.from('${tableName}').update().eq('${column}', '${value}') called with:`, dataToUpdate);
        return Promise.resolve({ error: null }); // Simulate successful update
      }
    }),
  })
};

export interface AgentFilter {
  category?: AgentCategory | 'all';
  status?: AgentStatus | 'all';
  search?: string;
  userId?: string;
  limit?: number;
}

export interface CreateAgentData {
  user_id: string;
  name: string;
  description: string;
  category: string;
  input_format: string;
  output_format: string;
  pricing_model: string;
  hourly_rate: number | null;
  api_endpoint: string | null;
  status?: string;
}

export const agentService = {
  // Create agent data for new agents
  async createAgent(agentData: CreateAgentData): Promise<Agent | null> {
    try {
      // TODO: [SUPABASE_REMOVAL] Implement agent creation with new backend.
      console.log("[SUPABASE_REMOVAL] Attempting to create agent with raw data:", agentData);
      
      // const { data, error } = await supabase
      //   .from('ai_agents')
      //   .insert(agentData)
      //   .select()
      //   .single();
      
      // if (error) {
      //   console.error("Error inserting agent:", error);
      //   throw error;
      // }
      
      // console.log("Agent created successfully:", data);
      // return data ? typeAdapters.convertToAgent(data) : null;
      const mockAgent: Agent = {
        id: `mock_agent_${Date.now()}`,
        user_id: agentData.user_id,
        name: agentData.name,
        description: agentData.description,
        category: agentData.category as AgentCategory,
        input_format: agentData.input_format,
        output_format: agentData.output_format,
        pricing_model: agentData.pricing_model as AgentPricingModel,
        hourly_rate: agentData.hourly_rate,
        api_endpoint: agentData.api_endpoint,
        status: (agentData.status || 'pending') as AgentStatus,
        avg_rating: 0,
        total_reviews: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.warn('[SUPABASE_REMOVAL] Returning mock agent for createAgent, Supabase removed.');
      return typeAdapters.convertToAgent(mockAgent); // Use adapter if it's still relevant for structure
    } catch (error) {
      console.error('Error creating agent:', error);
      return null;
    }
  },
  
  // Get a single agent by ID
  async getAgentById(agentId: string): Promise<Agent | null> {
    try {
      // TODO: [SUPABASE_REMOVAL] Implement fetching agent by ID with new backend.
      // const { data, error } = await supabase
      //   .from('ai_agents')
      //   .select('*')
      //   .eq('id', agentId)
      //   .single();
      
      // if (error) throw error;
      // return data ? typeAdapters.convertToAgent(data) : null;
      console.warn('[SUPABASE_REMOVAL] Returning null for getAgentById, Supabase removed.');
      return null;
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  },
  
  // Get all agents with optional filtering
  async getAgents(filter?: AgentFilter): Promise<Agent[]> {
    try {
      // TODO: [SUPABASE_REMOVAL] Implement fetching agents with new backend.
      // let query = supabase
      //   .from('ai_agents')
      //   .select('*');
      
      // // Apply filters
      // if (filter) {
      //   if (filter.category && filter.category !== 'all') {
      //     query = query.eq('category', filter.category);
      //   }
        
      //   if (filter.status && filter.status !== 'all') {
      //     query = query.eq('status', filter.status);
      //   }
        
      //   if (filter.userId) {
      //     query = query.eq('user_id', filter.userId);
      //   }
        
      //   if (filter.search) {
      //     query = query.or(`name.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
      //   }
        
      //   if (filter.limit) {
      //     query = query.limit(filter.limit);
      //   }
      // }
      
      // const { data, error } = await query;
      
      // if (error) throw error;
      // return (data || []).map(agent => typeAdapters.convertToAgent(agent));
      console.warn('[SUPABASE_REMOVAL] Returning empty array for getAgents, Supabase removed.');
      return [];
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  },
  
  // Get agents created by a specific user
  async getUserAgents(userId: string): Promise<Agent[]> {
    try {
      // TODO: [SUPABASE_REMOVAL] Implement fetching user agents with new backend.
      // const { data, error } = await supabase
      //   .from('ai_agents')
      //   .select('*')
      //   .eq('user_id', userId);
      
      // if (error) throw error;
      // return (data || []).map(agent => typeAdapters.convertToAgent(agent));
      console.warn('[SUPABASE_REMOVAL] Returning empty array for getUserAgents, Supabase removed.');
      return [];
    } catch (error) {
      console.error('Error fetching user agents:', error);
      return [];
    }
  },
  
  // Update an agent
  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<boolean> {
    try {
      // TODO: [SUPABASE_REMOVAL] Implement agent update with new backend.
      // Convert typed Agent data to raw DB format
      // const dbUpdates: any = {
      //   ...(updates.name !== undefined && { name: updates.name }),
      //   ...(updates.description !== undefined && { description: updates.description }),
      //   ...(updates.category !== undefined && { category: updates.category }),
      //   ...(updates.input_format !== undefined && { input_format: updates.input_format }),
      //   ...(updates.output_format !== undefined && { output_format: updates.output_format }),
      //   ...(updates.pricing_model !== undefined && { pricing_model: updates.pricing_model }),
      //   ...(updates.hourly_rate !== undefined && { hourly_rate: updates.hourly_rate }),
      //   ...(updates.api_endpoint !== undefined && { api_endpoint: updates.api_endpoint }),
      //   ...(updates.status !== undefined && { status: updates.status }),
      // };
      
      // const { error } = await supabase
      //   .from('ai_agents')
      //   .update(dbUpdates)
      //   .eq('id', agentId);
      
      // if (error) throw error;
      // return true;
      console.warn('[SUPABASE_REMOVAL] Returning false for updateAgent, Supabase removed.');
      return false;
    } catch (error) {
      console.error('Error updating agent:', error);
      return false;
    }
  }
};
