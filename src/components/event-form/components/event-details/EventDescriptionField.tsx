
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schema";

interface EventDescriptionFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EventDescriptionField = ({ form }: EventDescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel aria-required="true">
            Event Description *
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Provide details about your event..."
              className="resize-y"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Describe what the event is about (500 characters max)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
