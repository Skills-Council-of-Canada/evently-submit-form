
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllSchools } from "@/services/schoolService";
import { School } from "@/services/schoolService";
import { SearchableSchoolSelect } from "./SearchableSchoolSelect";

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

  // Using the more robust SearchableSchoolSelect component instead
  return (
    <SearchableSchoolSelect
      value={value}
      onChange={onChange}
      schools={schools}
      isLoading={isLoading}
    />
  );
}
