
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';
// AgentPricingModel is now defined locally below.
export type AgentPricingModel = 'free' | 'pay-per-use' | 'subscription' | 'custom';

export const PRICING_OPTIONS = [
  { label: 'Free', value: 'free' as AgentPricingModel },
  { label: 'Pay-per-use', value: 'pay-per-use' as AgentPricingModel },
  { label: 'Subscription', value: 'subscription' as AgentPricingModel },
  { label: 'Custom', value: 'custom' as AgentPricingModel },
];

interface PricingFieldProps {
  control: Control<any>;
}

export const PricingField: React.FC<PricingFieldProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="pricingModel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pricing Model</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pricing model" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PRICING_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose how you want to monetize your agent.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Show hourly rate field for all pricing models except 'free' */}
      <FormField
        control={control}
        name="hourlyRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hourly Rate (USD)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={control._formValues.pricingModel === 'free'}
                {...field}
                onChange={(e) => {
                  // Ensure the value is a valid number
                  const value = e.target.value;
                  if (value === '' || !isNaN(parseFloat(value))) {
                    field.onChange(value === '' ? '' : parseFloat(value));
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              {control._formValues.pricingModel === 'free' 
                ? 'No hourly rate for free agents.' 
                : 'Set the hourly rate for your agent (USD).'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
