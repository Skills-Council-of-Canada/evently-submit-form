
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { EventRow } from "./EventRow";
import { EventDetailsSheet } from "./EventDetailsSheet";
import { ExtendedEventRecord, EventsTableProps } from "./types";

// Mock data - in a real app, this would come from an API
const mockEvents: ExtendedEventRecord[] = [
  {
    id: "1",
    eventName: "Spring Concert",
    eventDate: new Date("2023-05-15"),
    eventTime: "7:00 PM",
    description: "Annual spring concert featuring student performances across all grades.",
    schoolName: "Elm Street Public School",
    contactName: "Jane Smith",
    contactEmail: "jane.smith@pdsb.org",
    audienceType: "Parents and Students",
    status: "pending",
    contentGenerated: true
  },
  {
    id: "2",
    eventName: "Science Fair",
    eventDate: new Date("2023-06-10"),
    eventTime: "10:00 AM",
    description: "Showcasing student science projects with awards for top innovations.",
    schoolName: "Oakridge Secondary School",
    contactName: "John Doe",
    contactEmail: "john.doe@pdsb.org",
    audienceType: "Community",
    status: "approved",
    contentGenerated: false
  },
  {
    id: "3",
    eventName: "Parent-Teacher Conferences",
    eventDate: new Date("2023-06-22"),
    eventTime: "1:00 PM - 8:00 PM",
    description: "End-of-year parent-teacher meetings to discuss student progress.",
    schoolName: "Pine Valley Middle School",
    contactName: "Robert Johnson",
    contactEmail: "robert.johnson@pdsb.org",
    audienceType: "Parents",
    status: "published",
  },
  {
    id: "4",
    eventName: "Graduation Ceremony",
    eventDate: new Date("2023-06-28"),
    eventTime: "5:00 PM",
    description: "Graduation ceremony for the class of 2023.",
    schoolName: "Oakridge Secondary School",
    contactName: "Sarah Williams",
    contactEmail: "sarah.williams@pdsb.org",
    audienceType: "Parents and Students",
    status: "approved",
  },
  {
    id: "5",
    eventName: "Sports Day",
    eventDate: new Date("2023-06-15"),
    eventTime: "9:00 AM",
    description: "Annual school sports day with various athletic competitions.",
    schoolName: "Maple Heights Academy",
    contactName: "Michael Brown",
    contactEmail: "michael.brown@pdsb.org",
    audienceType: "Students",
    status: "pending",
  },
];

export function EventsTable({
  searchQuery,
  selectedSchool,
  selectedStatus,
  dateRange,
}: EventsTableProps) {
  const [events, setEvents] = useState<ExtendedEventRecord[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ExtendedEventRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const eventsPerPage = 5;
  const { toast } = useToast();

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.eventName.toLowerCase().includes(query) ||
          event.schoolName.toLowerCase().includes(query) ||
          event.contactName.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    if (selectedSchool) {
      filtered = filtered.filter((event) => event.schoolName === selectedSchool);
    }

    if (selectedStatus) {
      filtered = filtered.filter((event) => event.status === selectedStatus);
    }

    if (dateRange.from) {
      filtered = filtered.filter(
        (event) => new Date(event.eventDate) >= new Date(dateRange.from!)
      );
    }
    
    if (dateRange.to) {
      filtered = filtered.filter(
        (event) => new Date(event.eventDate) <= new Date(dateRange.to!)
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [events, searchQuery, selectedSchool, selectedStatus, dateRange]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
    });
  };

  const handleApprove = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, status: "approved" as const } : event
      )
    );
    toast({
      title: "Event Approved",
      description: "The event has been approved and is ready for publishing.",
    });
  };

  const handlePublish = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, status: "published" as const } : event
      )
    );
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
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              currentEvents.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApprove}
                  onPublish={handlePublish}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <EventDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        event={selectedEvent}
        onApprove={handleApprove}
        onPublish={handlePublish}
      />
    </>
  );
}
