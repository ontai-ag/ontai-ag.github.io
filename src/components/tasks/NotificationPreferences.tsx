
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { NotificationChannel } from '@/integrations/supabase/client';
import { Mail, MessageSquare, Slack, BellOff } from 'lucide-react';

interface NotificationPreferencesProps {
  value: NotificationChannel;
  onChange: (value: NotificationChannel) => void;
}

const NotificationPreferences = ({ value, onChange }: NotificationPreferencesProps) => {
  return (
    <RadioGroup 
      value={value} 
      onValueChange={(val) => onChange(val as NotificationChannel)}
      className="grid grid-cols-2 gap-4 pt-2"
    >
      <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
        <RadioGroupItem value="email" id="email" />
        <Label htmlFor="email" className="flex items-center cursor-pointer">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Label>
      </div>
      
      <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
        <RadioGroupItem value="sms" id="sms" />
        <Label htmlFor="sms" className="flex items-center cursor-pointer">
          <MessageSquare className="h-4 w-4 mr-2" />
          SMS
        </Label>
      </div>
      
      <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
        <RadioGroupItem value="slack" id="slack" />
        <Label htmlFor="slack" className="flex items-center cursor-pointer">
          <Slack className="h-4 w-4 mr-2" />
          Slack
        </Label>
      </div>
      
      <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
        <RadioGroupItem value="none" id="none" />
        <Label htmlFor="none" className="flex items-center cursor-pointer">
          <BellOff className="h-4 w-4 mr-2" />
          None
        </Label>
      </div>
    </RadioGroup>
  );
};

export default NotificationPreferences;
