
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import StarRating from '@/components/reviews/StarRating';
import { useTranslation } from 'react-i18next';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    category: string;
    rating?: number;
    reviews?: number;
    price: number;
    priceModel: string;
    image: string;
    provider: string;
  };
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Truncate description to fit within the card
  const truncatedDescription = agent.description.length > 100 ? agent.description.substring(0, 100) + '...' : agent.description;
  
  // Add function to navigate to task submission
  const handleSubmitTask = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/task-submission', { state: { agent } });
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
        <CardDescription>{agent.provider}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div
          className="aspect-video w-full bg-cover bg-center rounded-md mb-4"
          style={{ backgroundImage: `url(${agent.image})` }}
        />
        <p className="text-sm text-gray-600">{truncatedDescription}</p>
        <div className="mt-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {agent.category}
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {agent.priceModel}
          </span>
        </div>
      </CardContent>
    
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex items-center text-sm">
          {agent.rating !== undefined && (
            <div className="flex items-center">
              <StarRating rating={agent.rating} size="sm" className="mr-1" />
              <span>{agent.rating.toFixed(1)}</span>
              {agent.reviews !== undefined && (
                <span className="text-gray-500 ml-1">({agent.reviews})</span>
              )}
            </div>
          )}
          {agent.rating === undefined && (
            <span className="text-gray-500">No ratings yet</span>
          )}
        </div>
        <Button variant="default" size="sm" onClick={handleSubmitTask}>
          {t('agentCard.startButton', 'Start')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
