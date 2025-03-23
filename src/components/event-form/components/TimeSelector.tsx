
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSelectorProps {
  title: string;
  hour: string;
  minute: string;
  period: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  onPeriodChange: (period: string) => void;
  showLabel?: boolean;
}

const TimeSelector = ({
  title,
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  showLabel = true
}: TimeSelectorProps) => {
  // Hours options: 1-12
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  // Minutes options: 00, 15, 30, 45
  const minutes = ["00", "15", "30", "45"];
  
  // Periods: AM, PM
  const periods = ["AM", "PM"];

  return (
    <div className="space-y-2">
      {showLabel && <Label className="font-medium text-gray-700">{title}</Label>}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex-1">
          <TimeDropdown
            value={hour}
            onChange={onHourChange}
            options={hours}
            placeholder="Hour"
          />
        </div>
        
        <div className="flex-1">
          <TimeDropdown
            value={minute}
            onChange={onMinuteChange}
            options={minutes}
            placeholder="Minute"
          />
        </div>
        
        <div className="flex-1">
          <TimeDropdown
            value={period}
            onChange={onPeriodChange}
            options={periods}
            placeholder="AM/PM"
          />
        </div>
      </div>
    </div>
  );
};

interface TimeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

const TimeDropdown = ({ value, onChange, options, placeholder }: TimeDropdownProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="h-10 px-3 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className="min-w-[5rem] bg-white"
        position="popper"
        align="center"
        sideOffset={4}
      >
        {options.map((option) => (
          <SelectItem key={`${placeholder}-${option}`} value={option} className="px-4 py-2">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelector;
