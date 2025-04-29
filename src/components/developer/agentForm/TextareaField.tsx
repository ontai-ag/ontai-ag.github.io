
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from 'react-hook-form';

interface TextareaFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  description: string;
  minHeight?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  description, 
  minHeight = "100px" 
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={placeholder} 
              className={`min-h-[${minHeight}]`} 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
