
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { SchoolSearchInput } from "../components/SchoolSearchInput";

interface ContactInfoSectionProps {
  form: UseFormReturn<FormValues>;
}

export const ContactInfoSection = ({ form }: ContactInfoSectionProps) => {
  return (
    <div className="form-section">
      <h2 className="form-subtitle">School & Contact Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="schoolName"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required="true">
                School Name *
              </FormLabel>
              <FormControl>
                <SchoolSearchInput 
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required="true">
                Contact Person *
              </FormLabel>
              <FormControl>
                <Input placeholder="Jane Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required="true">
                Contact Email *
              </FormLabel>
              <FormControl>
                <Input placeholder="jsmith@school.edu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
