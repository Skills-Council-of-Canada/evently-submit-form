
import React from "react";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InlineTimeFieldProps {
  form: UseFormReturn<FormValues>;
  required?: boolean;
}

const InlineTimeField = ({ form, required = true }: InlineTimeFieldProps) => {
  // Parse current time value from form
  const parseTimeString = (timeString: string) => {
    const defaultTime = {
      startHour: "8",
      startMinute: "00",
      startPeriod: "AM" as const,
      endHour: "9",
      endMinute: "00",
      endPeriod: "AM" as const
    };
    
    if (!timeString) return defaultTime;
    
    const timePattern = /(\d{1,2}):(\d{2}) (AM|PM) - (\d{1,2}):(\d{2}) (AM|PM)/;
    const match = timeString.match(timePattern);
    
    if (match) {
      return {
        startHour: match[1],
        startMinute: match[2],
        startPeriod: match[3] as "AM" | "PM",
        endHour: match[4],
        endMinute: match[5],
        endPeriod: match[6] as "AM" | "PM",
      };
    }
    
    return defaultTime;
  };
  
  const currentValue = form.watch("eventTime") || "8:00 AM - 9:00 AM";
  const parsedTime = parseTimeString(currentValue);
  
  // Update the time string when any value changes
  const updateTimeValue = (newValues: Partial<ReturnType<typeof parseTimeString>>) => {
    const updatedTime = { ...parsedTime, ...newValues };
    
    const startMin = updatedTime.startMinute.padStart(2, '0');
    const endMin = updatedTime.endMinute.padStart(2, '0');
    
    const formattedTime = `${updatedTime.startHour}:${startMin} ${updatedTime.startPeriod} - ${updatedTime.endHour}:${endMin} ${updatedTime.endPeriod}`;
    form.setValue("eventTime", formattedTime, { shouldValidate: true });
  };

  // Hours options: 1-12
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  // Minutes options: 00, 15, 30, 45
  const minutes = ["00", "15", "30", "45"];
  
  // Periods: AM, PM
  const periods = ["AM", "PM"];
  
  return (
    <FormItem className="col-span-full">
      <FormLabel aria-required={required ? "true" : "false"}>
        Event Time {required && "*"}
      </FormLabel>
      <FormControl>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-md border border-input bg-background">
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Start Time</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Select 
                value={parsedTime.startHour} 
                onValueChange={(value) => updateTimeValue({ startHour: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {hours.map((hour) => (
                    <SelectItem key={`start-hour-${hour}`} value={hour} className="cursor-pointer">
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={parsedTime.startMinute} 
                onValueChange={(value) => updateTimeValue({ startMinute: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {minutes.map((minute) => (
                    <SelectItem key={`start-min-${minute}`} value={minute} className="cursor-pointer">
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={parsedTime.startPeriod} 
                onValueChange={(value) => updateTimeValue({ startPeriod: value as "AM" | "PM" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {periods.map((period) => (
                    <SelectItem key={`start-period-${period}`} value={period} className="cursor-pointer">
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">End Time</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Select 
                value={parsedTime.endHour} 
                onValueChange={(value) => updateTimeValue({ endHour: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {hours.map((hour) => (
                    <SelectItem key={`end-hour-${hour}`} value={hour} className="cursor-pointer">
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={parsedTime.endMinute} 
                onValueChange={(value) => updateTimeValue({ endMinute: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {minutes.map((minute) => (
                    <SelectItem key={`end-min-${minute}`} value={minute} className="cursor-pointer">
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={parsedTime.endPeriod} 
                onValueChange={(value) => updateTimeValue({ endPeriod: value as "AM" | "PM" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {periods.map((period) => (
                    <SelectItem key={`end-period-${period}`} value={period} className="cursor-pointer">
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </FormControl>
      <FormDescription>
        The start and end time of your event
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
};

export default InlineTimeField;
