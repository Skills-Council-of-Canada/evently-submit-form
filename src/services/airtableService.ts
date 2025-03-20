
import { toast } from "@/hooks/use-toast";
import { 
  AIRTABLE_API_KEY, 
  AIRTABLE_BASE_ID, 
  AIRTABLE_TABLE_NAME,
  AIRTABLE_SCHEMA
} from "./airtable/config";
import { EventRecord } from "./airtable/types";

/**
 * Submit event data to Airtable
 * @param eventData The event data to submit
 * @returns Promise resolving to the created record ID or null if failed
 */
export const submitEventToAirtable = async (eventData: EventRecord): Promise<string | null> => {
  try {
    const schema = AIRTABLE_SCHEMA.EVENT_SUBMISSIONS;
    
    // Prepare the request payload
    const payload = {
      fields: {
        [schema.EVENT_NAME]: eventData.eventName,
        [schema.EVENT_DATE]: eventData.eventDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        [schema.EVENT_TIME]: eventData.eventTime,
        [schema.DESCRIPTION]: eventData.description,
        [schema.SCHOOL_NAME]: eventData.schoolName,
        [schema.CONTACT_NAME]: eventData.contactName,
        [schema.CONTACT_EMAIL]: eventData.contactEmail,
        [schema.AUDIENCE_TYPE]: eventData.audienceType,
        [schema.STATUS]: "pending",
        [schema.CREATED_AT]: new Date().toISOString()
        // Image handling would require additional logic with Airtable attachments
      }
    };

    // Make the API request to Airtable
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable API error:", errorData);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Event successfully submitted to Airtable:", data);
    
    // This record ID can be used by Make.com to reference this specific event
    return data.id;
  } catch (error) {
    console.error("Error submitting to Airtable:", error);
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
    const schema = AIRTABLE_SCHEMA.EVENT_SUBMISSIONS;
    
    // Format the date to YYYY-MM-DD for filtering
    const formattedDate = eventDate.toISOString().split('T')[0];
    
    // Create a filter formula to check for duplicates
    const filterByFormula = encodeURIComponent(
      `AND({${schema.EVENT_NAME}}='${eventName}', {${schema.EVENT_DATE}}='${formattedDate}', {${schema.SCHOOL_NAME}}='${schoolName}')`
    );
    
    // Query Airtable to check for duplicates
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=${filterByFormula}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    // If records are returned, it means a duplicate exists
    return data.records.length > 0;
  } catch (error) {
    console.error("Error checking for duplicate events:", error);
    return false; // Default to allowing submission in case of error
  }
};

/**
 * Get all events from Airtable
 * @returns Promise resolving to array of events or empty array if failed
 */
export const getAllEvents = async (): Promise<EventRecord[]> => {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?view=Grid%20view`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    const schema = AIRTABLE_SCHEMA.EVENT_SUBMISSIONS;
    
    // Map Airtable records to EventRecord format
    return data.records.map((record: any) => ({
      id: record.id,
      eventName: record.fields[schema.EVENT_NAME],
      eventDate: new Date(record.fields[schema.EVENT_DATE]),
      eventTime: record.fields[schema.EVENT_TIME],
      description: record.fields[schema.DESCRIPTION],
      schoolName: record.fields[schema.SCHOOL_NAME],
      contactName: record.fields[schema.CONTACT_NAME],
      contactEmail: record.fields[schema.CONTACT_EMAIL],
      audienceType: record.fields[schema.AUDIENCE_TYPE],
      status: record.fields[schema.STATUS] || "pending"
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

/**
 * Update event status in Airtable
 * @param eventId The ID of the event to update
 * @param status The new status to set
 * @returns Promise resolving to true if successful, false otherwise
 */
export const updateEventStatus = async (
  eventId: string, 
  status: 'pending' | 'approved' | 'published'
): Promise<boolean> => {
  try {
    const schema = AIRTABLE_SCHEMA.EVENT_SUBMISSIONS;
    
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            [schema.STATUS]: status
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating event status:", error);
    return false;
  }
};

export { EventRecord };
