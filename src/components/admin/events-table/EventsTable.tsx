
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { EventRow } from "./EventRow";
import { EventDetailsSheet } from "./EventDetailsSheet";
import { EventsTableProps, ExtendedEventRecord } from "./types";
import { EventsEmptyState } from "./EventsEmptyState";
import { EventsPagination } from "./EventsPagination";
import { useEvents } from "./hooks/useEvents";

export function EventsTable({
  searchQuery,
  selectedSchool,
  selectedStatus,
  dateRange,
}: EventsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const eventsPerPage = 5;
  const { toast } = useToast();

  const { filteredEvents, handleDelete, handleApprove, handlePublish } = useEvents({
    searchQuery,
    selectedSchool,
    selectedStatus,
    dateRange
  });

  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSchool, selectedStatus, dateRange]);

  const handleEventDelete = (eventId: string) => {
    handleDelete(eventId);
    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
    });
  };

  const handleEventApprove = (eventId: string) => {
    handleApprove(eventId);
    toast({
      title: "Event Approved",
      description: "The event has been approved and is ready for publishing.",
    });
  };

  const handleEventPublish = (eventId: string) => {
    handlePublish(eventId);
    toast({
      title: "Event Published",
      description: "The event has been published to the public calendar.",
    });
  };

  const handleViewDetails = (event: ExtendedEventRecord) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">School</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEvents.length === 0 ? (
              <EventsEmptyState />
            ) : (
              currentEvents.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                  onApprove={handleEventApprove}
                  onPublish={handleEventPublish}
                  onDelete={handleEventDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EventsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <EventDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        event={selectedEvent}
        onApprove={handleEventApprove}
        onPublish={handleEventPublish}
      />
    </>
  );
}
