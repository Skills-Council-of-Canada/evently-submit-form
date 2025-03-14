
import React from "react";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

// This would ideally come from an API call to get all schools
const schools = [
  { value: "Elm Street Public School", label: "Elm Street Public School" },
  { value: "Oakridge Secondary School", label: "Oakridge Secondary School" },
  { value: "Pine Valley Middle School", label: "Pine Valley Middle School" },
  { value: "Maple Heights Academy", label: "Maple Heights Academy" },
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
  const hasActiveFilters = searchQuery || selectedSchool || selectedStatus || dateRange.from || dateRange.to;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
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
          value={selectedSchool || ""}
          onValueChange={(value) => onSchoolFilter(value || null)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Schools</SelectItem>
            {schools.map((school) => (
              <SelectItem key={school.value} value={school.value}>
                {school.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedStatus || ""}
          onValueChange={(value) => onStatusFilter(value || null)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[240px] justify-start text-left font-normal"
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
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={(range) => {
                onDateFilter({
                  from: range?.from,
                  to: range?.to,
                });
              }}
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
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
