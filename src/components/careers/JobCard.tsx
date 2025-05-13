// src/components/careers/JobCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import type { Job } from '@/data/careers'; // Assuming Job type is exported from careers data

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary-dark transition-colors">
          {job.title}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            <Briefcase className="h-3 w-3 mr-1" />
            {job.department}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {job.location}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full justify-start text-primary hover:text-primary-dark">
          <Link to={`/careers/${job.slug}`}>
            {/* Consider using a more descriptive text or t() for localization */}
            Узнать больше
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;