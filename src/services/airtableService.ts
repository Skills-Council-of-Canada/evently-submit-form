
import { toast } from "@/hooks/use-toast";

// Define the structure of an event record
export interface EventRecord {
  eventName: string;
  eventDate: Date;
  eventTime: string;
  description: string;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  audienceType: string;
  eventImage?: FileList;
}

// Airtable configuration
const AIRTABLE_API_KEY = "YOUR_AIRTABLE_API_KEY"; // Replace with your Airtable API key
const AIRTABLE_BASE_ID = "YOUR_AIRTABLE_BASE_ID"; // Replace with your Airtable base ID
const AIRTABLE_TABLE_NAME = "Event Submissions";

/**
 * Submit event data to Airtable
 * @param eventData The event data to submit
 * @returns Promise resolving to the created record ID or null if failed
 */
export const submitEventToAirtable = async (eventData: EventRecord): Promise<string | null> => {
  try {
    // Prepare the request payload
    const payload = {
      fields: {
        "Event Name": eventData.eventName,
        "Event Date": eventData.eventDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        "Event Time": eventData.eventTime,
        "Description": eventData.description,
        "School Name": eventData.schoolName,
        "Contact Name": eventData.contactName,
        "Contact Email": eventData.contactEmail,
        "Audience Type": eventData.audienceType,
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
    // Format the date to YYYY-MM-DD for filtering
    const formattedDate = eventDate.toISOString().split('T')[0];
    
    // Create a filter formula to check for duplicates
    const filterByFormula = encodeURIComponent(
      `AND({Event Name}='${eventName}', {Event Date}='${formattedDate}', {School Name}='${schoolName}')`
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
