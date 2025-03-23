
import React from "react";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import TimeSelector from "./TimeSelector";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { Clock } from "lucide-react";

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
  
  return (
    <FormItem>
      <FormLabel aria-required={required ? "true" : "false"}>
        Event Time {required && "*"}
      </FormLabel>
      <FormControl>
        <div className="relative grid grid-cols-2 gap-4 py-4 px-6 rounded-md border border-input bg-background">
          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Start Time</span>
            </div>
            <TimeSelector
              title=""
              showLabel={false}
              hour={parsedTime.startHour}
              minute={parsedTime.startMinute}
              period={parsedTime.startPeriod}
              onHourChange={(hour) => updateTimeValue({ startHour: hour })}
              onMinuteChange={(minute) => updateTimeValue({ startMinute: minute })}
              onPeriodChange={(period) => updateTimeValue({ startPeriod: period as "AM" | "PM" })}
            />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">End Time</span>
            </div>
            <TimeSelector
              title=""
              showLabel={false}
              hour={parsedTime.endHour}
              minute={parsedTime.endMinute}
              period={parsedTime.endPeriod}
              onHourChange={(hour) => updateTimeValue({ endHour: hour })}
              onMinuteChange={(minute) => updateTimeValue({ endMinute: minute })}
              onPeriodChange={(period) => updateTimeValue({ endPeriod: period as "AM" | "PM" })}
            />
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
