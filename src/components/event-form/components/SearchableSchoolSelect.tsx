
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { School } from "@/services/schoolService";
import { cn } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchableSchoolSelectProps {
  value: string;
  onChange: (value: string) => void;
  schools: School[];
  isLoading: boolean;
  onSchoolSelect?: (school: School | null) => void;
}

export function SearchableSchoolSelect({
  value,
  onChange,
  schools = [], 
  isLoading,
  onSchoolSelect
}: SearchableSchoolSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Make sure schools is always an array
  const safeSchools = Array.isArray(schools) ? schools : [];
  
  // Find the selected school object based on the school name value
  const selectedSchool = safeSchools.length > 0 
    ? safeSchools.find(school => school.school_name === value) 
    : null;
  
  // Filter schools based on search query
  const filteredSchools = safeSchools.length > 0
    ? safeSchools
        .filter(school => 
          school && 
          school.school_name && 
          typeof school.school_name === 'string' &&
          school.school_name.trim() !== "" &&
          (searchQuery === "" || 
          school.school_name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => a.school_name.localeCompare(b.school_name))
    : [];

  // When a school is selected, trigger the callback
  useEffect(() => {
    if (onSchoolSelect) {
      onSchoolSelect(selectedSchool || null);
    }
  }, [value, onSchoolSelect, selectedSchool]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  // Handle school selection
  const handleSelectSchool = (schoolName: string) => {
    onChange(schoolName);
    setShowDropdown(false);
    setSearchQuery("");
  };

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // @ts-ignore - we know the current target is an HTMLElement
      if (e.target && !e.target.closest('.school-select-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Handle button click to prevent form submission
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="relative w-full school-select-container">
      <div className="flex">
        <FormControl>
          <Input
            type="text"
            placeholder="Search for a school..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            className="w-full pr-10"
          />
        </FormControl>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={handleButtonClick}
        >
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredSchools.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {searchQuery ? `No schools found matching "${searchQuery}"` : "Type to search schools"}
              </div>
            ) : (
              filteredSchools.map((school) => (
                <div
                  key={school.id || school.school_name}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === school.school_name ? "bg-accent text-accent-foreground" : ""
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectSchool(school.school_name);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === school.school_name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {school.school_name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Show the current selection as text if there is a value */}
      {!searchQuery && value && (
        <div className="mt-1 text-sm text-muted-foreground">
          Selected: {value}
        </div>
      )}
    </div>
  );
}
