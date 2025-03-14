
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
    case "published":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Published</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}
