
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventsFilter } from "@/components/admin/EventsFilter";
import { EventsTable } from "@/components/admin/events-table";

interface AdminTabsProps {
  searchQuery: string;
  selectedSchool: string | null;
  selectedStatus: string | null;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onSearch: (query: string) => void;
  onSchoolFilter: (school: string | null) => void;
  onStatusFilter: (status: string | null) => void;
  onDateFilter: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onResetFilters: () => void;
}

export const AdminTabs = ({
  searchQuery,
  selectedSchool,
  selectedStatus,
  dateRange,
  onSearch,
  onSchoolFilter,
  onStatusFilter,
  onDateFilter,
  onResetFilters,
}: AdminTabsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab based on current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/admin/schools")) return "schools";
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/events")) return "events";
    if (path.includes("/admin/settings")) return "settings";
    return "dashboard"; // Default to dashboard for /admin
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    switch (value) {
      case "schools":
        navigate("/admin/schools");
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "events":
        navigate("/admin/events");
        break;
      case "settings":
        navigate("/admin/settings");
        break;
      case "dashboard":
      default:
        navigate("/admin");
        break;
    }
  };

  const activeTab = getActiveTab();

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="schools">Schools</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Welcome to the PDSB event management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Select a tab above to manage events, schools, or users.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="events" className="mt-4">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Event Submissions</CardTitle>
            <CardDescription>
              View, filter, and manage event submissions from schools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventsFilter
              onSearch={onSearch}
              onSchoolFilter={onSchoolFilter}
              onStatusFilter={onStatusFilter}
              onDateFilter={onDateFilter}
              onResetFilters={onResetFilters}
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
      </TabsContent>

      <TabsContent value="schools" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>School Management</CardTitle>
            <CardDescription>
              Manage school information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              School management functionality coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage admin and school users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              User management functionality coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Manage application settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings functionality coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
