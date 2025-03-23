
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

export const ParticipationHighlightsSection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <div className="form-section">
      <h2 className="form-subtitle">Event Participation & Highlights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Who Was Involved?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List grade levels, classes, clubs, or community groups" 
                  className="resize-y"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                List grade levels, classes, clubs, or community groups
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="keyHighlights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Highlights or Activities</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What happened during the event that was special, different, or impactful?" 
                  className="resize-y"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Special, different, or impactful moments
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FormField
          control={form.control}
          name="specialGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Guests or Speakers</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Include names and titles, if applicable" 
                  className="resize-y"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Include names and titles, if applicable
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notableAchievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notable Student or Staff Achievements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Was someone recognized or featured at the event?" 
                  className="resize-y"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Recognition or features at the event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
