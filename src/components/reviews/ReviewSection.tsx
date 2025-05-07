
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { TaskReview } from '@/integrations/supabase/client'; // TODO: [SUPABASE_REMOVAL] Remove Supabase type import
import { reviewService } from '@/services/reviewService';

// TODO: [SUPABASE_REMOVAL] Define TaskReview locally or move to a shared types file
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
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';

interface ReviewSectionProps {
  taskId: string;
  userId: string;
  agentId: string;
  isTaskCompleted: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  taskId,
  userId,
  agentId,
  isTaskCompleted
}) => {
  const [review, setReview] = useState<TaskReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Fetch existing review if available
  useEffect(() => {
    const fetchReview = async () => {
      try {
        setIsLoading(true);
        const reviewData = await reviewService.getReviewByTaskId(taskId);
        setReview(reviewData);
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchReview();
    }
  }, [taskId]);

  const handleReviewSubmitted = (rating: number, reviewText: string | null) => {
    setReview({
      ...review!,
      rating,
      review_text: reviewText,
      updated_at: new Date().toISOString()
    });
    setIsEditing(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If task is not completed, don't show the review section
  if (!isTaskCompleted) {
    return null;
  }

  // If there's no review and we're not in editing mode
  if (!review && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate this task</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Share your feedback about this AI agent's performance to help others.
          </p>
          <Button 
            onClick={() => setIsEditing(true)} 
            className="w-full"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Leave a Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If we're in editing mode, show the review form
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {review ? 'Edit your review' : 'Rate this task'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewForm
            taskId={taskId}
            userId={userId}
            agentId={agentId}
            initialRating={review?.rating || 0}
            initialReviewText={review?.review_text || ''}
            onReviewSubmitted={handleReviewSubmitted}
          />
          {review && (
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // If there's a review and we're not in editing mode
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <StarRating rating={review!.rating} size="md" />
              <p className="text-sm text-muted-foreground mt-1">
                Submitted on {formatDate(review!.created_at)}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </div>
          
          {review!.review_text && (
            <>
              <Separator />
              <div>
                <p className="whitespace-pre-wrap text-sm">{review!.review_text}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
