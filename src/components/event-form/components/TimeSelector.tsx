
import React from "react";
import { Label } from "@/components/ui/label";
import TimeDropdown from "./TimeDropdown";
import { useTimeOptions } from "../hooks/useTimeOptions";

interface TimeSelectorProps {
  title: string;
  hour: string;
  minute: string;
  period: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  onPeriodChange: (period: string) => void;
}

const TimeSelector = ({
  title,
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange
}: TimeSelectorProps) => {
  const { hours, minutes, periods } = useTimeOptions();

  return (
    <div className="space-y-2 w-full">
      <Label className="font-medium text-gray-700">{title}</Label>
      <div className="grid grid-cols-3 gap-3 w-full min-w-[240px] bg-gray-100 p-4 rounded-md">
        <TimeDropdown
          value={hour}
          onChange={onHourChange}
          options={hours}
          placeholder="Hour"
        />
        
        <TimeDropdown
          value={minute}
          onChange={onMinuteChange}
          options={minutes}
          placeholder="Minute"
        />
        
        <TimeDropdown
          value={period}
          onChange={onPeriodChange}
          options={periods}
          placeholder="AM/PM"
        />
      </div>
    </div>
  );
};

export default TimeSelector;
