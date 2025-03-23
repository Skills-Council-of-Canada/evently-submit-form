
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
    form.setValue("submissionDate", new Date());
  }, [form]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Submission Information</h3>
      
      <FormField
        control={form.control}
        name="submissionDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Submission</FormLabel>
            <FormControl>
              <Input
                value={field.value ? format(field.value, "PPP") : ""}
                readOnly
                className="bg-gray-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
