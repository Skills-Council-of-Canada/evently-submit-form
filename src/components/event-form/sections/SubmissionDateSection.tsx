
import React from "react";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SubmissionDateSectionProps {
  form: UseFormReturn<FormValues>;
}

export const SubmissionDateSection: React.FC<SubmissionDateSectionProps> = ({ form }) => {
  // Set the current date when the component mounts
  React.useEffect(() => {
    // Ensure we're setting an actual Date object, not a string
    const currentDate = new Date();
    form.setValue("submissionDate", currentDate, { 
      shouldValidate: true 
    });
    
    console.log("Setting submissionDate as Date object:", currentDate);
  }, [form]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Submission Information</h3>
      
      <FormField
        control={form.control}
        name="submissionDate"
        render={({ field }) => {
          // Ensure we're always working with a Date object
          const dateValue = field.value instanceof Date ? 
            field.value : 
            (typeof field.value === 'string' ? new Date(field.value) : new Date());
          
          return (
            <FormItem>
              <FormLabel>Date of Submission</FormLabel>
              <FormControl>
                <Input
                  value={format(dateValue, "PPP")}
                  readOnly
                  className="bg-gray-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
