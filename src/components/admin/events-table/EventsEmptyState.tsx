
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export function EventsEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        No events found.
      </TableCell>
    </TableRow>
  );
}
