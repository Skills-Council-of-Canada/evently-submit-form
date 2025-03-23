
import React, { useState } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import TimePickerPopover from "./TimePickerPopover";
import { useTimePickerState } from "../hooks/useTimePickerState";

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
      <TimePickerPopover 
        timeValue={timeValue}
        updateTime={updateTime}
      />
    </Popover>
  );
};

export default TimePicker;
