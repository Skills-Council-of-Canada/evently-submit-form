
import { supabase } from "@/integrations/supabase/client";
import { EventRecord } from "./types";

/**
 * Get all events from Supabase
 * @returns Promise resolving to array of events or empty array if failed
 */
export const getAllEvents = async (): Promise<EventRecord[]> => {
  try {
    console.log("Getting all events from Supabase...");
    
    // Query all events, regardless of status (for testing purposes)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("Raw events data from Supabase:", data);
    
    if (!data || data.length === 0) {
      console.log("No events found in the database");
      return [];
    }

    // Map Supabase records to EventRecord format with all fields
    const formattedEvents = data.map((record: any) => ({
      id: record.id,
      eventName: record.event_name,
      eventDate: new Date(record.event_date),
      eventTime: record.event_time || "",
      description: record.description,
      schoolName: record.school_name,
      contactName: record.contact_name,
      contactEmail: record.contact_email,
      audienceType: record.audience_type,
      imageUrl: record.image_url || null,
      status: record.status || "pending",
      createdAt: record.created_at,
      eventLocation: record.event_location || null,
      estimatedAttendance: record.estimated_attendance || null,
      participants: record.participants || null,
      keyHighlights: record.key_highlights || null,
      specialGuests: record.special_guests || null,
      notableAchievements: record.notable_achievements || null,
      imagePermission: record.image_permission || false,
      suggestedCaption: record.suggested_caption || null,
      contentHighlight: record.content_highlight || null,
      messageTone: record.message_tone || null
    }));

    console.log("Formatted events:", formattedEvents);
    return formattedEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
