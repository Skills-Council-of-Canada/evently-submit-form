
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getAllSchools, School } from "@/services/schoolService";

interface EventsFilterProps {
  onSearch: (query: string) => void;
  onSchoolFilter: (school: string | null) => void;
  onStatusFilter: (status: string | null) => void;
  onDateFilter: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onResetFilters: () => void;
  searchQuery: string;
  selectedSchool: string | null;
  selectedStatus: string | null;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
];

export function EventsFilter({
  onSearch,
  onSchoolFilter,
  onStatusFilter,
  onDateFilter,
  onResetFilters,
  searchQuery,
  selectedSchool,
  selectedStatus,
  dateRange,
}: EventsFilterProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const hasActiveFilters = searchQuery || selectedSchool || selectedStatus || dateRange.from || dateRange.to;

  // Fetch schools from Supabase when component mounts
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoadingSchools(true);
      try {
        const schoolsData = await getAllSchools();
        setSchools(schoolsData.filter(school => school.school_name.trim() !== ""));
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  // Handle range selection completion
  const handleRangeSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    onDateFilter(range);
    // Close the calendar when a complete range is selected (both from and to dates)
    if (range.from && range.to) {
      setCalendarOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8 bg-white"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
              onClick={() => onSearch("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <Select
          value={selectedSchool || "all"}
          onValueChange={(value) => onSchoolFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-[200px] bg-white">
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Schools</SelectItem>
            {isLoadingSchools ? (
              <SelectItem value="loading" disabled>Loading schools...</SelectItem>
            ) : (
              schools
                .filter(school => school.school_name.trim() !== "")
                .map((school) => (
                  <SelectItem key={school.id} value={school.school_name}>
                    {school.school_name}
                  </SelectItem>
                ))
            )}
          </SelectContent>
        </Select>

        <Select
          value={selectedStatus || "all"}
          onValueChange={(value) => onStatusFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[240px] justify-start text-left font-normal bg-white"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-muted-foreground"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
