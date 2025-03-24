
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schema";

interface EventNameFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EventNameField = ({ form }: EventNameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="eventName"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel aria-required="true">
            Event Name *
          </FormLabel>
          <FormControl>
            <Input placeholder="Spring Science Fair" {...field} />
          </FormControl>
          <FormDescription>
            The official name of your event
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
