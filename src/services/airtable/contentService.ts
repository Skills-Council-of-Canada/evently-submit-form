
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_CONTENT_TABLE } from "./config";
import { ContentTemplate } from "./types";

/**
 * Get content templates for a specific event
 * This can be used to check if Make.com has processed an event
 * @param eventId The ID of the event record in Airtable
 * @returns Promise resolving to an array of content templates
 */
export const getContentTemplates = async (eventId: string): Promise<ContentTemplate[]> => {
  try {
    const filterByFormula = encodeURIComponent(`{sourceEventId}='${eventId}'`);
    
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_CONTENT_TABLE)}?filterByFormula=${filterByFormula}`,
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
    
    // Transform Airtable records to our ContentTemplate interface
    return data.records.map((record: any) => ({
      id: record.id,
      sourceEventId: record.fields.sourceEventId || "",
      socialMediaPost: record.fields.socialMediaPost || "",
      pressRelease: record.fields.pressRelease || "",
      newsletterContent: record.fields.newsletterContent || "",
      status: record.fields.status || "pending",
      reviewerNotes: record.fields.reviewerNotes || "",
    }));
  } catch (error) {
    console.error("Error fetching content templates:", error);
    return [];
  }
};

/**
 * Update the approval status of a content template
 * This can be called after a user reviews the generated content
 * @param templateId The ID of the content template record
 * @param status The new approval status
 * @param notes Optional reviewer notes
 * @returns Promise resolving to true if update successful
 */
export const updateContentApproval = async (
  templateId: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<boolean> => {
  try {
    const payload = {
      fields: {
        status,
        ...(notes && { reviewerNotes: notes })
      }
    };
    
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_CONTENT_TABLE)}/${templateId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error updating content approval:", error);
    return false;
  }
};
