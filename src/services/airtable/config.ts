
// Airtable configuration
// Note: Remember to replace these values with your actual Airtable credentials
export const AIRTABLE_API_KEY = "YOUR_AIRTABLE_API_KEY"; // Replace with your Airtable API key
export const AIRTABLE_BASE_ID = "YOUR_AIRTABLE_BASE_ID"; // Replace with your Airtable base ID
export const AIRTABLE_TABLE_NAME = "Event Submissions";
export const AIRTABLE_CONTENT_TABLE = "Marketing Content"; // Table for Make.com to store formatted content

// Table schema information (for reference)
export const AIRTABLE_SCHEMA = {
  EVENT_SUBMISSIONS: {
    EVENT_NAME: "Event Name",
    EVENT_DATE: "Event Date",
    EVENT_TIME: "Event Time",
    DESCRIPTION: "Description",
    SCHOOL_NAME: "School Name",
    CONTACT_NAME: "Contact Name",
    CONTACT_EMAIL: "Contact Email",
    AUDIENCE_TYPE: "Audience Type",
    EVENT_IMAGE: "Event Image",
    STATUS: "Status",
    CREATED_AT: "Created At"
  },
  MARKETING_CONTENT: {
    SOURCE_EVENT_ID: "Source Event ID",
    SOCIAL_MEDIA_POST: "Social Media Post",
    PRESS_RELEASE: "Press Release",
    NEWSLETTER_CONTENT: "Newsletter Content",
    STATUS: "Status",
    REVIEWER_NOTES: "Reviewer Notes",
    APPROVED_DATE: "Approved Date"
  }
};
