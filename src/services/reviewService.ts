// import { supabase } from '@/integrations/supabase/client';
// import type { TaskReview } from '@/integrations/supabase/client';

export interface CreateReviewParams {
  taskId: string;
  userId: string;
  agentId: string;
  rating: number;
  reviewText?: string;
}

export const reviewService = {
  // Create or update a review for a task
  async submitReview(params: CreateReviewParams): Promise<TaskReview | null> {
    try {
      console.log("ReviewService: Starting submitReview process");
      
      // Check if a review already exists for this task
      const { data: existingReview, error: checkError } = await supabase
        .from('task_reviews')
        .select('*')
        .eq('task_id', params.taskId)
        .maybeSingle();
      
      if (checkError) {
        console.error("ReviewService: Error checking for existing review:", checkError);
        throw checkError;
      }
      
      console.log("ReviewService: Existing review check result:", existingReview);
      
      if (existingReview) {
        // Update the existing review
        console.log("ReviewService: Updating existing review");
        const { data, error } = await supabase
          .from('task_reviews')
          .update({
            rating: params.rating,
            review_text: params.reviewText || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id)
          .select()
          .single();
        
        if (error) {
          console.error("ReviewService: Error updating review:", error);
          throw error;
        }
        
        console.log("ReviewService: Review updated successfully:", data);
        return data;
      } else {
        // Create a new review
        console.log("ReviewService: Creating new review");
        const { data, error } = await supabase
          .from('task_reviews')
          .insert({
            task_id: params.taskId,
            user_id: params.userId,
            agent_id: params.agentId,
            rating: params.rating,
            review_text: params.reviewText || null
          })
          .select()
          .single();
        
        if (error) {
          console.error("ReviewService: Error inserting review:", error);
          throw error;
        }
        
        console.log("ReviewService: Review created successfully:", data);
        return data;
      }
    } catch (error) {
      console.error('ReviewService: Error in submitReview function:', error);
      return null;
    }
  },
  
  // Get a review for a specific task
  async getReviewByTaskId(taskId: string): Promise<TaskReview | null> {
    try {
      console.log("ReviewService: Getting review for task:", taskId);
      const { data, error } = await supabase
        .from('task_reviews')
        .select('*')
        .eq('task_id', taskId)
        .maybeSingle();
      
      if (error) {
        console.error("ReviewService: Error fetching review by task ID:", error);
        throw error;
      }
      
      console.log("ReviewService: Got review by task ID result:", data);
      return data;
    } catch (error) {
      console.error('ReviewService: Error in getReviewByTaskId function:', error);
      return null;
    }
  },
  
  // Get all reviews for a specific agent
  async getAgentReviews(agentId: string, limit?: number): Promise<TaskReview[]> {
    try {
      console.log("ReviewService: Getting reviews for agent:", agentId);
      let query = supabase
        .from('task_reviews')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("ReviewService: Error fetching agent reviews:", error);
        throw error;
      }
      
      console.log("ReviewService: Got agent reviews, count:", data?.length);
      return data || [];
    } catch (error) {
      console.error('ReviewService: Error in getAgentReviews function:', error);
      return [];
    }
  },
  
  // Delete a review
  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      console.log("ReviewService: Deleting review:", reviewId);
      const { error } = await supabase
        .from('task_reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) {
        console.error("ReviewService: Error deleting review:", error);
        throw error;
      }
      
      console.log("ReviewService: Review deleted successfully");
      return true;
    } catch (error) {
      console.error('ReviewService: Error in deleteReview function:', error);
      return false;
    }
  }
};
