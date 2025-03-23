
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schema";

interface EventLocationFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EventLocationField = ({ form }: EventLocationFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="eventLocation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Event Location (Room or Area)
          </FormLabel>
          <FormControl>
            <Input placeholder="Gymnasium, Library, Outdoor Field" {...field} value={field.value || ""} />
          </FormControl>
          <FormDescription>
            Where the event will take place
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
