
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';
// AgentCategory is now defined locally below.
export type AgentCategory =
  | 'text-generation'
  | 'image-generation'
  | 'data-analysis'
  | 'conversational-ai'
  | 'code-generation'
  | 'translation'
  | 'other';

export const CATEGORY_OPTIONS = [
  { label: 'Text Generation', value: 'text-generation' as AgentCategory },
  { label: 'Image Generation', value: 'image-generation' as AgentCategory },
  { label: 'Data Analysis', value: 'data-analysis' as AgentCategory },
  { label: 'Conversational AI', value: 'conversational-ai' as AgentCategory },
  { label: 'Code Generation', value: 'code-generation' as AgentCategory },
  { label: 'Translation', value: 'translation' as AgentCategory },
  { label: 'Other', value: 'other' as AgentCategory },
];

interface CategoryFieldProps {
  control: Control<any>;
}

export const CategoryField: React.FC<CategoryFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {CATEGORY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Choose the category that best fits your agent's primary function.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
