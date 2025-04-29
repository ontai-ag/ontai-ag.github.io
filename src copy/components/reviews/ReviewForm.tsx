
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import StarRating from './StarRating';
import { reviewService } from '@/services/reviewService';

interface ReviewFormProps {
  taskId: string;
  userId: string;
  agentId: string;
  initialRating?: number;
  initialReviewText?: string;
  onReviewSubmitted?: (rating: number, reviewText: string | null) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  taskId,
  userId,
  agentId,
  initialRating = 0,
  initialReviewText = '',
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [reviewText, setReviewText] = useState<string>(initialReviewText || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Review form submitted, starting process...");
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting review with data:", {
        taskId,
        userId,
        agentId,
        rating,
        reviewText: reviewText.trim() || undefined
      });
      
      const review = await reviewService.submitReview({
        taskId,
        userId,
        agentId,
        rating,
        reviewText: reviewText.trim() || undefined
      });
      
      console.log("Review submission response:", review);
      
      if (review) {
        toast({
          title: "Review submitted",
          description: "Your review has been submitted successfully.",
        });
        
        if (onReviewSubmitted) {
          console.log("Calling onReviewSubmitted callback");
          onReviewSubmitted(review.rating, review.review_text);
        } else {
          console.log("No onReviewSubmitted callback provided");
        }
      } else {
        console.error("Review service returned null");
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Rate your experience:
        </label>
        <div className="flex items-center gap-2">
          <StarRating 
            rating={rating} 
            size="lg" 
            onChange={setRating} 
          />
          <span className="text-sm text-muted-foreground ml-2">
            {rating > 0 ? `${rating}/5` : 'Select a rating'}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="reviewText" className="block text-sm font-medium">
          Review (optional):
        </label>
        <Textarea
          id="reviewText"
          placeholder="Share your thoughts about the AI agent's performance..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
