
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { getAllEvents, updateEventStatus, EventRecord } from "@/services/eventService";
import { ExtendedEventRecord } from "../types";

interface UseEventsProps {
  searchQuery: string;
  selectedSchool: string | null;
  selectedStatus: string | null;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const useEvents = ({
  searchQuery,
  selectedSchool,
  selectedStatus,
  dateRange,
}: UseEventsProps) => {
  const [events, setEvents] = useState<ExtendedEventRecord[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ExtendedEventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const fetchedEvents = await getAllEvents();
        // Convert EventRecord[] to ExtendedEventRecord[]
        const extendedEvents: ExtendedEventRecord[] = fetchedEvents
          .filter(event => event.id !== undefined) // Filter out any events without IDs
          .map(event => ({
            ...event,
            id: event.id as string, // We know id exists because of the filter
            status: event.status || "pending" as const,
            contentGenerated: Math.random() > 0.5 // Randomly set for demo purposes
          }));
        setEvents(extendedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query, school, status, and date range
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
  }, [events, searchQuery, selectedSchool, selectedStatus, dateRange]);

  const handleDelete = async (eventId: string) => {
    try {
      // In a real app, you would call a delete function here
      // For now, we'll just remove it from the local state
      setEvents(events.filter((event) => event.id !== eventId));
      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (eventId: string) => {
    try {
      const success = await updateEventStatus(eventId, "approved");
      if (success) {
        setEvents(
          events.map((event) =>
            event.id === eventId ? { ...event, status: "approved" as const } : event
          )
        );
        toast({
          title: "Event Approved",
          description: "The event has been approved and is ready for publishing.",
        });
      } else {
        throw new Error("Failed to update event status");
      }
    } catch (error) {
      console.error("Error approving event:", error);
      toast({
        title: "Error",
        description: "Failed to approve event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (eventId: string) => {
    try {
      const success = await updateEventStatus(eventId, "published");
      if (success) {
        setEvents(
          events.map((event) =>
            event.id === eventId ? { ...event, status: "published" as const } : event
          )
        );
        toast({
          title: "Event Published",
          description: "The event has been published to the public calendar.",
        });
      } else {
        throw new Error("Failed to update event status");
      }
    } catch (error) {
      console.error("Error publishing event:", error);
      toast({
        title: "Error",
        description: "Failed to publish event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    events,
    filteredEvents,
    isLoading,
    handleDelete,
    handleApprove,
    handlePublish
  };
};
