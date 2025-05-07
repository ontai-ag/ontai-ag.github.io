// import { supabase, Agent, AgentCategory, AgentStatus, AgentPricingModel, typeAdapters } from '@/integrations/supabase/client'; // TODO: [SUPABASE_REMOVAL] Remove Supabase client and types
import { Agent, typeAdapters, AgentWithUIDetails, ProfileData, Task, TaskReview, PaymentLog, PaymentDetails } from '@/integrations/supabase/client'; // Assuming these types are now placeholders or will be redefined
import type { AgentCategory, AgentStatus, AgentPricingModel } from '@/integrations/supabase/client'; // Import as types if they are just string unions now

// TODO: [SUPABASE_REMOVAL] Placeholder for supabase client if needed by other logic, otherwise remove.
const supabase: any = { 
  from: (tableName: string) => ({ 
    select: (...args: any[]) => ({ 
      eq: (column: string, value: any) => ({ 
        single: () => Promise.resolve({ data: null, error: new Error(`Supabase removed, called select on ${tableName}`) }),
        order: () => Promise.resolve({ data: [], error: new Error(`Supabase removed, called select on ${tableName}`) })
      }),
      or: () => ({ // Added 'or' for search functionality
        limit: () => Promise.resolve({ data: [], error: new Error(`Supabase removed, called select with or/limit on ${tableName}`) })
      }),
      limit: () => Promise.resolve({ data: [], error: new Error(`Supabase removed, called select with limit on ${tableName}`) })
    }),
    insert: (data: any) => ({ 
      select: () => ({ 
        single: () => Promise.resolve({ data: null, error: new Error(`Supabase removed, called insert on ${tableName}`) })
      })
    }),
    update: (data: any) => ({ 
      eq: (column: string, value: any) => Promise.resolve({ error: new Error(`Supabase removed, called update on ${tableName}`) })
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
