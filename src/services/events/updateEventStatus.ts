
import { supabase } from "@/integrations/supabase/client";

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
