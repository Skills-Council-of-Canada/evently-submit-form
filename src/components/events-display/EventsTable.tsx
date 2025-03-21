
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { EventRecord } from "@/services/eventService";

export function EventsTable() {
  const { events, isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
        <p className="mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found.</p>
        <p className="mt-2">Be the first to submit an event!</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.eventName}</TableCell>
                  <TableCell>
                    {event.eventDate instanceof Date 
                      ? format(event.eventDate, "MMM d, yyyy") 
                      : format(new Date(event.eventDate), "MMM d, yyyy")}
                    <div className="text-xs text-muted-foreground mt-1">
                      {event.eventTime}
                    </div>
                  </TableCell>
                  <TableCell>{event.schoolName}</TableCell>
                  <TableCell>{event.audienceType}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <StatusBadge status={event.status || "pending"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" | null }> = {
    pending: { label: "Pending", variant: "outline" },
    approved: { label: "Approved", variant: "secondary" },
    published: { label: "Published", variant: "default" },
    rejected: { label: "Rejected", variant: "destructive" },
  };

  const { label, variant } = statusMap[status] || { label: status, variant: null };

  return <Badge variant={variant || "outline"}>{label}</Badge>;
}
