
import { useState, useEffect } from "react";

export interface TimeValue {
  startHour: string;
  startMinute: string;
  startPeriod: "AM" | "PM";
  endHour: string;
  endMinute: string;
  endPeriod: "AM" | "PM";
}

interface UseTimePickerStateProps {
  value: string;
  onChange: (value: string) => void;
}

export const useTimePickerState = ({ value, onChange }: UseTimePickerStateProps) => {
  // Initialize with default time values
  const [timeValue, setTimeValue] = useState<TimeValue>({
    startHour: "8",
    startMinute: "00",
    startPeriod: "AM",
    endHour: "9",
    endMinute: "00",
    endPeriod: "AM",
  });
  
  // For debugging
  console.log("useTimePickerState initialized with value:", value);
  
  // Parse existing value when component mounts or value changes
  useEffect(() => {
    if (value) {
      console.log("Attempting to parse time value:", value);
      const timePattern = /(\d{1,2}):(\d{2}) (AM|PM) - (\d{1,2}):(\d{2}) (AM|PM)/;
      const match = value.match(timePattern);
      
      if (match) {
        console.log("Time pattern matched:", match);
        setTimeValue({
          startHour: match[1],
          startMinute: match[2],
          startPeriod: match[3] as "AM" | "PM",
          endHour: match[4],
          endMinute: match[5],
          endPeriod: match[6] as "AM" | "PM",
        });
      } else {
        console.warn("Time pattern did not match for value:", value);
      }
    }
  }, [value]);

  // Update the formatted time string when any time value changes
  const updateTime = (newTimeValue: Partial<TimeValue>) => {
    const updatedTimeValue = { ...timeValue, ...newTimeValue };
    setTimeValue(updatedTimeValue);
    
    // Ensure minutes are always two digits
    const startMin = updatedTimeValue.startMinute.padStart(2, '0');
    const endMin = updatedTimeValue.endMinute.padStart(2, '0');
    
    const formattedTime = `${updatedTimeValue.startHour}:${startMin} ${updatedTimeValue.startPeriod} - ${updatedTimeValue.endHour}:${endMin} ${updatedTimeValue.endPeriod}`;
    console.log("Setting formatted time:", formattedTime);
    onChange(formattedTime);
  };
  
  // If the component loads without a value, initialize with default time
  useEffect(() => {
    if (!value) {
      const startMin = timeValue.startMinute.padStart(2, '0');
      const endMin = timeValue.endMinute.padStart(2, '0');
      const defaultTime = `${timeValue.startHour}:${startMin} ${timeValue.startPeriod} - ${timeValue.endHour}:${endMin} ${timeValue.endPeriod}`;
      console.log("Setting default time:", defaultTime);
      onChange(defaultTime);
    }
  }, []);

  return {
    timeValue,
    updateTime
  };
};
