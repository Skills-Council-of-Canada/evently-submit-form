
import { supabase } from "@/integrations/supabase/client";
import { EventRecord } from "./types";
import { toast } from "@/hooks/use-toast";

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
    
    // Handle the Date object conversion properly
    let formattedDate: string;
    if (eventData.eventDate instanceof Date) {
      formattedDate = eventData.eventDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } else {
      // Fallback to string conversion for any other case
      formattedDate = String(eventData.eventDate).split('T')[0];
    }
    
    // Prepare the data for Supabase
    const eventRecord = {
      event_name: eventData.eventName,
      event_date: formattedDate,
      event_time: eventData.eventTime,
      description: eventData.description,
      school_name: eventData.schoolName,
      contact_name: eventData.contactName,
      contact_email: eventData.contactEmail,
      audience_type: eventData.audienceType,
      image_url: eventData.imageUrl || null,
      status: "pending" as const, // Use const assertion for literal type
      created_at: new Date().toISOString()
    };

    console.log("Inserting record into Supabase:", JSON.stringify(eventRecord, null, 2));
    console.log("Event time in record:", eventRecord.event_time);

    console.log("Attempting to insert data into Supabase events table");
    
    try {
      // Insert the record into Supabase
      const { data, error } = await supabase
        .from('events')
        .insert(eventRecord)
        .select();

      console.log("Supabase response data:", data);
      console.log("Supabase response error:", error);

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
    } catch (supabaseError) {
      console.error("Supabase operation error:", supabaseError);
      throw supabaseError;
    }
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
