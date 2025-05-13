import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface TeamMemberCardProps {
  imageSrc: string;
  nameKey: string; // i18n key for name
  roleKey: string; // i18n key for role
  descriptionKey: string; // i18n key for description
  telegramLink: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  imageSrc, 
  nameKey, 
  roleKey, 
  descriptionKey, 
  telegramLink 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
      <img 
        src={imageSrc} 
        alt={t(nameKey)} 
        className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary"
      />
      <h3 className="text-xl font-semibold mb-1">{t(nameKey)}</h3>
      <p className="text-primary mb-2 font-medium">{t(roleKey)}</p>
      <p className="text-muted-foreground text-sm mb-4">
        {t(descriptionKey)}
      </p>
      <Button 
        asChild 
        variant="outline"
        className="mt-auto"
      >
        <a href={telegramLink} target="_blank" rel="noopener noreferrer">
          {t('aboutPage.team.telegramButton')} <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};

export default TeamMemberCard;