
import { supabase } from "@/integrations/supabase/client";
import { EventRecord } from "./types";
import { toast } from "@/hooks/use-toast";

/**
 * Format a Date object into a YYYY-MM-DD string for Supabase
 * @param date The date to format
 * @returns Formatted date string
 */
const formatEventDate = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }
  // Fallback to string conversion for any other case
  return String(date).split('T')[0];
};

/**
 * Convert EventRecord to Supabase format
 * @param eventData The event data in application format
 * @returns The event data formatted for Supabase
 */
const prepareEventForSupabase = (eventData: EventRecord) => {
  return {
    event_name: eventData.eventName,
    event_date: formatEventDate(eventData.eventDate),
    event_time: eventData.eventTime,
    description: eventData.description,
    school_name: eventData.schoolName,
    contact_name: eventData.contactName,
    contact_email: eventData.contactEmail,
    audience_type: eventData.audienceType,
    image_url: eventData.imageUrl || null,
    status: "pending" as const,
    created_at: new Date().toISOString()
  };
};

/**
 * Insert an event record into Supabase
 * @param eventRecord The prepared event record to insert
 * @returns Promise resolving to the created record ID or null if failed
 */
const insertEventRecord = async (eventRecord: ReturnType<typeof prepareEventForSupabase>): Promise<string | null> => {
  try {
    console.log("Inserting record into Supabase:", JSON.stringify(eventRecord, null, 2));
    
    const { data, error } = await supabase
      .from('events')
      .insert(eventRecord)
      .select();

    console.log("Supabase response data:", data);
    
    if (error) {
      console.error("Supabase error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("Event successfully submitted to Supabase:", data);
    
    // Return the ID of the created record
    return data?.[0]?.id || null;
  } catch (error) {
    console.error("Error in insertEventRecord:", error);
    throw error;
  }
};

/**
 * Submit event data to Supabase
 * @param eventData The event data to submit
 * @returns Promise resolving to the created record ID or null if failed
 */
export const submitEvent = async (eventData: EventRecord): Promise<string | null> => {
  try {
    console.log("Preparing event data for Supabase:", JSON.stringify(eventData, null, 2));
    console.log("Event time being submitted:", eventData.eventTime);
    console.log("Supabase client available:", !!supabase);
    
    // Prepare the data for Supabase
    const eventRecord = prepareEventForSupabase(eventData);

    // Insert the event record
    return await insertEventRecord(eventRecord);
  } catch (error) {
    console.error("Error submitting to Supabase:", error);
    toast({
      title: "Submission Error",
      description: "There was a problem submitting your event.",
      variant: "destructive",
    });
    return null;
  }
};
