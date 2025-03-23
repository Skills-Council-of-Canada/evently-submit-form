
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schema";

interface AudienceTypeFieldProps {
  form: UseFormReturn<FormValues>;
}

export const AudienceTypeField = ({ form }: AudienceTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="audienceType"
      render={({ field }) => (
        <FormItem>
          <FormLabel aria-required="true">
            Audience Type *
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select audience type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="parents">Parents</SelectItem>
              <SelectItem value="faculty">Faculty</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Who is the event intended for
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
