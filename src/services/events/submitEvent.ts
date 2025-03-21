
import { supabase } from "@/integrations/supabase/client";
import { EventRecord } from "./types";
import { toast } from "@/hooks/use-toast";

/**
 * Format a Date object into a YYYY-MM-DD string for Supabase
 * @param date The date to format
 * @returns Formatted date string
 */
const formatEventDate = (date: Date | string): string => {
  console.log("🔷 formatEventDate called with:", date);
  if (date instanceof Date) {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    console.log("🔷 Date formatted as:", formattedDate);
    return formattedDate;
  }
  // Fallback to string conversion for any other case
  const formattedString = String(date).split('T')[0];
  console.log("🔷 String date formatted as:", formattedString);
  return formattedString;
};

/**
 * Convert EventRecord to Supabase format
 * @param eventData The event data in application format
 * @returns The event data formatted for Supabase
 */
const prepareEventForSupabase = (eventData: EventRecord) => {
  console.log("🔷 prepareEventForSupabase called with:", JSON.stringify(eventData, null, 2));
  
  // Validate required fields
  if (!eventData.eventName || !eventData.eventDate || !eventData.eventTime || 
      !eventData.description || !eventData.schoolName || 
      !eventData.contactName || !eventData.contactEmail || !eventData.audienceType) {
    console.error("🔷 Missing required fields in event data:", eventData);
    throw new Error("Missing required fields for event submission");
  }
  
  const prepared = {
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
  
  console.log("🔷 Prepared data for Supabase:", JSON.stringify(prepared, null, 2));
  return prepared;
};

/**
 * Insert an event record into Supabase
 * @param eventRecord The prepared event record to insert
 * @returns Promise resolving to the created record ID or null if failed
 */
const insertEventRecord = async (eventRecord: ReturnType<typeof prepareEventForSupabase>): Promise<string | null> => {
  try {
    console.log("🔷 insertEventRecord starting with:", JSON.stringify(eventRecord, null, 2));
    
    // Log Supabase client info without accessing protected properties
    console.log("🔷 Supabase client available:", !!supabase);
    
    // Check Supabase connection
    try {
      console.log("🔷 Testing Supabase connection with ping...");
      const { data: pingData, error: pingError } = await supabase.from('events').select('count').limit(1);
      console.log("🔷 Supabase ping result:", pingData, pingError);
      
      if (pingError) {
        console.error("🔷 Supabase ping failed with error:", pingError);
        throw pingError;
      }
    } catch (pingError) {
      console.error("🔷 Supabase ping threw exception:", pingError);
    }
    
    console.log("🔷 Executing Supabase insert...");
    const { data, error, status, statusText } = await supabase
      .from('events')
      .insert(eventRecord)
      .select();

    console.log("🔷 Supabase response:", { data, status, statusText });
    
    if (error) {
      console.error("🔷 Supabase error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.error("🔷 No data returned from successful insert");
      throw new Error("No data returned from Supabase insert");
    }

    console.log("🔷 Event successfully submitted to Supabase:", data);
    
    // Return the ID of the created record
    return data[0]?.id || null;
  } catch (error) {
    console.error("🔷 Error in insertEventRecord:", error);
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
    console.log("🔷 Starting submitEvent function with data:", JSON.stringify(eventData, null, 2));
    console.log("🔷 Event date type:", typeof eventData.eventDate, eventData.eventDate instanceof Date);
    console.log("🔷 Event time being submitted:", eventData.eventTime);
    
    // Prepare the data for Supabase
    const eventRecord = prepareEventForSupabase(eventData);

    // Insert the event record
    const recordId = await insertEventRecord(eventRecord);
    console.log("🔷 submitEvent success, record ID:", recordId);
    
    toast({
      title: "Event Submitted Successfully",
      description: "Your event has been saved to the database.",
    });
    
    return recordId;
  } catch (error) {
    console.error("🔷 Error submitting to Supabase:", error);
    toast({
      title: "Submission Error",
      description: error instanceof Error ? error.message : "There was a problem submitting your event.",
      variant: "destructive",
    });
    return null;
  }
};
