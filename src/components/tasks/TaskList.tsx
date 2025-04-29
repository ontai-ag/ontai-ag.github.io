
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import TaskStatusBadge from './TaskStatusBadge';
import type { Task } from '@/integrations/supabase/client';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading = false }) => {
  const navigate = useNavigate();
  
  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableCaption>A list of your recent tasks</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium whitespace-nowrap">
              {formatDate(task.created_at)}
            </TableCell>
            <TableCell className="max-w-[200px]">
              {truncateText(task.prompt)}
            </TableCell>
            <TableCell>
              <TaskStatusBadge status={task.status} />
            </TableCell>
            <TableCell>${task.price.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskList;
