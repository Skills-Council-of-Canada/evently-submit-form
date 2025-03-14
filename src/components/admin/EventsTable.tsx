import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, Edit, Trash2, AlertTriangle, Calendar, Building, Users, Eye, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { EventRecord } from "@/services/airtableService";

interface ExtendedEventRecord extends EventRecord {
  id: string;
  status: "pending" | "approved" | "published";
  contentGenerated?: boolean;
}

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

interface EventsTableProps {
  searchQuery: string;
  selectedSchool: string | null;
  selectedStatus: string | null;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
    setDeleteDialogOpen(false);
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

  const getStatusBadge = (status: string) => {
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
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.eventName}</TableCell>
                  <TableCell>
                    {format(new Date(event.eventDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{event.schoolName}</TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedEvent(event);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      
                      {event.contentGenerated && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:text-blue-700"
                          asChild
                        >
                          <Link to={`/content-review/${event.id}`}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Review Content</span>
                          </Link>
                        </Button>
                      )}
                      
                      {event.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleApprove(event.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                      )}
                      
                      {event.status === "approved" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handlePublish(event.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Publish</span>
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-700">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this event? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(event.id)}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
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

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedEvent && (
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{selectedEvent.eventName}</SheetTitle>
              <SheetDescription>Event details</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedEvent.eventDate), "PPP")} at {selectedEvent.eventTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">School</p>
                  <p className="text-sm text-muted-foreground">{selectedEvent.schoolName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Audience</p>
                  <p className="text-sm text-muted-foreground">{selectedEvent.audienceType}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>
              
              <div>
                <p className="font-medium mb-1">Contact Information</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.contactName} - {selectedEvent.contactEmail}
                </p>
              </div>
              
              <div className="pt-4">
                <p className="font-medium mb-2">Current Status</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedEvent.status)}
                  
                  {selectedEvent.status === "pending" ? (
                    <Button 
                      size="sm" 
                      className="ml-2"
                      onClick={() => {
                        handleApprove(selectedEvent.id);
                        setDetailsOpen(false);
                      }}
                    >
                      Approve Event
                    </Button>
                  ) : selectedEvent.status === "approved" ? (
                    <Button 
                      size="sm" 
                      className="ml-2"
                      onClick={() => {
                        handlePublish(selectedEvent.id);
                        setDetailsOpen(false);
                      }}
                    >
                      Publish Event
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </>
  );
}
