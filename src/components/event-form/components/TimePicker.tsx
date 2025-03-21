
import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TimePicker = ({ value, onChange, placeholder = "Select time" }: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  
  // Generate time options in 30-minute intervals
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const formattedMinute = minute === 0 ? '00' : minute.toString();
      const timeString = `${displayHour}:${formattedMinute} ${period}`;
      timeOptions.push(timeString);
    }
  }

  // Add common time ranges
  const timeRanges = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
  ];
  
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
      <PopoverContent className="w-64 p-0" align="start">
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Common Time Ranges</p>
            <div className="space-y-1">
              {timeRanges.map((timeRange) => (
                <Button
                  key={timeRange}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    value === timeRange && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onChange(timeRange);
                    setOpen(false);
                  }}
                >
                  {timeRange}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Single Times</p>
            <div className="grid grid-cols-2 gap-1">
              {timeOptions.map((timeOption) => (
                <Button
                  key={timeOption}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal",
                    value === timeOption && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onChange(timeOption);
                    setOpen(false);
                  }}
                >
                  {timeOption}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
