
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllSchools } from "@/services/schoolService";
import { School } from "@/services/schoolService";

interface SchoolSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SchoolSearchInput({ value, onChange }: SchoolSearchInputProps) {
  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch all schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      try {
        const fetchedSchools = await getAllSchools();
        setSchools(Array.isArray(fetchedSchools) ? fetchedSchools : []);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchools();
  }, []);

  const handleSelect = (schoolName: string) => {
    onChange(schoolName);
    setOpen(false);
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
        >
          {value ? value : "Select a school..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        {isLoading ? (
          <div className="py-6 text-center text-sm">Loading schools...</div>
        ) : (
          <Command>
            {schools.length > 0 ? (
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {schools.map((school) => (
                  <CommandItem
                    key={school.id || school.school_name}
                    value={school.school_name}
                    onSelect={() => handleSelect(school.school_name)}
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
            ) : (
              <CommandEmpty>No schools available</CommandEmpty>
            )}
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
