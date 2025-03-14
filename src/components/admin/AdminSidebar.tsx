
import React from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Grid3X3, 
  Home, 
  LayoutDashboard, 
  School, 
  Settings, 
  Users 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin",
    },
    {
      title: "Events",
      icon: Calendar,
      url: "/admin/events",
    },
    {
      title: "Schools",
      icon: School,
      url: "/admin/schools",
    },
    {
      title: "Users",
      icon: Users,
      url: "/admin/users",
    },
  ];

  const secondaryMenuItems = [
    {
      title: "Settings",
      icon: Settings,
      url: "/admin/settings",
    },
    {
      title: "Home",
      icon: Home,
      url: "/",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link 
          to="/admin" 
          className="flex items-center gap-2 font-semibold"
        >
          <Grid3X3 className="h-6 w-6" />
          <span>PDSB Admin</span>
        </Link>
        <div className="ml-auto md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          PDSB Admin Portal v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
