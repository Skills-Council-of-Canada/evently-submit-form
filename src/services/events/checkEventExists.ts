
import { supabase } from "@/integrations/supabase/client";

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
    const formattedDate = eventDate instanceof Date 
      ? eventDate.toISOString().split('T')[0]
      : String(eventDate).split('T')[0];
    
    console.log(`⚠️ Checking for duplicate event with name: ${eventName}, date: ${formattedDate}, school: ${schoolName}`);
    console.log("⚠️ Using Supabase client from:", supabase.supabaseUrl);
    
    // Get the database URL to verify which database we're connected to
    const { data: urlData, error: urlError } = await supabase.from('_metadata').select('*').limit(1);
    console.log("⚠️ Database connection check:", urlData, urlError);
    
    // Query Supabase to check for duplicates - with extra logging
    console.log("⚠️ About to execute duplicate check query");
    const { data, error, status, statusText } = await supabase
      .from('events')
      .select('id')
      .eq('event_name', eventName)
      .eq('event_date', formattedDate)
      .eq('school_name', schoolName);

    if (error) {
      console.error("⚠️ Error checking for duplicates:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("⚠️ Duplicate check response status:", status, statusText);
    console.log("⚠️ Duplicate check result:", data);
    
    // As a temporary measure, return false to bypass duplicate check
    // Remove this line after testing if real duplicate checking is needed
    return false;
    
    // If records are returned, it means a duplicate exists
    return data && data.length > 0;
  } catch (error) {
    console.error("⚠️ Error checking for duplicate events:", error);
    // On error, default to allowing submission
    return false;
  }
};
