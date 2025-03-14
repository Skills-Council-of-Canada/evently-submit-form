
import { useState, useEffect } from "react";
import { ExtendedEventRecord } from "../types";

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

  // Initial load of mock data
  useEffect(() => {
    setEvents(mockEvents);
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

  const handleDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleApprove = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, status: "approved" as const } : event
      )
    );
  };

  const handlePublish = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, status: "published" as const } : event
      )
    );
  };

  return {
    events,
    filteredEvents,
    handleDelete,
    handleApprove,
    handlePublish
  };
};
