
import React from "react";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

export const AdminHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">PDSB Event Management</h1>
      <ThemeToggle />
    </div>
  );
};
