import { toast } from "@/hooks/use-toast";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_CONTENT_TABLE } from "./config";
import { ContentTemplate, EventRecord } from "./types";
import { notifyEventApproved, notifyFeedbackRequested } from "./notificationService";

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

/**
 * Approve content template
 */
export const approveContentTemplate = async (
  templateId: string, 
  eventData: EventRecord
): Promise<boolean> => {
  try {
    // Update the content template status to approved
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_CONTENT_TABLE)}/${templateId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            "Status": "approved",
            "Approved Date": new Date().toISOString()
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    // Send notification that the event was approved
    await notifyEventApproved(eventData);
    
    toast({
      title: "Content Approved!",
      description: "The marketing content has been approved and will be distributed as scheduled.",
    });
    
    return true;
  } catch (error) {
    console.error("Error approving content template:", error);
    toast({
      title: "Approval Error",
      description: "There was a problem approving the content. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Reject content template with feedback
 */
export const rejectContentTemplate = async (
  templateId: string,
  feedbackNotes: string,
  eventData: EventRecord
): Promise<boolean> => {
  try {
    // Update the content template status to rejected
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_CONTENT_TABLE)}/${templateId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            "Status": "rejected",
            "Reviewer Notes": feedbackNotes
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    // Send notification about the feedback
    await notifyFeedbackRequested(eventData, feedbackNotes);
    
    toast({
      title: "Feedback Sent",
      description: "Your feedback has been recorded and the submitter has been notified.",
    });
    
    return true;
  } catch (error) {
    console.error("Error rejecting content template:", error);
    toast({
      title: "Error",
      description: "There was a problem sending your feedback. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Update content template
 */
export const updateContentTemplate = async (
  templateId: string,
  updates: Partial<ContentTemplate>
): Promise<boolean> => {
  try {
    // Map our ContentTemplate fields to Airtable field names
    const fieldsToUpdate: Record<string, any> = {};
    
    if (updates.socialMediaPost !== undefined) {
      fieldsToUpdate["Social Media Post"] = updates.socialMediaPost;
    }
    
    if (updates.pressRelease !== undefined) {
      fieldsToUpdate["Press Release"] = updates.pressRelease;
    }
    
    if (updates.newsletterContent !== undefined) {
      fieldsToUpdate["Newsletter Content"] = updates.newsletterContent;
    }
    
    if (updates.status !== undefined) {
      fieldsToUpdate["Status"] = updates.status;
    }
    
    if (updates.reviewerNotes !== undefined) {
      fieldsToUpdate["Reviewer Notes"] = updates.reviewerNotes;
    }
    
    // Update the content template
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_CONTENT_TABLE)}/${templateId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: fieldsToUpdate
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    toast({
      title: "Content Updated",
      description: "The marketing content has been successfully updated.",
    });
    
    return true;
  } catch (error) {
    console.error("Error updating content template:", error);
    toast({
      title: "Update Error",
      description: "There was a problem updating the content. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Update content approval status
 */
export const updateContentApproval = async (
  templateId: string,
  status: 'approved' | 'rejected',
  reviewerNotes: string = ""
): Promise<boolean> => {
  try {
    // Update the content template status
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_CONTENT_TABLE)}/${templateId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            "Status": status,
            "Reviewer Notes": reviewerNotes,
            ...(status === 'approved' ? { "Approved Date": new Date().toISOString() } : {})
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} content:`, error);
    return false;
  }
};
