
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
import { Loader2 } from "lucide-react";
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

  const { filteredEvents, isLoading, handleDelete, handleApprove, handlePublish } = useEvents({
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
  };

  const handleEventApprove = (eventId: string) => {
    handleApprove(eventId);
  };

  const handleEventPublish = (eventId: string) => {
    handlePublish(eventId);
  };

  const handleViewDetails = (event: ExtendedEventRecord) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading events...</span>
      </div>
    );
  }

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

      {filteredEvents.length > 0 && (
        <EventsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

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
