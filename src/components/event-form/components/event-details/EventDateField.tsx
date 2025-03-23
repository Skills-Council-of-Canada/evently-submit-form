
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schema";

interface EventDateFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EventDateField = ({ form }: EventDateFieldProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
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
                    "pl-3 text-left font-normal bg-white",
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
            <PopoverContent className="w-auto p-0 bg-white" align="start">
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
  );
};
