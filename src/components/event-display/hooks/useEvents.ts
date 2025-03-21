
import { useState, useEffect } from "react";
import { getAllEvents, EventRecord } from "@/services/events";

export function useEvents() {
  const [events, setEvents] = useState<EventRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      
      try {
        console.log("Fetching events from Supabase...");
        const eventsData = await getAllEvents();
        console.log("Events returned from Supabase:", eventsData);
        
        setEvents(eventsData);
      } catch (e) {
        console.error("Error fetching events:", e);
        setError("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, isLoading, error };
}
