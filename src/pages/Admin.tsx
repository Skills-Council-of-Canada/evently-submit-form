
import React, { useState } from "react";
import { EventsTable } from "@/components/admin/EventsTable";
import { EventsFilter } from "@/components/admin/EventsFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSchoolFilter = (school: string | null) => {
    setSelectedSchool(school);
  };

  const handleStatusFilter = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleDateFilter = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSchool(null);
    setSelectedStatus(null);
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PDSB Event Management</h1>
        <ThemeToggle />
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Event Submissions</CardTitle>
          <CardDescription>
            View, filter, and manage event submissions from schools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventsFilter
            onSearch={handleSearch}
            onSchoolFilter={handleSchoolFilter}
            onStatusFilter={handleStatusFilter}
            onDateFilter={handleDateFilter}
            onResetFilters={handleResetFilters}
            searchQuery={searchQuery}
            selectedSchool={selectedSchool}
            selectedStatus={selectedStatus}
            dateRange={dateRange}
          />
        </CardContent>
      </Card>

      <EventsTable
        searchQuery={searchQuery}
        selectedSchool={selectedSchool}
        selectedStatus={selectedStatus}
        dateRange={dateRange}
      />
    </div>
  );
};

export default AdminDashboard;
