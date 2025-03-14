
import React from "react";
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { EventRowProps } from "./types";
import { StatusBadge } from "./StatusBadge";
import { EventActions } from "./EventActions";

export function EventRow({
  event,
  onViewDetails,
  onApprove,
  onPublish,
  onDelete,
}: EventRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{event.eventName}</TableCell>
      <TableCell>
        {format(new Date(event.eventDate), "MMM d, yyyy")}
      </TableCell>
      <TableCell className="hidden md:table-cell">{event.schoolName}</TableCell>
      <TableCell><StatusBadge status={event.status} /></TableCell>
      <TableCell className="text-right">
        <EventActions
          event={event}
          onViewDetails={() => onViewDetails(event)}
          onApprove={onApprove}
          onPublish={onPublish}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
