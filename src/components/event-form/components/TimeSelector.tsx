
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
      <div className="grid grid-cols-3 gap-2 w-full min-w-[240px] bg-event-light-purple/30 p-4 rounded-md">
        <div className="w-full">
          <TimeDropdown
            value={hour}
            onChange={onHourChange}
            options={hours}
            placeholder="Hour"
          />
        </div>
        
        <div className="w-full">
          <TimeDropdown
            value={minute}
            onChange={onMinuteChange}
            options={minutes}
            placeholder="Minute"
          />
        </div>
        
        <div className="w-full">
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

export default TimeSelector;
