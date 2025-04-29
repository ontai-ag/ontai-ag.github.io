
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  onChange,
  className
}) => {
  const isInteractive = !!onChange;
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const starSize = sizeClasses[size];
  
  const handleClick = (selectedRating: number) => {
    if (onChange) {
      onChange(selectedRating);
    }
  };
  
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <Star
            key={index}
            className={cn(
              starSize,
              isInteractive && 'cursor-pointer transition-colors',
              isFilled ? 'fill-amber-400 text-amber-400' : 'text-gray-300',
              isInteractive && !isFilled && 'hover:text-amber-200'
            )}
            onClick={isInteractive ? () => handleClick(starValue) : undefined}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
