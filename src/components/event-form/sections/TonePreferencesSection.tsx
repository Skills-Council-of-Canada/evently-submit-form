
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

export const TonePreferencesSection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <div className="form-section">
      <h2 className="form-subtitle">Content Highlight Preferences</h2>
      
      <div className="mt-4">
        <FormField
          control={form.control}
          name="contentHighlight"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>What should this content highlight most? *</FormLabel>
              <FormDescription>
                Choose one focus for your event content
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Student Achievement" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Student Achievement
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="School Community Engagement" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      School Community Engagement
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Classroom Innovation" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Classroom Innovation
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Partnership or Collaboration" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Partnership or Collaboration
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Staff Recognition" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Staff Recognition
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Extracurricular Success" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Extracurricular Success
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
