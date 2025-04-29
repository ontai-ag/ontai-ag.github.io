
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare } from 'lucide-react';
import { TaskRevision } from '@/integrations/supabase/client';

interface RevisionsHistoryProps {
  revisions: TaskRevision[];
}

const RevisionsHistory: React.FC<RevisionsHistoryProps> = ({ revisions }) => {
  if (revisions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No revision history available.
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Revision History</h3>
      
      <Accordion type="single" collapsible className="w-full">
        {revisions.map((revision, index) => (
          <AccordionItem key={revision.id} value={revision.id} className="border border-border rounded-md mb-3 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-accent/50 hover:no-underline">
              <div className="flex flex-col sm:flex-row sm:items-center w-full text-left">
                <div className="flex items-center font-medium">
                  <Badge variant="outline" className="mr-2">
                    Revision #{revisions.length - index}
                  </Badge>
                </div>
                <div className="flex items-center text-muted-foreground text-sm mt-1 sm:mt-0 sm:ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(revision.created_at)}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4 bg-accent/10">
              <div className="space-y-4 text-sm">
                {revision.feedback && (
                  <div className="p-3 bg-background rounded-md">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                      <h4 className="font-medium">Feedback Provided</h4>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{revision.feedback}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Previous Result</h4>
                  <ScrollArea className="h-[200px] border rounded-md p-4 bg-background">
                    <p className="whitespace-pre-wrap">{revision.result}</p>
                  </ScrollArea>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default RevisionsHistory;
