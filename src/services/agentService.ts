import { supabase, Agent, AgentCategory, AgentStatus, AgentPricingModel, typeAdapters } from '@/integrations/supabase/client';

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
      console.log("Creating agent with raw data:", agentData);
      
      const { data, error } = await supabase
        .from('ai_agents')
        .insert(agentData)
        .select()
        .single();
      
      if (error) {
        console.error("Error inserting agent:", error);
        throw error;
      }
      
      console.log("Agent created successfully:", data);
      return data ? typeAdapters.convertToAgent(data) : null;
    } catch (error) {
      console.error('Error creating agent:', error);
      return null;
    }
  },
  
  // Get a single agent by ID
  async getAgentById(agentId: string): Promise<Agent | null> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();
      
      if (error) throw error;
      return data ? typeAdapters.convertToAgent(data) : null;
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  },
  
  // Get all agents with optional filtering
  async getAgents(filter?: AgentFilter): Promise<Agent[]> {
    try {
      let query = supabase
        .from('ai_agents')
        .select('*');
      
      // Apply filters
      if (filter) {
        if (filter.category && filter.category !== 'all') {
          query = query.eq('category', filter.category);
        }
        
        if (filter.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }
        
        if (filter.userId) {
          query = query.eq('user_id', filter.userId);
        }
        
        if (filter.search) {
          query = query.or(`name.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
        }
        
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []).map(agent => typeAdapters.convertToAgent(agent));
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  },
  
  // Get agents created by a specific user
  async getUserAgents(userId: string): Promise<Agent[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return (data || []).map(agent => typeAdapters.convertToAgent(agent));
    } catch (error) {
      console.error('Error fetching user agents:', error);
      return [];
    }
  },
  
  // Update an agent
  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<boolean> {
    try {
      // Convert typed Agent data to raw DB format
      const dbUpdates: any = {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.category !== undefined && { category: updates.category }),
        ...(updates.input_format !== undefined && { input_format: updates.input_format }),
        ...(updates.output_format !== undefined && { output_format: updates.output_format }),
        ...(updates.pricing_model !== undefined && { pricing_model: updates.pricing_model }),
        ...(updates.hourly_rate !== undefined && { hourly_rate: updates.hourly_rate }),
        ...(updates.api_endpoint !== undefined && { api_endpoint: updates.api_endpoint }),
        ...(updates.status !== undefined && { status: updates.status }),
      };
      
      const { error } = await supabase
        .from('ai_agents')
        .update(dbUpdates)
        .eq('id', agentId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating agent:', error);
      return false;
    }
  }
};
