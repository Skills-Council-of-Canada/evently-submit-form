
import React, { useState, useEffect } from "react";
import { AdminHeader, AdminTabs } from "@/components/admin/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useLocation } from "react-router-dom";

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
  
  useEffect(() => {
    // Ensure the component updates when path changes
    console.log("Current path:", location.pathname);
  }, [location.pathname]);

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-4 md:p-6">
            <AdminHeader />
            
            <AdminTabs 
              searchQuery={searchQuery}
              selectedSchool={selectedSchool}
              selectedStatus={selectedStatus}
              dateRange={dateRange}
              onSearch={handleSearch}
              onSchoolFilter={handleSchoolFilter}
              onStatusFilter={handleStatusFilter}
              onDateFilter={handleDateFilter}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
