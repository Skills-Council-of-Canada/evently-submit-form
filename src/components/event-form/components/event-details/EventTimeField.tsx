import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schema";
import { 
  FormControl, 
  FormDescription, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface EventTimeFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EventTimeField = ({ form }: EventTimeFieldProps) => {
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
    <FormItem>
      <FormLabel>Event Time *</FormLabel>
      <FormControl>
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-md border border-input bg-white">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-xs font-medium text-gray-700 mr-2">From</span>
            
            <div className="flex gap-1">
              <Select value={parsedTime.startHour} onValueChange={(value) => updateTimeValue({ startHour: value })}>
                <SelectTrigger className="w-16 h-8 bg-white">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="bg-white min-w-[5rem]">
                  {hours.map((hour) => (
                    <SelectItem key={`start-hour-${hour}`} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={parsedTime.startMinute} onValueChange={(value) => updateTimeValue({ startMinute: value })}>
                <SelectTrigger className="w-16 h-8 bg-white">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent className="bg-white min-w-[5rem]">
                  {minutes.map((minute) => (
                    <SelectItem key={`start-min-${minute}`} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={parsedTime.startPeriod} onValueChange={(value) => updateTimeValue({ startPeriod: value as "AM" | "PM" })}>
                <SelectTrigger className="w-16 h-8 bg-white">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-white min-w-[5rem]">
                  {periods.map((period) => (
                    <SelectItem key={`start-period-${period}`} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <span className="text-gray-500 mx-1">—</span>
          
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">To</span>
            
            <div className="flex gap-1">
              <Select value={parsedTime.endHour} onValueChange={(value) => updateTimeValue({ endHour: value })}>
                <SelectTrigger className="w-16 h-8 bg-white">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="bg-white min-w-[5rem]">
                  {hours.map((hour) => (
                    <SelectItem key={`end-hour-${hour}`} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={parsedTime.endMinute} onValueChange={(value) => updateTimeValue({ endMinute: value })}>
                <SelectTrigger className="w-16 h-8 bg-white">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent className="bg-white min-w-[5rem]">
                  {minutes.map((minute) => (
                    <SelectItem key={`end-min-${minute}`} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={parsedTime.endPeriod} onValueChange={(value) => updateTimeValue({ endPeriod: value as "AM" | "PM" })}>
                <SelectTrigger className="w-16 h-8 bg-white">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-white min-w-[5rem]">
                  {periods.map((period) => (
                    <SelectItem key={`end-period-${period}`} value={period}>
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
