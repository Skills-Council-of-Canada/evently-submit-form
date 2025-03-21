
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventRecord } from "@/services/eventService";

export function useEvents() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch only approved or published events
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .in('status', ['approved', 'published'])
          .order('event_date', { ascending: true });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Map the data to match our EventRecord type
        const mappedEvents: EventRecord[] = data.map((record: any) => ({
          id: record.id,
          eventName: record.event_name,
          eventDate: new Date(record.event_date),
          eventTime: record.event_time,
          description: record.description,
          schoolName: record.school_name,
          contactName: record.contact_name,
          contactEmail: record.contact_email,
          audienceType: record.audience_type,
          imageUrl: record.image_url,
          status: record.status,
          createdAt: record.created_at
        }));
        
        setEvents(mappedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  return { events, isLoading, error };
}
