
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { taskService } from '@/services/taskService';
import { useToast } from '@/hooks/use-toast';

interface RevisionRequestFormProps {
  taskId: string;
  currentRevisions: number;
  maxRevisions: number;
  onRevisionRequested: () => void;
}

const RevisionRequestForm: React.FC<RevisionRequestFormProps> = ({
  taskId,
  currentRevisions,
  maxRevisions,
  onRevisionRequested
}) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const revisionsRemaining = maxRevisions - currentRevisions;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setError('Please provide feedback for the revision');
      return;
    }
    
    if (revisionsRemaining <= 0) {
      setError('No revisions remaining');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await taskService.requestRevision(taskId, feedback);
      
      if (success) {
        toast({
          title: "Revision requested",
          description: "Your revision request has been submitted successfully",
        });
        setFeedback('');
        onRevisionRequested();
      } else {
        setError('Failed to request revision. Please try again.');
      }
    } catch (err) {
      console.error('Error requesting revision:', err);
      setError('An error occurred while requesting a revision');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Request a Revision</h3>
        <span className="text-sm text-muted-foreground">
          {revisionsRemaining} {revisionsRemaining === 1 ? 'revision' : 'revisions'} remaining
        </span>
      </div>
      
      {revisionsRemaining <= 0 ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have used all available revisions for this task.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Provide specific feedback about what you'd like to change..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            disabled={isSubmitting}
            className="resize-none"
          />
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !feedback.trim() || revisionsRemaining <= 0}
            className={isSubmitting ? "opacity-70" : ""}
          >
            {isSubmitting ? "Submitting..." : "Submit Revision Request"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default RevisionRequestForm;
