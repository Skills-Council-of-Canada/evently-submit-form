
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

export const EventDetailsSection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <div className="form-section">
      <h2 className="form-subtitle">Event Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
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
        
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel aria-required="true">
                Event Date *
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When the event will take place
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="eventTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required="true">
                Event Time *
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="6:00 PM - 8:00 PM"
                    {...field}
                  />
                </FormControl>
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <FormDescription>
                The start and end time of your event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
      </div>
      
      <div className="mt-6">
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
      </div>
    </div>
  );
};
