
import React from "react";
import {
  PopoverContent,
} from "@/components/ui/popover";
import TimeSelector from "./TimeSelector";
import { TimeValue } from "../hooks/useTimePickerState";

interface TimePickerPopoverProps {
  timeValue: TimeValue;
  updateTime: (value: Partial<TimeValue>) => void;
}

const TimePickerPopover = ({ timeValue, updateTime }: TimePickerPopoverProps) => {
  return (
    <PopoverContent className="w-[520px] p-6 bg-gray-200" align="start">
      <div className="grid grid-cols-2 gap-8">
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
  );
};

export default TimePickerPopover;
