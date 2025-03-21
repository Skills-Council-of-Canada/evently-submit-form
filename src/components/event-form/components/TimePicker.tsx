
import React, { useState } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import TimeSelector from "./TimeSelector";
import { useTimePickerState, TimeValue } from "../hooks/useTimePickerState";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TimePicker = ({ value, onChange, placeholder = "Select time" }: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const { timeValue, updateTime } = useTimePickerState({ value, onChange });
  
  console.log("TimePicker rendering with value:", value);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={value || ''}
            onChange={(e) => {
              console.log("Input value changed to:", e.target.value);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full pr-10"
            onClick={() => {
              console.log("TimePicker input clicked, opening popover");
              setOpen(true);
            }}
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
            onHourChange={(hour) => {
              console.log("Start hour changed to:", hour);
              updateTime({ startHour: hour });
            }}
            onMinuteChange={(minute) => {
              console.log("Start minute changed to:", minute);
              updateTime({ startMinute: minute });
            }}
            onPeriodChange={(period) => {
              console.log("Start period changed to:", period);
              updateTime({ startPeriod: period as "AM" | "PM" });
            }}
          />
          
          <TimeSelector 
            title="End Time"
            hour={timeValue.endHour}
            minute={timeValue.endMinute}
            period={timeValue.endPeriod}
            onHourChange={(hour) => {
              console.log("End hour changed to:", hour);
              updateTime({ endHour: hour });
            }}
            onMinuteChange={(minute) => {
              console.log("End minute changed to:", minute);
              updateTime({ endMinute: minute });
            }}
            onPeriodChange={(period) => {
              console.log("End period changed to:", period);
              updateTime({ endPeriod: period as "AM" | "PM" });
            }}
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
