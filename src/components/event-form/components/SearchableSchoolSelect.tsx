
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { School } from "@/services/schoolService";
import { cn } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

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
  schools = [], // Default to empty array to avoid undefined errors
  isLoading,
  onSchoolSelect
}: SearchableSchoolSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
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

  // Clear search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button" // Prevent form submission
            onClick={(e) => {
              e.preventDefault(); // Prevent any default behavior
              setOpen(!open);
            }}
          >
            {value ? value : "Start typing to search for a school..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}> {/* Disable internal filtering */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Type to search schools..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          {searchQuery && filteredSchools.length === 0 && (
            <CommandEmpty>No schools found matching "{searchQuery}"</CommandEmpty>
          )}
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {safeSchools.length === 0 ? (
              <CommandItem disabled>No schools available</CommandItem>
            ) : filteredSchools.length === 0 && !searchQuery ? (
              <CommandItem disabled>Type to search schools</CommandItem>
            ) : (
              filteredSchools.map((school) => (
                <CommandItem
                  key={school.id || school.school_name}
                  value={school.school_name}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === school.school_name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {school.school_name}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
