
import React, { useState, useEffect } from "react";
import { EventsTable } from "@/components/admin/EventsTable";
import { EventsFilter } from "@/components/admin/EventsFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    // Ensure the component updates when path changes
    console.log("Current path:", location.pathname);
    console.log("Active tab:", getActiveTab());
  }, [location.pathname]);

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

  const activeTab = getActiveTab();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">PDSB Event Management</h1>
              <ThemeToggle />
            </div>

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
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
