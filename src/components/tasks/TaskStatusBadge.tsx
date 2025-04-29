
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { type TaskStatus } from '@/integrations/supabase/client';
import { 
  Clock, 
  Hourglass,
  CheckCircle2,
  XCircle 
} from 'lucide-react';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const TaskStatusBadge = ({ status, className }: TaskStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="secondary" className={className}>
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="default" className={`bg-amber-500 ${className}`}>
          <Hourglass className="h-3 w-3 mr-1" />
          Processing
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="default" className={`bg-green-500 ${className}`}>
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive" className={className}>
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return null;
  }
};

export default TaskStatusBadge;
