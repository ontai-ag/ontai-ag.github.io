
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';

interface InputFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  description,
  type = "text" 
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type={type}
              placeholder={placeholder}
              {...field} 
            />
          </FormControl>
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
