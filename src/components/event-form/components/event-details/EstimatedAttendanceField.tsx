
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schema";

interface EstimatedAttendanceFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EstimatedAttendanceField = ({ form }: EstimatedAttendanceFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="estimatedAttendance"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Estimated Attendance
          </FormLabel>
          <FormControl>
            <Input placeholder="e.g., 100 students, 30 parents" {...field} value={field.value || ""} />
          </FormControl>
          <FormDescription>
            Approximate number of attendees
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
