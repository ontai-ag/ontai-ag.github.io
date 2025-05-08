
import React from 'react';
import { Progress } from '@/components/ui/progress';
//import { type TaskStatus } from '@/integrations/supabase/client';

interface TaskProgressIndicatorProps {
  status: TaskStatus;
  className?: string;
}

const TaskProgressIndicator = ({ status, className }: TaskProgressIndicatorProps) => {
  if (status === 'processing') {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <img src="/ezgif-1de2b2f378170e.gif" alt="Loading..." className="h-10 w-10" />
      </div>
    );
  }

  const getProgressValue = () => {
    switch(status) {
      case 'pending': return 25;
      // case 'processing': return 65; // Removed as it's handled above
      case 'completed': return 100;
      case 'failed': return 100;
      default: return 0;
    }
  };

  // Render progress bar and text for non-processing states
  if (status !== 'processing') {
    return (
      <div className={`space-y-2 ${className}`}>
        <Progress value={getProgressValue()} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={status === 'pending' ? 'font-medium text-primary' : ''}>Submitted</span>
          {/* Removed Processing span as it's handled by the GIF */}
          <span className={status === 'completed' || status === 'failed' ? 'font-medium text-primary' : ''}>
            {status === 'failed' ? 'Failed' : 'Completed'}
          </span>
        </div>
      </div>
    );
  }

  return null; // Should not reach here, but added for completeness
};

export default TaskProgressIndicator;
