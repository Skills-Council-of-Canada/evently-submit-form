
import React, { useEffect } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TimeSelector from "./TimeSelector";

interface TimeValue {
  startHour: string;
  startMinute: string;
  startPeriod: "AM" | "PM";
  endHour: string;
  endMinute: string;
  endPeriod: "AM" | "PM";
}

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TimePicker = ({ value, onChange, placeholder = "Select time" }: TimePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [timeValue, setTimeValue] = React.useState<TimeValue>({
    startHour: "8",
    startMinute: "00",
    startPeriod: "AM",
    endHour: "9",
    endMinute: "00",
    endPeriod: "AM",
  });
  
  // Parse existing value when component mounts or value changes
  useEffect(() => {
    if (value) {
      const timePattern = /(\d{1,2}):(\d{2}) (AM|PM) - (\d{1,2}):(\d{2}) (AM|PM)/;
      const match = value.match(timePattern);
      
      if (match) {
        setTimeValue({
          startHour: match[1],
          startMinute: match[2],
          startPeriod: match[3] as "AM" | "PM",
          endHour: match[4],
          endMinute: match[5],
          endPeriod: match[6] as "AM" | "PM",
        });
      }
    }
  }, [value]);

  // Update the formatted time string when any time value changes
  const updateTime = (newTimeValue: Partial<TimeValue>) => {
    const updatedTimeValue = { ...timeValue, ...newTimeValue };
    setTimeValue(updatedTimeValue);
    
    const formattedTime = `${updatedTimeValue.startHour}:${updatedTimeValue.startMinute} ${updatedTimeValue.startPeriod} - ${updatedTimeValue.endHour}:${updatedTimeValue.endMinute} ${updatedTimeValue.endPeriod}`;
    console.log("Setting formatted time:", formattedTime);
    onChange(formattedTime);
  };
  
  // If the component loads without a value, initialize with default time
  useEffect(() => {
    if (!value) {
      const defaultTime = `${timeValue.startHour}:${timeValue.startMinute} ${timeValue.startPeriod} - ${timeValue.endHour}:${timeValue.endMinute} ${timeValue.endPeriod}`;
      console.log("Setting default time:", defaultTime);
      onChange(defaultTime);
    }
  }, []);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pr-10"
          />
          <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="grid grid-cols-2 gap-6">
          <TimeSelector 
            title="Start Time"
            hour={timeValue.startHour}
            minute={timeValue.startMinute}
            period={timeValue.startPeriod}
            onHourChange={(hour) => updateTime({ startHour: hour })}
            onMinuteChange={(minute) => updateTime({ startMinute: minute })}
            onPeriodChange={(period) => updateTime({ startPeriod: period as "AM" | "PM" })}
          />
          
          <TimeSelector 
            title="End Time"
            hour={timeValue.endHour}
            minute={timeValue.endMinute}
            period={timeValue.endPeriod}
            onHourChange={(hour) => updateTime({ endHour: hour })}
            onMinuteChange={(minute) => updateTime({ endMinute: minute })}
            onPeriodChange={(period) => updateTime({ endPeriod: period as "AM" | "PM" })}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Select both start and end times for your event
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
