
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSchoolSearch } from "../hooks/useSchoolSearch";

interface SchoolSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SchoolSearchInput({ value, onChange }: SchoolSearchInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  
  const { schools, isLoading, searchSchools } = useSchoolSearch();
  
  // Update the search results when input changes
  useEffect(() => {
    // Debounce the search to prevent API hammering and possible errors
    const handler = setTimeout(() => {
      if (inputValue && inputValue.trim()) {
        searchSchools(inputValue);
      }
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, searchSchools]);
  
  // Sync input value with form value on mount
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleSelect = (schoolName: string) => {
    if (schoolName) {
      onChange(schoolName);
      setInputValue(schoolName);
    }
    setOpen(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value || "");
    // Don't update form value yet - will update on selection
  };

  const clearInput = () => {
    setInputValue("");
    onChange("");
  };

  // Safety check to ensure schools is always an array
  const safeSchools = Array.isArray(schools) ? schools : [];

  const renderSchoolsList = () => {
    if (isLoading) {
      return <div className="py-6 text-center text-sm">Loading schools...</div>;
    } 
    
    if (safeSchools.length > 0) {
      return (
        <CommandGroup className="max-h-[300px] overflow-y-auto">
          {safeSchools.map((school) => (
            <CommandItem
              key={school.id || school.school_name}
              value={school.school_name}
              onSelect={() => handleSelect(school.school_name)}
              className="flex items-center"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === school.school_name ? "opacity-100" : "opacity-0"
                )}
              />
              {school.school_name}
            </CommandItem>
          ))}
        </CommandGroup>
      );
    }
    
    if (inputValue) {
      return <CommandEmpty>No schools found matching "{inputValue}"</CommandEmpty>;
    }
    
    return <div className="py-6 text-center text-sm">Type to search schools</div>;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          <div className="flex items-center truncate">
            {value ? value : "Search for a school..."}
          </div>
          {value && (
            <X
              className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                clearInput();
              }}
            />
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Type to search schools..." 
              value={inputValue}
              onValueChange={handleInputChange}
              className="h-9"
            />
          </div>
          {renderSchoolsList()}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
