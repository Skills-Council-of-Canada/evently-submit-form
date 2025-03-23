
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import InlineTimeField from "../components/InlineTimeField";

export const EventDetailsSection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Make sure the eventTime has a default value if it's not set
  React.useEffect(() => {
    const currentTime = form.getValues("eventTime");
    if (!currentTime) {
      const defaultTime = "8:00 AM - 9:00 AM";
      form.setValue("eventTime", defaultTime);
      console.log("Set default event time:", defaultTime);
    }
  }, [form]);

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
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
                        format(new Date(field.value), "PPP")
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
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date);
                      // Close the calendar when a date is selected
                      setCalendarOpen(false);
                    }}
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
          render={() => (
            <InlineTimeField form={form} />
          )}
        />
        
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
