
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_CONTENT_TABLE } from "./config";
import { ContentTemplate } from "./types";

/**
 * Fetch content templates for a specific event from Airtable
 */
export const getContentTemplates = async (eventId: string): Promise<ContentTemplate | null> => {
  try {
    // Create a filter formula to find content for this event
    const filterByFormula = encodeURIComponent(`{Source Event ID}='${eventId}'`);
    
    // Query Airtable to get content templates
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
    
    // If no content templates are found
    if (data.records.length === 0) {
      return null;
    }

    // Return the first matching content template
    const record = data.records[0];
    return {
      id: record.id,
      sourceEventId: record.fields["Source Event ID"],
      socialMediaPost: record.fields["Social Media Post"],
      pressRelease: record.fields["Press Release"],
      newsletterContent: record.fields["Newsletter Content"],
      status: record.fields["Status"] || "pending",
      reviewerNotes: record.fields["Reviewer Notes"]
    };
  } catch (error) {
    console.error("Error fetching content templates:", error);
    return null;
  }
};
