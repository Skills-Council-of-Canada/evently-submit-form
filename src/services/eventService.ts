
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EventRecord {
  id?: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  description: string;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  audienceType: string;
  imageUrl?: string;
  status?: 'pending' | 'approved' | 'published';
  createdAt?: string;
}

/**
 * Submit event data to Supabase
 * @param eventData The event data to submit
 * @returns Promise resolving to the created record ID or null if failed
 */
export const submitEvent = async (eventData: EventRecord): Promise<string | null> => {
  try {
    // Prepare the data for Supabase
    const eventRecord = {
      event_name: eventData.eventName,
      event_date: eventData.eventDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      event_time: eventData.eventTime,
      description: eventData.description,
      school_name: eventData.schoolName,
      contact_name: eventData.contactName,
      contact_email: eventData.contactEmail,
      audience_type: eventData.audienceType,
      image_url: eventData.imageUrl || null,
      status: "pending" as 'pending', // Explicitly type as literal
      created_at: new Date().toISOString()
    };

    // Insert the record into Supabase
    const { data, error } = await supabase
      .from('events')
      .insert(eventRecord)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("Event successfully submitted to Supabase:", data);
    
    // Return the ID of the created record
    return data?.[0]?.id || null;
  } catch (error) {
    console.error("Error submitting to Supabase:", error);
    return null;
  }
};

/**
 * Check if an event already exists to prevent duplicates
 * @param eventName The name of the event
 * @param eventDate The date of the event
 * @param schoolName The school name
 * @returns Promise resolving to true if the event exists, false otherwise
 */
export const checkEventExists = async (
  eventName: string, 
  eventDate: Date, 
  schoolName: string
): Promise<boolean> => {
  try {
    // Format the date to YYYY-MM-DD for filtering
    const formattedDate = eventDate.toISOString().split('T')[0];
    
    // Query Supabase to check for duplicates
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .eq('event_name', eventName)
      .eq('event_date', formattedDate)
      .eq('school_name', schoolName);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // If records are returned, it means a duplicate exists
    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking for duplicate events:", error);
    return false; // Default to allowing submission in case of error
  }
};

/**
 * Get all events from Supabase
 * @returns Promise resolving to array of events or empty array if failed
 */
export const getAllEvents = async (): Promise<EventRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Map Supabase records to EventRecord format
    return data.map((record: any) => ({
      id: record.id,
      eventName: record.event_name,
      eventDate: new Date(record.event_date),
      eventTime: record.event_time,
      description: record.description,
      schoolName: record.school_name,
      contactName: record.contact_name,
      contactEmail: record.contact_email,
      audienceType: record.audience_type,
      imageUrl: record.image_url || null,
      status: record.status || "pending",
      createdAt: record.created_at
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

/**
 * Update event status in Supabase
 * @param eventId The ID of the event to update
 * @param status The new status to set
 * @returns Promise resolving to true if successful, false otherwise
 */
export const updateEventStatus = async (
  eventId: string, 
  status: 'pending' | 'approved' | 'published'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('events')
      .update({ status })
      .eq('id', eventId);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating event status:", error);
    return false;
  }
};
