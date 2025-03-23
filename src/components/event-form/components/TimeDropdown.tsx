
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <SelectTrigger className="w-full bg-white border-gray-200">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="min-w-[120px] w-full bg-white z-50">
        {options.map((option) => (
          <SelectItem key={`${placeholder}-${option}`} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeDropdown;
