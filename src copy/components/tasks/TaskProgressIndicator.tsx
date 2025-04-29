
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { type TaskStatus } from '@/integrations/supabase/client';

interface TaskProgressIndicatorProps {
  status: TaskStatus;
  className?: string;
}

const TaskProgressIndicator = ({ status, className }: TaskProgressIndicatorProps) => {
  const getProgressValue = () => {
    switch(status) {
      case 'pending': return 25;
      case 'processing': return 65;
      case 'completed': return 100;
      case 'failed': return 100;
      default: return 0;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Progress value={getProgressValue()} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className={status === 'pending' ? 'font-medium text-primary' : ''}>Submitted</span>
        <span className={status === 'processing' ? 'font-medium text-primary' : ''}>Processing</span>
        <span className={status === 'completed' || status === 'failed' ? 'font-medium text-primary' : ''}>
          {status === 'failed' ? 'Failed' : 'Completed'}
        </span>
      </div>
    </div>
  );
};

export default TaskProgressIndicator;
