
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

export const MediaMessagingSection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <div className="form-section">
      <h2 className="form-subtitle">Media & Messaging</h2>
      
      <div className="mt-4">
        <FormField
          control={form.control}
          name="imagePermission"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Do you have permission to use this image publicly? *
                </FormLabel>
                <FormDescription>
                  We can only use images where all identifiable people have given consent
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6">
        <FormField
          control={form.control}
          name="suggestedCaption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suggested Caption (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a sentence or two to accompany your image"
                  className="resize-y"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Write a sentence or two to accompany your image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
