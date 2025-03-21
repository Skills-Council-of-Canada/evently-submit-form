
import React, { useEffect } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  
  // Hours options: 1-12
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  // Minutes options: 00, 15, 30, 45
  const minutes = ["00", "15", "30", "45"];
  
  // Periods: AM, PM
  const periods = ["AM", "PM"];

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
          <div className="space-y-2">
            <Label className="font-medium text-gray-700">Start Time</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={timeValue.startHour}
                onValueChange={(value) => updateTime({ startHour: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={`start-hour-${hour}`} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={timeValue.startMinute}
                onValueChange={(value) => updateTime({ startMinute: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={`start-minute-${minute}`} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={timeValue.startPeriod}
                onValueChange={(value) => updateTime({ startPeriod: value as "AM" | "PM" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={`start-period-${period}`} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="font-medium text-gray-700">End Time</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={timeValue.endHour}
                onValueChange={(value) => updateTime({ endHour: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={`end-hour-${hour}`} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={timeValue.endMinute}
                onValueChange={(value) => updateTime({ endMinute: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={`end-minute-${minute}`} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={timeValue.endPeriod}
                onValueChange={(value) => updateTime({ endPeriod: value as "AM" | "PM" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
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
        
        <div className="mt-4 text-sm text-gray-500">
          Select both start and end times for your event
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
